import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each dashboard test
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("alex@lumora.io");
    await page.getByLabel(/password/i).fill("demo1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test("should display dashboard stats", async ({ page }) => {
    await expect(page.getByText(/total revenue/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/active users/i)).toBeVisible();
    await expect(page.getByText(/orders/i)).toBeVisible();
  });

  test("should navigate to users page", async ({ page }) => {
    await page.getByRole("link", { name: /users/i }).first().click();
    await page.waitForURL(/\/users/);
    await expect(page.getByText(/users/i)).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /theme|toggle|dark|light/i });
    if (await themeButton.isVisible()) {
      await themeButton.click();
      // Check that theme changed
      await expect(page.locator("html")).toHaveAttribute("class", /dark/, { timeout: 3000 });
    }
  });

  test("should open search modal with Cmd+K", async ({ page }) => {
    await page.keyboard.press("Meta+k");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible({ timeout: 5000 });
  });

  test("mobile navigation should show hamburger menu", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const hamburger = page.getByRole("button", { name: /menu|hamburger|open/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.getByRole("navigation")).toBeVisible({ timeout: 3000 });
    }
  });
});
