import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  PackageX,
} from "lucide-react";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description?: string | null;
    brand?: string | null;
    category?: string | null;
    stock?: number;
    imageUrl?: string | null;
    image?: string | null;
  };
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ProductCard({ product }: Props) {
  const image =
    product.imageUrl ||
    product.image ||
    "/images/product-placeholder.png";

  const hasStockValue = typeof product.stock === "number";
  const isInStock = hasStockValue ? product.stock! > 0 : true;
  const isLowStock =
    hasStockValue &&
    product.stock! > 0 &&
    product.stock! <= 5;

  return (
    <article className="overflow-hidden border-b border-slate-200 bg-white last:border-b-0">
      <div className="grid items-stretch lg:grid-cols-[380px_1fr]">
        {/* PRODUCT IMAGE */}
        <Link
          href={`/products/${product.slug}`}
          className="flex min-h-[320px] items-center justify-center border-b border-slate-200 bg-slate-50 p-6 transition hover:bg-slate-100 sm:min-h-[380px] lg:min-h-[460px] lg:border-b-0 lg:border-r lg:p-8"
        >
          <img
            src={image}
            alt={product.name}
            className="max-h-[360px] w-full object-contain transition duration-300 hover:scale-[1.02]"
          />
        </Link>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {/* CATEGORY AND BRAND */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {product.category ? <span>{product.category}</span> : null}

            {product.category && product.brand ? (
              <span className="text-slate-300">/</span>
            ) : null}

            {product.brand ? <span>{product.brand}</span> : null}
          </div>

          {/* PRODUCT NAME */}
          <Link href={`/products/${product.slug}`}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 transition hover:text-blue-600 sm:text-3xl">
              {product.name}
            </h2>
          </Link>

          {/* PRICE */}
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {formatPrice(product.price)}
          </p>

          {/* STOCK */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                isInStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isInStock ? (
                <PackageCheck className="h-4 w-4" />
              ) : (
                <PackageX className="h-4 w-4" />
              )}

              {isInStock ? "In stock" : "Out of stock"}
            </span>

            {isLowStock ? (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                Only {product.stock} remaining
              </span>
            ) : null}
          </div>

          {/* DESCRIPTION */}
          {product.description ? (
            <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>
          ) : (
            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
              View the full product page for details, availability, and purchase
              options.
            </p>
          )}

          {/* PRODUCT DETAILS */}
          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Brand
              </dt>

              <dd className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                {product.brand || "Not specified"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Category
              </dt>

              <dd className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                {product.category || "General"}
              </dd>
            </div>
          </dl>

          {/* ACTION */}
          <div className="mt-7">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              View Product
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}