"use client";

import { useState } from "react";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  image?: string | null;
};

type CartItemType = {
  id: string;
  quantity: number;
  product: CartProduct;
};

type Props = {
  item: CartItemType;
  onQuantityChange: (itemId: string, nextQuantity: number) => void;
  onRemove: (itemId: string) => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: Props) {
  const [loading, setLoading] = useState(false);

  const image =
    item.product.imageUrl || item.product.image || "/images/headphones.jpg";

  async function updateQuantity(nextQuantity: number) {
    if (nextQuantity < 1) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          quantity: nextQuantity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update quantity");
        return;
      }

      onQuantityChange(item.id, nextQuantity);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem() {
    try {
      setLoading(true);

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to remove item");
        return;
      }

      onRemove(item.id);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-28 w-28 overflow-hidden border bg-slate-50">
          <img
            src={image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {item.product.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Delivery by Tomorrow
            </p>

            <div className="mt-3 flex items-center gap-3">
              <p className="text-xl font-bold">
                {formatPrice(item.product.price)}
              </p>
              <span className="text-green-600 text-sm">
                Special price
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex border border-slate-300">
              <button
                onClick={() => updateQuantity(item.quantity - 1)}
                disabled={loading || item.quantity <= 1}
                className="px-3 py-1 hover:bg-slate-100"
              >
                -
              </button>

              <span className="px-4 py-1 border-x">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.quantity + 1)}
                disabled={loading}
                className="px-3 py-1 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            <button
              onClick={removeItem}
              disabled={loading}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <p className="text-sm text-slate-500">Item Total</p>
          <p className="text-lg font-bold">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}