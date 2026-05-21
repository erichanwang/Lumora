import { NextResponse } from "next/server";
import { revenueData } from "@/lib/data";

/**
 * Revenue data endpoint.
 *
 * Returns monthly revenue, expenses, and profit data with total and average
 * calculations.
 *
 * @returns JSON response with revenue data array, total, and average
 */
export async function GET() {
  return NextResponse.json({
    data: revenueData,
    total: revenueData.reduce((s, m) => s + m.revenue, 0),
    average: Math.round(
      revenueData.reduce((s, m) => s + m.revenue, 0) / revenueData.length
    ),
  });
}
