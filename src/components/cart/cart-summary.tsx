import Link from "next/link";

type Props = {
  totalItems: number;
  subtotal: number;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CartSummary({ totalItems, subtotal }: Props) {
  const shipping = 0;
  const estimatedTotal = subtotal + shipping;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Order Summary
        </p>
      </div>

      <div className="space-y-4 px-6 py-5 text-sm">
        <div className="flex items-center justify-between text-slate-700">
          <span>Items ({totalItems})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-700">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-lg font-bold text-slate-950">
            <span>Estimated Total</span>
            <span>{formatPrice(estimatedTotal)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-5">
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Proceed to Checkout
        </Link>
      </div>
    </aside>
  );
}