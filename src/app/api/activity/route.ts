import { NextResponse } from "next/server";
import { activities } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    data: activities,
    total: activities.length,
  });
}
