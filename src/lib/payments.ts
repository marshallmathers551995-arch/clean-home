import Stripe from "stripe";
import { siteUrl } from "./site";

type OrderForPayment = {
  number: string;
  email: string | null;
  items: { name: string; unitPriceSen: number; quantity: number }[];
  deliveryFeeSen: number;
};

export class PaymentUnavailableError extends Error {
  constructor() {
    super("Online payment is not available right now");
  }
}

/**
 * - "stripe": a Stripe secret key is configured (and PAYMENT_PROVIDER is not forced to "mock").
 * - "mock":   local development only. The fake payment page is never offered in production.
 * - "none":   nothing usable is configured, so online payment is switched off.
 */
export function paymentProvider(): "stripe" | "mock" | "none" {
  const wanted = process.env.PAYMENT_PROVIDER;
  if (process.env.STRIPE_SECRET_KEY && wanted !== "mock") return "stripe";
  if (process.env.NODE_ENV !== "production" && wanted !== "stripe") return "mock";
  return "none";
}

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

/** Returns the URL the customer should be sent to in order to pay. */
export async function createPaymentSession(order: OrderForPayment): Promise<string> {
  const provider = paymentProvider();
  if (provider === "none") throw new PaymentUnavailableError();
  if (provider === "mock") return `${siteUrl()}/pay/mock/${order.number}`;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    // Payment methods (card, FPX) are enabled in the Stripe Dashboard, not here.
    client_reference_id: order.number,
    customer_email: order.email ?? undefined,
    line_items: [
      ...order.items.map((i) => ({
        quantity: i.quantity,
        price_data: { currency: "myr", unit_amount: i.unitPriceSen, product_data: { name: i.name } },
      })),
      ...(order.deliveryFeeSen > 0
        ? [
            {
              quantity: 1,
              price_data: { currency: "myr", unit_amount: order.deliveryFeeSen, product_data: { name: "Delivery" } },
            },
          ]
        : []),
    ],
    success_url: `${siteUrl()}/order/${order.number}`,
    cancel_url: `${siteUrl()}/checkout`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}
