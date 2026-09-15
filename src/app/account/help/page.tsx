import Link from "next/link";
import {
  CircleHelp,
  Package,
  RotateCcw,
  CreditCard,
  MapPin,
  User,
  Heart,
  ChevronRight,
  Mail,
  ShoppingBag,
} from "lucide-react";

const helpTopics = [
  {
    title: "Orders & Delivery",
    description: "Track orders, check order status, and manage your purchases.",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Returns & Refunds",
    description: "Learn about returns, refunds, and eligible purchases.",
    icon: RotateCcw,
    href: "/account/returns",
  },
  {
    title: "Payments",
    description: "Get help with payment status and payment-related questions.",
    icon: CreditCard,
    href: "/account/orders",
  },
  {
    title: "Saved Addresses",
    description: "Add, edit, remove, or manage your delivery addresses.",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    title: "Account & Profile",
    description: "Manage your personal information and account preferences.",
    icon: User,
    href: "/account/profile",
  },
  {
    title: "Wishlist",
    description: "Manage products you have saved for later.",
    icon: Heart,
    href: "/account/wishlist",
  },
];

const faqs = [
  {
    question: "How can I check the status of my order?",
    answer:
      "Open My Orders from your account and select the order you want to view. You can see its current order and delivery status there.",
  },
  {
    question: "How do I cancel an order?",
    answer:
      "Eligible orders can be cancelled from the order details page before they move into processing or shipping.",
  },
  {
    question: "How do I change my delivery address?",
    answer:
      "Open Saved Addresses from your account. You can add a new address, edit an existing address, or choose a default address.",
  },
  {
    question: "Where can I find products I saved?",
    answer:
      "Products saved with the heart icon are available in the Wishlist section of your account.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-slate-200 pb-7">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-1 h-7 w-7 shrink-0 text-slate-900" />

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Help Center
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Find answers and get help with your DJADOR account and orders.
            </p>
          </div>
        </div>
      </div>

      {/* Help topics */}
      <section className="py-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            How can we help?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a topic to find the information you need.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.title}
                href={topic.href}
                className="group flex min-h-[150px] flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                </div>

                <h3 className="mt-4 font-bold text-slate-950">
                  {topic.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {topic.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 py-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quick answers to common questions.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`px-6 py-5 ${
                index !== faqs.length - 1
                  ? "border-b border-slate-200"
                  : ""
              }`}
            >
              <h3 className="font-semibold text-slate-950">
                {faq.question}
              </h3>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="border-t border-slate-200 py-8">
        <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50">
              <Mail className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Still need help?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Our customer support team can help with your order or account.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}