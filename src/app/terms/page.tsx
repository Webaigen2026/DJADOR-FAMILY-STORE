import Link from "next/link";

const sections = [
  { id: "using-djador", label: "Using DJADOR Family Store" },
  { id: "accounts", label: "Accounts" },
  { id: "products", label: "Products and availability" },
  { id: "orders", label: "Orders" },
  { id: "pricing", label: "Pricing and product information" },
  { id: "shipping", label: "Shipping and delivery" },
  { id: "cancellations", label: "Cancellations" },
  { id: "returns", label: "Returns and refunds" },
  { id: "reviews", label: "Reviews and customer content" },
  { id: "website-use", label: "Website use" },
  { id: "third-party", label: "Third-party services" },
  { id: "changes", label: "Changes to these Terms" },
  { id: "contact", label: "Contact us" },
];

const relatedLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping", label: "Shipping Information" },
  { href: "/account/returns", label: "Returns & Exchanges" },
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

export default function TermsPage() {
  return (
    <main className="bg-white text-slate-950">
      {/* Header */}
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

            <span className="text-slate-600">Terms of Service</span>
          </nav>

          <h1 className="text-[38px] font-bold tracking-[-0.04em] text-slate-950 sm:text-[44px] md:text-[48px]">
            Terms of Service
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
              These Terms of Service govern your use of the DJADOR Family
              Store website and the shopping, account, order, and customer
              service features available through it.
            </p>

            <p>
              By accessing or using DJADOR Family Store, you agree to use the
              website and its services in accordance with these Terms and any
              policies referenced on this website.
            </p>
          </div>
        </div>
      </section>

      {/* Main policy area */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-5 sm:px-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        {/* Sidebar */}
        <aside className="border-b border-slate-200 py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-8">
          <div className="lg:sticky lg:top-28">
            <h2 className="mb-3 text-[14px] font-bold text-slate-950">
              On this page
            </h2>

            <nav aria-label="Terms of Service sections">
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

        {/* Policy content */}
        <article className="min-w-0 py-1 lg:pl-14">
          <PolicySection id="using-djador" title="Using DJADOR Family Store">
            <p>
              DJADOR Family Store provides an online shopping service that
              allows customers to browse products, maintain a shopping cart
              and wishlist, create an account, place and manage orders, and
              access customer service features.
            </p>

            <p>
              You may use the website only for lawful purposes and in a way
              that does not interfere with the operation, security, or use of
              the website by other customers.
            </p>

            <p>
              Features available through DJADOR Family Store may change as the
              store and its services develop.
            </p>
          </PolicySection>

          <PolicySection id="accounts" title="Accounts">
            <p>
              Certain features require a DJADOR account. When creating or
              using an account, you should provide accurate information and
              keep your account information reasonably current.
            </p>

            <p>
              You are responsible for maintaining the confidentiality of your
              sign-in credentials and for activity conducted through your
              account.
            </p>

            <p>
              You should not share your password with others. If you believe
              your account has been accessed without authorization, contact
              Customer Service and use the available account-recovery
              features.
            </p>
          </PolicySection>

          <PolicySection id="products" title="Products and availability">
            <p>
              Products displayed on DJADOR Family Store are subject to
              availability. Product availability may change as inventory is
              updated.
            </p>

            <p>
              Product pages may contain information such as product names,
              descriptions, images, prices, available quantities, brands,
              categories, sizes, colors, or other applicable options.
            </p>

            <p>
              We work to present product information clearly. Product
              appearance may vary depending on factors such as photography,
              lighting, display settings, and the device used to view the
              website.
            </p>
          </PolicySection>

          <PolicySection id="orders" title="Orders">
            <p>
              When you submit an order through DJADOR Family Store, order
              information is recorded so the order can be displayed, managed,
              and supported through your account.
            </p>

            <p>
              An order may include information such as the products ordered,
              quantities, selected product options, prices, shipping details,
              and current order status.
            </p>

            <p>
              Order availability and fulfillment may depend on current
              inventory and the information associated with the order.
            </p>

            <div className="mt-5 border-l-2 border-slate-900 pl-5">
              <h3 className="mb-1 font-semibold text-slate-950">
                Order status
              </h3>

              <p>
                Customers can review available order information and status
                updates through the order section of their DJADOR account.
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="pricing"
            title="Pricing and product information"
          >
            <p>
              Product prices and other product information are displayed on
              the website as part of the shopping experience.
            </p>

            <p>
              Prices, inventory, product details, and available product
              options may be updated when store information changes.
            </p>

            <p>
              The information associated with an order at the time it is
              created is maintained as part of that order&apos;s record.
            </p>
          </PolicySection>

          <PolicySection id="shipping" title="Shipping and delivery">
            <p>
              Shipping information provided during checkout is used to support
              the processing and delivery of an order.
            </p>

            <p>
              Customers are responsible for reviewing the shipping information
              they provide and ensuring that it is accurate and complete.
            </p>

            <p>
              Additional information about shipping can be found on our{" "}
              <Link
                href="/shipping"
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
              >
                Shipping Information
              </Link>{" "}
              page.
            </p>
          </PolicySection>

          <PolicySection id="cancellations" title="Cancellations">
            <p>
              Cancellation options depend on the current status of an order.
              When an order is eligible for cancellation, the available
              cancellation option may be provided through the customer&apos;s
              order details.
            </p>

            <p>
              Once an order has progressed beyond an eligible cancellation
              stage, cancellation may no longer be available through the
              account.
            </p>

            <p>
              Customers who need assistance with an order can contact Customer
              Service.
            </p>
          </PolicySection>

          <PolicySection id="returns" title="Returns and refunds">
            <p>
              Eligible orders may provide return options after the applicable
              order stage has been reached.
            </p>

            <p>
              Return eligibility, return processing, and any applicable refund
              handling are subject to the information and conditions described
              in the relevant DJADOR customer policies.
            </p>

            <p>
              Review our{" "}
              <Link
                href="/account/returns"
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
              >
                Returns &amp; Exchanges
              </Link>{" "}
              information and{" "}
              <Link
                href="/refund-policy"
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
              >
                Refund Policy
              </Link>{" "}
              for additional information.
            </p>
          </PolicySection>

          <PolicySection
            id="reviews"
            title="Reviews and customer content"
          >
            <p>
              DJADOR Family Store may allow customers to submit product
              reviews or other customer-provided content.
            </p>

            <p>
              Content submitted through the website should relate to the
              relevant product or shopping experience and should not be used
              to submit unlawful, abusive, misleading, or harmful material.
            </p>

            <p>
              Customer-submitted content may be reviewed or moderated as part
              of operating the store and its review features.
            </p>
          </PolicySection>

          <PolicySection id="website-use" title="Website use">
            <p>
              You may not attempt to interfere with the operation or security
              of DJADOR Family Store, gain unauthorized access to accounts or
              administrative functionality, or misuse website features.
            </p>

            <p>
              You may not use the website in a manner intended to damage,
              disable, overload, disrupt, or improperly access the website,
              its services, or information belonging to other users.
            </p>

            <p>
              Automated or abusive activity that interferes with normal store
              operations may be restricted where necessary to protect the
              website and its customers.
            </p>
          </PolicySection>

          <PolicySection id="third-party" title="Third-party services">
            <p>
              DJADOR Family Store may rely on third-party technology and
              service providers to operate certain parts of the website and
              provide store functionality.
            </p>

            <p>
              These services may include website hosting, database services,
              authentication, file storage, email delivery, and other
              technical services required to operate the store.
            </p>

            <p>
              Third-party services may be subject to their own applicable
              terms and policies.
            </p>
          </PolicySection>

          <PolicySection id="changes" title="Changes to these Terms">
            <p>
              These Terms may be updated from time to time to reflect changes
              to DJADOR Family Store, available services, customer features,
              business practices, or applicable requirements.
            </p>

            <p>
              When these Terms are updated, the revised version will be
              published on this page and the &quot;Last updated&quot; date
              shown at the top of the page will be changed.
            </p>
          </PolicySection>

          <PolicySection id="contact" title="Contact us">
            <p>
              If you have questions about these Terms or need assistance with
              your DJADOR account or an order, please contact DJADOR Customer
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
              Policies &amp; customer information
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
              href="/privacy"
              className="text-slate-600 hover:text-slate-950"
            >
              Privacy Policy
            </Link>

            <Link
              href="/refund-policy"
              className="text-slate-600 hover:text-slate-950"
            >
              Refund Policy
            </Link>

            <Link
              href="/shipping"
              className="text-slate-600 hover:text-slate-950"
            >
              Shipping
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