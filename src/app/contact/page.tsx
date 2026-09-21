import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Mail,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

export const metadata = {
  title: "Customer Service | DJADOR FAMILY STORE",
  description:
    "Get help with DJADOR FAMILY STORE orders, returns, shipping, products, account questions, and customer support.",
};

const helpCategories = [
  {
    title: "Your Orders",
    description: "Track, view, or manage your orders.",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Returns & Refunds",
    description: "Returns, exchanges, and refund information.",
    href: "/account/returns",
    icon: RotateCcw,
  },
  {
    title: "Shipping & Delivery",
    description: "Shipping and delivery information.",
    href: "/shipping",
    icon: Truck,
  },
  {
    title: "Account & Login",
    description: "Sign-in, addresses, and account help.",
    href: "/account",
    icon: UserRound,
  },
  {
    title: "Products & Shopping",
    description: "Product information and shopping help.",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Checkout Help",
    description: "Get help with checkout questions.",
    href: "/account/help",
    icon: CreditCard,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Customer Service Header */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Customer Service
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Hi, how can we help you?
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Get help with your orders, returns, shipping, account, and shopping
            questions.
          </p>

          {/* Search */}
          <form
            action="/account/help"
            method="get"
            className="mt-6 flex max-w-2xl overflow-hidden rounded-md border border-slate-300 bg-white"
          >
            <div className="flex flex-1 items-center">
              <Search className="ml-4 h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="search"
                name="q"
                placeholder="Search help topics"
                className="h-11 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Help Categories */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">
              What do you need help with?
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Select a topic to find the right support.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex min-h-[110px] items-start gap-4 border-b border-slate-200 p-5 transition-colors hover:bg-slate-50 sm:border-r lg:[&:nth-child(3n)]:border-r-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-semibold text-slate-950">
                        {item.title}
                      </h3>

                      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <p className="mt-1.5 text-sm leading-5 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Order Help */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-[18px] w-[18px] text-slate-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Need help with an order?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  View order details, status, tracking, cancellations, and
                  eligible returns.
                </p>
              </div>
            </div>

            <Link
              href="/account/orders"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View my orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* More Help */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Need more help?
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Find more answers or contact DJADOR customer support.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white md:grid-cols-3">
            {/* Help Center */}
            <Link
              href="/account/help"
              className="group flex min-h-[110px] items-start gap-4 border-b border-slate-200 p-5 transition-colors hover:bg-slate-50 md:border-b-0 md:border-r"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <CircleHelp className="h-[18px] w-[18px] text-slate-700" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold text-slate-950">
                    Help Center
                  </h3>

                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Browse common customer support topics.
                </p>
              </div>
            </Link>

            {/* FAQs */}
            <Link
              href="/faqs"
              className="group flex min-h-[110px] items-start gap-4 border-b border-slate-200 p-5 transition-colors hover:bg-slate-50 md:border-b-0 md:border-r"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <CircleHelp className="h-[18px] w-[18px] text-slate-700" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold text-slate-950">
                    Frequently Asked Questions
                  </h3>

                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                <p className="mt-1.5 text-sm leading-5 text-slate-600">
                  Find quick answers to common questions.
                </p>
              </div>
            </Link>

            {/* Email */}
            <a
              href="mailto:support@djadorfamilystore.com"
              className="group flex min-h-[110px] items-start gap-4 p-5 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Mail className="h-[18px] w-[18px] text-slate-700" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold text-slate-950">
                    Email Customer Support
                  </h3>

                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                <p className="mt-1.5 break-all text-sm leading-5 text-slate-600">
                  support@djadorfamilystore.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}