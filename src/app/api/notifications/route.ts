import { NextRequest, NextResponse } from "next/server";
import { notifications } from "@/lib/data";

/**
 * Notifications endpoint.
 *
 * GET returns notifications, optionally filtered to unread only.
 * PATCH marks all notifications as read.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const filtered = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({
    app: "Lumora",
    data: filtered,
    unreadCount,
    total: notifications.length,
  });
}

/**
 * Mark all notifications as read.
 *
 * @returns JSON response confirming success
 */
export async function PATCH() {
  // Mark all as read
  notifications.forEach((n) => {
    n.read = true;
  });

  return NextResponse.json({ app: "Lumora", success: true });
}
