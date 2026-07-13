import Link from "next/link";
import { Heart } from "lucide-react";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    category?: string | null;
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

  return (
    <article className="group relative border-b border-slate-200 bg-white p-4 transition hover:bg-slate-50 sm:p-5">
      <button
        type="button"
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute right-3 top-3 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition hover:border-red-200 hover:text-red-500 sm:right-5 sm:top-5"
      >
        <Heart className="h-5 w-5" />
      </button>

      <div className="grid gap-5 sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] md:gap-7">
        <Link
          href={`/products/${product.slug}`}
          className="flex h-52 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-4 sm:h-56"
        >
          <img
            src={image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-center pr-0 md:pr-12">
          {product.category ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {product.category}
            </p>
          ) : null}

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 pr-10 text-xl font-bold text-slate-900 transition hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          <p className="mt-4 text-2xl font-bold text-slate-950">
            {formatPrice(product.price)}
          </p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            View complete product information, available images, pricing, and purchase options.
          </p>

          <div className="mt-5">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}