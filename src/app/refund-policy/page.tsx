import Link from "next/link";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Return eligibility" },
  { id: "starting-return", label: "Starting a return" },
  { id: "condition", label: "Product condition" },
  { id: "non-returnable", label: "Non-returnable items" },
  { id: "inspection", label: "Return inspection" },
  { id: "refunds", label: "Refund processing" },
  { id: "shipping", label: "Shipping and delivery charges" },
  { id: "damaged", label: "Damaged or incorrect items" },
  { id: "cancellations", label: "Order cancellations" },
  { id: "changes", label: "Policy changes" },
  { id: "contact", label: "Contact us" },
];

const relatedLinks = [
  { href: "/shipping", label: "Shipping Information" },
  { href: "/account/returns", label: "Returns & Exchanges" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/account/help", label: "Help Center" },
];

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 border-b border-slate-200 py-9 last:border-b-0"
    >
      <h2 className="mb-5 text-[28px] font-bold tracking-[-0.025em] text-slate-950 md:text-[30px]">
        {title}
      </h2>

      <div className="space-y-4 text-[16px] leading-8 text-slate-600 md:text-[17px]">
        {children}
      </div>
    </section>
  );
}

export default function RefundPolicyPage() {
  return (
    <main className="bg-white text-slate-950">
      {/* Page header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-12 sm:px-7 md:pb-14 md:pt-14 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/"
              className="transition-colors hover:text-slate-950"
            >
              Home
            </Link>

            <span className="text-slate-300">/</span>

            <span className="text-slate-600">Refund Policy</span>
          </nav>

          <h1 className="text-[38px] font-bold tracking-[-0.04em] text-slate-950 sm:text-[44px] md:text-[48px]">
            Refund Policy
          </h1>

          <p className="mt-3 text-[15px] text-slate-500">
            Last updated: September 17, 2026
          </p>
        </div>
      </header>

      {/* Introduction */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-7 md:py-11 lg:px-8">
          <div className="max-w-[1000px] space-y-4 text-[16px] leading-8 text-slate-700 md:text-[17px]">
            <p>
              This Refund Policy explains how return requests, returned
              merchandise, and applicable refunds are handled through DJADOR
              Family Store.
            </p>

            <p>
              Return and refund availability depends on the order, the
              product, its condition, and the stage of the return process.
              Customers should review the information associated with their
              order before submitting a return request.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-5 sm:px-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        {/* Sidebar */}
        <aside className="border-b border-slate-200 py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-8">
          <div className="lg:sticky lg:top-28">
            <h2 className="mb-3 text-[14px] font-bold text-slate-950">
              On this page
            </h2>

            <nav aria-label="Refund policy sections">
              <ul className="border-t border-slate-200">
                {sections.map((section) => (
                  <li
                    key={section.id}
                    className="border-b border-slate-200"
                  >
                    <a
                      href={`#${section.id}`}
                      className="block py-2.5 text-[14px] leading-5 text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="mb-3 text-[14px] font-bold text-slate-950">
                Related information
              </h2>

              <ul className="space-y-2.5">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-slate-600 transition-colors hover:text-slate-950 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Policy */}
        <article className="min-w-0 py-1 lg:pl-14">
          <PolicySection id="overview" title="Overview">
            <p>
              DJADOR Family Store provides return features for eligible
              orders. When a return is available, customers may be able to
              begin the process through their order details.
            </p>

            <p>
              Submitting a return request does not by itself mean that a
              refund has been completed. Returned merchandise may need to be
              received and reviewed before the return process is completed.
            </p>
          </PolicySection>

          <PolicySection id="eligibility" title="Return eligibility">
            <p>
              Return eligibility depends on the product and the current status
              of the order. The return option is made available only when the
              order has reached an eligible stage.
            </p>

            <p>
              Customers should use the return options displayed within their
              DJADOR order details when available.
            </p>

            <div className="mt-5 border-l-2 border-slate-900 pl-5">
              <h3 className="mb-1 font-semibold text-slate-950">
                Check your order
              </h3>

              <p>
                The most current information about an order and any available
                return action can be found in the Orders section of your
                account.
              </p>
            </div>
          </PolicySection>

          <PolicySection id="starting-return" title="Starting a return">
            <p>
              For eligible orders, a return request can be started from the
              applicable order details page.
            </p>

            <p>
              Customers should review the order and select the available
              return option. Additional information may be required to help
              identify and process the return.
            </p>

            <p>
              You can review available return information through our{" "}
              <Link
                href="/account/returns"
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
              >
                Returns &amp; Exchanges
              </Link>{" "}
              section.
            </p>
          </PolicySection>

          <PolicySection id="condition" title="Product condition">
            <p>
              Returned products should be kept in an appropriate condition
              while the return is being processed.
            </p>

            <p>
              Product condition, included accessories, packaging, and other
              materials associated with an item may be considered when a
              returned product is reviewed.
            </p>

            <p>
              Customers should take reasonable care of merchandise they intend
              to return.
            </p>
          </PolicySection>

          <PolicySection id="non-returnable" title="Non-returnable items">
            <p>
              Some products may not be eligible for return because of their
              type, condition, or other circumstances associated with the
              product or order.
            </p>

            <p>
              When a return option is not available through the order details,
              customers who believe there is a problem with an order should
              contact Customer Service for assistance.
            </p>
          </PolicySection>

          <PolicySection id="inspection" title="Return inspection">
            <p>
              A return request and a completed return are separate stages of
              the return process.
            </p>

            <p>
              Returned merchandise may be reviewed after it is received. The
              return status may be updated as the request progresses through
              the applicable stages.
            </p>

            <p>
              Customers can review available status information through their
              DJADOR account.
            </p>
          </PolicySection>

          <PolicySection id="refunds" title="Refund processing">
            <p>
              When a return qualifies for a refund, refund processing occurs
              after the applicable return requirements have been completed.
            </p>

            <p>
              The timing and method of a refund may depend on the payment
              services available for the applicable order.
            </p>

            <div className="mt-5 border-l-2 border-slate-900 pl-5">
              <h3 className="mb-1 font-semibold text-slate-950">
                Payment processing
              </h3>

              <p>
                Additional refund-processing information will be provided as
                payment services become available through DJADOR Family Store.
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="shipping"
            title="Shipping and delivery charges"
          >
            <p>
              Shipping, delivery, and return-shipping treatment may depend on
              the circumstances of the order and return.
            </p>

            <p>
              Customers should review the information provided for their
              return and contact Customer Service if they need assistance
              before sending merchandise.
            </p>

            <p>
              General delivery information is available on our{" "}
              <Link
                href="/shipping"
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
              >
                Shipping Information
              </Link>{" "}
              page.
            </p>
          </PolicySection>

          <PolicySection
            id="damaged"
            title="Damaged or incorrect items"
          >
            <p>
              If an order arrives with a damaged item, an incorrect item, or
              another order-related problem, contact DJADOR Customer Service
              so the issue can be reviewed.
            </p>

            <p>
              Providing the relevant order information helps Customer Service
              identify the purchase and review the available options.
            </p>

            <p>
              Customers should avoid disposing of an affected item or related
              materials before receiving applicable return instructions.
            </p>
          </PolicySection>

          <PolicySection id="cancellations" title="Order cancellations">
            <p>
              Cancellation and return processes are different. Eligible orders
              may provide a cancellation option before the order progresses
              beyond an applicable cancellation stage.
            </p>

            <p>
              If an order can no longer be cancelled, any available return
              options will depend on the order after it reaches an eligible
              return stage.
            </p>

            <p>
              Customers can review available cancellation actions from their
              order details.
            </p>
          </PolicySection>

          <PolicySection id="changes" title="Policy changes">
            <p>
              This Refund Policy may be updated as DJADOR Family Store
              services, return processes, payment capabilities, or business
              practices change.
            </p>

            <p>
              When this policy is updated, the revised version will be
              published on this page and the date shown at the top of the page
              will be updated.
            </p>
          </PolicySection>

          <PolicySection id="contact" title="Contact us">
            <p>
              If you have questions about a return, refund, damaged product,
              incorrect item, or an existing order, contact DJADOR Customer
              Service.
            </p>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-b border-slate-300 pb-1 font-semibold text-slate-950 transition-colors hover:border-slate-950"
              >
                Contact Customer Service
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </PolicySection>
        </article>
      </div>

      {/* Related policy strip */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-5 py-7 sm:px-7 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-950">
              Returns &amp; customer information
            </h2>

            <p className="mt-1 text-[14px] text-slate-500">
              Review related DJADOR policies and customer resources.
            </p>
          </div>

          <nav
            aria-label="Related policies"
            className="flex flex-wrap gap-x-7 gap-y-3 text-[14px]"
          >
            <Link
              href="/account/returns"
              className="text-slate-600 hover:text-slate-950"
            >
              Returns &amp; Exchanges
            </Link>

            <Link
              href="/shipping"
              className="text-slate-600 hover:text-slate-950"
            >
              Shipping
            </Link>

            <Link
              href="/terms"
              className="text-slate-600 hover:text-slate-950"
            >
              Terms of Service
            </Link>

            <Link
              href="/contact"
              className="font-medium text-slate-900 hover:text-slate-950"
            >
              Customer Service
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}