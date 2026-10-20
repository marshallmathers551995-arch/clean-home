import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "./db";
import { DELIVERY, isServedArea } from "./delivery";
import { generateOrderNumber } from "./order-number";
import { computeTotals, MAX_QTY, type PricedLine } from "./pricing";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        kind: z.enum(["product", "bundle"]),
        id: z.number().int().positive(),
        quantity: z.number().int().min(1).max(MAX_QTY),
      }),
    )
    .min(1, "Your order is empty")
    .max(50),
  customerName: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{8,15}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email")]).optional(),
  address: z.string().trim().min(8, "Please enter your full address").max(300),
  area: z.string().refine(isServedArea, `We currently deliver to ${DELIVERY.areas.join(" and ")} only`),
  notes: z.string().trim().max(300).optional(),
  paymentMethod: z.enum(["ONLINE", "WHATSAPP"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export class OrderError extends Error {}

/** Looks up every price from the database; the client only supplies ids and quantities. */
export async function priceCart(items: CheckoutInput["items"]): Promise<PricedLine[]> {
  const productIds = items.filter((i) => i.kind === "product").map((i) => i.id);
  const bundleIds = items.filter((i) => i.kind === "bundle").map((i) => i.id);
  const [products, bundles] = await Promise.all([
    db.product.findMany({ where: { id: { in: productIds }, active: true } }),
    db.bundle.findMany({ where: { id: { in: bundleIds }, active: true } }),
  ]);
  const pMap = new Map(products.map((p) => [p.id, p]));
  const bMap = new Map(bundles.map((b) => [b.id, b]));

  return items.map((i) => {
    if (i.kind === "product") {
      const p = pMap.get(i.id);
      if (!p) throw new OrderError("An item in your order is no longer available");
      return { ...i, name: `${p.name} ${p.size}`, unitPriceSen: p.priceSen };
    }
    const b = bMap.get(i.id);
    if (!b) throw new OrderError("A bundle in your order is no longer available");
    return { ...i, name: b.name, unitPriceSen: b.priceSen };
  });
}

async function createOrderRow(input: CheckoutInput, lines: PricedLine[], number: string) {
  const totals = computeTotals(lines);
  return db.order.create({
    data: {
      number,
      status: input.paymentMethod === "ONLINE" ? "PENDING" : "WHATSAPP",
      paymentMethod: input.paymentMethod,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email || null,
      address: input.address,
      area: input.area,
      notes: input.notes || null,
      ...totals,
      items: {
        create: lines.map((l) => ({
          name: l.name,
          unitPriceSen: l.unitPriceSen,
          quantity: l.quantity,
          productId: l.kind === "product" ? l.id : null,
          bundleId: l.kind === "bundle" ? l.id : null,
        })),
      },
    },
    include: { items: true },
  });
}

export async function createOrder(input: CheckoutInput) {
  const lines = await priceCart(input.items);
  // A clash on the unique order number is astronomically unlikely, but retry rather than fail the customer.
  for (let attempt = 0; ; attempt++) {
    try {
      return await createOrderRow(input, lines, generateOrderNumber());
    } catch (e) {
      const clash = e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
      if (!clash || attempt >= 4) throw e;
    }
  }
}

/** Marks a pending order paid, but only if the amount actually paid matches the order total. */
export async function markPaid(orderNumber: string, paymentRef: string, paidTotalSen: number): Promise<boolean> {
  const result = await db.order.updateMany({
    where: { number: orderNumber, status: "PENDING", totalSen: paidTotalSen },
    data: { status: "PAID", paymentRef },
  });
  return result.count > 0;
}

export async function cancelOrder(orderNumber: string) {
  await db.order.updateMany({ where: { number: orderNumber, status: "PENDING" }, data: { status: "CANCELLED" } });
}
