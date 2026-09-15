import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Receipt,
  RefreshCcw,
  Wallet,
  XCircle,
} from "lucide-react";

type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

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

type Payment = {
  status: PaymentStatus;
  provider: string | null;
  transactionId: string | null;
  amount: number;
  createdAt: Date | null;
};

type Props = {
  payment: Payment;
  orderStatus: OrderStatus;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function paymentInfo(
  status: PaymentStatus,
  orderStatus: OrderStatus
) {
  if (
    orderStatus === "CANCELLED" &&
    status === "PENDING"
  ) {
    return {
      title: "No Payment Made",
      description:
        "This order was cancelled before payment was completed.",
      badge: "Cancelled",
      icon: XCircle,
      color:
        "bg-slate-50 border-slate-200 text-slate-700",
    };
  }

  switch (status) {
    case "CAPTURED":
      return {
        title: "Payment Successful",
        description:
          "Payment has been successfully recorded for this order.",
        badge: "Paid",
        icon: CheckCircle2,
        color:
          "bg-emerald-50 border-emerald-200 text-emerald-700",
      };

    case "AUTHORIZED":
      return {
        title: "Payment Authorized",
        description:
          "Payment has been authorized but has not yet been captured.",
        badge: "Authorized",
        icon: CheckCircle2,
        color:
          "bg-blue-50 border-blue-200 text-blue-700",
      };

    case "REFUNDED":
      return {
        title: "Payment Refunded",
        description:
          "The payment for this order has been refunded.",
        badge: "Refunded",
        icon: RefreshCcw,
        color:
          "bg-purple-50 border-purple-200 text-purple-700",
      };

    case "PARTIALLY_REFUNDED":
      return {
        title: "Partially Refunded",
        description:
          "Part of the payment for this order has been refunded.",
        badge: "Partial refund",
        icon: RefreshCcw,
        color:
          "bg-purple-50 border-purple-200 text-purple-700",
      };

    case "FAILED":
      return {
        title: "Payment Failed",
        description:
          "The payment could not be completed.",
        badge: "Failed",
        icon: XCircle,
        color:
          "bg-red-50 border-red-200 text-red-700",
      };

    case "PENDING":
    default:
      return {
        title: "Payment Pending",
        description:
          "No payment has been completed for this order yet.",
        badge: "Pending",
        icon: CircleDollarSign,
        color:
          "bg-amber-50 border-amber-200 text-amber-700",
      };
  }
}

export default function PaymentCard({
  payment,
  orderStatus,
}: Props) {
  const status = paymentInfo(
    payment.status,
    orderStatus
  );

  const StatusIcon = status.icon;

  const isPaid = payment.status === "CAPTURED";

  const isCancelledWithoutPayment =
    orderStatus === "CANCELLED" &&
    payment.status === "PENDING";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Payment Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Payment status for this order
          </p>
        </div>

        <CreditCard className="h-6 w-6 text-slate-400" />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Status */}
        <div
          className={`rounded-xl border p-4 ${status.color}`}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">
              <StatusIcon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold">
                  {status.title}
                </h3>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                  {status.badge}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 opacity-90">
                {status.description}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          {/* Payment Method */}
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Wallet className="h-4 w-4" />
            </span>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Method
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {payment.provider || "Not selected"}
              </p>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <CircleDollarSign className="h-4 w-4" />
            </span>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount Paid
              </p>

              <p className="mt-1 text-lg font-bold text-slate-950">
                {isPaid
                  ? formatPrice(payment.amount)
                  : formatPrice(0)}
              </p>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Receipt className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Transaction ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                {payment.transactionId ||
                  "Not available"}
              </p>
            </div>
          </div>

          {/* Payment Date */}
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <CalendarDays className="h-4 w-4" />
            </span>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {isPaid && payment.createdAt
                  ? formatDate(payment.createdAt)
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Cancelled Without Payment */}
        {isCancelledWithoutPayment ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

              <div>
                <h3 className="text-sm font-bold text-slate-950">
                  No payment was made
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  This order was cancelled before any
                  payment was completed.
                </p>
              </div>
            </div>
          </div>
        ) : !isPaid ? (
          /* Active Unpaid Order */
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <CircleDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Payment not completed
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  This order has been created, but no
                  payment has been recorded yet.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Invoice */}
        {isPaid ? (
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Receipt className="h-4 w-4" />
            Download Invoice
          </button>
        ) : isCancelledWithoutPayment ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-500">
            No invoice is available because no payment
            was made.
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-500">
            Invoice will be available after payment.
          </div>
        )}
      </div>
    </section>
  );
}