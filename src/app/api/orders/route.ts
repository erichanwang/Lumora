import { NextRequest, NextResponse } from "next/server";
import { orders, type Order } from "@/lib/data/orders";

/** Maximum number of items per page */
const MAX_PER_PAGE = 50;
/** Minimum number of items per page */
const MIN_PER_PAGE = 1;
/** Default number of items per page */
const DEFAULT_PER_PAGE = 10;
/** Number of days to add for estimated delivery (ETA) */
const ETA_DAYS = 7;
/** Milliseconds in a day */
const MS_PER_DAY = 86400000;

/**
 * Orders endpoint.
 *
 * GET returns paginated, sorted, and filtered order list.
 * POST creates a new order with default values.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const perPage = Math.min(MAX_PER_PAGE, Math.max(MIN_PER_PAGE, parseInt(searchParams.get("perPage") ?? String(DEFAULT_PER_PAGE))));
  const search = (searchParams.get("search") ?? "").toLowerCase();
  const statusFilter = searchParams.get("status") ?? "all";
  const sortField = searchParams.get("sortField") ?? "date";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

  let filtered = [...orders];

  if (search) {
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(search) ||
        o.customer.toLowerCase().includes(search) ||
        o.email.toLowerCase().includes(search)
    );
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((o) => o.status === statusFilter);
  }

  filtered.sort((a, b) => {
    if (sortField === "amount") {
      return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    const aVal: unknown = a[sortField as keyof Order];
    const bVal: unknown = b[sortField as keyof Order];
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
 * Create a new order.
 *
 * Parses the JSON body and creates an order with sensible defaults.
 * Logs the error on failure rather than swallowing it.
 *
 * @param request - The incoming HTTP request with JSON body
 * @returns JSON response with the created order or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lastId = Math.max(...orders.map((o) => parseInt(o.id.split("-")[1])));
    const newOrder: Order = {
      id: `ORD-${lastId + 1}`,
      customer: body.customer || "New Customer",
      email: body.email || "customer@example.com",
      items: body.items || 1,
      amount: body.amount || 0,
      status: "processing",
      payment: "pending",
      date: new Date().toISOString().split("T")[0],
      eta: new Date(Date.now() + ETA_DAYS * MS_PER_DAY).toISOString().split("T")[0],
    };
    orders.unshift(newOrder);
    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders] Failed to parse request body:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
