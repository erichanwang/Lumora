import { NextRequest, NextResponse } from "next/server";
import { invoices, type Invoice } from "@/lib/data/invoices";

/** Number of days from now to set the invoice due date */
const DUE_DATE_DAYS = 14;
/** Milliseconds in a day */
const MS_PER_DAY = 86400000;
/** How many digits to pad the invoice number to */
const INVOICE_NUMBER_PAD = 3;

/**
 * Invoices endpoint.
 *
 * GET returns the invoice list with summary statistics.
 * POST creates a new invoice with default values.
 */
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
    app: "Lumora",
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

/**
 * Create a new invoice.
 *
 * Parses the JSON body and creates an invoice with sensible defaults.
 * Logs the error on failure rather than swallowing it.
 *
 * @param request - The incoming HTTP request with JSON body
 * @returns JSON response with the created invoice or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lastNum = Math.max(
      ...invoices.map((inv) => parseInt(inv.id.split("-").pop() ?? "0"))
    );
    const newInvoice: Invoice = {
      id: `INV-2025-${String(lastNum + 1).padStart(INVOICE_NUMBER_PAD, "0")}`,
      customer: body.customer || "New Client",
      email: body.email || "client@example.com",
      amount: body.amount || 0,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + DUE_DATE_DAYS * MS_PER_DAY).toISOString().split("T")[0],
    };
    invoices.unshift(newInvoice);
    return NextResponse.json({ data: newInvoice }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/invoices] Failed to parse request body:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
