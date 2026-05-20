import { NextRequest, NextResponse } from "next/server";
import { users, type User } from "@/lib/data/users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") ?? "10")));
  const search = (searchParams.get("search") ?? "").toLowerCase();
  const roleFilter = searchParams.get("role") ?? "all";
  const statusFilter = searchParams.get("status") ?? "all";
  const sortField = searchParams.get("sortField") ?? "name";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

  let filtered = [...users];

  // Filter by search
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  // Filter by role
  if (roleFilter !== "all") {
    filtered = filtered.filter(
      (u) => u.role.toLowerCase() === roleFilter.toLowerCase()
    );
  }

  // Filter by status
  if (statusFilter !== "all") {
    filtered = filtered.filter((u) => u.status === statusFilter);
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortField];
    const bVal = (b as unknown as Record<string, unknown>)[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);

  return NextResponse.json({
    data: paged,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages - 1,
      hasPrev: page > 0,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: body.name || "New User",
      email: body.email || "user@example.com",
      role: body.role || "Viewer",
      status: "pending",
      plan: "Free",
      location: body.location || "Unknown",
      avatar: (body.name || "NU")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      joined: new Date().toISOString().split("T")[0],
      revenue: 0,
    };
    users.push(newUser);
    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
