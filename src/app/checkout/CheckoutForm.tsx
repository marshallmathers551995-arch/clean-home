"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";
import { DELIVERY } from "@/lib/delivery";
import { formatRM } from "@/lib/money";

type Method = "ONLINE" | "WHATSAPP";

const field = "mt-1 w-full rounded-md border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function CheckoutForm({ onlineAvailable }: { onlineAvailable: boolean }) {
  const router = useRouter();
  const cart = useCart();
  const [method, setMethod] = useState<Method>(onlineAvailable ? "ONLINE" : "WHATSAPP");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!cart.ready) return <p className="mt-6 text-muted">Loading your order&hellip;</p>;

  if (cart.items.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-muted">Your order is empty.</p>
        <Link href="/products" className="mt-4 block rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white sm:inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const body = {
      items: cart.items.map(({ kind, id, quantity }) => ({ kind, id, quantity })),
      customerName: String(form.get("customerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
      area: String(form.get("area") ?? ""),
      notes: String(form.get("notes") ?? ""),
      paymentMethod: method,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setFieldErrors(data.fields ?? {});
        setSubmitting(false);
        return;
      }
      if (method === "ONLINE") {
        window.location.href = data.redirectUrl;
      } else {
        router.push(`/order/${data.orderNumber}`);
      }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const err = (name: string) =>
    fieldErrors[name]?.[0] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[name][0]}</p> : null;

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Delivery details</h2>
        <label className="block text-sm font-medium">
          Full name
          <input name="customerName" required autoComplete="name" className={field} />
          {err("customerName")}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Phone
            <input name="phone" type="tel" required autoComplete="tel" placeholder="012-345 6789" className={field} />
            {err("phone")}
          </label>
          <label className="block text-sm font-medium">
            Email (optional)
            <input name="email" type="email" autoComplete="email" className={field} />
            {err("email")}
          </label>
        </div>
        <label className="block text-sm font-medium">
          Delivery address
          <textarea name="address" required rows={3} autoComplete="street-address" className={field} />
          {err("address")}
        </label>
        <label className="block text-sm font-medium">
          Area
          <select name="area" required defaultValue="" className={field}>
            <option value="" disabled>Select area</option>
            {DELIVERY.areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {err("area")}
        </label>
        <label className="block text-sm font-medium">
          Notes (optional)
          <textarea name="notes" rows={2} className={field} />
        </label>

        <fieldset className="space-y-2 pt-2">
          <legend className="text-lg font-semibold">Payment</legend>
          {(
            [
              ["ONLINE", "Pay online", "Card or FPX"],
              ["WHATSAPP", "Order via WhatsApp", "We confirm the total and delivery, then you pay us directly"],
            ] as const
          )
            .filter(([value]) => value === "WHATSAPP" || onlineAvailable)
            .map(([value, title, sub]) => (
            <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${method === value ? "border-brand bg-tint" : "border-line"}`}>
              <input type="radio" name="method" checked={method === value} onChange={() => setMethod(value)} className="mt-1" />
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-muted">{sub}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <aside className="h-fit rounded-xl border border-line p-5">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-3 divide-y divide-line">
          {cart.items.map((i) => (
            <li key={`${i.kind}-${i.id}`} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{i.name}</p>
                <div className="mt-1">
                  <QuantityStepper value={i.quantity} onChange={(q) => cart.setQuantity(i.kind, i.id, q)} label={i.name} />
                </div>
              </div>
              <span className="font-semibold">{formatRM(i.unitPriceSen * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatRM(cart.subtotalSen)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{cart.deliveryFeeSen === 0 ? "FREE" : formatRM(cart.deliveryFeeSen)}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatRM(cart.totalSen)}</span></div>
        </div>
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-full bg-wa py-3 font-semibold text-white hover:bg-wa-dark disabled:opacity-60"
        >
          {submitting ? "Please wait…" : method === "ONLINE" ? "Continue to payment" : "Place order"}
        </button>
      </aside>
    </form>
  );
}
