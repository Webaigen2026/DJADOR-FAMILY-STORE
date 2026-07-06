type Props = {
  name: string;
  price: number;
  description?: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ProductInfo({
  name,
  price,
  description,
}: Props) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Product Details
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        {name}
      </h1>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {formatPrice(price)}
      </p>

      <p className="mt-6 text-base leading-8 text-slate-600">
        {description || "High-quality product for modern users."}
      </p>
    </div>
  );
}