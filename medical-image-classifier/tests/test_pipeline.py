"""Smoke tests for the medical image classification pipeline."""

import sys
import tempfile
from pathlib import Path

import numpy as np
import pandas as pd
import pytest
import torch
import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from data.dataset import make_weighted_sampler
from data.transforms import get_train_transforms, get_val_transforms
from models.resnet import build_model, freeze_backbone, unfreeze_backbone
from utils.config import load_config


SAMPLE_CONFIG = {
    "dataset": {
        "name": "isic",
        "data_dir": "./data/HAM10000",
        "image_size": 224,
        "batch_size": 4,
        "num_workers": 0,
        "test_split": 0.15,
        "val_split": 0.15,
    },
    "model": {
        "backbone": "resnet18",
        "num_classes": 7,
        "pretrained": False,
    },
    "training": {
        "seed": 42,
        "epochs": 2,
        "head_epochs": 1,
        "optimizer": "adam",
        "lr_head": 1e-4,
        "lr_full": 1e-5,
        "weight_decay": 1e-4,
        "scheduler": "cosine",
        "early_stopping_patience": 3,
        "checkpoint_dir": "./runs/",
    },
    "evaluation": {
        "results_dir": "./results/",
    },
    "logging": {
        "level": "INFO",
        "use_wandb": False,
    },
}


class TestConfig:
    """Tests for config loading and validation."""

    def test_load_config_valid(self):
        """load_config returns correct values for a valid config."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".yaml") as f:
            yaml.dump(SAMPLE_CONFIG, f)
            f.flush()
            config = load_config(f.name)
            assert config.dataset.name == "isic"
            assert config.dataset.batch_size == 4
            assert config.model.backbone == "resnet18"
            assert config.model.num_classes == 7
            assert config.training.seed == 42
            assert config.training.epochs == 2

    def test_load_config_missing_field_raises(self):
        """load_config raises ValueError for missing required fields."""
        incomplete = {"dataset": {"name": "isic"}}
        with tempfile.NamedTemporaryFile(mode="w", suffix=".yaml") as f:
            yaml.dump(incomplete, f)
            f.flush()
            with pytest.raises(ValueError, match="Missing required config field"):
                load_config(f.name)

    def test_load_config_file_not_found(self):
        """load_config raises FileNotFoundError for nonexistent path."""
        with pytest.raises(FileNotFoundError):
            load_config("/nonexistent/config.yaml")


class TestTransforms:
    """Tests for transform pipelines."""

    def test_train_transforms_shape(self):
        """get_train_transforms returns tensor of correct shape."""
        transform = get_train_transforms(224)
        dummy = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        result = transform(image=dummy)
        assert result["image"].shape == (3, 224, 224)
        assert isinstance(result["image"], torch.Tensor)

    def test_val_transforms_shape(self):
        """get_val_transforms returns tensor of correct shape."""
        transform = get_val_transforms(224)
        dummy = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        result = transform(image=dummy)
        assert result["image"].shape == (3, 224, 224)
        assert isinstance(result["image"], torch.Tensor)


class TestModel:
    """Tests for model builder."""

    def test_build_model_output_shape(self):
        """build_model produces correct output shape for given num_classes."""
        model = build_model("resnet18", num_classes=7, pretrained=False)
        model.eval()
        dummy = torch.randn(2, 3, 224, 224)
        output = model(dummy)
        assert output.shape == (2, 7)

    def test_build_model_unknown_backbone(self):
        """build_model raises ValueError for unknown backbone."""
        with pytest.raises(ValueError, match="Unknown backbone"):
            build_model("unknown_backbone", num_classes=7, pretrained=False)

    def test_freeze_backbone(self):
        """freeze_backbone disables gradients for non-fc params."""
        model = build_model("resnet18", num_classes=7, pretrained=False)
        freeze_backbone(model)
        for name, param in model.named_parameters():
            if "fc" not in name:
                assert not param.requires_grad
            else:
                assert param.requires_grad

    def test_unfreeze_backbone(self):
        """unfreeze_backbone enables gradients for all params."""
        model = build_model("resnet18", num_classes=7, pretrained=False)
        freeze_backbone(model)
        unfreeze_backbone(model)
        for param in model.parameters():
            assert param.requires_grad


class TestDataset:
    """Tests for ISICDataset and helpers."""

    def test_make_weighted_sampler(self):
        """make_weighted_sampler returns a sampler with correct length."""
        df = pd.DataFrame({"label": [0, 0, 0, 1, 1, 2]})
        sampler = make_weighted_sampler(df)
        assert len(sampler) == 6
        assert isinstance(sampler, torch.utils.data.WeightedRandomSampler)
