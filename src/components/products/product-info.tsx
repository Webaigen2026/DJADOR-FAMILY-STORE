import {
  MessageSquareText,
  PackageCheck,
  PackageX,
  Star,
} from "lucide-react";

type Props = {
  name: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
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
  averageRating,
  reviewCount,
}: Props) {
  const roundedRating = Math.round(averageRating);
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div>
      {/* CATEGORY AND BRAND */}
      <div className="flex flex-wrap items-center gap-2">
        {category ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            {category}
          </span>
        ) : null}

        {brand ? (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {brand}
          </span>
        ) : null}
      </div>

      {/* PRODUCT NAME */}
      <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
        {name}
      </h1>

      {/* PRICE */}
      <p className="mt-5 text-4xl font-black tracking-tight text-slate-950">
        {formatPrice(price)}
      </p>

      {/* REVIEW SUMMARY */}
      <a
        href="#customer-reviews"
        className="mt-8 block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 transition duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md"
      >
        <div className="grid gap-5 p-5 sm:grid-cols-[100px_210px_1fr] sm:items-center sm:gap-0 sm:p-6">
          {/* AVERAGE RATING */}
          <div className="sm:border-r sm:border-slate-200 sm:pr-6">
            <p className="text-4xl font-black text-slate-950">
              {averageRating.toFixed(1)}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              out of 5
            </p>
          </div>

          {/* STARS AND REVIEW COUNT */}
          <div className="sm:border-r sm:border-slate-200 sm:px-6">
            <div
              className="flex items-center gap-1"
              aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= roundedRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MessageSquareText className="h-5 w-5" />

              <span>
                {reviewCount} customer{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* REVIEW MESSAGE */}
          <div className="sm:pl-6">
            <p className="font-bold text-slate-900">
              {reviewCount === 0
                ? "Be the first to review"
                : "Read customer reviews"}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {reviewCount === 0
                ? "Share your experience and help other customers make an informed decision."
                : `Rated ${averageRating.toFixed(
                    1
                  )} out of 5 from approved customer reviews.`}
            </p>

            <span className="mt-2 inline-block text-sm font-semibold text-blue-600">
              {reviewCount === 0 ? "Write a Review →" : "View Reviews →"}
            </span>
          </div>
        </div>
      </a>

      {/* STOCK */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
            isInStock
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isInStock ? (
            <PackageCheck className="h-5 w-5" />
          ) : (
            <PackageX className="h-5 w-5" />
          )}

          {isInStock ? "In stock" : "Out of stock"}
        </span>

        {isLowStock ? (
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
            Only {stock} remaining
          </span>
        ) : null}
      </div>

      {/* DESCRIPTION */}
      <div className="mt-8 border-t border-slate-200 pt-7">
        <h2 className="text-lg font-bold text-slate-950">
          Product overview
        </h2>

        <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
          {description || "Product information is currently unavailable."}
        </p>
      </div>
    </div>
  );
}