import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { markPaid } from "@/lib/orders";
import { paymentProvider } from "@/lib/payments";
import { formatRM } from "@/lib/money";

export const dynamic = "force-dynamic";

// Local stand-in for a payment gateway. Only reachable when PAYMENT_PROVIDER is not "stripe".
async function pay(formData: FormData) {
  "use server";
  if (paymentProvider() !== "mock") return;
  const number = String(formData.get("number"));
  const order = await db.order.findUnique({ where: { number } });
  if (!order) return;
  await markPaid(number, `mock-${Date.now()}`, order.totalSen);
  redirect(`/order/${number}`);
}

export default async function MockPayPage({ params }: { params: Promise<{ number: string }> }) {
  if (paymentProvider() !== "mock") notFound();
  const { number } = await params;
  const order = await db.order.findUnique({ where: { number } });
  if (!order) notFound();

  return (
    <div className="container-page max-w-md py-16">
      <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Mock payment (local only)</p>
        <h1 className="mt-2 text-2xl font-bold">Pay {formatRM(order.totalSen)}</h1>
        <p className="mt-1 text-sm text-muted">Order {order.number}. No real money is charged.</p>
        <form action={pay} className="mt-6 flex gap-3">
          <input type="hidden" name="number" value={order.number} />
          <button className="flex-1 rounded-full bg-wa py-3 font-semibold text-white hover:bg-wa-dark">Simulate successful payment</button>
        </form>
      </div>
    </div>
  );
}
