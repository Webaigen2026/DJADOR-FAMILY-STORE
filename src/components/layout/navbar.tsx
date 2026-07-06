"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  User,
  ChevronDown,
  Bell,
  Gift,
  Headphones,
  Store,
  Package,
  Heart,
  MapPinned,
  X,
  Menu,
  Home,
  LayoutGrid,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const categoryLinks = [
  { label: "Electronics", href: "/products?category=electronics" },
  { label: "Fashion", href: "/products?category=fashion" },
  { label: "Mobiles", href: "/products?category=mobiles" },
  { label: "Beauty", href: "/products?category=beauty" },
  { label: "Home", href: "/products?category=home" },
  { label: "Appliances", href: "/products?category=appliances" },
];

export default function Navbar() {
  const { data: session } = useSession();

  const [loginOpen, setLoginOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const userLabel = session?.user?.name || session?.user?.email || "Login";

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-extrabold tracking-tight text-slate-900 md:text-2xl"
          >
            <span className="md:hidden">DJADOR</span>
            <span className="hidden md:inline">DJADOR FAMILY STORE</span>
          </Link>

          <div className="hidden flex-1 lg:block">
            <form
              action="/products"
              method="GET"
              className="relative mx-auto max-w-2xl"
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more"
                className="h-11 w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </form>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {locationOpen && (
                <div className="absolute left-0 top-full w-72 pt-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                    <p className="text-sm font-semibold text-slate-900">
                      Choose your location
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Enter your delivery location to check availability.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationOpen(false);
                        setLocationModalOpen(true);
                      }}
                      className="mt-4 block w-full rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Add Location
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setLoginOpen(true)}
              onMouseLeave={() => setLoginOpen(false)}
            >
              <button className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{userLabel}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {loginOpen && (
                <div className="absolute right-0 top-full w-72 pt-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    {!session?.user ? (
                      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-sm text-slate-600">
                          New customer?
                        </span>
                        <Link
                          href="/register"
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Sign Up
                        </Link>
                      </div>
                    ) : null}

                    <div className="space-y-1">
                      <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link href="/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>

                      <Link href="/wishlist" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>

                      <Link href="/cart" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </Link>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      {session?.user ? (
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                        >
                          Logout
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          className="block w-full rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full w-64 pt-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    <div className="space-y-1">
                      <Link href="/seller" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Store className="h-4 w-4" />
                        Become a Seller
                      </Link>

                      <Link href="/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Link>

                      <Link href="/gift-cards" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Gift className="h-4 w-4" />
                        Gift Cards
                      </Link>

                      <Link href="/support" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Headphones className="h-4 w-4" />
                        24x7 Support
                      </Link>

                      <Link href="/delivery-location" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <MapPinned className="h-4 w-4" />
                        Delivery Location
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium text-slate-800"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/cart"
              className="rounded-full border border-slate-200 p-2 text-slate-800"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full border border-slate-200 p-2 text-slate-800"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 lg:hidden">
          <form action="/products" method="GET" className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="h-11 w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-slate-900"
            />
          </form>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/40"
          />

          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  DJADOR
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Family Store
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-2">
                <Link onClick={closeMobileMenu} href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Home className="h-5 w-5" />
                  Home
                </Link>

                <Link onClick={closeMobileMenu} href="/products" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <LayoutGrid className="h-5 w-5" />
                  Shop All Products
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    setLocationModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <MapPin className="h-5 w-5" />
                  Set Delivery Location
                </button>

                <Link onClick={closeMobileMenu} href="/cart" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                </Link>

                <Link onClick={closeMobileMenu} href="/orders" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Package className="h-5 w-5" />
                  Orders
                </Link>

                <Link onClick={closeMobileMenu} href="/wishlist" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Categories
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {categoryLinks.map((category) => (
                    <Link
                      key={category.label}
                      href={category.href}
                      onClick={closeMobileMenu}
                      className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-50"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                {session?.user ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-700"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {locationModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/40">
          <div className="ml-auto h-full w-full max-w-xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Select delivery address
              </h2>

              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by area, street name, ZIP code"
                className="h-14 w-full rounded-2xl border border-slate-300 pl-12 pr-4 text-base outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Use current location
            </button>
          </div>
        </div>
      )}
    </>
  );
}