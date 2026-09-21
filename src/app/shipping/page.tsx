import Link from "next/link";

const shippingSections = [
  {
    id: "order-processing",
    label: "Order processing",
  },
  {
    id: "delivery-estimates",
    label: "Delivery estimates",
  },
  {
    id: "tracking",
    label: "Tracking your order",
  },
  {
    id: "shipping-addresses",
    label: "Shipping addresses",
  },
  {
    id: "delivery-issues",
    label: "Delivery issues",
  },
];

export default function ShippingPage() {
  return (
    <main className="bg-white text-slate-950">
      {/* Page header */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Customer Service
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Shipping &amp; Delivery
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Find information about order processing, delivery estimates,
            tracking, shipping addresses, and delivery questions.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          {/* Left navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="border-b border-slate-200 pb-4 text-sm font-semibold text-slate-950">
                On this page
              </p>

              <nav className="divide-y divide-slate-200">
                {shippingSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block py-4 text-sm text-slate-600 transition-colors hover:text-slate-950"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-sm font-semibold text-slate-950">
                  Need more help?
                </p>

                <Link
                  href="/contact"
                  className="mt-3 inline-block text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950"
                >
                  Contact Customer Service
                </Link>
              </div>
            </div>
          </aside>

          {/* Shipping information */}
          <div className="min-w-0 max-w-4xl">
            {/* Order processing */}
            <section
              id="order-processing"
              className="scroll-mt-32 border-b border-slate-200 pb-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Order processing
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  After you place an order, you can follow its current status
                  from your DJADOR account. Your order details show the latest
                  available information as your order moves through the order
                  process.
                </p>

                <p>
                  Order information may be updated as your order is processed
                  and prepared for shipment.
                </p>
              </div>

              <Link
                href="/account/orders"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:underline hover:underline-offset-4"
              >
                View your orders
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            {/* Delivery estimates */}
            <section
              id="delivery-estimates"
              className="scroll-mt-32 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Delivery estimates
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Delivery information can vary depending on the order and
                  destination. When delivery information is available, check
                  your order details for the latest status and shipping
                  updates.
                </p>

                <p>
                  Delivery estimates are estimates and may change while an
                  order is being processed or while it is in transit.
                </p>
              </div>
            </section>

            {/* Tracking */}
            <section
              id="tracking"
              className="scroll-mt-32 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Tracking your order
              </h2>

              <div className="mt-5 text-[15px] leading-7 text-slate-600">
                <p>
                  When tracking information is available, you can find it in
                  the order details in your account. Tracking information may
                  not appear immediately after an order is placed.
                </p>
              </div>

              <div className="mt-6 border-l-2 border-slate-900 pl-5">
                <p className="text-sm font-semibold text-slate-950">
                  Where can I check my order?
                </p>

                <p className="mt-2 text-[15px] leading-7 text-slate-600">
                  Sign in to your account, open Your Orders, and select the
                  order you want to review.
                </p>
              </div>

              <Link
                href="/account/orders"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:underline hover:underline-offset-4"
              >
                Go to Your Orders
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            {/* Shipping addresses */}
            <section
              id="shipping-addresses"
              className="scroll-mt-32 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Shipping addresses
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Check your shipping information carefully when placing an
                  order. Your order details contain the shipping address
                  submitted with that order.
                </p>

                <p>
                  You can manage addresses saved to your DJADOR account from
                  the Saved Addresses section.
                </p>
              </div>

              <Link
                href="/account/addresses"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:underline hover:underline-offset-4"
              >
                Manage saved addresses
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            {/* Delivery problems */}
            <section
              id="delivery-issues"
              className="scroll-mt-32 pt-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Problems with a delivery
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  If you have a question about an order or delivery, first
                  check your order details for the latest available status and
                  tracking information.
                </p>

                <p>
                  If you still need assistance, contact DJADOR Customer
                  Service and include your order information so the team can
                  help with your request.
                </p>
              </div>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:underline hover:underline-offset-4"
              >
                Contact Customer Service
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </div>
        </div>
      </section>

      {/* Bottom help bar */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Still have a shipping question?
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Find more answers or contact DJADOR Customer Service.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-950">
            <Link
              href="/faqs"
              className="hover:underline hover:underline-offset-4"
            >
              FAQs
            </Link>

            <span className="text-slate-300">|</span>

            <Link
              href="/account/help"
              className="hover:underline hover:underline-offset-4"
            >
              Help Center
            </Link>

            <span className="text-slate-300">|</span>

            <Link
              href="/contact"
              className="hover:underline hover:underline-offset-4"
            >
              Contact Customer Service
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}