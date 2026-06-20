export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Backend returns numeric months (1-12). Convert to short names for display.
export function monthName(n) {
  if (n === null || n === undefined) return "—";
  const idx = Number(n) - 1;
  return MONTH_NAMES[idx] ?? String(n);
}
