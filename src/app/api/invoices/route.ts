import { NextRequest, NextResponse } from "next/server";

interface Invoice {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
}

const invoices: Invoice[] = [
  { id: "INV-2025-001", customer: "Acme Corp", email: "billing@acme.com", amount: 2499.00, status: "paid", date: "2025-03-01", dueDate: "2025-03-15" },
  { id: "INV-2025-002", customer: "Globex Inc", email: "finance@globex.io", amount: 5899.00, status: "pending", date: "2025-02-28", dueDate: "2025-03-14" },
  { id: "INV-2025-003", customer: "Initech", email: "ap@initech.co", amount: 1299.00, status: "paid", date: "2025-02-25", dueDate: "2025-03-11" },
  { id: "INV-2025-004", customer: "Hooli", email: "bills@hooli.xyz", amount: 8499.00, status: "overdue", date: "2025-01-15", dueDate: "2025-02-01" },
  { id: "INV-2025-005", customer: "Stark Industries", email: "accounts@stark.com", amount: 12999.00, status: "paid", date: "2025-02-20", dueDate: "2025-03-06" },
  { id: "INV-2025-006", customer: "Wayne Enterprises", email: "payables@wayne.org", amount: 3499.00, status: "pending", date: "2025-03-02", dueDate: "2025-03-16" },
  { id: "INV-2025-007", customer: "Cyberdyne Systems", email: "finance@cyberdyne.net", amount: 6999.00, status: "overdue", date: "2024-12-10", dueDate: "2024-12-25" },
  { id: "INV-2025-008", customer: "Soylent Corp", email: "billing@soylent.com", amount: 1899.00, status: "paid", date: "2025-02-28", dueDate: "2025-03-14" },
  { id: "INV-2025-009", customer: "Umbrella Corp", email: "accounts@umbrella.bio", amount: 4599.00, status: "pending", date: "2025-03-05", dueDate: "2025-03-19" },
  { id: "INV-2025-010", customer: "Wonka Industries", email: "finance@wonka.candy", amount: 1299.00, status: "paid", date: "2025-03-03", dueDate: "2025-03-17" },
];

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
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
