"""HAM10000 dermoscopy image dataset for 7-class skin lesion classification."""

import logging
from pathlib import Path

import numpy as np
import pandas as pd
import torch
from PIL import Image
from torch.utils.data import Dataset, WeightedRandomSampler
from sklearn.model_selection import train_test_split

logger = logging.getLogger(__name__)


class ISICDataset(Dataset):
    """HAM10000 dermoscopy image dataset for 7-class skin lesion classification.

    Args:
        data_dir: Directory containing the HAM10000 images and metadata CSV.
        split_df: DataFrame with columns 'image_id' and 'label' for this split.
        transform: Optional albumentations transform pipeline.

    Attributes:
        CLASSES: Ordered list of class names indexed 0-6.
        CLASS_TO_IDX: Mapping from class name to integer index.
    """

    CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
    CLASS_TO_IDX = {c: i for i, c in enumerate(CLASSES)}

    def __init__(
        self,
        data_dir: str,
        split_df: pd.DataFrame,
        transform: object | None = None,
    ) -> None:
        self.data_dir = Path(data_dir)
        self.split_df = split_df.reset_index(drop=True)
        self.transform = transform

    def __len__(self) -> int:
        """Return the number of samples in this split."""
        return len(self.split_df)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, int]:
        """Load and return a single image-label pair.

        Args:
            idx: Index within the split.

        Returns:
            Tuple of (image_tensor, label_int).
        """
        row = self.split_df.iloc[idx]
        image_path = self.data_dir / f"{row['image_id']}.jpg"
        image = Image.open(image_path).convert("RGB")

        label = int(row["label"])

        if self.transform:
            transformed = self.transform(image=np.array(image))
            image = transformed["image"]

        return image, label


def make_splits(
    data_dir: str,
    val_split: float,
    test_split: float,
    seed: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Create stratified train/val/test splits by lesion_id.

    Splits by lesion_id (not image_id) to prevent data leakage.
    Stratifies by class label to preserve distribution across splits.

    Args:
        data_dir: Directory containing HAM10000_metadata.csv.
        val_split: Fraction of data for validation.
        test_split: Fraction of data for testing.
        seed: Random seed for reproducibility.

    Returns:
        Tuple of (train_df, val_df, test_df) DataFrames, each with
        columns 'image_id' and 'label'.
    """
    metadata_path = Path(data_dir) / "HAM10000_metadata.csv"
    if not metadata_path.exists():
        raise FileNotFoundError(f"Metadata CSV not found: {metadata_path.resolve()}")

    df = pd.read_csv(metadata_path)
    df["label"] = df["dx"].map(ISICDataset.CLASS_TO_IDX)

    # Deduplicate by lesion_id for stratified split
    lesion_df = df.drop_duplicates(subset="lesion_id")[["lesion_id", "label"]]

    # First split: separate test
    train_val_ids, test_ids = train_test_split(
        lesion_df["lesion_id"].values,
        test_size=test_split,
        random_state=seed,
        stratify=lesion_df["label"].values,
    )

    # Second split: separate val from train
    val_ratio = val_split / (1 - test_split)
    train_ids, val_ids = train_test_split(
        train_val_ids,
        test_size=val_ratio,
        random_state=seed,
        stratify=lesion_df[lesion_df["lesion_id"].isin(train_val_ids)]["label"].values,
    )

    def _get_split_df(ids: list) -> pd.DataFrame:
        """Get image-level DataFrame for a set of lesion IDs."""
        split = df[df["lesion_id"].isin(ids)][["image_id", "label"]].copy()
        return split

    train_df = _get_split_df(train_ids)
    val_df = _get_split_df(val_ids)
    test_df = _get_split_df(test_ids)

    logger.info(
        "Splits: train=%d, val=%d, test=%d",
        len(train_df),
        len(val_df),
        len(test_df),
    )

    return train_df, val_df, test_df


def make_weighted_sampler(train_df: pd.DataFrame) -> WeightedRandomSampler:
    """Create a WeightedRandomSampler for imbalanced training data.

    Computes per-class weights as 1 / class_count and assigns each
    sample its class weight.

    Args:
        train_df: Training DataFrame with a 'label' column.

    Returns:
        WeightedRandomSampler for use with a DataLoader.
    """
    class_counts = train_df["label"].value_counts().sort_index()
    class_weights = 1.0 / class_counts.values
    sample_weights = class_weights[train_df["label"].values]

    sampler = WeightedRandomSampler(
        weights=torch.tensor(sample_weights, dtype=torch.float),
        num_samples=len(sample_weights),
        replacement=True,
    )
    return sampler
