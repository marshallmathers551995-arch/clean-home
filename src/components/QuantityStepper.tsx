"use client";

import { MAX_QTY } from "@/lib/pricing";

export function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const btn = "flex h-9 w-9 items-center justify-center rounded-md border border-line text-base hover:bg-tint disabled:opacity-40";
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        &minus;
      </button>
      <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
