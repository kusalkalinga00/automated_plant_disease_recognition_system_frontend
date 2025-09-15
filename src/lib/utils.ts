import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a 0..1 confidence value into a friendly percentage string
export function formatConfidence(c?: number): string {
  if (c == null || isNaN(c)) return "-";
  const pct = Math.max(0, Math.min(1, c)) * 100;
  if (pct >= 99.995) return "100%";
  if (pct >= 1) return `${pct.toFixed(2)}%`;
  if (pct >= 0.1) return `${pct.toFixed(3)}%`;
  return "<0.1%";
}

// Convert 0..1 confidence to a CSS width percentage (e.g., "99.53%")
export function confidenceWidth(c?: number): string {
  if (c == null || isNaN(c)) return "0%";
  const pct = Math.max(0, Math.min(100, c * 100));
  return `${pct.toFixed(2)}%`;
}
