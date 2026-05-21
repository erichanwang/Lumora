"""Image transformation pipelines for training and validation."""

import albumentations as A
from albumentations.pytorch import ToTensorV2

IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)


def get_train_transforms(image_size: int) -> A.Compose:
    """Augmentation pipeline for training.

    Applies resizing, flips, rotation, color jitter, normalization,
    and tensor conversion.

    Args:
        image_size: Target size for both width and height after resize.

    Returns:
        Albumentations Compose pipeline for training.
    """
    return A.Compose([
        A.Resize(image_size, image_size),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.Rotate(limit=15),
        A.ColorJitter(brightness=0.2, contrast=0.2),
        A.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ToTensorV2(),
    ])


def get_val_transforms(image_size: int) -> A.Compose:
    """Deterministic pipeline for validation and test.

    Applies resizing, normalization, and tensor conversion only.

    Args:
        image_size: Target size for both width and height after resize.

    Returns:
        Albumentations Compose pipeline for validation/test.
    """
    return A.Compose([
        A.Resize(image_size, image_size),
        A.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ToTensorV2(),
    ])
