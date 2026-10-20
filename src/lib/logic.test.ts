import { describe, expect, it } from "vitest";
import { computeTotals, bundleSavings } from "./pricing";
import { deliveryFeeSen, isServedArea } from "./delivery";
import { formatRM } from "./money";
import { whatsappMessage, whatsappUrl } from "./whatsapp";

describe("money", () => {
  it("formats sen as RM", () => {
    expect(formatRM(690)).toBe("RM 6.90");
    expect(formatRM(6490)).toBe("RM 64.90");
  });
});

describe("delivery", () => {
  it("charges a fee at or below RM80 and is free above", () => {
    expect(deliveryFeeSen(7999)).toBe(800);
    expect(deliveryFeeSen(8000)).toBe(800);
    expect(deliveryFeeSen(8001)).toBe(0);
  });
  it("only serves KL and Selangor", () => {
    expect(isServedArea("Selangor")).toBe(true);
    expect(isServedArea("Johor")).toBe(false);
  });
});

describe("pricing", () => {
  it("sums lines and adds delivery", () => {
    const t = computeTotals([{ unitPriceSen: 690, quantity: 2 }, { unitPriceSen: 1290, quantity: 1 }]);
    expect(t).toEqual({ subtotalSen: 2670, deliveryFeeSen: 800, totalSen: 3470 });
  });
  it("has no delivery fee for an empty cart", () => {
    expect(computeTotals([]).totalSen).toBe(0);
  });
  it("computes bundle savings from the fixed price", () => {
    const s = bundleSavings(2190, [{ priceSen: 1290, quantity: 1 }, { priceSen: 890, quantity: 1 }, { priceSen: 590, quantity: 1 }]);
    expect(s).toEqual({ originalSen: 2770, savedSen: 580, savePercent: 21 });
  });
  it("never reports negative savings", () => {
    expect(bundleSavings(5000, [{ priceSen: 1000, quantity: 1 }]).savedSen).toBe(0);
  });
});

describe("whatsapp", () => {
  const order = {
    number: "CH-0001", customerName: "Aisyah", phone: "0123456789", address: "1 Jalan A", area: "Selangor",
    subtotalSen: 690, deliveryFeeSen: 800, totalSen: 1490,
    items: [{ name: "Dishwashing Liquid 1L", quantity: 1, unitPriceSen: 690 }],
  };
  it("builds a readable message", () => {
    const m = whatsappMessage(order);
    expect(m).toContain("CH-0001");
    expect(m).toContain("1 x Dishwashing Liquid 1L (RM 6.90)");
    expect(m).toContain("Total: RM 14.90");
  });
  it("builds a wa.me url with the digits only", () => {
    expect(whatsappUrl("+60 12-345 6789", "hi there")).toBe("https://wa.me/60123456789?text=hi%20there");
  });
});
