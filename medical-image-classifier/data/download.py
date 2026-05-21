"""Download the HAM10000 dataset from ISIC 2018 Task 3 challenge."""

import zipfile
from pathlib import Path

import requests
from tqdm import tqdm

METADATA_URL = "https://isic-challenge-data.s3.amazonaws.com/2018/ISIC2018_Task3_Training_GroundTruth.zip"
IMAGES_URL = "https://isic-challenge-data.s3.amazonaws.com/2018/ISIC2018_Task3_Training_Input.zip"
EXPECTED_IMAGE_COUNT = 10015
MAX_RETRIES = 3


def _download_with_progress(url: str, dest: Path) -> None:
    """Download a file with a tqdm progress bar and retry logic.

    Args:
        url: URL to download from.
        dest: Destination file path.

    Raises:
        RuntimeError: If download fails after MAX_RETRIES attempts.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.get(url, stream=True, timeout=60)
            response.raise_for_status()
            total = int(response.headers.get("content-length", 0))
            dest.write_bytes(b"")
            with tqdm(total=total, unit="B", unit_scale=True, desc=dest.name) as pbar:
                with open(dest, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                        pbar.update(len(chunk))
            return
        except requests.RequestException as e:
            if attempt == MAX_RETRIES:
                raise RuntimeError(f"Download failed after {MAX_RETRIES} attempts: {e}") from e


def download_ham10000(data_dir: str) -> None:
    """Download HAM10000 images and metadata CSVs into data_dir.

    Skips download if the metadata CSV already exists. Downloads and
    unzips both the metadata and images archives.

    Args:
        data_dir: Directory to store the dataset.

    Raises:
        RuntimeError: If download fails or extracted file count is wrong.
    """
    data_path = Path(data_dir)
    data_path.mkdir(parents=True, exist_ok=True)

    metadata_csv = data_path / "HAM10000_metadata.csv"
    if metadata_csv.exists():
        return

    metadata_zip = data_path / "metadata.zip"
    images_zip = data_path / "images.zip"

    print("Downloading HAM10000 metadata...")
    _download_with_progress(METADATA_URL, metadata_zip)

    print("Downloading HAM10000 images...")
    _download_with_progress(IMAGES_URL, images_zip)

    print("Extracting metadata...")
    with zipfile.ZipFile(metadata_zip) as z:
        z.extractall(data_path)
    metadata_zip.unlink()

    print("Extracting images...")
    with zipfile.ZipFile(images_zip) as z:
        z.extractall(data_path)
    images_zip.unlink()

    image_count = len(list(data_path.glob("*.jpg")))
    print(f"Extracted {image_count} images (expected ~{EXPECTED_IMAGE_COUNT})")
    if image_count < EXPECTED_IMAGE_COUNT * 0.9:
        raise RuntimeError(
            f"Expected ~{EXPECTED_IMAGE_COUNT} images but found {image_count}. "
            "Download may be incomplete."
        )
