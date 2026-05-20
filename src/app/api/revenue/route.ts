import { NextResponse } from "next/server";
import { revenueData } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    data: revenueData,
    total: revenueData.reduce((s, m) => s + m.revenue, 0),
    average: Math.round(
      revenueData.reduce((s, m) => s + m.revenue, 0) / revenueData.length
    ),
  });
}
