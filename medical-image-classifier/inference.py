#!/usr/bin/env python3
"""Inference entry point for a trained medical image classifier."""

import argparse
from pathlib import Path

import numpy as np
import torch
from PIL import Image

from data.dataset import ISICDataset
from data.transforms import get_val_transforms
from models.resnet import build_model
from utils.config import load_config


def main() -> None:
    """Run inference on a single image using a trained checkpoint."""
    parser = argparse.ArgumentParser(description="Run inference on a medical image")
    parser.add_argument("--image", type=str, required=True, help="Path to input image")
    parser.add_argument("--checkpoint", type=str, required=True, help="Path to model checkpoint")
    parser.add_argument("--config", type=str, default="config.yaml", help="Path to config file")
    args = parser.parse_args()

    # Load config
    config = load_config(args.config)

    # Setup device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Build model
    model = build_model(
        backbone=config.model.backbone,
        num_classes=config.model.num_classes,
        pretrained=False,
    )

    # Load checkpoint
    checkpoint = torch.load(args.checkpoint, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    # Load and transform image
    image_path = Path(args.image)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path.resolve()}")

    image = Image.open(image_path).convert("RGB")
    transform = get_val_transforms(config.dataset.image_size)
    transformed = transform(image=np.array(image))
    input_tensor = transformed["image"].unsqueeze(0).to(device)

    # Inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1).squeeze(0)

    # Results
    predicted_idx = int(probs.argmax())
    confidence = float(probs[predicted_idx])

    print("\n" + "=" * 50)
    print("INFERENCE RESULT")
    print("=" * 50)
    print(f"  Image:       {image_path}")
    print(f"  Top-1 class: {ISICDataset.CLASSES[predicted_idx]}")
    print(f"  Confidence:  {confidence:.4f} ({confidence*100:.2f}%)")
    print("-" * 50)
    print("  All class probabilities:")
    sorted_indices = torch.argsort(probs, descending=True)
    for idx in sorted_indices:
        cls_name = ISICDataset.CLASSES[int(idx)]
        prob = float(probs[int(idx)])
        bar = "█" * int(prob * 30)
        print(f"    {cls_name:10s}: {prob:.4f}  {bar}")
    print("=" * 50)


if __name__ == "__main__":
    main()
