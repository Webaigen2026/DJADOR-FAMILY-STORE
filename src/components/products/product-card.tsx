import Link from "next/link";
import { Heart, Star } from "lucide-react";

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
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80";

  const originalPrice = Math.round(product.price * 1.25);
  const discount = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  return (
    <div className="group relative border-b border-slate-200 bg-white p-4 transition hover:shadow-md sm:p-5">
      <button className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-slate-400 shadow-sm hover:text-red-500 sm:right-5 sm:top-5">
        <Heart className="h-5 w-5" />
      </button>

      <div className="grid gap-5 sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] md:gap-6">
        <Link
          href={`/products/${product.slug}`}
          className="flex h-52 w-full items-center justify-center rounded-xl bg-slate-50 p-4 sm:h-56"
        >
          <img
            src={image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition group-hover:scale-105"
          />
        </Link>

        <div className="pr-0 md:pr-10">
          <Link href={`/products/${product.slug}`}>
            <h3 className="pr-10 text-base font-semibold text-slate-900 hover:text-blue-600 sm:text-lg">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
              4.3 <Star className="h-3 w-3 fill-white" />
            </span>
            <span className="text-xs text-slate-500 sm:text-sm">
              (2,431 Ratings & 318 Reviews)
            </span>
          </div>

          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>• High quality product</li>
            <li>• Fast delivery available</li>
            <li>• 7 days replacement policy</li>
            <li>• Secure payment and easy returns</li>
          </ul>

          <div className="mt-5">
            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </p>
              <p className="text-sm font-semibold text-green-600">
                {discount}% off
              </p>
            </div>

            <p className="mt-1 text-sm font-medium text-green-600">
              Free delivery
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bank offers available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}