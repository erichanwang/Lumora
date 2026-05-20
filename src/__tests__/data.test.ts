import { describe, it, expect } from "vitest";
import { users } from "@/lib/data/users";
import { orders } from "@/lib/data/orders";
import { invoices } from "@/lib/data/invoices";
import { dashboardStats, revenueData, activities, notifications } from "@/lib/data";

describe("User data", () => {
  it("has at least 15 users", () => {
    expect(users.length).toBeGreaterThanOrEqual(15);
  });

  it("has unique IDs", () => {
    const ids = users.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid roles", () => {
    const validRoles = ["Admin", "Editor", "Viewer"];
    users.forEach((u) => {
      expect(validRoles).toContain(u.role);
    });
  });

  it("has valid statuses", () => {
    const validStatuses = ["active", "inactive", "pending"];
    users.forEach((u) => {
      expect(validStatuses).toContain(u.status);
    });
  });
});

describe("Order data", () => {
  it("has at least 10 orders", () => {
    expect(orders.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique order IDs", () => {
    const ids = orders.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid order statuses", () => {
    const validStatuses = ["delivered", "shipped", "processing", "cancelled"];
    orders.forEach((o) => {
      expect(validStatuses).toContain(o.status);
    });
  });

  it("has positive amounts for non-cancelled orders", () => {
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        expect(o.amount).toBeGreaterThan(0);
      });
  });
});

describe("Invoice data", () => {
  it("has at least 8 invoices", () => {
    expect(invoices.length).toBeGreaterThanOrEqual(8);
  });

  it("has valid invoice statuses", () => {
    const validStatuses = ["paid", "pending", "overdue"];
    invoices.forEach((inv) => {
      expect(validStatuses).toContain(inv.status);
    });
  });
});

describe("Dashboard stats", () => {
  it("has all required fields", () => {
    expect(dashboardStats).toHaveProperty("totalRevenue");
    expect(dashboardStats).toHaveProperty("activeUsers");
    expect(dashboardStats).toHaveProperty("orders");
    expect(dashboardStats).toHaveProperty("growthRate");
  });

  it("has positive values", () => {
    expect(dashboardStats.totalRevenue).toBeGreaterThan(0);
    expect(dashboardStats.activeUsers).toBeGreaterThan(0);
    expect(dashboardStats.orders).toBeGreaterThan(0);
  });
});

describe("Revenue data", () => {
  it("has 12 months of data", () => {
    expect(revenueData.length).toBe(12);
  });

  it("each month has revenue, expenses, and profit", () => {
    revenueData.forEach((m) => {
      expect(m.revenue).toBeGreaterThan(0);
      expect(m.expenses).toBeGreaterThan(0);
      expect(m.profit).toBeDefined();
    });
  });
});

describe("Activity data", () => {
  it("has activities", () => {
    expect(activities.length).toBeGreaterThan(0);
  });

  it("each activity has required fields", () => {
    activities.forEach((a) => {
      expect(a).toHaveProperty("user");
      expect(a).toHaveProperty("action");
      expect(a).toHaveProperty("time");
      expect(a).toHaveProperty("type");
    });
  });
});

describe("Notification data", () => {
  it("has notifications", () => {
    expect(notifications.length).toBeGreaterThan(0);
  });

  it("has some unread notifications", () => {
    const unread = notifications.filter((n) => !n.read);
    expect(unread.length).toBeGreaterThan(0);
  });
});
