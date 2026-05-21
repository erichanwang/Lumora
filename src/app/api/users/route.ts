import { NextRequest, NextResponse } from "next/server";
import { users, type User } from "@/lib/data/users";

/** Maximum number of items per page */
const MAX_PER_PAGE = 50;
/** Minimum number of items per page */
const MIN_PER_PAGE = 1;
/** Default number of items per page */
const DEFAULT_PER_PAGE = 10;

/**
 * Users endpoint.
 *
 * GET returns paginated, sorted, and filtered user list.
 * POST creates a new user with default values.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const perPage = Math.min(MAX_PER_PAGE, Math.max(MIN_PER_PAGE, parseInt(searchParams.get("perPage") ?? String(DEFAULT_PER_PAGE))));
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
    const aVal: unknown = a[sortField as keyof User];
    const bVal: unknown = b[sortField as keyof User];
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
    app: "Lumora",
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

/**
 * Create a new user.
 *
 * Parses the JSON body and creates a user with sensible defaults.
 * Logs the error on failure rather than swallowing it.
 *
 * @param request - The incoming HTTP request with JSON body
 * @returns JSON response with the created user or error
 */
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
  } catch (err) {
    console.error("[POST /api/users] Failed to parse request body:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
