"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SummaryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  items: SummaryItem[];
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function OrderSummary({ items }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  async function handlePlaceOrder() {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to place order");
        return;
      }

      router.push("/orders");
      router.refresh();
    } catch (error) {
      alert("Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Price details
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Order summary
        </h2>
      </div>

      <div className="px-5 py-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-slate-900">
                {formatPrice(item.quantity * item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Total items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-medium text-emerald-700">Free</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="mt-5 w-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </aside>
  );
}