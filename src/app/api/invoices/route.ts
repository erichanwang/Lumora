import { NextRequest, NextResponse } from "next/server";
import { invoices, type Invoice } from "@/lib/data/invoices";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").toLowerCase();

  let filtered = [...invoices];

  if (search) {
    filtered = filtered.filter(
      (inv) =>
        inv.customer.toLowerCase().includes(search) ||
        inv.id.toLowerCase().includes(search)
    );
  }

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return NextResponse.json({
    data: filtered,
    summary: {
      total: invoices.length,
      paid: invoices.filter((i) => i.status === "paid").length,
      pending: invoices.filter((i) => i.status === "pending").length,
      overdue: invoices.filter((i) => i.status === "overdue").length,
      totalOutstanding,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lastNum = Math.max(
      ...invoices.map((inv) => parseInt(inv.id.split("-").pop() ?? "0"))
    );
    const newInvoice: Invoice = {
      id: `INV-2025-${String(lastNum + 1).padStart(3, "0")}`,
      customer: body.customer || "New Client",
      email: body.email || "client@example.com",
      amount: body.amount || 0,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    };
    invoices.unshift(newInvoice);
    return NextResponse.json({ data: newInvoice }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
