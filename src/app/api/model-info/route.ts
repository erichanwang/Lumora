import { NextResponse } from "next/server";

const MODEL_INFO = {
  app: "Lumora",
  model: {
    name: "LumoraNet-ResNet50-v3",
    architecture: "ResNet-50 with custom classification head",
    framework: "PyTorch 2.1",
    inputSize: "224×224×3",
    pretrained: "ImageNet",
    finetuned: "HAM10000 + custom clinical dataset",
    version: "3.2.1",
    deployedAt: "2025-02-15T00:00:00Z",
  },
  performance: {
    sensitivity: 96.8,
    specificity: 94.2,
    precision: 92.7,
    f1Score: 94.7,
    aucRoc: 98.3,
    accuracy: 95.1,
    ppv: 91.4,
    npv: 97.6,
  },
  perClass: [
    { type: "mel", name: "Melanoma", sensitivity: 97.2, specificity: 98.1, precision: 94.8, f1Score: 96.0 },
    { type: "bcc", name: "Basal Cell Carcinoma", sensitivity: 96.5, specificity: 97.8, precision: 93.2, f1Score: 94.8 },
    { type: "akiec", name: "Actinic Keratoses", sensitivity: 95.8, specificity: 96.9, precision: 91.7, f1Score: 93.7 },
    { type: "nv", name: "Melanocytic Nevi", sensitivity: 98.4, specificity: 92.6, precision: 93.9, f1Score: 96.1 },
    { type: "bkl", name: "Benign Keratosis", sensitivity: 94.1, specificity: 95.3, precision: 90.2, f1Score: 92.1 },
    { type: "df", name: "Dermatofibroma", sensitivity: 95.6, specificity: 96.8, precision: 91.5, f1Score: 93.5 },
    { type: "vasc", name: "Vascular Lesions", sensitivity: 96.2, specificity: 97.1, precision: 92.4, f1Score: 94.3 },
  ],
  training: {
    dataset: "HAM10000",
    totalImages: 10015,
    classes: 7,
    epochs: 120,
    batchSize: 32,
    optimizer: "AdamW",
    learningRate: "1e-4 (cosine schedule)",
    augmentations: [
      "RandomHorizontalFlip",
      "RandomVerticalFlip",
      "ColorJitter",
      "RandomRotation(±30°)",
      "RandomResizedCrop",
    ],
    validationSplit: "80/20 stratified",
  },
  latency: {
    p50: 1.2,
    p95: 2.8,
    p99: 3.5,
    unit: "seconds",
  },
  timestamp: new Date().toISOString(),
};

export async function GET() {
  await new Promise((r) => setTimeout(r, 60));
  return NextResponse.json(MODEL_INFO);
}
