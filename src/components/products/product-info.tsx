type Props = {
  name: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  stock?: number;
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
  brand,
  category,
  stock,
}: Props) {
  const isInStock = typeof stock === "number" ? stock > 0 : true;

  return (
    <div>
      {category ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {category}
        </p>
      ) : null}

      {brand ? (
        <p className="mt-3 text-sm text-slate-600">
          Visit the{" "}
          <span className="font-semibold text-blue-600">{brand}</span> collection
        </p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        {name}
      </h1>

      <div className="mt-5 border-b border-slate-200 pb-6">
        <p className="text-3xl font-bold text-slate-950">
          {formatPrice(price)}
        </p>

        <p
          className={`mt-3 text-sm font-semibold ${
            isInStock ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {isInStock ? "In stock" : "Out of stock"}
        </p>
      </div>

      {description ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-900">
            About this item
          </h2>

          <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
}