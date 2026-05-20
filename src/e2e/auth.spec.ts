import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("landing page should be publicly accessible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /lumora/i })).toBeVisible();
  });

  test("should redirect to login when accessing protected route", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
  });

  test("should show login form with all fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should show validation error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("wrong@email.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("alex@lumora.io");
    await page.getByLabel(/password/i).fill("demo1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test("register page should show signup form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
