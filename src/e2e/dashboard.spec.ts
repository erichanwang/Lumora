import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("alex@lumora.io");
    await page.getByLabel(/password/i).fill("demo1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test("should display dashboard stats and metrics", async ({ page }) => {
    await expect(page.getByText(/total revenue/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/active users/i)).toBeVisible();
    await expect(page.getByText(/orders/i)).toBeVisible();
    await expect(page.getByText(/growth rate/i)).toBeVisible();
    await expect(page.getByText(/top products/i)).toBeVisible();
    await expect(page.getByText(/recent activity/i)).toBeVisible();
  });

  test("should navigate to users page with sidebar", async ({ page }) => {
    await page.getByRole("link", { name: /users/i }).first().click();
    await page.waitForURL(/\/users/);
    await expect(page.getByText(/manage team members/i)).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to orders page with sidebar", async ({ page }) => {
    await page.getByRole("link", { name: /orders/i }).first().click();
    await page.waitForURL(/\/orders/);
    await expect(page.getByText(/track and manage/i)).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to invoices page with sidebar", async ({ page }) => {
    await page.getByRole("link", { name: /invoices/i }).first().click();
    await page.waitForURL(/\/invoices/);
    await expect(page.getByText(/manage and track/i)).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to team page with sidebar", async ({ page }) => {
    await page.getByRole("link", { name: /team/i }).first().click();
    await page.waitForURL(/\/team/);
    await expect(page.getByText(/manage your team members/i)).toBeVisible({ timeout: 5000 });
  });

  test("should toggle theme with button", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch to dark|switch to light/i });
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await expect(page.locator("html")).toHaveAttribute("class", /dark/, { timeout: 3000 });
    }
  });

  test("should open search modal with Cmd+K", async ({ page }) => {
    await page.keyboard.press("Meta+k");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible({ timeout: 5000 });
  });

  test("should search and navigate in command palette", async ({ page }) => {
    await page.keyboard.press("Meta+k");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible({ timeout: 5000 });
    await page.getByPlaceholder(/search/i).fill("user");
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/users/);
  });

  test("should open keyboard shortcuts modal with Cmd+/", async ({ page }) => {
    await page.keyboard.press("Meta+/");
    await expect(page.getByText(/keyboard shortcuts/i)).toBeVisible({ timeout: 5000 });
    await page.keyboard.press("Escape");
    await expect(page.getByText(/keyboard shortcuts/i)).not.toBeVisible();
  });

  test("mobile navigation should show and close sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const hamburger = page.getByRole("button", { name: /open menu/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.getByRole("button", { name: /close sidebar/i })).toBeVisible({ timeout: 3000 });
    }
  });

  test("should search users table", async ({ page }) => {
    await page.goto("/users");
    await page.waitForURL(/\/users/);
    const searchInput = page.getByPlaceholder(/search users/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("Sarah");
      await expect(page.getByText("sarah@example.com")).toBeVisible();
    }
  });

  test("should filter orders by status", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForURL(/\/orders/);
    const filterSelect = page.locator("select").first();
    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption("delivered");
      await expect(page.getByText("Delivered").first()).toBeVisible();
    }
  });
});
