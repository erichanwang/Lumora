"""Weighted loss function for handling class imbalance."""

import torch
import torch.nn as nn


def make_weighted_loss(class_counts: list[int], device: torch.device) -> nn.CrossEntropyLoss:
    """Return CrossEntropyLoss with inverse-frequency class weights.

    Args:
        class_counts: List of sample counts per class, indexed by class label.
        device: Device to place the weight tensor on.

    Returns:
        CrossEntropyLoss with weighted classes.
    """
    counts = torch.tensor(class_counts, dtype=torch.float, device=device)
    weights = 1.0 / counts
    weights = weights / weights.sum() * len(class_counts)
    return nn.CrossEntropyLoss(weight=weights)
