import { NextResponse } from "next/server";
import { activities } from "@/lib/data";

/**
 * Activity feed endpoint.
 *
 * Returns the list of recent user activities (upgrades, creations, etc.).
 *
 * @returns JSON response with activity data array and total count
 */
export async function GET() {
  return NextResponse.json({
    data: activities,
    total: activities.length,
  });
}
