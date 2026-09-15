"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Loader2,
  PackageCheck,
  PackageX,
  Truck,
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

type WishlistResponse = {
  success?: boolean;
  error?: string;
  items?: Array<{
    productId: string;
  }>;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ProductCard({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const productUrl = `/products/${product.slug}`;

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

  useEffect(() => {
    let cancelled = false;

    async function checkWishlist() {
      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
          cache: "no-store",
        });

        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as WishlistResponse;

        if (cancelled) {
          return;
        }

        const exists =
          data.items?.some(
            (item) => item.productId === product.id
          ) ?? false;

        setWishlisted(exists);
      } catch {
        // Wishlist status should not prevent product cards from loading.
      }
    }

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [product.id]);

  async function toggleWishlist() {
    if (wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);

      const response = await fetch("/api/wishlist", {
        method: wishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = (await response.json()) as WishlistResponse;

      if (!response.ok) {
        console.error(
          data.error || "Unable to update wishlist."
        );
        return;
      }

      setWishlisted((current) => !current);
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:border-slate-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
      {/* WISHLIST */}
      <button
        type="button"
        onClick={toggleWishlist}
        disabled={wishlistLoading}
        aria-label={
          wishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={wishlisted}
        className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-70 ${
          wishlisted
            ? "border-red-200 text-red-500"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-red-500"
        }`}
      >
        {wishlistLoading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <Heart
            className={`h-[18px] w-[18px] ${
              wishlisted ? "fill-current" : ""
            }`}
          />
        )}
      </button>

      {/* IMAGE */}
      <Link
        href={productUrl}
        className="relative flex h-[300px] items-center justify-center overflow-hidden bg-slate-50 p-4 sm:h-[330px] xl:h-[350px]"
      >
        {isLowStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
            Only {product.stock} left
          </span>
        ) : null}

        {!isInStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
            Out of stock
          </span>
        ) : null}

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {product.brand || product.category || "DJADOR"}
        </p>

        <Link href={productUrl}>
          <h2 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-[22px] text-slate-900 transition group-hover:text-blue-700">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-xs font-medium text-slate-500">
          New arrival
        </p>

        <p className="mt-3 text-xl font-bold tracking-tight text-slate-950">
          {formatPrice(product.price)}
        </p>

        {isInStock ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Truck className="h-4 w-4 text-emerald-600" />
            Free standard delivery
          </div>
        ) : null}

        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              isInStock
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {isInStock ? (
              <PackageCheck className="h-4 w-4" />
            ) : (
              <PackageX className="h-4 w-4" />
            )}

            {isInStock
              ? "In stock"
              : "Currently unavailable"}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={productUrl}
            className="inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800 hover:underline"
          >
            view details
          </Link>
        </div>
      </div>
    </article>
  );
}