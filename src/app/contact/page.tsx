import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/Logo";
import { whatsappUrl } from "@/lib/whatsapp";
import { DELIVERY } from "@/lib/delivery";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-3xl font-bold text-navy">Contact Us</h1>
      <p className="mt-1 text-muted">Questions about a product or an order? We&apos;re happy to help.</p>
      <a
        href={whatsappUrl(number, "Hi CleanHome, I have a question.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-3 font-semibold text-white hover:bg-wa-dark sm:inline-flex"
      >
        <WhatsAppIcon /> Chat on WhatsApp
      </a>
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-navy">WhatsApp</dt>
          <dd className="text-muted">+{number}</dd>
        </div>
        <div>
          <dt className="font-semibold text-navy">Delivery areas</dt>
          <dd className="text-muted">{DELIVERY.areas.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
}
