import { NextRequest, NextResponse } from "next/server";
import { orders, type Order } from "@/lib/data/orders";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") ?? "10")));
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
      eta: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    };
    orders.unshift(newOrder);
    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
