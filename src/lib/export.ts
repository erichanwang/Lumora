/**
 * Convert an array of objects to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  columns?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return "";

  const keys = columns
    ? columns.map((c) => c.key)
    : (Object.keys(data[0] as object) as (keyof T)[]);

  const headers = columns
    ? columns.map((c) => c.label)
    : keys.map((k) => String(k));

  const csvRows = [
    headers.map(escapeCSV).join(","),
    ...data.map((row) =>
      keys.map((key) => escapeCSV(String(row[key] ?? ""))).join(",")
    ),
  ];

  return csvRows.join("\n");
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Trigger a browser download of a CSV string
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV and trigger download
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  const csv = toCSV(data, columns);
  downloadCSV(csv, filename);
}
