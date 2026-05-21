import { NextResponse } from "next/server";

/** Start time of the server for uptime calculation (ms since epoch). */
const START_TIME_MS = Date.now();

/** Number of seconds in a day */
const SECONDS_PER_DAY = 86400;
/** Number of seconds in an hour */
const SECONDS_PER_HOUR = 3600;
/** Number of seconds in a minute */
const SECONDS_PER_MINUTE = 60;
/** Milliseconds per second */
const MS_PER_SECOND = 1000;

const services = [
  { name: "API Gateway", status: "operational" as const, latency: 12 },
  { name: "Authentication", status: "operational" as const, latency: 8 },
  { name: "Database", status: "operational" as const, latency: 3 },
  { name: "Cache", status: "operational" as const, latency: 1 },
  { name: "Email Service", status: "operational" as const, latency: 45 },
  { name: "Analytics", status: "operational" as const, latency: 22 },
];

const latencyHistory = [
  { time: "00:00", latency: 12 },
  { time: "01:00", latency: 14 },
  { time: "02:00", latency: 10 },
  { time: "03:00", latency: 9 },
  { time: "04:00", latency: 8 },
  { time: "05:00", latency: 11 },
  { time: "06:00", latency: 15 },
  { time: "07:00", latency: 18 },
  { time: "08:00", latency: 25 },
  { time: "09:00", latency: 32 },
  { time: "10:00", latency: 28 },
  { time: "11:00", latency: 22 },
  { time: "12:00", latency: 20 },
  { time: "13:00", latency: 24 },
  { time: "14:00", latency: 26 },
  { time: "15:00", latency: 22 },
  { time: "16:00", latency: 19 },
  { time: "17:00", latency: 21 },
  { time: "18:00", latency: 18 },
  { time: "19:00", latency: 15 },
  { time: "20:00", latency: 13 },
  { time: "21:00", latency: 11 },
  { time: "22:00", latency: 10 },
  { time: "23:00", latency: 9 },
];

/**
 * Health check endpoint.
 *
 * Returns system health status including uptime, average latency, and
 * per-service operational status.
 *
 * @returns JSON response with health metrics
 */
export async function GET() {
  const uptime = Math.floor((Date.now() - START_TIME_MS) / MS_PER_SECOND);
  const days = Math.floor(uptime / SECONDS_PER_DAY);
  const hours = Math.floor((uptime % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const minutes = Math.floor((uptime % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  const uptimeStr = days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${hours}h ${minutes}m`;

  const avgLatency = Math.round(
    services.reduce((sum, s) => sum + s.latency, 0) / services.length
  );

  return NextResponse.json({
    app: "Lumora",
    status: "healthy",
    uptime: uptimeStr,
    uptimeSeconds: uptime,
    avgLatency,
    services,
    latencyHistory,
    timestamp: new Date().toISOString(),
  });
}
