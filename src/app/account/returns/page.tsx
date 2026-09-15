import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Open your order",
    description:
      "Go to My Orders and select the order containing the item you want to return.",
  },
  {
    number: "2",
    title: "Request a return",
    description:
      "If the order is eligible, choose the return option and follow the instructions.",
  },
  {
    number: "3",
    title: "Return your item",
    description:
      "Prepare the item for return according to the instructions provided with your request.",
  },
  {
    number: "4",
    title: "Refund processing",
    description:
      "After the returned item is received and approved, the refund will be processed.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-slate-200 pb-7">
        <div className="flex items-start gap-3">
          <RotateCcw className="mt-1 h-7 w-7 shrink-0 text-slate-900" />

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Returns & Refunds
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage eligible returns and understand the refund process.
            </p>
          </div>
        </div>
      </div>

      {/* Start return */}
      <section className="py-8">
        <div className="flex flex-col justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50">
              <Package className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Need to return an item?
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Start from your order details. Eligible completed orders will
                display the available return option.
              </p>
            </div>
          </div>

          <Link
            href="/account/orders"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            View My Orders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Return process */}
      <section className="border-t border-slate-200 py-8">
        <h2 className="text-xl font-bold text-slate-950">
          How returns work
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Follow these steps when returning an eligible purchase.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                {step.number}
              </div>

              <h3 className="mt-4 font-bold text-slate-950">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Information */}
      <section className="border-t border-slate-200 py-8">
        <h2 className="text-xl font-bold text-slate-950">
          Return information
        </h2>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex gap-4 border-b border-slate-200 p-6">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <h3 className="font-semibold text-slate-950">
                Return eligibility
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Return availability depends on the order status and the
                eligibility of the purchased item.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-200 p-6">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

            <div>
              <h3 className="font-semibold text-slate-950">
                Refund processing
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Approved refunds are processed after the returned item has been
                received and reviewed.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

            <div>
              <h3 className="font-semibold text-slate-950">
                Item condition
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Items should be returned in an appropriate condition with the
                included accessories or packaging when applicable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="border-t border-slate-200 py-8">
        <div className="flex flex-col justify-between gap-5 rounded-xl bg-slate-50 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-950">
              Have a question about a return?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Visit the Help Center for additional information and support.
            </p>
          </div>

          <Link
            href="/account/help"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Visit Help Center
          </Link>
        </div>
      </section>
    </div>
  );
}