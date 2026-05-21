import { NextResponse } from "next/server";
import { dashboardStats, type DashboardStats } from "@/lib/data";

/** Simulated network delay in milliseconds for realistic loading state */
const LOADING_DELAY_MS = 100;

/**
 * Dashboard stats endpoint.
 *
 * Returns aggregated dashboard statistics including revenue, users, orders,
 * and growth metrics.
 *
 * @returns JSON response with dashboard stats and timestamp
 */
export async function GET() {
  // Simulate slight delay for realistic loading state
  await new Promise((r) => setTimeout(r, LOADING_DELAY_MS));

  return NextResponse.json({
    app: "Lumora",
    data: dashboardStats,
    timestamp: new Date().toISOString(),
  });
}

// Top products for the dashboard widget
const topProducts = [
  { name: "Enterprise Plan", revenue: 45200, growth: 12.3, color: "bg-indigo-500" },
  { name: "Pro Subscription", revenue: 28900, growth: 8.7, color: "bg-emerald-500" },
  { name: "Add-on Analytics", revenue: 12400, growth: 15.2, color: "bg-amber-500" },
  { name: "API Access", revenue: 7700, growth: 22.1, color: "bg-rose-500" },
];

const weeklyTraffic = [
  { name: "Mon", pageViews: 4200, uniqueVisitors: 2800 },
  { name: "Tue", pageViews: 3800, uniqueVisitors: 2400 },
  { name: "Wed", pageViews: 5100, uniqueVisitors: 3200 },
  { name: "Thu", pageViews: 4900, uniqueVisitors: 3100 },
  { name: "Fri", pageViews: 5600, uniqueVisitors: 3500 },
  { name: "Sat", pageViews: 3100, uniqueVisitors: 2000 },
  { name: "Sun", pageViews: 2800, uniqueVisitors: 1800 },
];

export type { DashboardStats };

export { topProducts, weeklyTraffic };
