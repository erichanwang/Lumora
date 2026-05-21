#!/usr/bin/env python3
"""Training entry point for Medical Image Classification."""

import argparse
import logging
from pathlib import Path

import torch

from data.dataset import ISICDataset, make_splits, make_weighted_sampler
from data.download import download_ham10000
from data.transforms import get_train_transforms, get_val_transforms
from models.resnet import build_model, freeze_backbone
from training.losses import make_weighted_loss
from training.trainer import Trainer
from utils.config import load_config
from utils.logging import setup_logger
from utils.seed import set_seed


def main() -> None:
    """Run end-to-end training: download, split, train, evaluate."""
    parser = argparse.ArgumentParser(description="Train medical image classifier")
    parser.add_argument(
        "--config",
        type=str,
        default="config.yaml",
        help="Path to configuration YAML file",
    )
    parser.add_argument(
        "--resume",
        type=str,
        default=None,
        help="Path to checkpoint to resume from",
    )
    args = parser.parse_args()

    config = load_config(args.config)

    # Setup logger
    log_dir = Path(config.training.checkpoint_dir)
    log_dir.mkdir(parents=True, exist_ok=True)
    logger = setup_logger(
        "train",
        log_file=str(log_dir / "training.log"),
        level=getattr(logging, config.logging.level.upper()),
    )
    logger.info("Configuration loaded from %s", args.config)

    # Reproducibility
    set_seed(config.training.seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info("Using device: %s", device)

    # Download dataset if needed
    download_ham10000(config.dataset.data_dir)

    # Create splits
    train_df, val_df, test_df = make_splits(
        data_dir=config.dataset.data_dir,
        val_split=config.dataset.val_split,
        test_split=config.dataset.test_split,
        seed=config.training.seed,
    )

    # Datasets and loaders
    train_transforms = get_train_transforms(config.dataset.image_size)
    val_transforms = get_val_transforms(config.dataset.image_size)

    train_dataset = ISICDataset(config.dataset.data_dir, train_df, train_transforms)
    val_dataset = ISICDataset(config.dataset.data_dir, val_df, val_transforms)
    test_dataset = ISICDataset(config.dataset.data_dir, test_df, val_transforms)

    sampler = make_weighted_sampler(train_df)
    train_loader = torch.utils.data.DataLoader(
        train_dataset,
        batch_size=config.dataset.batch_size,
        sampler=sampler,
        num_workers=config.dataset.num_workers,
    )
    val_loader = torch.utils.data.DataLoader(
        val_dataset,
        batch_size=config.dataset.batch_size,
        shuffle=False,
        num_workers=config.dataset.num_workers,
    )
    test_loader = torch.utils.data.DataLoader(
        test_dataset,
        batch_size=config.dataset.batch_size,
        shuffle=False,
        num_workers=config.dataset.num_workers,
    )

    # Build model
    model = build_model(
        backbone=config.model.backbone,
        num_classes=config.model.num_classes,
        pretrained=config.model.pretrained,
    )
    model = model.to(device)

    # Phase 1: freeze backbone
    freeze_backbone(model)

    # Loss, optimizer, scheduler
    class_counts = [len(train_df[train_df["label"] == i]) for i in range(config.model.num_classes)]
    loss_fn = make_weighted_loss(class_counts, device)

    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=config.training.lr_head,
        weight_decay=config.training.weight_decay,
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=config.training.epochs
    )

    # Optional resume
    if args.resume:
        checkpoint = torch.load(args.resume, map_location=device)
        model.load_state_dict(checkpoint["model_state_dict"])
        optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        logger.info("Resumed from checkpoint: %s", args.resume)

    # Train
    trainer = Trainer(model, optimizer, scheduler, loss_fn, device, config, logger)
    best_metrics = trainer.fit(train_loader, val_loader)

    # Evaluate on test set
    from evaluation.evaluate import evaluate as run_evaluation

    results_dir = config.evaluation.results_dir
    metrics = run_evaluation(
        model=model,
        test_loader=test_loader,
        device=device,
        results_dir=results_dir,
        class_names=ISICDataset.CLASSES,
    )

    logger.info("Training complete. Best val AUC: %.4f", best_metrics["auc"])
    logger.info("Test macro AUC: %.4f", metrics["macro_auc"])


if __name__ == "__main__":
    main()
