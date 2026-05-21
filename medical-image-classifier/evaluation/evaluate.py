"""Test set evaluation with metrics, ROC curves, and confusion matrix."""

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import (
    accuracy_score,
    auc,
    classification_report,
    confusion_matrix,
    f1_score,
    roc_curve,
)
from torchmetrics.classification import MulticlassAUROC


def evaluate(
    model: nn.Module,
    test_loader: torch.utils.data.DataLoader,
    device: torch.device,
    results_dir: str,
    class_names: list[str],
) -> dict:
    """Run full test set evaluation. Saves plots and JSON report.

    Args:
        model: Trained PyTorch model.
        test_loader: DataLoader for the test set.
        device: torch.device for inference.
        results_dir: Directory for saving outputs.
        class_names: Ordered list of class names.

    Returns:
        Dictionary of computed metrics.
    """
    results_path = Path(results_dir)
    results_path.mkdir(parents=True, exist_ok=True)

    model.eval()
    all_probs: list[torch.Tensor] = []
    all_labels: list[torch.Tensor] = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            probs = torch.softmax(outputs, dim=1)
            all_probs.append(probs.cpu())
            all_labels.append(labels.cpu())

    all_probs = torch.cat(all_probs).numpy()
    all_labels = torch.cat(all_labels).numpy()
    all_preds = all_probs.argmax(axis=1)

    # Compute metrics
    accuracy = accuracy_score(all_labels, all_preds)
    f1 = f1_score(all_labels, all_preds, average="weighted")

    # Macro AUC via torchmetrics
    probs_tensor = torch.from_numpy(all_probs)
    labels_tensor = torch.from_numpy(all_labels)
    num_classes = len(class_names)
    auroc_fn = MulticlassAUROC(num_classes=num_classes, average="macro")
    macro_auc = auroc_fn(probs_tensor, labels_tensor).item()

    # Per-class AUC
    per_class_auc = {}
    for i, cls_name in enumerate(class_names):
        fpr, tpr, _ = roc_curve((all_labels == i).astype(int), all_probs[:, i])
        per_class_auc[cls_name] = float(auc(fpr, tpr))

    # Classification report
    report = classification_report(
        all_labels, all_preds, target_names=class_names, digits=4, output_dict=True
    )

    metrics = {
        "accuracy": float(accuracy),
        "macro_auc": float(macro_auc),
        "weighted_f1": float(f1),
        "per_class_auc": per_class_auc,
        "classification_report": report,
    }

    # Save JSON report
    report_path = results_path / "eval_report.json"
    with open(report_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Evaluation report saved: {report_path}")

    # Plot ROC curves
    plot_roc_curves(all_labels, all_probs, class_names, results_path)

    # Plot confusion matrix
    cm = confusion_matrix(all_labels, all_preds)
    plot_confusion_matrix(cm, class_names, results_path)

    # Print summary
    print("\n" + "=" * 60)
    print("TEST SET EVALUATION RESULTS")
    print("=" * 60)
    print(f"  Accuracy:      {accuracy:.4f}")
    print(f"  Macro AUC:     {macro_auc:.4f}")
    print(f"  Weighted F1:   {f1:.4f}")
    print("-" * 60)
    print("  Per-class AUC:")
    for cls_name, cls_auc in per_class_auc.items():
        print(f"    {cls_name:10s}: {cls_auc:.4f}")
    print("=" * 60)

    return metrics


def plot_roc_curves(
    labels: np.ndarray,
    probs: np.ndarray,
    class_names: list[str],
    save_dir: Path,
) -> None:
    """Plot and save ROC curves for all classes.

    Args:
        labels: Ground-truth labels array.
        probs: Predicted probabilities array (n_samples, n_classes).
        class_names: Ordered list of class names.
        save_dir: Directory to save the plot.
    """
    plt.figure(figsize=(10, 8))

    for i, cls_name in enumerate(class_names):
        fpr, tpr, _ = roc_curve((labels == i).astype(int), probs[:, i])
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, label=f"{cls_name} (AUC = {roc_auc:.3f})")

    plt.plot([0, 1], [0, 1], "k--", alpha=0.4)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curves — Per Class")
    plt.legend(loc="lower right")
    plt.grid(alpha=0.3)

    path = save_dir / "roc_curves.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"ROC curves saved: {path}")


def plot_confusion_matrix(
    cm: np.ndarray,
    class_names: list[str],
    save_dir: Path,
) -> None:
    """Plot and save a normalized confusion matrix.

    Args:
        cm: Confusion matrix array.
        class_names: Ordered list of class names.
        save_dir: Directory to save the plot.
    """
    cm_norm = cm.astype("float") / cm.sum(axis=1, keepdims=True).clip(min=1e-8)

    plt.figure(figsize=(10, 8))
    plt.imshow(cm_norm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title("Confusion Matrix (Normalized)")
    plt.colorbar()

    tick_marks = np.arange(len(class_names))
    plt.xticks(tick_marks, class_names, rotation=45, ha="right")
    plt.yticks(tick_marks, class_names)

    for i in range(len(class_names)):
        for j in range(len(class_names)):
            plt.text(
                j,
                i,
                f"{cm[i, j]}\n({cm_norm[i, j]:.2f})",
                ha="center",
                va="center",
                fontsize=8,
                color="white" if cm_norm[i, j] > 0.5 else "black",
            )

    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.tight_layout()

    path = save_dir / "confusion_matrix.png"
    plt.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Confusion matrix saved: {path}")
