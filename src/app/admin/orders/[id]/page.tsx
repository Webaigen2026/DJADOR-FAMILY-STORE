import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

function Badge({ value }: { value: string }) {
  const style =
    value === "PAID" ||
    value === "CAPTURED" ||
    value === "AUTHORIZED" ||
    value === "COMPLETED" ||
    value === "DELIVERED" ||
    value === "FULFILLED"
      ? "bg-green-100 text-green-700"
      : value === "FAILED" ||
          value === "CANCELLED" ||
          value === "REFUNDED" ||
          value === "RETURNED" ||
          value === "PARTIALLY_REFUNDED"
        ? "bg-red-100 text-red-700"
        : value === "RETURN_REQUESTED"
          ? "bg-amber-100 text-amber-700"
          : "bg-yellow-100 text-yellow-700";

  const label =
    value === "RETURN_REQUESTED"
      ? "RETURN REQUESTED"
      : value === "RETURNED"
        ? "RETURNED"
        : value === "REFUNDED"
          ? "REFUNDED"
          : value;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${style}`}
    >
      {label}
    </span>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/* ---------------------------------------------------------
   Mark order fulfilled
--------------------------------------------------------- */

async function markFulfilled(orderId: string) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: {
        in: [
          "PENDING_PAYMENT",
          "PAID",
          "PROCESSING",
          "PACKING",
          "READY_TO_SHIP",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ],
      },
    },
    data: {
      status: "COMPLETED",
    },
  });

  if (result.count === 0) {
    throw new Error(
      "This order can no longer be marked as fulfilled."
    );
  }

  redirect(`/admin/orders/${orderId}`);
}

async function advanceOrderStatus(orderId: string) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      status: true,
      userId: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const nextStatus = {
    PAID: "PROCESSING",
    PROCESSING: "PACKING",
    PACKING: "READY_TO_SHIP",
    READY_TO_SHIP: "SHIPPED",
    SHIPPED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
    DELIVERED: "COMPLETED",
  } as const;

  const newStatus =
    nextStatus[order.status as keyof typeof nextStatus];

  if (!newStatus) {
    throw new Error(
      "This order cannot be advanced from its current status."
    );
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: order.status,
    },
    data: {
      status: newStatus,
    },
  });

  if (result.count === 0) {
    throw new Error(
      "The order status changed before this update could be completed."
    );
  }

  const orderNumber = orderId.slice(-8).toUpperCase();

  const notificationContent = {
    PROCESSING: {
      title: "Order processing",
      message: `Your order #${orderNumber} is now being processed.`,
      type: "ORDER_PROCESSING",
    },

    PACKING: {
      title: "Order being packed",
      message: `Your order #${orderNumber} is being packed and prepared for shipment.`,
      type: "ORDER_PACKING",
    },

    READY_TO_SHIP: {
      title: "Ready to ship",
      message: `Your order #${orderNumber} is packed and ready to be shipped.`,
      type: "ORDER_READY_TO_SHIP",
    },

    SHIPPED: {
      title: "Order shipped",
      message: `Your order #${orderNumber} has been shipped.`,
      type: "ORDER_SHIPPED",
    },

    OUT_FOR_DELIVERY: {
      title: "Out for delivery",
      message: `Your order #${orderNumber} is out for delivery.`,
      type: "ORDER_OUT_FOR_DELIVERY",
    },

    DELIVERED: {
      title: "Order delivered",
      message: `Your order #${orderNumber} has been delivered.`,
      type: "ORDER_DELIVERED",
    },

    COMPLETED: {
      title: "Order completed",
      message: `Your order #${orderNumber} has been completed successfully.`,
      type: "ORDER_COMPLETED",
    },
  } as const;

  const notification =
    notificationContent[
      newStatus as keyof typeof notificationContent
    ];

  if (notification) {
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        href: `/account/orders/${orderId}`,
      },
    });
  }

  redirect(`/admin/orders/${orderId}`);
} 

/* ---------------------------------------------------------
   Cancel order
--------------------------------------------------------- */

async function cancelOrder(orderId: string) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      userId: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: {
        in: [
          "PENDING_PAYMENT",
          "PAID",
          "PROCESSING",
          "PACKING",
          "READY_TO_SHIP",
        ],
      },
    },
    data: {
      status: "CANCELLED",
    },
  });

  if (result.count === 0) {
    throw new Error(
      "This order can no longer be cancelled."
    );
  }

  const orderNumber = orderId.slice(-8).toUpperCase();

  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Order cancelled",
      message: `Your order #${orderNumber} has been cancelled.`,
      type: "ORDER_CANCELLED",
      href: `/account/orders/${orderId}`,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

