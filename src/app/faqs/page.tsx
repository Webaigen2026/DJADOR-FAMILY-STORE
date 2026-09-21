"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

type FAQ = {
  question: string;
  answer: React.ReactNode;
};

type FAQSection = {
  id: string;
  title: string;
  description: string;
  questions: FAQ[];
};

const linkClass =
  "font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950";

const faqSections: FAQSection[] = [
  {
    id: "orders",
    title: "Orders & Tracking",
    description:
      "Get help with order status, tracking, cancellations, and order history.",
    questions: [
      {
        question: "How can I check the status of my order?",
        answer: (
          <>
            Sign in to your DJADOR account and visit{" "}
            <Link href="/account/orders" className={linkClass}>
              Your Orders
            </Link>
            . Select an order to view its current status and order details.
          </>
        ),
      },
      {
        question: "Where can I find my previous orders?",
        answer: (
          <>
            Your current and previous orders are available in{" "}
            <Link href="/account/orders" className={linkClass}>
              Your Orders
            </Link>
            . You must be signed in to view orders associated with your
            account.
          </>
        ),
      },
      {
        question: "How do I track my order?",
        answer:
          "Open the order from Your Orders. When tracking information is available, you can view it from the order details page.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Eligible orders can be cancelled from the order details page. Cancellation availability depends on the current status of the order. If the cancellation option is no longer shown, the order has progressed beyond the stage where online cancellation is available.",
      },
      {
        question: "Why is my order still showing as processing?",
        answer:
          "Orders can move through several stages while they are being prepared. Check Your Orders for the most recent status. If you believe there is a problem, contact DJADOR customer support.",
      },
      {
        question: "What should I do if there is a problem with my order?",
        answer: (
          <>
            First review the order from{" "}
            <Link href="/account/orders" className={linkClass}>
              Your Orders
            </Link>
            . If you still need assistance, visit{" "}
            <Link href="/contact" className={linkClass}>
              Customer Service
            </Link>
            .
          </>
        ),
      },
    ],
  },

  {
    id: "shipping",
    title: "Shipping & Delivery",
    description:
      "Find information about shipping, tracking, delivery, and addresses.",
    questions: [
      {
        question: "Where can I find shipping information?",
        answer: (
          <>
            Visit our{" "}
            <Link href="/shipping" className={linkClass}>
              Shipping Information
            </Link>{" "}
            page for the shipping information currently available from DJADOR.
          </>
        ),
      },
      {
        question: "How will I know when my order has shipped?",
        answer:
          "Your order status will be updated as it moves through the fulfillment process. You can check the latest information from Your Orders.",
      },
      {
        question: "Where can I find my tracking information?",
        answer:
          "Open the relevant order from Your Orders. If tracking information has been added to your shipment, it will appear with the order details.",
      },
      {
        question: "What should I do if my order has not arrived?",
        answer:
          "Check your order status and available tracking information first. If the order appears delayed or there is a delivery problem, contact DJADOR customer support with your order information.",
      },
      {
        question: "Can I change my shipping address after placing an order?",
        answer:
          "Address changes may not be available after an order has been submitted. Review your order details and contact customer support as soon as possible if you entered incorrect shipping information.",
      },
    ],
  },

  {
    id: "returns",
    title: "Returns & Refunds",
    description:
      "Find information about return requests, return status, exchanges, and refunds.",
    questions: [
      {
        question: "How do I request a return?",
        answer: (
          <>
            Open the eligible order from{" "}
            <Link href="/account/orders" className={linkClass}>
              Your Orders
            </Link>
            . If a return can be requested for that order, the return option
            will be available from the order details.
          </>
        ),
      },
      {
        question: "Which orders can be returned?",
        answer:
          "Return availability depends on the order's current status and the applicable DJADOR return policy. When an order is eligible for an online return request, the option will appear in the order details.",
      },
      {
        question: "Where can I check the status of my return?",
        answer:
          "Check the relevant order in Your Orders. The order status will show when a return has been requested and when the returned item has been processed by DJADOR.",
      },
      {
        question: "What happens after DJADOR receives my returned item?",
        answer:
          "After an approved returned item is received and processed, the order status can be updated to reflect that the return has been received. Any applicable refund is handled according to the refund process and policy.",
      },
      {
        question: "Where can I find the DJADOR refund policy?",
        answer: (
          <>
            Review the current{" "}
            <Link href="/refund-policy" className={linkClass}>
              Refund Policy
            </Link>{" "}
            for information about DJADOR returns and refunds.
          </>
        ),
      },
    ],
  },

  {
    id: "account",
    title: "Account & Login",
    description:
      "Get help with sign-in, passwords, saved addresses, and account information.",
    questions: [
      {
        question: "Do I need an account to view my orders?",
        answer:
          "Yes. You need to sign in to the account associated with your order to access your order history and order details.",
      },
      {
        question: "How do I sign in to my account?",
        answer: (
          <>
            Visit the{" "}
            <Link href="/login" className={linkClass}>
              Sign In
            </Link>{" "}
            page and enter the email address and password associated with your
            DJADOR account.
          </>
        ),
      },
      {
        question: "What should I do if I forgot my password?",
        answer: (
          <>
            Use the{" "}
            <Link href="/forgot-password" className={linkClass}>
              Forgot Password
            </Link>{" "}
            option and follow the instructions to create a new password.
          </>
        ),
      },
      {
        question: "How can I manage my saved addresses?",
        answer: (
          <>
            Sign in and visit{" "}
            <Link href="/account/addresses" className={linkClass}>
              Saved Addresses
            </Link>
            . From there, you can manage the addresses saved to your account.
          </>
        ),
      },
      {
        question: "How can I view my account information?",
        answer: (
          <>
            Sign in and open your{" "}
            <Link href="/account" className={linkClass}>
              Account
            </Link>{" "}
            area to access the account options currently available to you.
          </>
        ),
      },
    ],
  },

  {
    id: "shopping",
    title: "Products & Shopping",
    description:
      "Find help with product search, availability, details, and wishlists.",
    questions: [
      {
        question: "How can I search for a product?",
        answer:
          "Use the product search at the top of the DJADOR website to search by product, brand, or category. You can also browse the Products page.",
      },
      {
        question: "How do I know if a product is in stock?",
        answer:
          "Current product availability is shown through the product information on DJADOR. Availability can vary by product and, where applicable, by product variant.",
      },
      {
        question: "Where can I find product details?",
        answer:
          "Select a product from the store to open its product page. Available information may include the product description, price, images, availability, and product variants.",
      },
      {
        question: "How do I add a product to my wishlist?",
        answer:
          "When the wishlist option is available on a product, use the heart or wishlist control to save that product to your account.",
      },
      {
        question: "Where can I view my wishlist?",
        answer: (
          <>
            Sign in and visit{" "}
            <Link href="/account/wishlist" className={linkClass}>
              Your Wishlist
            </Link>{" "}
            to see the products you have saved.
          </>
        ),
      },
    ],
  },

  {
    id: "cart",
    title: "Cart & Checkout",
    description:
      "Get help with cart items, quantities, availability, and checkout.",
    questions: [
      {
        question: "How do I add an item to my cart?",
        answer:
          "Open the product you want to purchase, select any required product options, and use the Add to Cart button when the item is available.",
      },
      {
        question: "How can I change the quantity of an item in my cart?",
        answer: (
          <>
            Open your{" "}
            <Link href="/cart" className={linkClass}>
              Cart
            </Link>{" "}
            and use the available quantity controls. Quantities are subject to
            current product availability.
          </>
        ),
      },
      {
        question: "How do I remove an item from my cart?",
        answer:
          "Open your Cart and use the remove option for the item you no longer want to purchase.",
      },
      {
        question: "What should I do if I have a problem during checkout?",
        answer: (
          <>
            Review the information entered during checkout and confirm that the
            products in your cart are still available. If the issue continues,
            visit{" "}
            <Link href="/contact" className={linkClass}>
              Customer Service
            </Link>{" "}
            for additional help.
          </>
        ),
      },
    ],
  },
];

