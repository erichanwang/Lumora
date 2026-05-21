import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with conflict resolution.
 *
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * of conflicting utility classes.
 *
 * @param inputs - Class values (strings, objects, arrays) to merge
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency without decimal places.
 *
 * @param amount - The monetary amount to format
 * @returns Formatted currency string (e.g., "$12,400")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with locale-appropriate separators.
 *
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1,423")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format a date string as a human-readable date.
 *
 * Uses noon UTC to avoid timezone offset issues when parsing date-only strings.
 *
 * @param date - ISO date string (with or without time component)
 * @returns Formatted date string (e.g., "Mar 1, 2025")
 */
export function formatDate(date: string): string {
  // Parse date safely, using noon to avoid timezone offset issues
  const parsed = new Date(date + (date.includes("T") ? "" : "T12:00:00"));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

/**
 * Format a date as a relative time string (e.g., "5m ago", "2h ago").
 *
 * For dates older than 7 days, falls back to the formatted date.
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const parsed = typeof date === "string" ? new Date(date + (date.includes("T") ? "" : "T12:00:00")).getTime() : date.getTime();
  const diff = now - parsed;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(typeof date === "string" ? date : date.toISOString());
}

/**
 * Format a percentage value with a sign prefix and configurable decimals.
 *
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "+23.6%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}
