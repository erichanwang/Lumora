"""Logging setup for training and evaluation."""

import logging
import sys
from pathlib import Path


def setup_logger(name: str, log_file: str | None = None, level: int = logging.INFO) -> logging.Logger:
    """Configure and return a logger with console and optional file output.

    Args:
        name: Logger name (typically __name__).
        log_file: Optional path to a log file for persistent output.
        level: Logging level (default: logging.INFO).

    Returns:
        Configured logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid duplicate handlers if setup_logger is called multiple times
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(str(log_path))
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger
