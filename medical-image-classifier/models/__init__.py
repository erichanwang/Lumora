"""Model builder module. Re-exports from resnet.py for convenience."""

from models.resnet import build_model, freeze_backbone, unfreeze_backbone

__all__ = ["build_model", "freeze_backbone", "unfreeze_backbone"]
