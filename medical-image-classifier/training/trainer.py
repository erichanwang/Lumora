"""Training loop with two-phase fine-tuning, checkpointing, and early stopping."""

from pathlib import Path

import torch
import torch.nn as nn
from tqdm import tqdm

from models.resnet import unfreeze_backbone


class Trainer:
    """Two-phase trainer for medical image classification.

    Phase 1 (epoch < head_epochs): frozen backbone, train head only.
    Phase 2 (epoch >= head_epochs): unfreeze all, lower learning rate.

    Args:
        model: PyTorch model.
        optimizer: Optimizer instance.
        scheduler: Learning rate scheduler.
        loss_fn: Loss function.
        device: torch.device.
        config: Full Config dataclass.
        logger: logging.Logger instance.
    """

    def __init__(
        self,
        model: nn.Module,
        optimizer: torch.optim.Optimizer,
        scheduler: torch.optim.lr_scheduler.LRScheduler,
        loss_fn: nn.Module,
        device: torch.device,
        config: object,
        logger: object,
    ) -> None:
        self.model = model
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.loss_fn = loss_fn
        self.device = device
        self.config = config
        self.logger = logger

        self.best_val_auc = 0.0
        self.patience_counter = 0
        self.best_metrics: dict = {}

        self.checkpoint_dir = Path(config.training.checkpoint_dir)
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)

    def fit(
        self,
        train_loader: torch.utils.data.DataLoader,
        val_loader: torch.utils.data.DataLoader,
    ) -> dict:
        """Run full training loop with two-phase fine-tuning.

        Args:
            train_loader: DataLoader for training set.
            val_loader: DataLoader for validation set.

        Returns:
            Dictionary of best validation metrics.
        """
        for epoch in range(1, self.config.training.epochs + 1):
            # Phase transition
            if epoch == self.config.training.head_epochs:
                unfreeze_backbone(self.model)
                for param_group in self.optimizer.param_groups:
                    param_group["lr"] = self.config.training.lr_full
                self.logger.info(
                    "Phase 2: unfrozen backbone, LR set to %f",
                    self.config.training.lr_full,
                )

            train_metrics = self._train_epoch(train_loader)
            val_metrics = self._val_epoch(val_loader)

            self.logger.info(
                "Epoch %3d/%d | train_loss: %.4f | val_loss: %.4f | val_acc: %.4f | val_auc: %.4f",
                epoch,
                self.config.training.epochs,
                train_metrics["loss"],
                val_metrics["loss"],
                val_metrics["accuracy"],
                val_metrics["auc"],
            )

            self.scheduler.step()

            # Save checkpoint if val_auc improves
            if val_metrics["auc"] > self.best_val_auc:
                self.best_val_auc = val_metrics["auc"]
                self.best_metrics = val_metrics
                self.patience_counter = 0
                self._save_checkpoint(epoch, val_metrics)
            else:
                self.patience_counter += 1
                if self.patience_counter >= self.config.training.early_stopping_patience:
                    self.logger.info(
                        "Early stopping triggered after %d epochs (no improvement for %d)",
                        epoch,
                        self.config.training.early_stopping_patience,
                    )
                    break

        self.logger.info("Best val AUC: %.4f", self.best_val_auc)
        return self.best_metrics

    def _train_epoch(self, loader: torch.utils.data.DataLoader) -> dict:
        """Run one training epoch.

        Args:
            loader: Training DataLoader.

        Returns:
            Dictionary with 'loss' key.
        """
        self.model.train()
        total_loss = 0.0

        for images, labels in tqdm(loader, desc="Training", leave=False):
            images = images.to(self.device)
            labels = labels.to(self.device)

            self.optimizer.zero_grad()
            outputs = self.model(images)
            loss = self.loss_fn(outputs, labels)
            loss.backward()
            self.optimizer.step()

            total_loss += loss.item() * images.size(0)

        avg_loss = total_loss / len(loader.dataset)
        return {"loss": avg_loss}

    def _val_epoch(self, loader: torch.utils.data.DataLoader) -> dict:
        """Run one validation epoch.

        Args:
            loader: Validation DataLoader.

        Returns:
            Dictionary with 'loss', 'accuracy', and 'auc' keys.
        """
        self.model.eval()
        total_loss = 0.0
        correct = 0
        total = 0

        all_preds: list[torch.Tensor] = []
        all_labels: list[torch.Tensor] = []

        with torch.no_grad():
            for images, labels in tqdm(loader, desc="Validation", leave=False):
                images = images.to(self.device)
                labels = labels.to(self.device)

                outputs = self.model(images)
                loss = self.loss_fn(outputs, labels)
                total_loss += loss.item() * images.size(0)

                probs = torch.softmax(outputs, dim=1)
                _, predicted = probs.max(1)

                correct += predicted.eq(labels).sum().item()
                total += labels.size(0)

                all_preds.append(probs.cpu())
                all_labels.append(labels.cpu())

        avg_loss = total_loss / total
        accuracy = correct / total

        all_preds = torch.cat(all_preds)
        all_labels = torch.cat(all_labels)

        # Compute macro AUC using torchmetrics (handles multi-class)
        from torchmetrics.classification import MulticlassAUROC

        num_classes = self.config.model.num_classes
        auroc_fn = MulticlassAUROC(num_classes=num_classes, average="macro")
        auc = auroc_fn(all_preds, all_labels).item()

        return {"loss": avg_loss, "accuracy": accuracy, "auc": auc}

    def _save_checkpoint(self, epoch: int, metrics: dict) -> None:
        """Save model checkpoint when val_auc improves.

        Args:
            epoch: Current epoch number.
            metrics: Validation metrics dict.
        """
        checkpoint = {
            "epoch": epoch,
            "model_state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "metrics": metrics,
        }
        path = self.checkpoint_dir / "best.ckpt"
        torch.save(checkpoint, path)
        self.logger.info("Checkpoint saved: %s (val_auc=%.4f)", path, metrics["auc"])
