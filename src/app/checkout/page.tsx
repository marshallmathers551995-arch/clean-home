import type { Metadata } from "next";
import { paymentProvider } from "@/lib/payments";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
// Whether online payment is offered depends on environment variables, so decide per request.
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-navy">Checkout</h1>
      <CheckoutForm onlineAvailable={paymentProvider() !== "none"} />
    </div>
  );
}
