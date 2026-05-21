"""ResNet model builder with pretrained backbones and fine-tuning helpers."""

import logging

import torch.nn as nn
import torchvision.models as models

logger = logging.getLogger(__name__)

BACKBONE_REGISTRY = {
    "resnet18": models.resnet18,
    "resnet50": models.resnet50,
}


def build_model(backbone: str, num_classes: int, pretrained: bool) -> nn.Module:
    """Load a pretrained backbone and attach a task-specific classification head.

    Args:
        backbone: Name of the backbone architecture ('resnet18' or 'resnet50').
        num_classes: Number of output classes.
        pretrained: Whether to load ImageNet-pretrained weights.

    Returns:
        PyTorch model with the classification head replaced.

    Raises:
        ValueError: If the backbone name is not in BACKBONE_REGISTRY.
    """
    if backbone not in BACKBONE_REGISTRY:
        raise ValueError(
            f"Unknown backbone '{backbone}'. Available: {list(BACKBONE_REGISTRY.keys())}"
        )

    weights = "DEFAULT" if pretrained else None
    model = BACKBONE_REGISTRY[backbone](weights=weights)

    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)
    nn.init.xavier_uniform_(model.fc.weight)

    logger.info("Built %s with %d classes (pretrained=%s)", backbone, num_classes, pretrained)
    return model


def freeze_backbone(model: nn.Module) -> None:
    """Freeze all parameters except the final classification head.

    Args:
        model: PyTorch model with a `.fc` classification head.
    """
    for name, param in model.named_parameters():
        if "fc" not in name:
            param.requires_grad = False
    logger.info("Frozen backbone parameters")


def unfreeze_backbone(model: nn.Module) -> None:
    """Unfreeze all parameters for full fine-tuning.

    Args:
        model: PyTorch model.
    """
    for param in model.parameters():
        param.requires_grad = True
    logger.info("Unfrozen all parameters")