export default function FAQsPage() {
  const [activeSection, setActiveSection] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const selectedSection =
    faqSections.find((section) => section.id === activeSection) ??
    faqSections[0];

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return faqSections.flatMap((section) =>
      section.questions
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(normalizedQuery) ||
            section.title.toLowerCase().includes(normalizedQuery)
        )
        .map((faq, index) => ({
          ...faq,
          resultId: `${section.id}-${index}`,
          sectionTitle: section.title,
        }))
    );
  }, [normalizedQuery]);

  const handleTopicChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSearchQuery("");
    setOpenQuestion(null);
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Customer Service
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Find answers to common questions about shopping and managing your
            orders with DJADOR.
          </p>

          <div className="mt-6 flex max-w-3xl overflow-hidden border border-slate-300 bg-white">
            <div className="flex flex-1 items-center">
              <Search className="ml-4 h-[18px] w-[18px] shrink-0 text-slate-400" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setOpenQuestion(null);
                }}
                placeholder="Search FAQs"
                aria-label="Search FAQs"
                className="h-12 w-full bg-transparent px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex min-w-[105px] items-center justify-center bg-slate-950 px-6 text-sm font-semibold text-white">
              Search
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FAQ AREA */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          {/* LEFT TOPIC NAVIGATION */}
          <aside>
            <h2 className="border-b border-slate-300 pb-3 text-sm font-semibold text-slate-950">
              Help topics
            </h2>

            <nav className="mt-1" aria-label="FAQ topics">
              {faqSections.map((section) => {
                const active =
                  !isSearching && activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleTopicChange(section.id)}
                    className={`block w-full border-b border-slate-200 py-3.5 text-left text-sm transition-colors ${
                      active
                        ? "font-semibold text-slate-950"
                        : "font-medium text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {section.title}

                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-slate-200 pt-5">
              <p className="text-sm font-semibold text-slate-950">
                Need more help?
              </p>

              <Link
                href="/contact"
                className="mt-2 inline-block text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
              >
                Contact Customer Service
              </Link>
            </div>
          </aside>

          {/* FAQ CONTENT */}
          <div className="min-w-0">
            {isSearching ? (
              <>
                <div className="border-b border-slate-300 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Search results
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Results for &ldquo;{searchQuery.trim()}&rdquo;
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {searchResults.length}{" "}
                    {searchResults.length === 1 ? "result" : "results"} found
                  </p>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-12">
                    <h3 className="text-base font-semibold text-slate-950">
                      No matching questions found
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Try another search term or choose a help topic from the
                      menu.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setOpenQuestion(null);
                      }}
                      className="mt-5 text-sm font-semibold text-slate-950 underline underline-offset-4"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div>
                    {searchResults.map((faq) => {
                      const questionId = `search-${faq.resultId}`;
                      const isOpen = openQuestion === questionId;

                      return (
                        <div
                          key={questionId}
                          className="border-b border-slate-200"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenQuestion(isOpen ? null : questionId)
                            }
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-8 py-5 text-left"
                          >
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                {faq.sectionTitle}
                              </p>

                              <p className="mt-1 text-sm font-semibold leading-6 text-slate-950">
                                {faq.question}
                              </p>
                            </div>

                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-slate-600">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* SELECTED CATEGORY */}
                <div className="border-b border-slate-300 pb-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {selectedSection.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedSection.description}
                  </p>
                </div>

                {/* QUESTIONS */}
                <div>
                  {selectedSection.questions.map((faq, index) => {
                    const questionId = `${selectedSection.id}-${index}`;
                    const isOpen = openQuestion === questionId;

                    return (
                      <div
                        key={questionId}
                        className="border-b border-slate-200"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQuestion(isOpen ? null : questionId)
                          }
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-8 py-5 text-left"
                        >
                          <span className="text-sm font-semibold leading-6 text-slate-950">
                            {faq.question}
                          </span>

                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-slate-600">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CUSTOMER SERVICE STRIP */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Didn&apos;t find what you were looking for?
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visit the Help Center or contact DJADOR Customer Service.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/account/help"
                className="text-sm font-semibold text-slate-950 hover:underline"
              >
                Help Center
              </Link>

              <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-slate-300 sm:block"
              />

              <Link
                href="/account/orders"
                className="text-sm font-semibold text-slate-950 hover:underline"
              >
                My Orders
              </Link>

              <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-slate-300 sm:block"
              />

              <Link
                href="/contact"
                className="text-sm font-semibold text-slate-950 hover:underline"
              >
                Contact Customer Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}