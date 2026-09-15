"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingBag, Trash2 } from "lucide-react";

type WishlistItem = {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string | null;
    stock: number;
    isActive: boolean;
    images: {
      id: string;
      url: string;
    }[];
  };
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/wishlist", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load wishlist.");
      }

      setItems(data.items ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      setRemovingId(productId);
      setError("");

      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to remove product from wishlist."
        );
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.productId !== productId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove product from wishlist."
      );
    } finally {
      setRemovingId(null);
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-zinc-900" />

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {items.length === 0
                ? "Save products you love and come back to them anytime."
                : `${items.length} ${
                    items.length === 1 ? "item" : "items"
                  } saved`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <Heart className="h-7 w-7 text-zinc-500" />
          </div>

          <h2 className="text-lg font-semibold text-zinc-950">
            Your wishlist is empty
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Browse our products and use the heart icon to save your
            favorites here.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {items.map((item) => {
            const product = item.product;

            const image =
              product.imageUrl ||
              product.images?.[0]?.url ||
              null;

            return (
              <div
                key={item.id}
                className="flex gap-5 py-6"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-7 w-7 text-zinc-400" />
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:gap-6">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-base font-semibold text-zinc-950 transition hover:text-zinc-600"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-zinc-950">
                        {formatPrice(product.price)}
                      </span>

                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-sm text-zinc-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                    </div>

                    <p
                      className={`mt-3 text-sm font-medium ${
                        product.stock > 0
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? "In stock"
                        : "Out of stock"}
                    </p>
                  </div>

                  <div className="mt-5 flex items-end gap-3 sm:mt-0 sm:flex-col sm:justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      disabled={removingId === product.id}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      Remove
                    </button>

                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}