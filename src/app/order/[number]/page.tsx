import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatRM } from "@/lib/money";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Logo";
import { AutoRefresh } from "./AutoRefresh";
import { ClearCart } from "./ClearCart";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = await db.order.findUnique({ where: { number }, include: { items: true } });
  if (!order) notFound();

  const isWhatsApp = order.paymentMethod === "WHATSAPP";
  const pendingPayment = order.status === "PENDING";
  const cancelled = order.status === "CANCELLED";

  return (
    <div className="container-page max-w-2xl py-10">
      {!pendingPayment && !cancelled && <ClearCart />}
      {pendingPayment && <AutoRefresh />}
      <h1 className="text-3xl font-bold text-navy">
        {cancelled ? "Order cancelled" : pendingPayment ? "Confirming payment" : isWhatsApp ? "Almost done!" : "Thank you!"}
      </h1>
      <p className="mt-2 text-muted">
        Order <strong className="text-foreground">{order.number}</strong>
        {order.status === "PAID" && " is paid. We will deliver to you soon."}
        {cancelled && " was not completed. Your items are still in your cart if you want to try again."}
        {pendingPayment && " is waiting for payment confirmation. This page updates by itself. If you were charged and it doesn't change, contact us with your order number."}
        {isWhatsApp && " has been saved. Send it to us on WhatsApp so we can confirm the total and delivery."}
      </p>

      {isWhatsApp && (
        <a
          href={whatsappUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", whatsappMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-3 font-semibold text-white hover:bg-wa-dark sm:inline-flex"
        >
          <WhatsAppIcon /> Send order on WhatsApp
        </a>
      )}

      <div className="mt-8 rounded-xl border border-line p-5">
        <ul className="divide-y divide-line text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>{i.quantity} &times; {i.name}</span>
              <span>{formatRM(i.unitPriceSen * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatRM(order.subtotalSen)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{order.deliveryFeeSen === 0 ? "FREE" : formatRM(order.deliveryFeeSen)}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatRM(order.totalSen)}</span></div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Deliver to {order.customerName}, {order.address}, {order.area}
        </p>
      </div>

      <Link href="/products" className="mt-8 inline-block text-sm font-semibold text-brand">&larr; Continue shopping</Link>
    </div>
  );
}
