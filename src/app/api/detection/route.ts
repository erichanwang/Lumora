import { NextResponse } from "next/server";
import {
  detections,
  detectionStats,
  detectionTrend,
  detectionByType,
  type CancerType,
  type DetectionStatus,
} from "@/lib/data/cancer-detection";

type CancerTypeFilter = CancerType | "all";
type StatusFilter = DetectionStatus | "all";

/** Simulated network delay for realistic loading */
const LOADING_DELAY_MS = 80;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cancerType = searchParams.get("cancerType") as CancerTypeFilter | null;
  const status = searchParams.get("status") as StatusFilter | null;
  const minConfidence = searchParams.get("minConfidence");
  const maxConfidence = searchParams.get("maxConfidence");
  const search = searchParams.get("search")?.toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") || "12", 10)));
  const sortField = searchParams.get("sortField") || "date";
  const sortDir = searchParams.get("sortDir") || "desc";

  await new Promise((r) => setTimeout(r, LOADING_DELAY_MS));

  let filtered = [...detections];

  if (cancerType && cancerType !== "all") {
    filtered = filtered.filter((d) => d.cancerType === cancerType);
  }

  if (status && status !== "all") {
    filtered = filtered.filter((d) => d.status === status);
  }

  if (minConfidence) {
    const min = parseFloat(minConfidence);
    if (!isNaN(min)) filtered = filtered.filter((d) => d.confidence >= min);
  }

  if (maxConfidence) {
    const max = parseFloat(maxConfidence);
    if (!isNaN(max)) filtered = filtered.filter((d) => d.confidence <= max);
  }

  if (search) {
    filtered = filtered.filter(
      (d) =>
        d.id.toLowerCase().includes(search) ||
        d.imageId.toLowerCase().includes(search) ||
        d.cancerName.toLowerCase().includes(search) ||
        d.cancerType.toLowerCase().includes(search)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "confidence":
        cmp = a.confidence - b.confidence;
        break;
      case "id":
        cmp = a.id.localeCompare(b.id);
        break;
      case "cancerType":
        cmp = a.cancerType.localeCompare(b.cancerType);
        break;
      case "date":
      default:
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  // Calculate filtered stats
  const filteredMalignant = filtered.filter((d) => d.status === "malignant").length;
  const filteredBenign = filtered.filter((d) => d.status === "benign").length;
  const avgConf =
    filtered.length > 0
      ? Math.round(
          (filtered.reduce((sum, d) => sum + d.confidence, 0) / filtered.length) * 10
        ) / 10
      : 0;

  return NextResponse.json({
    app: "Lumora",
    data: paged,
    stats: {
      total,
      malignantCount: filteredMalignant,
      benignCount: filteredBenign,
      averageConfidence: avgConf,
    },
    overview: detectionStats,
    trend: detectionTrend,
    byType: detectionByType,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}