/* ---------------------------------------------------------
   Mark returned
--------------------------------------------------------- */

async function markReturned(orderId: string) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      userId: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: "RETURN_REQUESTED",
    },
    data: {
      status: "RETURNED",
    },
  });

  if (result.count === 0) {
    throw new Error(
      "This order is no longer waiting for return processing."
    );
  }

  const orderNumber = orderId.slice(-8).toUpperCase();

  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Return completed",
      message: `Your returned item for order #${orderNumber} has been received successfully.`,
      type: "ORDER_RETURNED",
      href: `/account/orders/${orderId}`,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

/* ---------------------------------------------------------
   Update shipping
--------------------------------------------------------- */

async function updateShipping(
  orderId: string,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: {
        in: [
          "PENDING_PAYMENT",
          "PAID",
          "PROCESSING",
          "PACKING",
          "READY_TO_SHIP",
        ],
      },
    },
    data: {
      shippingName:
        String(formData.get("shippingName") || "").trim() ||
        null,

      shippingPhone:
        String(formData.get("shippingPhone") || "").trim() ||
        null,

      shippingAddress:
        String(formData.get("shippingAddress") || "").trim() ||
        null,

      shippingCity:
        String(formData.get("shippingCity") || "").trim() ||
        null,

      shippingState:
        String(formData.get("shippingState") || "").trim() ||
        null,

      shippingZip:
        String(formData.get("shippingZip") || "").trim() ||
        null,
    },
  });

  if (result.count === 0) {
    throw new Error(
      "Shipping information can no longer be changed for this order."
    );
  }

  redirect(`/admin/orders/${orderId}`);
}

/* ---------------------------------------------------------
   Update tracking
--------------------------------------------------------- */

async function updateTracking(
  orderId: string,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: {
        in: [
          "PAID",
          "PROCESSING",
          "PACKING",
          "READY_TO_SHIP",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
        ],
      },
    },
    data: {
      trackingNumber:
        String(formData.get("trackingNumber") || "").trim() ||
        null,
    },
  });

  if (result.count === 0) {
    throw new Error(
      "Tracking information can no longer be changed for this order."
    );
  }

  redirect(`/admin/orders/${orderId}`);
}

/* ---------------------------------------------------------
   Update notes
--------------------------------------------------------- */

