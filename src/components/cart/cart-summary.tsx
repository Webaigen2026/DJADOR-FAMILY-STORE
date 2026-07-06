import Link from "next/link";

type Props = {
  totalItems: number;
  subtotal: number;
};

export default function CartSummary({ totalItems, subtotal }: Props) {
  const discount = Math.floor(subtotal * 0.1);
  const deliveryCharge = 0;
  const total = subtotal - discount + deliveryCharge;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <aside className="border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Price Details
        </p>
      </div>

      <div className="space-y-4 px-5 py-4 text-sm">
        <div className="flex items-center justify-between text-slate-700">
          <span>Price ({totalItems} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-700">
          <span>Discount</span>
          <span className="text-emerald-600">
            -{formatPrice(discount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-700">
          <span>Delivery Charges</span>
          <span className="text-emerald-600">Free</span>
        </div>

        <div className="border-t border-dashed border-slate-300 pt-4">
          <div className="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total Amount</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          You save {formatPrice(discount)} on this order
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-4">
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300"
        >
          Continue
        </Link>
      </div>
    </aside>
  );
}