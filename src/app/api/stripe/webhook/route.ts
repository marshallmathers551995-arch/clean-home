import { getStripe } from "@/lib/payments";
import { markPaid } from "@/lib/orders";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return new Response("Webhook not configured", { status: 400 });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.client_reference_id) {
      const matched =
        session.currency === "myr" &&
        typeof session.amount_total === "number" &&
        (await markPaid(session.client_reference_id, session.id, session.amount_total));
      // Not an error Stripe can fix by retrying (already paid, or amount mismatch), so still answer 200.
      if (!matched) console.warn(`Stripe session ${session.id} did not match a pending order ${session.client_reference_id}`);
    }
  }
  return new Response("ok");
}
