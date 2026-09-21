"use client";

import Link from "next/link";
import { openCookiePreferences } from "../../lib/cookie-consent";

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Cart", href: "/cart" },
  { label: "Your Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
];

const supportLinks = [
  { label: "Help Center", href: "/account/help" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Information", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/account/returns" },
  { label: "Contact Support", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const footerSections = [
  {
    title: "About",
    links: aboutLinks,
  },
  {
    title: "Shop",
    links: shopLinks,
  },
  {
    title: "Customer Service",
    links: supportLinks,
  },
  {
    title: "Policies",
    links: policyLinks,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block text-xl font-bold tracking-tight text-white"
            >
              DJADOR FAMILY STORE
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Shop fashion, beauty, home essentials, and everyday products
              through a simple and reliable shopping experience.
            </p>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer Support
              </p>

              <Link
                href="/contact"
                className="mt-2 inline-block text-sm font-medium text-slate-200 transition-colors hover:text-white"
              >
                Get help with your order
              </Link>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {section.title}
                </h3>

                <nav
                  className="mt-5 space-y-3"
                  aria-label={`${section.title} footer navigation`}
                >
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm leading-6 text-slate-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-slate-800 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              © 2026 DJADOR FAMILY STORE. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/privacy"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/refund-policy"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Refunds
              </Link>

              <button
                type="button"
                onClick={openCookiePreferences}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}