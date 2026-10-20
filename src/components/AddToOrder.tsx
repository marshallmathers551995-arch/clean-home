"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  kind: "product" | "bundle";
  id: number;
  name: string;
  unitPriceSen: number;
  showStepper?: boolean;
  tone?: "green" | "blue";
};

export function AddToOrder({ kind, id, name, unitPriceSen, showStepper = true, tone = "green" }: Props) {
  const { add, setDrawerOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ kind, id, name, unitPriceSen }, qty);
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setDrawerOpen(true);
  }

  return (
    <div className="space-y-3">
      {showStepper && <QuantityStepper value={qty} onChange={setQty} label={name} />}
      <button
        type="button"
        onClick={handleAdd}
        className={`w-full rounded-md py-2.5 text-sm font-semibold text-white ${
          tone === "green" ? "bg-wa hover:bg-wa-dark" : "bg-brand hover:bg-brand-dark"
        }`}
      >
        {added ? "Added ✓" : "Add to Order"}
      </button>
    </div>
  );
}
