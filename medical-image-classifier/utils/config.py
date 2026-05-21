"""Configuration loading and validation using dataclasses."""

import dataclasses
from dataclasses import dataclass
from pathlib import Path

import yaml


@dataclass
class DatasetConfig:
    """Dataset configuration."""

    name: str
    data_dir: str
    image_size: int
    batch_size: int
    num_workers: int
    test_split: float
    val_split: float


@dataclass
class ModelConfig:
    """Model architecture configuration."""

    backbone: str
    num_classes: int
    pretrained: bool


@dataclass
class TrainingConfig:
    """Training hyperparameters."""

    seed: int
    epochs: int
    head_epochs: int
    optimizer: str
    lr_head: float
    lr_full: float
    weight_decay: float
    scheduler: str
    early_stopping_patience: int
    checkpoint_dir: str


@dataclass
class EvaluationConfig:
    """Evaluation output configuration."""

    results_dir: str


@dataclass
class LoggingConfig:
    """Logging configuration."""

    level: str
    use_wandb: bool


@dataclass
class Config:
    """Top-level configuration aggregating all sub-configs."""

    dataset: DatasetConfig
    model: ModelConfig
    training: TrainingConfig
    evaluation: EvaluationConfig
    logging: LoggingConfig


def _from_dict(cls, data: dict) -> object:
    """Recursively convert a dict to a dataclass instance.

    Args:
        cls: Dataclass type to instantiate.
        data: Dictionary of field values.

    Returns:
        Instantiated dataclass with nested dataclasses resolved.

    Raises:
        ValueError: If a required field is missing.
    """
    field_types = {f.name: f.type for f in cls.__dataclass_fields__.values()}
    kwargs = {}
    for name, value in data.items():
        if name in field_types:
            ftype = field_types[name]
            # Check if the field type is itself a dataclass
            if hasattr(ftype, "__dataclass_fields__"):
                kwargs[name] = _from_dict(ftype, value)
            else:
                kwargs[name] = value

    # Validate required fields
    for f in cls.__dataclass_fields__.values():
        if f.name not in kwargs and f.default is dataclasses.MISSING and f.default_factory is dataclasses.MISSING:
            raise ValueError(f"Missing required config field: '{f.name}' in {cls.__name__}")

    return cls(**kwargs)


def load_config(path: str) -> Config:
    """Load and validate a YAML configuration file.

    Args:
        path: Path to the YAML config file.

    Returns:
        Validated Config dataclass instance.

    Raises:
        FileNotFoundError: If the config file does not exist.
        ValueError: If required fields are missing.
    """
    config_path = Path(path)
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path.resolve()}")

    with open(config_path) as f:
        raw = yaml.safe_load(f)

    if raw is None:
        raise ValueError("Config file is empty")

    return _from_dict(Config, raw)
