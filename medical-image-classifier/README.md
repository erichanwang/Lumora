# Medical Image Classifier

CNN-based anomaly detection for medical images, starting with ISIC HAM10000 skin lesion classification.

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Dataset Download

```bash
python train.py --config config.yaml
```

The dataset downloads automatically on first run (~3GB).

## Training

```bash
python train.py --config config.yaml
python train.py --config config.yaml --resume runs/best.ckpt
```

## Evaluation

Evaluation runs automatically after training. Results saved to `results/`:

- `eval_report.json` — accuracy, macro AUC, weighted F1, per-class AUC
- `roc_curves.png` — per-class ROC curves
- `confusion_matrix.png` — normalized confusion matrix

```bash
# Re-run evaluation with a trained checkpoint
python -c "
from evaluation.evaluate import evaluate
from data.dataset import ISICDataset, make_splits
from data.transforms import get_val_transforms
from models.resnet import build_model
from utils.config import load_config
import torch

config = load_config('config.yaml')
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = build_model(config.model.backbone, config.model.num_classes, False)
checkpoint = torch.load('runs/best.ckpt', map_location=device)
model.load_state_dict(checkpoint['model_state_dict'])
model.to(device)

_, _, test_df = make_splits(config.dataset.data_dir, config.dataset.val_split, config.dataset.test_split, config.training.seed)
test_dataset = ISICDataset(config.dataset.data_dir, test_df, get_val_transforms(config.dataset.image_size))
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=config.dataset.batch_size)

evaluate(model, test_loader, device, config.evaluation.results_dir, ISICDataset.CLASSES)
"
```

## Inference

```bash
python inference.py --image path/to/image.jpg --checkpoint runs/best.ckpt
python inference.py --image path/to/image.jpg --checkpoint runs/best.ckpt --config config.yaml
```

## Tests

```bash
pytest tests/ -v
```

## Project Structure

```
├── config.yaml              # All hyperparameters & paths
├── requirements.txt
├── README.md
├── data/
│   ├── download.py           # Download HAM10000
│   ├── dataset.py            # ISICDataset + splits + sampler
│   └── transforms.py         # Augmentation pipelines
├── models/
│   └── resnet.py             # build_model, freeze/unfreeze
├── training/
│   ├── trainer.py            # Trainer with two-phase fine-tuning
│   └── losses.py             # Weighted CrossEntropy
├── evaluation/
│   └── evaluate.py           # Metrics, ROC curves, confusion matrix
├── utils/
│   ├── config.py             # load_config() → dataclass
│   ├── logging.py            # Logger setup
│   └── seed.py               # set_seed()
├── train.py                  # Entry point
├── inference.py              # Single-image inference
├── results/                  # Evaluation outputs
├── runs/                     # Checkpoints & logs
└── tests/                    # Smoke tests
```
