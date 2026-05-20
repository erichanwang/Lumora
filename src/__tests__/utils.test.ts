import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatNumber, formatDate, formatRelativeTime, formatPercentage } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
    expect(cn("base", true && "visible")).toBe("base visible");
  });

  it("merges Tailwind classes correctly", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("handles undefined and null", () => {
    expect(cn("foo", undefined, null)).toBe("foo");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats whole numbers", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
  });

  it("formats large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatNumber", () => {
  it("formats with commas", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2025-03-15");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats January date", () => {
    const result = formatDate("2025-01-01");
    expect(result).toContain("Jan");
    expect(result).toContain("1");
    expect(result).toContain("2025");
  });

  it("formats December date", () => {
    const result = formatDate("2024-12-25");
    expect(result).toContain("Dec");
    expect(result).toContain("25");
    expect(result).toContain("2024");
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent dates", () => {
    const result = formatRelativeTime(new Date().toISOString());
    expect(result).toBe("just now");
  });

  it("returns minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");
  });

  it("returns days ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe("2d ago");
  });

  it("accepts Date objects", () => {
    const result = formatRelativeTime(new Date());
    expect(result).toBe("just now");
  });
});

describe("formatPercentage", () => {
  it("formats positive values with + prefix", () => {
    expect(formatPercentage(12.5)).toBe("+12.5%");
  });

  it("formats negative values with - prefix", () => {
    expect(formatPercentage(-3.1)).toBe("-3.1%");
  });

  it("formats zero", () => {
    expect(formatPercentage(0)).toBe("+0.0%");
  });

  it("respects decimal places parameter", () => {
    expect(formatPercentage(12.345, 2)).toBe("+12.35%");
  });
});
