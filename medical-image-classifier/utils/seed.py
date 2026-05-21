"""Random seed utilities for reproducibility."""

import random

import numpy as np
import torch


def set_seed(seed: int) -> None:
    """Set random seed for reproducibility across torch, numpy, random, and CUDA.

    Args:
        seed: Integer seed value to use for all RNGs.

    Returns:
        None
    """
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