async function updateNotes(
  orderId: string,
  formData: FormData
) {
  "use server";

  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      notes:
        String(formData.get("notes") || "").trim() || null,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

/* =========================================================
   PAGE
========================================================= */

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      user: true,

      items: {
        include: {
          product: true,
        },
      },

      payments: true,
    },
  });

  if (!order) {
    return <main className="p-10">Order not found</main>;
  }

  const orderDate = order.createdAt.toLocaleDateString();
  const orderTime = order.createdAt.toLocaleTimeString();

  const customerInitial =
    order.user?.name?.charAt(0).toUpperCase() ||
    order.user?.email?.charAt(0).toUpperCase() ||
    "C";

  const isFulfilled = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const isReturnRequested =
    order.status === "RETURN_REQUESTED";
  const isReturned = order.status === "RETURNED";
  const isRefunded = order.status === "REFUNDED";

  const canFulfill = [
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "PACKING",
    "READY_TO_SHIP",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].includes(order.status);
  
  const canCancel = [
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "PACKING",
    "READY_TO_SHIP",
  ].includes(order.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 px-8 pt-28 pb-10">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-green-600">
                Admin Dashboard / Orders / #
                {order.id.slice(-8)}
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                Order Details
              </h1>

              <p className="mt-2 text-slate-600">
                Manage shipping, tracking, notes, payment, and
                fulfillment.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
            >
              ← Back to Orders
            </Link>
          </div>

          <div
            className={`mt-6 rounded-2xl px-5 py-4 ${
              isReturnRequested
                ? "border border-amber-200 bg-amber-50 text-amber-800"
                : isReturned
                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                  : isRefunded
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : isFulfilled
                      ? "bg-green-50 text-green-700"
                      : isCancelled
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
            }`}
          >
            <p className="font-black">
              {isReturnRequested
                ? "↩ Customer has requested a return."
                : isReturned
                  ? "✓ Returned item has been received."
                  : isRefunded
                    ? "✓ This order has been refunded."
                    : isFulfilled
                      ? "✓ This order has been fulfilled."
                      : isCancelled
                        ? "× This order has been cancelled."
                        : "This order is still pending fulfillment."}
            </p>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-8 grid gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold text-slate-500">
              Order Number
            </p>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              #{order.id.slice(-8)}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Internal order ID
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-slate-300">
              Order Total
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {formatMoney(order.totalAmount)}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Final order value
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-xl shadow-yellow-100">
            <p className="text-sm font-black text-yellow-700">
              Order Status
            </p>

            <div className="mt-4">
              <Badge value={order.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl shadow-blue-100">
            <p className="text-sm font-black text-blue-700">
              Payment Status
            </p>

            <div className="mt-4">
              <Badge value={order.paymentStatus} />
            </div>
          </div>

          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-xl shadow-purple-100">
            <p className="text-sm font-black text-purple-700">
              Order Date
            </p>

            <h2 className="mt-3 text-lg font-black text-slate-950">
              {orderDate}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {orderTime}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6">
            {/* ORDER ITEMS */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-7 py-6">
                <h2 className="text-2xl font-black text-slate-950">
                  Order Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products purchased in this order.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-5 px-7 py-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            N/A
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {item.product?.name || "Product"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Unit Price:{" "}
                          {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-slate-950">
                        {formatMoney(
                          item.quantity * item.unitPrice
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Line total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ORDER TIMELINE */}

            <section className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Timeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track the progress of this order.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Order created
                    </p>

                    <p className="text-sm text-slate-500">
                      {orderDate} at {orderTime}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      order.paymentStatus === "CAPTURED"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    $
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Payment status
                    </p>

                    <p className="text-sm text-slate-500">
                      Current payment status is{" "}
                      {order.paymentStatus}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isFulfilled
                        ? "bg-green-100 text-green-700"
                        : isCancelled
                          ? "bg-red-100 text-red-700"
                          : isReturnRequested
                            ? "bg-amber-100 text-amber-700"
                            : isReturned
                              ? "bg-blue-100 text-blue-700"
                              : isRefunded
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isFulfilled
                      ? "✓"
                      : isCancelled
                        ? "×"
                        : isReturnRequested
                          ? "↩"
                          : isReturned || isRefunded
                            ? "✓"
                            : "!"}
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Fulfillment status
                    </p>

                    <p className="text-sm text-slate-500">
                      Current order status is {order.status}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    #
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Tracking
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.trackingNumber ||
                        "Tracking number not assigned."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* EDIT SHIPPING */}

            <details className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <summary className="cursor-pointer text-2xl font-black text-slate-950">
                Edit Shipping Address
              </summary>

              <p className="mt-2 text-sm text-slate-500">
                Add or update customer delivery information.
              </p>

              <form
                action={updateShipping.bind(null, order.id)}
                className="mt-6 grid gap-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="shippingName"
                    defaultValue={order.shippingName || ""}
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingPhone"
                    defaultValue={order.shippingPhone || ""}
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>

                <textarea
                  name="shippingAddress"
                  defaultValue={order.shippingAddress || ""}
                  placeholder="Full shipping address"
                  rows={3}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="shippingCity"
                    defaultValue={order.shippingCity || ""}
                    placeholder="City"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingState"
                    defaultValue={order.shippingState || ""}
                    placeholder="State"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingZip"
                    defaultValue={order.shippingZip || ""}
                    placeholder="Zip code"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>

                <button className="w-fit rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Shipping
                </button>
              </form>
            </details>

            {/* ORDER NOTES */}

            <details className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <summary className="cursor-pointer text-2xl font-black text-slate-950">
                Edit Order Notes
              </summary>

              <p className="mt-2 text-sm text-slate-500">
                Internal notes for this order.
              </p>

              <form
                action={updateNotes.bind(null, order.id)}
                className="mt-6 grid gap-4"
              >
                <textarea
                  name="notes"
                  defaultValue={order.notes || ""}
                  placeholder="Add notes about delivery, customer request, or admin follow-up..."
                  rows={5}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <button className="w-fit rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Notes
                </button>
              </form>
            </details>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* CUSTOMER */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Customer Information
              </h2>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white">
                    {customerInitial}
                  </div>

                  <div>
                    <p className="text-lg font-black text-slate-950">
                      {order.user?.name || "Customer"}
                    </p>

                    <p className="text-sm font-medium text-slate-500">
                      {order.user?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">
                      Phone
                    </span>

                    <span className="font-bold text-slate-700">
                      {order.shippingPhone ||
                        "Not Available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">
                      Customer ID
                    </span>

                    <span className="font-bold text-slate-700">
                      {order.user?.id.slice(-8) || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SHIPPING */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Shipping Information
              </h2>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-slate-950">
                  {order.shippingName || "Not Added"}
                </p>

                <p className="mt-2 text-slate-600">
                  {order.shippingPhone || "No phone"}
                </p>

                <p className="mt-2 text-slate-600">
                  {order.shippingAddress ||
                    "Address not added"}
                </p>

                <p className="text-slate-600">
                  {order.shippingCity || ""}{" "}
                  {order.shippingState || ""}{" "}
                  {order.shippingZip || ""}
                </p>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Tracking Number
                  </p>

                  <p className="mt-1 font-black text-slate-950">
                    {order.trackingNumber ||
                      "Not assigned"}
                  </p>
                </div>
              </div>

              <form
                action={updateTracking.bind(null, order.id)}
                className="mt-5 grid gap-3"
              >
                <input
                  name="trackingNumber"
                  defaultValue={order.trackingNumber || ""}
                  placeholder="Enter tracking number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Tracking
                </button>
              </form>
            </section>

            {/* ORDER SUMMARY */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Items
                  </span>

                  <span className="font-black">
                    {order.items.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-black">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="font-black">$0</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <span className="font-black">$0</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                  <span className="font-black text-slate-950">
                    Total
                  </span>

                  <span className="font-black text-slate-950">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Payment Details
              </h2>

              {order.payments.length > 0 ? (
                order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-950">
                        {payment.provider}
                      </p>

                      <Badge value={payment.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Amount: {formatMoney(payment.amount)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Payment ID:{" "}
                      {payment.providerPaymentId || "-"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-black text-blue-700">
                    No payment record yet.
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    Payment information will appear here after
                    payment integration is completed.
                  </p>
                </div>
              )}
            </section>

            {/* =================================================
                ORDER ACTIONS
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Actions
              </h2>

              {/* RETURN REQUESTED */}

              {isReturnRequested ? (
                <>
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="font-black text-amber-900">
                      Return requested
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-700">
                      The customer has requested a return for
                      this order. Confirm that the returned item
                      has been received before marking the order
                      as returned.
                    </p>
                  </div>

                  <form
                    action={markReturned.bind(
                      null,
                      order.id
                    )}
                    className="mt-4"
                  >
                    <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-black text-white hover:from-blue-700 hover:to-indigo-700">
                      ✓ Mark as Returned
                    </button>
                  </form>
                </>
              ) : isReturned ? (
                /* RETURNED */

                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="font-black text-blue-800">
                    ✓ Returned item received
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    This return has been completed. Refund
                    processing will be available after payment
                    integration is completed.
                  </p>
                </div>
              ) : isRefunded ? (
                /* REFUNDED */

                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-black text-emerald-800">
                    ✓ Order refunded
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    The refund workflow for this order has been
                    completed.
                  </p>
                </div>
              ) : isFulfilled ? (
                /* COMPLETED */

                <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-700">
                  ✓ Order completed successfully.
                </div>
              ) : isCancelled ? (
                /* CANCELLED */

                <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700">
                  × This order has been cancelled.
                </div>
              ) : (
                /* NORMAL ACTIVE ORDER */

                <>
  {order.status !== "PENDING_PAYMENT" &&
    canFulfill &&
    order.status !== "COMPLETED" && (
      <form
        action={advanceOrderStatus.bind(null, order.id)}
        className="mt-4"
      >
        <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-black text-white hover:from-blue-700 hover:to-indigo-700">
          {order.status === "PAID"
            ? "Start Processing"
            : order.status === "PROCESSING"
              ? "Mark as Packing"
              : order.status === "PACKING"
                ? "Ready to Ship"
                : order.status === "READY_TO_SHIP"
                  ? "Mark as Shipped"
                  : order.status === "SHIPPED"
                    ? "Out for Delivery"
                    : order.status === "OUT_FOR_DELIVERY"
                      ? "Mark as Delivered"
                      : order.status === "DELIVERED"
                        ? "Complete Order"
                        : "Advance Order"}
        </button>
      </form>
    )}

  {order.status === "PENDING_PAYMENT" && (
    <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
      <p className="font-black text-yellow-800">
        Payment Pending
      </p>

      <p className="mt-1 text-sm leading-6 text-yellow-700">
        Fulfillment will become available after payment is confirmed.
      </p>
    </div>
  )}

  {canCancel && (
    <form
      action={cancelOrder.bind(null, order.id)}
      className="mt-3"
    >
      <button className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-black text-red-600 hover:bg-red-100">
        Cancel Order
      </button>
    </form>
  )}
</>
              )}

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Refunds and payment verification will be
                  enabled after payment integration is added.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}