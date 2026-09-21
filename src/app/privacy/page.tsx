import Link from "next/link";

const sections = [
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use your information" },
  { id: "your-account", label: "Your account" },
  { id: "orders-shipping", label: "Orders and shipping information" },
  { id: "cookies", label: "Cookies and website technologies" },
  { id: "service-providers", label: "Service providers" },
  { id: "security", label: "How we protect information" },
  { id: "retention", label: "How long we keep information" },
  { id: "choices", label: "Your choices" },
  { id: "children", label: "Children's privacy" },
  { id: "changes", label: "Changes to this Privacy Policy" },
  { id: "contact", label: "Contact us" },
];

export default function PrivacyPage() {
  return (
    <main className="bg-white text-slate-950">
      {/* Page heading */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm text-slate-500">
              <Link
                href="/"
                className="transition-colors hover:text-slate-950"
              >
                Home
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              Privacy Policy
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Last updated: September 17, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="max-w-5xl">
            <p className="text-[17px] leading-8 text-slate-700">
              DJADOR Family Store respects your privacy. This Privacy Policy
              explains the types of information that may be collected when you
              use our website, how that information may be used, and the choices
              available to you.
            </p>

            <p className="mt-5 text-[17px] leading-8 text-slate-700">
              This policy applies when you browse our store, create or use an
              account, place or manage an order, save products or addresses,
              submit a review, or contact Customer Service.
            </p>
          </div>
        </div>
      </section>

      {/* Main policy */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
          {/* Left navigation */}
          <aside className="hidden border-r border-slate-200 py-12 pr-8 lg:block">
            <div className="sticky top-28">
              <p className="mb-4 text-sm font-semibold text-slate-950">
                On this page
              </p>

              <nav aria-label="Privacy policy sections">
                <ul className="border-t border-slate-200">
                  {sections.map((section) => (
                    <li
                      key={section.id}
                      className="border-b border-slate-200"
                    >
                      <a
                        href={`#${section.id}`}
                        className="block py-3 text-[13px] leading-5 text-slate-600 transition-colors hover:text-slate-950"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-9 border-t border-slate-200 pt-7">
                <p className="mb-4 text-sm font-semibold text-slate-950">
                  Related information
                </p>

                <div className="space-y-3">
                  <Link
                    href="/terms"
                    className="block text-[13px] text-slate-600 transition-colors hover:text-slate-950"
                  >
                    Terms of Service
                  </Link>

                  <Link
                    href="/refund-policy"
                    className="block text-[13px] text-slate-600 transition-colors hover:text-slate-950"
                  >
                    Refund Policy
                  </Link>

                  <Link
                    href="/shipping"
                    className="block text-[13px] text-slate-600 transition-colors hover:text-slate-950"
                  >
                    Shipping Information
                  </Link>

                  <Link
                    href="/account/returns"
                    className="block text-[13px] text-slate-600 transition-colors hover:text-slate-950"
                  >
                    Returns &amp; Exchanges
                  </Link>

                  <Link
                    href="/account/help"
                    className="block text-[13px] text-slate-600 transition-colors hover:text-slate-950"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy content */}
          <article className="min-w-0 py-12 lg:py-14">
            <PolicySection
              id="information-we-collect"
              title="Information we collect"
            >
              <p>
                We collect information that you provide when using DJADOR
                Family Store. The information collected depends on the features
                and services you use.
              </p>

              <p>This information may include:</p>

              <ul>
                <li>Your name and email address</li>
                <li>Account and sign-in information</li>
                <li>Telephone number when provided with an order</li>
                <li>Shipping and saved address information</li>
                <li>Products added to your cart or wishlist</li>
                <li>Order and purchase-related information</li>
                <li>Product reviews and other content you submit</li>
                <li>Information included in customer service requests</li>
              </ul>

              <p>
                Certain technical information may also be created or processed
                as you use the website so that features such as account
                sessions, carts, orders, notifications, and website security
                can operate correctly.
              </p>
            </PolicySection>

            <PolicySection
              id="how-we-use-information"
              title="How we use your information"
            >
              <p>
                We use information to provide, maintain, and support the
                services available through DJADOR Family Store.
              </p>

              <p>Information may be used to:</p>

              <ul>
                <li>Create and maintain customer accounts</li>
                <li>Authenticate users and protect account access</li>
                <li>Maintain shopping carts and wishlists</li>
                <li>Create and manage customer orders</li>
                <li>Provide order status and shipping information</li>
                <li>Manage saved shipping addresses</li>
                <li>Process cancellation and eligible return requests</li>
                <li>Send account and order-related communications</li>
                <li>Respond to customer service requests</li>
                <li>Protect the security and reliability of our services</li>
              </ul>
            </PolicySection>

            <PolicySection id="your-account" title="Your account">
              <p>
                When you create a DJADOR account, information associated with
                your account is used to provide services such as sign-in, order
                history, saved addresses, wishlists, notifications, and account
                recovery.
              </p>

              <p>
                You are responsible for keeping your account credentials
                confidential. We recommend using a strong password and avoiding
                sharing your sign-in information with others.
              </p>

              <p>
                We may send emails related to account verification, password
                recovery, orders, or other services requested through your
                account.
              </p>
            </PolicySection>

            <PolicySection
              id="orders-shipping"
              title="Orders and shipping information"
            >
              <p>
                When an order is placed, we maintain information needed to
                create, display, manage, and support that order.
              </p>

              <p>
                Order records may include products ordered, quantities, prices,
                shipping information, order status, and other information
                associated with the transaction.
              </p>

              <p>
                We may use this information to provide order updates, shipping
                information, customer support, cancellation services, and
                eligible return services.
              </p>

              <div className="mt-7 border-l-2 border-slate-950 pl-5">
                <p className="font-semibold text-slate-950">
                  Payment information
                </p>
                <p className="mt-1">
                  This policy may be updated when additional payment-processing
                  services are made available through DJADOR Family Store.
                </p>
              </div>
            </PolicySection>

            <PolicySection
              id="cookies"
              title="Cookies and website technologies"
            >
              <p>
                DJADOR Family Store may use cookies and similar browser
                technologies that help the website function properly. These
                technologies may support features such as authentication,
                sessions, preferences, shopping functionality, and security.
              </p>

              <p>
                Most browsers provide settings that allow you to manage or
                remove cookies. Restricting technologies required for website
                functionality may prevent some features from working correctly.
              </p>
            </PolicySection>

            <PolicySection id="service-providers" title="Service providers">
              <p>
                We may use third-party service providers to support the
                operation of DJADOR Family Store. These providers may perform
                technical functions such as website hosting, database services,
                authentication, file storage, and email delivery.
              </p>

              <p>
                Information may be processed by these providers when necessary
                to provide their services to DJADOR Family Store. Their handling
                of information may also be governed by their own privacy terms
                and policies.
              </p>
            </PolicySection>

            <PolicySection
              id="security"
              title="How we protect information"
            >
              <p>
                We use technical and organizational measures intended to
                protect customer information and restrict unauthorized access
                to accounts and administrative services.
              </p>

              <p>
                No website, network, database, or method of electronic
                transmission can be guaranteed to be completely secure.
                Customers should protect their passwords and contact Customer
                Service if they believe their account has been accessed without
                authorization.
              </p>
            </PolicySection>

            <PolicySection
              id="retention"
              title="How long we keep information"
            >
              <p>
                Information may be retained for as long as reasonably necessary
                to provide our services, maintain appropriate business records,
                respond to customer requests, protect our website, and meet
                applicable obligations.
              </p>

              <p>
                Retention periods may vary depending on the type of information
                and the purpose for which it is maintained.
              </p>
            </PolicySection>

            <PolicySection id="choices" title="Your choices">
              <p>
                Your DJADOR account provides access to certain information and
                account-management features. Depending on the feature, you may
                be able to review or manage:
              </p>

              <ul>
                <li>Your order history and order details</li>
                <li>Saved shipping addresses</li>
                <li>Wishlist items</li>
                <li>Account and password recovery options</li>
              </ul>

              <p>
                For privacy or account questions that cannot be handled
                directly through your account, please contact Customer Service.
              </p>
            </PolicySection>

            <PolicySection id="children" title="Children's privacy">
              <p>
                DJADOR Family Store is a general-audience shopping website and
                is not designed specifically for children.
              </p>

              <p>
                If you believe personal information involving a child has been
                submitted through our website and you have questions or
                concerns, please contact Customer Service.
              </p>
            </PolicySection>

            <PolicySection
              id="changes"
              title="Changes to this Privacy Policy"
            >
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes to our website, services, business practices, or
                applicable requirements.
              </p>

              <p>
                When changes are made, the updated policy will be published on
                this page and the date shown at the top of the policy will be
                revised.
              </p>
            </PolicySection>

            <section
              id="contact"
              className="scroll-mt-32 border-b-0 pt-10"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-[28px]">
                Contact us
              </h2>

              <p className="mt-5 max-w-4xl text-[16px] leading-8 text-slate-600">
                If you have questions about this Privacy Policy or need
                assistance with your DJADOR account, please contact DJADOR
                Customer Service.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-950"
              >
                Contact Customer Service
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </article>
        </div>
      </div>

      {/* Related links above existing global footer */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Policies &amp; customer information
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Review related DJADOR policies and customer resources.
            </p>
          </div>

          <nav
            aria-label="Related policy links"
            className="flex flex-wrap gap-x-7 gap-y-3"
          >
            <Link
              href="/terms"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Terms of Service
            </Link>

            <Link
              href="/refund-policy"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Refund Policy
            </Link>

            <Link
              href="/shipping"
              className="text-sm text-slate-600 transition-colors hover:text-slate-950"
            >
              Shipping
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-950"
            >
              Customer Service
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}

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
      className="scroll-mt-32 border-b border-slate-200 py-10 first:pt-0 sm:py-12"
    >
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-[28px]">
        {title}
      </h2>

      <div
        className="
          mt-5 max-w-4xl
          space-y-5
          text-[16px] leading-8 text-slate-600
          [&_ul]:ml-6
          [&_ul]:list-disc
          [&_ul]:space-y-1
          [&_li]:pl-1
        "
      >
        {children}
      </div>
    </section>
  );
}