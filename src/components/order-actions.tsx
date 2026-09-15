"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  PackageSearch,
  RefreshCcw,
  ShoppingCart,
  Trash2,
} from "lucide-react";

type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "PACKING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED";

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  canCancel: boolean;
  canTrack: boolean;
  canBuyAgain: boolean;
};

type LoadingAction = "cancel" | "buyAgain" | "return" | null;

export default function OrderActions({
  orderId,
  orderStatus,
  canCancel,
  canTrack,
  canBuyAgain,
}: Props) {
  const [loadingAction, setLoadingAction] =
    useState<LoadingAction>(null);

  async function buyAgain() {
    if (loadingAction) return;

    try {
      setLoadingAction("buyAgain");

      const response = await fetch(
        `/api/orders/${orderId}/buy-again`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to add these items to your cart."
        );
      }

      // Full navigation reloads the cart and navbar count.
      window.location.href = "/cart";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to add these items to your cart.";

      alert(message);
      setLoadingAction(null);
    }
  }

  async function requestReturn() {
    if (loadingAction) return;

    const confirmed = window.confirm(
      "Are you sure you want to request a return for this order?"
    );

    if (!confirmed) return;

    try {
      setLoadingAction("return");

      const response = await fetch(
        `/api/orders/${orderId}/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to request return."
        );
      }

      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to request return.";

      alert(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function cancelOrder() {
    if (loadingAction) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setLoadingAction("cancel");

      const response = await fetch(
        `/api/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to cancel order."
        );
      }

      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to cancel order.";

      alert(message);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-lg font-bold text-slate-950">
          Order Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your order and access helpful tools.
        </p>
      </div>

      <div className="grid gap-3 p-5">
        {canTrack && (
          <button
            type="button"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <PackageSearch className="h-5 w-5" />
            Track Package
          </button>
        )}

        {canBuyAgain && (
          <button
            type="button"
            onClick={buyAgain}
            disabled={loadingAction !== null}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-bold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction === "buyAgain" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Buy Again
              </>
            )}
          </button>
        )}

        {orderStatus === "COMPLETED" && (
          <button
            type="button"
            onClick={requestReturn}
            disabled={loadingAction !== null}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction === "return" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Requesting Return...
              </>
            ) : (
              <>
                <RefreshCcw className="h-5 w-5" />
                Request Return
              </>
            )}
          </button>
        )}

        <Link
          href="/contact"
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          <MessageCircle className="h-5 w-5" />
          Contact Support
        </Link>

        {canCancel && (
          <button
            type="button"
            onClick={cancelOrder}
            disabled={loadingAction !== null}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction === "cancel" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Cancel Order
              </>
            )}
          </button>
        )}

        <Link
          href="/account/orders"
          className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </Link>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-center text-xs leading-5 text-slate-500">
          Need help with this order? Our support team is
          available to assist you with cancellations, returns,
          refunds, shipping, and product questions.
        </p>
      </div>
    </section>
  );
}