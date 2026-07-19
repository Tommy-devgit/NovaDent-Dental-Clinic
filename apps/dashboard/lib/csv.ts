function escapeCell(value: unknown): string {
  if (value == null) return "";
  const raw = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n\r]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

/** Serialize rows to RFC-4180 CSV (CRLF line endings, quoted cells where needed). */
export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))];
  return lines.join("\r\n");
}
