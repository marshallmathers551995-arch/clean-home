// Delivery rules live here so they are easy to change.
export const DELIVERY = {
  areas: ["Kuala Lumpur", "Selangor"] as const,
  freeAboveSen: 8000, // free delivery for subtotals above RM 80
  feeSen: 800, // otherwise RM 8.00
};

export type DeliveryArea = (typeof DELIVERY.areas)[number];

export function isServedArea(area: string): area is DeliveryArea {
  return (DELIVERY.areas as readonly string[]).includes(area);
}

export function deliveryFeeSen(subtotalSen: number): number {
  return subtotalSen > DELIVERY.freeAboveSen ? 0 : DELIVERY.feeSen;
}
