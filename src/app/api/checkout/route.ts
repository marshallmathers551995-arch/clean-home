import { cancelOrder, checkoutSchema, createOrder, OrderError } from "@/lib/orders";
import { createPaymentSession, paymentProvider } from "@/lib/payments";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Refuse before saving anything, so an unavailable payment method doesn't leave a pending order behind.
  if (parsed.data.paymentMethod === "ONLINE" && paymentProvider() === "none") {
    return Response.json(
      { error: "Online payment is not available right now. Please order via WhatsApp instead." },
      { status: 503 },
    );
  }

  try {
    const order = await createOrder(parsed.data);
    if (order.paymentMethod === "WHATSAPP") {
      const url = whatsappUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", whatsappMessage(order));
      return Response.json({ orderNumber: order.number, redirectUrl: url });
    }
    try {
      const redirectUrl = await createPaymentSession(order);
      return Response.json({ orderNumber: order.number, redirectUrl });
    } catch (e) {
      await cancelOrder(order.number);
      throw e;
    }
  } catch (e) {
    if (e instanceof OrderError) return Response.json({ error: e.message }, { status: 409 });
    console.error(e);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
