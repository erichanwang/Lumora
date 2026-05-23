import { NextResponse } from "next/server";

export interface PatientRecord {
  id: string;
  mrn: string;
  name: string;
  age: number;
  sex: "male" | "female" | "unknown";
  riskLevel: "high" | "medium" | "low";
  totalScans: number;
  lastScanDate: string;
  diagnoses: string[];
  riskFactors: string[];
  primaryPhysician: string;
  createdAt: string;
}

const patients: PatientRecord[] = [
  { id: "PAT-001", mrn: "MRN-2024-0001", name: "James Mitchell", age: 54, sex: "male", riskLevel: "high", totalScans: 8, lastScanDate: "2025-03-15", diagnoses: ["Melanoma (detected Mar 2025)", "Atypical Nevus (2024)"], riskFactors: ["Family history of melanoma", "Fair skin", "History of sunburns"], primaryPhysician: "Dr. Sarah Chen", createdAt: "2024-01-10" },
  { id: "PAT-002", mrn: "MRN-2024-0002", name: "Patricia Reynolds", age: 67, sex: "female", riskLevel: "high", totalScans: 12, lastScanDate: "2025-03-14", diagnoses: ["Basal Cell Carcinoma (detected Jan 2025)", "Actinic Keratoses (2024)"], riskFactors: ["Extensive sun exposure", "Age > 65", "Multiple prior BCCs"], primaryPhysician: "Dr. Sarah Chen", createdAt: "2024-01-12" },
  { id: "PAT-003", mrn: "MRN-2024-0003", name: "Michael Torres", age: 45, sex: "male", riskLevel: "medium", totalScans: 5, lastScanDate: "2025-03-10", diagnoses: ["Dermatofibroma (benign)"], riskFactors: ["Outdoor occupation"], primaryPhysician: "Dr. James Park", createdAt: "2024-02-03" },
  { id: "PAT-004", mrn: "MRN-2024-0004", name: "Emily Watson", age: 32, sex: "female", riskLevel: "low", totalScans: 3, lastScanDate: "2025-03-01", diagnoses: ["Melanocytic Nevus (benign)"], riskFactors: [], primaryPhysician: "Dr. Lisa Rodriguez", createdAt: "2024-03-15" },
  { id: "PAT-005", mrn: "MRN-2024-0005", name: "Robert Chen", age: 71, sex: "male", riskLevel: "high", totalScans: 15, lastScanDate: "2025-03-16", diagnoses: ["Basal Cell Carcinoma (multiple)", "Benign Keratosis"], riskFactors: ["Immunosuppressed", "History of radiation therapy", "Age > 70"], primaryPhysician: "Dr. Sarah Chen", createdAt: "2024-01-05" },
  { id: "PAT-006", mrn: "MRN-2024-0006", name: "Lisa Park", age: 38, sex: "female", riskLevel: "low", totalScans: 2, lastScanDate: "2025-02-20", diagnoses: ["Vascular Lesion (benign)"], riskFactors: [], primaryPhysician: "Dr. Lisa Rodriguez", createdAt: "2024-04-22" },
  { id: "PAT-007", mrn: "MRN-2024-0007", name: "David Kim", age: 59, sex: "male", riskLevel: "medium", totalScans: 6, lastScanDate: "2025-03-12", diagnoses: ["Actinic Keratoses (detected Feb 2025)"], riskFactors: ["Fair skin", "History of actinic damage"], primaryPhysician: "Dr. James Park", createdAt: "2024-02-18" },
  { id: "PAT-008", mrn: "MRN-2024-0008", name: "Anna Henderson", age: 28, sex: "female", riskLevel: "low", totalScans: 1, lastScanDate: "2025-03-05", diagnoses: ["Benign Nevus"], riskFactors: [], primaryPhysician: "Dr. Lisa Rodriguez", createdAt: "2024-05-30" },
  { id: "PAT-009", mrn: "MRN-2024-0009", name: "Thomas Wright", age: 62, sex: "male", riskLevel: "high", totalScans: 10, lastScanDate: "2025-03-15", diagnoses: ["Melanoma (detected Dec 2024)", "Dysplastic Nevi"], riskFactors: ["Family history of melanoma", "Dysplastic nevus syndrome"], primaryPhysician: "Dr. Sarah Chen", createdAt: "2024-01-08" },
  { id: "PAT-010", mrn: "MRN-2024-0010", name: "Sophia Martinez", age: 41, sex: "female", riskLevel: "medium", totalScans: 4, lastScanDate: "2025-02-28", diagnoses: ["Benign Keratosis"], riskFactors: ["History of tanning bed use"], primaryPhysician: "Dr. James Park", createdAt: "2024-06-10" },
  { id: "PAT-011", mrn: "MRN-2024-0011", name: "William Foster", age: 73, sex: "male", riskLevel: "high", totalScans: 20, lastScanDate: "2025-03-16", diagnoses: ["Multiple BCC", "Squamous Cell Carcinoma (2023)", "Melanoma in situ (2024)"], riskFactors: ["Chronic sun exposure", "Age > 70", "History of multiple skin cancers"], primaryPhysician: "Dr. Sarah Chen", createdAt: "2023-11-01" },
  { id: "PAT-012", mrn: "MRN-2024-0012", name: "Olivia Green", age: 26, sex: "female", riskLevel: "low", totalScans: 1, lastScanDate: "2025-03-08", diagnoses: [], riskFactors: [], primaryPhysician: "Dr. Lisa Rodriguez", createdAt: "2025-02-20" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const risk = searchParams.get("risk");
  const search = searchParams.get("search")?.toLowerCase();
  const sortField = searchParams.get("sortField") || "lastScanDate";
  const sortDir = searchParams.get("sortDir") || "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "10", 10)));

  await new Promise((r) => setTimeout(r, 70));

  let filtered = [...patients];

  if (risk && risk !== "all") {
    filtered = filtered.filter((p) => p.riskLevel === risk);
  }

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.mrn.toLowerCase().includes(search) ||
        p.primaryPhysician.toLowerCase().includes(search) ||
        p.diagnoses.some((d) => d.toLowerCase().includes(search))
    );
  }

  filtered.sort((a, b) => {
    let cmp = 0;
    const aVal = a[sortField as keyof PatientRecord];
    const bVal = b[sortField as keyof PatientRecord];
    if (typeof aVal === "string" && typeof bVal === "string") cmp = aVal.localeCompare(bVal);
    else if (typeof aVal === "number" && typeof bVal === "number") cmp = aVal - bVal;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return NextResponse.json({
    app: "Lumora",
    data: paged,
    overview: {
      totalPatients: patients.length,
      highRisk: patients.filter((p) => p.riskLevel === "high").length,
      mediumRisk: patients.filter((p) => p.riskLevel === "medium").length,
      lowRisk: patients.filter((p) => p.riskLevel === "low").length,
      totalScans: patients.reduce((s, p) => s + p.totalScans, 0),
    },
    pagination: { page, perPage, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    timestamp: new Date().toISOString(),
  });
}
