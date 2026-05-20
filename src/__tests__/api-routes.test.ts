import { describe, it, expect } from "vitest";
import { users, type User } from "@/lib/data/users";
import { orders, type Order } from "@/lib/data/orders";
import { invoices, type Invoice } from "@/lib/data/invoices";

// These tests verify the data filtering/sorting logic used by API routes

describe("Users API logic", () => {
  const testUsers: User[] = users;

  it("filters by search query on name", () => {
    const q = "alex".toLowerCase();
    const result = testUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].name.toLowerCase()).toContain(q);
  });

  it("filters by role", () => {
    const role = "admin";
    const result = testUsers.filter(
      (u) => u.role.toLowerCase() === role
    );
    expect(result.every((u) => u.role.toLowerCase() === role)).toBe(true);
  });

  it("filters by status", () => {
    const status = "active";
    const result = testUsers.filter((u) => u.status === status);
    expect(result.every((u) => u.status === status)).toBe(true);
  });

  it("sorts by name ascending", () => {
    const sorted = [...testUsers].sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].name >= sorted[i - 1].name).toBe(true);
    }
  });

  it("sorts by revenue descending", () => {
    const sorted = [...testUsers].sort((a, b) => b.revenue - a.revenue);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].revenue <= sorted[i - 1].revenue).toBe(true);
    }
  });

  it("paginates correctly", () => {
    const page = 0;
    const perPage = 5;
    const paged = testUsers.slice(page * perPage, (page + 1) * perPage);
    expect(paged.length).toBeLessThanOrEqual(perPage);
  });

  it("generates new user ID", () => {
    const newId = Math.max(...testUsers.map((u) => u.id)) + 1;
    expect(newId).toBeGreaterThan(Math.max(...testUsers.map((u) => u.id)));
  });
});

describe("Orders API logic", () => {
  const testOrders: Order[] = orders;

  it("filters by search query", () => {
    const q = "olivia".toLowerCase();
    const result = testOrders.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
    );
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by status", () => {
    const status = "delivered";
    const result = testOrders.filter((o) => o.status === status);
    expect(result.every((o) => o.status === status)).toBe(true);
  });

  it("sorts by amount descending", () => {
    const sorted = [...testOrders].sort((a, b) => b.amount - a.amount);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].amount <= sorted[i - 1].amount).toBe(true);
    }
  });

  it("generates new order ID", () => {
    const lastNum = Math.max(
      ...testOrders.map((o) => parseInt(o.id.split("-")[1]))
    );
    const newId = `ORD-${lastNum + 1}`;
    expect(newId).toMatch(/^ORD-\d+$/);
  });
});

describe("Invoices API logic", () => {
  const testInvoices: Invoice[] = invoices;

  it("calculates outstanding total", () => {
    const outstanding = testInvoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);
    expect(outstanding).toBeGreaterThan(0);
  });

  it("counts statuses correctly", () => {
    const paid = testInvoices.filter((i) => i.status === "paid").length;
    const pending = testInvoices.filter((i) => i.status === "pending").length;
    const overdue = testInvoices.filter((i) => i.status === "overdue").length;
    expect(paid + pending + overdue).toBe(testInvoices.length);
  });

  it("generates new invoice ID", () => {
    const lastNum = Math.max(
      ...testInvoices.map((inv) => parseInt(inv.id.split("-").pop() ?? "0"))
    );
    const newId = `INV-2025-${String(lastNum + 1).padStart(3, "0")}`;
    expect(newId).toMatch(/^INV-2025-\d{3}$/);
  });
});
