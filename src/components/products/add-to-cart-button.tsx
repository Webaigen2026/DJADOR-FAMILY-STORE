"use client";

import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ProductVariant = {
  id: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
};

type Props = {
  productId: string;
  stock: number;
  variants?: ProductVariant[];
};

const COLOR_MAP: Record<string, string> = {
  black: "#111827",
  white: "#ffffff",
  blue: "#2563eb",
  "light blue": "#93c5fd",
  navy: "#1e3a8a",
  brown: "#8b5a2b",
  grey: "#9ca3af",
  gray: "#9ca3af",
  red: "#dc2626",
  pink: "#ec4899",
  green: "#16a34a",
  yellow: "#facc15",
  orange: "#f97316",
  purple: "#9333ea",
  beige: "#d6c4a1",
  cream: "#f5f0dc",
};

function getColorValue(color: string) {
  return COLOR_MAP[color.trim().toLowerCase()] || "#cbd5e1";
}

export default function AddToCartButton({
  productId,
  stock,
  variants = [],
}: Props) {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingAction, setLoadingAction] = useState<
    "cart" | "buy" | null
  >(null);

  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.stock > 0),
    [variants]
  );

  const colors = useMemo(() => {
    return Array.from(
      new Set(
        activeVariants
          .map((variant) => variant.color?.trim())
          .filter((color): color is string => Boolean(color))
      )
    );
  }, [activeVariants]);

  const sizes = useMemo(() => {
    const relevantVariants = selectedColor
      ? activeVariants.filter(
          (variant) => variant.color === selectedColor
        )
      : activeVariants;

    return Array.from(
      new Set(
        relevantVariants
          .map((variant) => variant.size?.trim())
          .filter((size): size is string => Boolean(size))
      )
    );
  }, [activeVariants, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (activeVariants.length === 0) {
      return null;
    }

    return (
      activeVariants.find((variant) => {
        const colorMatches = colors.length
          ? variant.color === selectedColor
          : true;

        const sizeMatches = sizes.length
          ? variant.size === selectedSize
          : true;

        return colorMatches && sizeMatches;
      }) || null
    );
  }, [
    activeVariants,
    colors.length,
    selectedColor,
    selectedSize,
    sizes.length,
  ]);

  const availableStock =
    variants.length > 0
      ? selectedVariant?.stock ?? 0
      : stock;

  const requiresColor = colors.length > 0;
  const requiresSize = sizes.length > 0;

  const hasSelectedOptions =
    (!requiresColor || Boolean(selectedColor)) &&
    (!requiresSize || Boolean(selectedSize));

  const isOutOfStock =
    variants.length > 0
      ? activeVariants.length === 0
      : stock <= 0;

  const canPurchase =
    !isOutOfStock &&
    hasSelectedOptions &&
    availableStock > 0;

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setSelectedSize("");
    setQuantity(1);
  }

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    setQuantity(1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(current + 1, availableStock)
    );
  }

  async function addProductToCart(action: "cart" | "buy") {
    if (!canPurchase || loadingAction) {
      return;
    }

    try {
      setLoadingAction(action);

      const selectionKey = selectedVariant
        ? selectedVariant.id
        : [
            selectedColor || "default",
            selectedSize || "default",
          ].join("-");

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId: selectedVariant?.id || null,
          selectedSize: selectedSize || null,
          selectedColor: selectedColor || null,
          selectionKey,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || "Failed to add product to cart.");
        return;
      }

      router.refresh();

      if (action === "buy") {
        router.push("/checkout");
      } else {
        router.push("/cart");
      }
    } catch (error) {
      console.error("ADD_TO_CART_ERROR", error);

      alert(
        "Something went wrong while adding the product to your cart."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* COLOR */}
      {colors.length > 0 ? (
        <section>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-950">
              Select color
            </h3>

            {selectedColor ? (
              <span className="text-sm font-medium text-slate-500">
                {selectedColor}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-4">
            {colors.map((color) => {
              const selected = selectedColor === color;
              const colorValue = getColorValue(color);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select ${color}`}
                  aria-pressed={selected}
                  className="group flex min-w-16 flex-col items-center gap-2"
                >
                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                      selected
                        ? "border-blue-600 ring-4 ring-blue-100"
                        : "border-slate-300 group-hover:border-slate-500"
                    }`}
                    style={{
                      backgroundColor: colorValue,
                    }}
                  >
                    {selected ? (
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          color.toLowerCase() === "white"
                            ? "bg-slate-950 text-white"
                            : "bg-white/90 text-slate-950"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    ) : null}
                  </span>

                  <span
                    className={`text-xs ${
                      selected
                        ? "font-bold text-blue-600"
                        : "font-medium text-slate-600"
                    }`}
                  >
                    {color}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* SIZE */}
      {sizes.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-950">
              Select size
            </h3>

            <button
              type="button"
              className="text-sm font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Size guide
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const matchingVariant = activeVariants.find(
                (variant) =>
                  variant.size === size &&
                  (!selectedColor ||
                    variant.color === selectedColor)
              );

              const disabled =
                !matchingVariant ||
                matchingVariant.stock <= 0;

              const selected = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSizeSelect(size)}
                  className={`flex h-12 min-w-14 items-center justify-center rounded-lg border px-4 text-sm font-bold transition ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                      : disabled
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                      : "border-slate-300 bg-white text-slate-900 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* STOCK */}
      <div>
        {isOutOfStock ? (
          <p className="text-sm font-bold text-red-600">
            Out of stock
          </p>
        ) : hasSelectedOptions ? (
          <div className="flex flex-wrap items-center gap-3">
            {availableStock <= 5 ? (
              <span className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                Only {availableStock} remaining
              </span>
            ) : (
              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                In stock
              </span>
            )}

            {selectedColor || selectedSize ? (
              <span className="text-sm text-slate-500">
                {selectedColor || ""}
                {selectedColor && selectedSize ? " / " : ""}
                {selectedSize || ""}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-sm font-bold text-emerald-700">
            In stock
          </span>
        )}
      </div>

      {/* QUANTITY */}
      {!isOutOfStock ? (
        <section>
          <h3 className="mb-3 text-base font-bold text-slate-950">
            Quantity
          </h3>

          <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="flex h-12 w-12 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="flex h-12 min-w-14 items-center justify-center border-x border-slate-300 px-4 text-sm font-bold text-slate-950">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                !hasSelectedOptions ||
                quantity >= availableStock
              }
              className="flex h-12 w-12 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {/* SELECTION WARNING */}
      {!isOutOfStock && !hasSelectedOptions ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-600">
            Please select{" "}
            {requiresColor && requiresSize
              ? "a color and size"
              : requiresColor
              ? "a color"
              : "a size"}{" "}
            before continuing.
          </p>
        </div>
      ) : null}

      {/* PURCHASE BUTTONS */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => addProductToCart("cart")}
          disabled={!canPurchase || Boolean(loadingAction)}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ShoppingCart className="h-5 w-5" />

          {loadingAction === "cart"
            ? "Adding..."
            : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={() => addProductToCart("buy")}
          disabled={!canPurchase || Boolean(loadingAction)}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-6 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ShoppingBag className="h-5 w-5" />

          {loadingAction === "buy"
            ? "Processing..."
            : "Buy Now"}
        </button>
      </div>
    </div>
  );
}