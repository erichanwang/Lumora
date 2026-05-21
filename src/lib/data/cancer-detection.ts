export type CancerType = "akiec" | "bcc" | "bkl" | "df" | "mel" | "nv" | "vasc";

export type DetectionStatus = "malignant" | "benign";

export interface CancerDetection {
  id: string;
  imageId: string;
  cancerType: CancerType;
  cancerName: string;
  status: DetectionStatus;
  confidence: number;
  date: string;
  patientAge?: number;
  patientSex?: "male" | "female" | "unknown";
  bodySite?: string;
  notes?: string;
}

/** Human-readable labels for cancer types */
export const CANCER_TYPE_LABELS: Record<CancerType, string> = {
  akiec: "Actinic Keratoses",
  bcc: "Basal Cell Carcinoma",
  bkl: "Benign Keratosis",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Melanocytic Nevi",
  vasc: "Vascular Lesions",
};

/** Whether each cancer type is malignant or benign */
export const CANCER_TYPE_STATUS: Record<CancerType, DetectionStatus> = {
  akiec: "malignant",
  bcc: "malignant",
  bkl: "benign",
  df: "benign",
  mel: "malignant",
  nv: "benign",
  vasc: "benign",
};

/** Color mapping for cancer types (for badges/charts) */
export const CANCER_TYPE_COLORS: Record<CancerType, string> = {
  akiec: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  bcc: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  bkl: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  df: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  mel: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  nv: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  vasc: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const detectionStats = {
  totalDetections: 12457,
  malignantCount: 3842,
  benignCount: 8615,
  averageConfidence: 91.4,
  scansToday: 142,
  scansThisWeek: 893,
  sensitivity: 96.8,
  specificity: 94.2,
};

export const detections: CancerDetection[] = [
  { id: "DET-0001", imageId: "ISIC_0024306", cancerType: "mel", cancerName: "Melanoma", status: "malignant", confidence: 98.7, date: "2025-03-15T09:23:00Z", patientAge: 54, patientSex: "male", bodySite: "upper extremity" },
  { id: "DET-0002", imageId: "ISIC_0024307", cancerType: "bcc", cancerName: "Basal Cell Carcinoma", status: "malignant", confidence: 97.2, date: "2025-03-15T09:45:00Z", patientAge: 67, patientSex: "male", bodySite: "scalp" },
  { id: "DET-0003", imageId: "ISIC_0024308", cancerType: "nv", cancerName: "Melanocytic Nevi", status: "benign", confidence: 99.1, date: "2025-03-15T10:12:00Z", patientAge: 32, patientSex: "female", bodySite: "back" },
  { id: "DET-0004", imageId: "ISIC_0024309", cancerType: "bkl", cancerName: "Benign Keratosis", status: "benign", confidence: 88.3, date: "2025-03-15T10:30:00Z", patientAge: 71, patientSex: "male", bodySite: "face" },
  { id: "DET-0005", imageId: "ISIC_0024310", cancerType: "akiec", cancerName: "Actinic Keratoses", status: "malignant", confidence: 94.5, date: "2025-03-15T11:00:00Z", patientAge: 59, patientSex: "male", bodySite: "scalp" },
  { id: "DET-0006", imageId: "ISIC_0024311", cancerType: "df", cancerName: "Dermatofibroma", status: "benign", confidence: 91.8, date: "2025-03-15T11:22:00Z", patientAge: 45, patientSex: "female", bodySite: "lower extremity" },
  { id: "DET-0007", imageId: "ISIC_0024312", cancerType: "vasc", cancerName: "Vascular Lesions", status: "benign", confidence: 86.4, date: "2025-03-15T11:45:00Z", patientAge: 38, patientSex: "female", bodySite: "trunk" },
  { id: "DET-0008", imageId: "ISIC_0024313", cancerType: "mel", cancerName: "Melanoma", status: "malignant", confidence: 99.3, date: "2025-03-15T12:10:00Z", patientAge: 62, patientSex: "male", bodySite: "back" },
  { id: "DET-0009", imageId: "ISIC_0024314", cancerType: "bcc", cancerName: "Basal Cell Carcinoma", status: "malignant", confidence: 95.1, date: "2025-03-15T12:35:00Z", patientAge: 73, patientSex: "female", bodySite: "face" },
  { id: "DET-0010", imageId: "ISIC_0024315", cancerType: "nv", cancerName: "Melanocytic Nevi", status: "benign", confidence: 97.6, date: "2025-03-15T13:00:00Z", patientAge: 28, patientSex: "female", bodySite: "upper extremity" },
  { id: "DET-0011", imageId: "ISIC_0024316", cancerType: "bkl", cancerName: "Benign Keratosis", status: "benign", confidence: 82.9, date: "2025-03-15T13:25:00Z", patientAge: 55, patientSex: "male", bodySite: "trunk" },
  { id: "DET-0012", imageId: "ISIC_0024317", cancerType: "mel", cancerName: "Melanoma", status: "malignant", confidence: 96.8, date: "2025-03-14T08:15:00Z", patientAge: 48, patientSex: "female", bodySite: "lower extremity" },
  { id: "DET-0013", imageId: "ISIC_0024318", cancerType: "akiec", cancerName: "Actinic Keratoses", status: "malignant", confidence: 92.3, date: "2025-03-14T08:40:00Z", patientAge: 65, patientSex: "male", bodySite: "face" },
  { id: "DET-0014", imageId: "ISIC_0024319", cancerType: "df", cancerName: "Dermatofibroma", status: "benign", confidence: 89.7, date: "2025-03-14T09:05:00Z", patientAge: 41, patientSex: "female", bodySite: "lower extremity" },
  { id: "DET-0015", imageId: "ISIC_0024320", cancerType: "vasc", cancerName: "Vascular Lesions", status: "benign", confidence: 84.2, date: "2025-03-14T09:30:00Z", patientAge: 33, patientSex: "male", bodySite: "trunk" },
  { id: "DET-0016", imageId: "ISIC_0024321", cancerType: "bcc", cancerName: "Basal Cell Carcinoma", status: "malignant", confidence: 98.1, date: "2025-03-14T10:00:00Z", patientAge: 70, patientSex: "male", bodySite: "scalp" },
  { id: "DET-0017", imageId: "ISIC_0024322", cancerType: "nv", cancerName: "Melanocytic Nevi", status: "benign", confidence: 95.4, date: "2025-03-14T10:25:00Z", patientAge: 26, patientSex: "female", bodySite: "back" },
  { id: "DET-0018", imageId: "ISIC_0024323", cancerType: "mel", cancerName: "Melanoma", status: "malignant", confidence: 97.9, date: "2025-03-14T11:00:00Z", patientAge: 51, patientSex: "male", bodySite: "upper extremity" },
  { id: "DET-0019", imageId: "ISIC_0024324", cancerType: "bkl", cancerName: "Benign Keratosis", status: "benign", confidence: 90.5, date: "2025-03-14T11:30:00Z", patientAge: 68, patientSex: "female", bodySite: "face" },
  { id: "DET-0020", imageId: "ISIC_0024325", cancerType: "akiec", cancerName: "Actinic Keratoses", status: "malignant", confidence: 93.7, date: "2025-03-14T12:00:00Z", patientAge: 61, patientSex: "male", bodySite: "scalp" },
  { id: "DET-0021", imageId: "ISIC_0024326", cancerType: "nv", cancerName: "Melanocytic Nevi", status: "benign", confidence: 98.2, date: "2025-03-14T12:30:00Z", patientAge: 34, patientSex: "female", bodySite: "trunk" },
  { id: "DET-0022", imageId: "ISIC_0024327", cancerType: "bcc", cancerName: "Basal Cell Carcinoma", status: "malignant", confidence: 96.4, date: "2025-03-13T09:00:00Z", patientAge: 75, patientSex: "female", bodySite: "face" },
  { id: "DET-0023", imageId: "ISIC_0024328", cancerType: "df", cancerName: "Dermatofibroma", status: "benign", confidence: 87.1, date: "2025-03-13T09:30:00Z", patientAge: 42, patientSex: "male", bodySite: "lower extremity" },
  { id: "DET-0024", imageId: "ISIC_0024329", cancerType: "mel", cancerName: "Melanoma", status: "malignant", confidence: 99.6, date: "2025-03-13T10:15:00Z", patientAge: 57, patientSex: "female", bodySite: "back" },
  { id: "DET-0025", imageId: "ISIC_0024330", cancerType: "vasc", cancerName: "Vascular Lesions", status: "benign", confidence: 81.3, date: "2025-03-13T10:45:00Z", patientAge: 29, patientSex: "male", bodySite: "upper extremity" },
];

/** Trend data for charts */
export const detectionTrend = [
  { date: "Mar 9", total: 187, malignant: 58, benign: 129 },
  { date: "Mar 10", total: 195, malignant: 62, benign: 133 },
  { date: "Mar 11", total: 203, malignant: 71, benign: 132 },
  { date: "Mar 12", total: 178, malignant: 49, benign: 129 },
  { date: "Mar 13", total: 210, malignant: 68, benign: 142 },
  { date: "Mar 14", total: 224, malignant: 73, benign: 151 },
  { date: "Mar 15", total: 142, malignant: 41, benign: 101 },
];

/** Distribution by cancer type */
export const detectionByType: Record<CancerType, number> = {
  akiec: 892,
  bcc: 1534,
  bkl: 2187,
  df: 643,
  mel: 1416,
  nv: 4672,
  vasc: 1113,
};
