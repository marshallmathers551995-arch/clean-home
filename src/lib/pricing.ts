import { deliveryFeeSen } from "./delivery";

export type CartLine = { kind: "product" | "bundle"; id: number; quantity: number };

export type PricedLine = CartLine & { name: string; unitPriceSen: number };

export type Totals = { subtotalSen: number; deliveryFeeSen: number; totalSen: number };

export const MAX_QTY = 99;

export function computeTotals(lines: { unitPriceSen: number; quantity: number }[]): Totals {
  const subtotalSen = lines.reduce((sum, l) => sum + l.unitPriceSen * l.quantity, 0);
  const fee = lines.length === 0 ? 0 : deliveryFeeSen(subtotalSen);
  return { subtotalSen, deliveryFeeSen: fee, totalSen: subtotalSen + fee };
}

/** Value of a bundle's contents if bought separately, and the saving vs the fixed bundle price. */
export function bundleSavings(bundlePriceSen: number, items: { priceSen: number; quantity: number }[]) {
  const originalSen = items.reduce((s, i) => s + i.priceSen * i.quantity, 0);
  const savedSen = Math.max(0, originalSen - bundlePriceSen);
  const savePercent = originalSen > 0 ? Math.round((savedSen / originalSen) * 100) : 0;
  return { originalSen, savedSen, savePercent };
}
