import { NextRequest, NextResponse } from "next/server";
import { notifications } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const filtered = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({
    data: filtered,
    unreadCount,
    total: notifications.length,
  });
}

export async function PATCH() {
  // Mark all as read
  notifications.forEach((n) => {
    n.read = true;
  });

  return NextResponse.json({ success: true });
}
