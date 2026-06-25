export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function safeString(value: unknown, fallback = "N/A"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

export function safeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : undefined
  });
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
}

export function getNestedValue(obj: unknown, possibleKeys: string[]): unknown {
  const root = isRecord(obj) ? obj : {};
  for (const path of possibleKeys) {
    const value = path.split(".").reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), root);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

export function errorToMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (isRecord(error)) {
    const message = error.Message ?? error.message ?? error.error;
    const code = error.Code ?? error.code;
    if (message) return code ? `${safeString(message)} (${safeString(code)})` : safeString(message);
  }
  return "Onbekende fout";
}
