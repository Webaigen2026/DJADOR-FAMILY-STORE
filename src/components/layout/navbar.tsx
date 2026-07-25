"use client";

import Link from "next/link";
import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Heart,
  Home,
  LayoutGrid,
  LocateFixed,
  LogOut,
  MapPin,
  Menu,
  Package,
  RotateCcw,
  Search,
  ShoppingCart,
  User,
  X,
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

const DELIVERY_STORAGE_KEY = "djador-delivery-location";
const DEFAULT_DELIVERY_LABEL = "Choose location";

type NavbarProps = {
  cartCount?: number;
  notificationCount?: number;
  wishlistCount?: number;
};

type IconComponent = ComponentType<{ className?: string }>;

export default function Navbar({
  cartCount = 0,
  notificationCount = 0,
  wishlistCount = 0,
}: NavbarProps) {
  const { data: session } = useSession();

  const [accountOpen, setAccountOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [deliveryLabel, setDeliveryLabel] = useState(
    DEFAULT_DELIVERY_LABEL,
  );
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    session?.user?.name?.trim().split(/\s+/)[0] ||
    session?.user?.email ||
    "Sign in";

  useEffect(() => {
    const savedLocation = window.localStorage.getItem(DELIVERY_STORAGE_KEY);

    if (!savedLocation) return;

    setDeliveryLabel(savedLocation);

    const savedZip = savedLocation.match(/\b\d{5}(?:-\d{4})?\b/)?.[0];
    if (savedZip) {
      setZipCode(savedZip);
    }
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }

      if (locationRef.current && !locationRef.current.contains(target)) {
        setLocationOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setAccountOpen(false);
      setLocationOpen(false);
      setLocationModalOpen(false);
      setMobileMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const shouldLockScroll = mobileMenuOpen || locationModalOpen;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen, locationModalOpen]);

  useEffect(() => {
    if (!locationModalOpen) return;

    const timer = window.setTimeout(() => {
      locationInputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [locationModalOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function closeDesktopMenus() {
    setAccountOpen(false);
    setLocationOpen(false);
  }

  function openLocationModal() {
    setLocationOpen(false);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setLocationError("");
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    setLocationError("");
    setLocating(false);
  }

  function saveZipCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedZip = zipCode.trim();

    if (!/^\d{5}(?:-\d{4})?$/.test(normalizedZip)) {
      setLocationError("Enter a valid 5-digit ZIP code.");
      return;
    }

    const label = `ZIP ${normalizedZip}`;

    window.localStorage.setItem(DELIVERY_STORAGE_KEY, label);
    setDeliveryLabel(label);
    setLocationError("");
    setLocationModalOpen(false);
  }

  function clearSavedLocation() {
    window.localStorage.removeItem(DELIVERY_STORAGE_KEY);
    setDeliveryLabel(DEFAULT_DELIVERY_LABEL);
    setZipCode("");
    setLocationError("");
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by this browser.",
      );
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      () => {
        const label = "Current location";

        window.localStorage.setItem(DELIVERY_STORAGE_KEY, label);
        setDeliveryLabel(label);
        setLocationModalOpen(false);
        setLocating(false);
      },
      (error) => {
        let message =
          "We could not access your location. Enter a ZIP code instead.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location access was denied. Allow location access or enter a ZIP code.";
        }

        if (error.code === error.TIMEOUT) {
          message =
            "Location request timed out. Try again or enter a ZIP code.";
        }

        setLocationError(message);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 10000,
      },
    );
  }

  const iconActionClass =
    "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-transparent text-slate-700 transition duration-200 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_14px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:gap-5 xl:px-8">
          <Link
            href="/"
            aria-label="DJADOR Family Store home"
            className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <span className="block text-[24px] font-black leading-none tracking-[-0.05em] text-slate-950 sm:text-[27px]">
              DJADOR
            </span>
            <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 sm:block">
              Family Store
            </span>
          </Link>

          <form
            action="/products"
            method="GET"
            className="relative hidden min-w-0 flex-1 lg:block"
            role="search"
          >
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands and categories"
              autoComplete="off"
              aria-label="Search products"
              className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-14 text-[15px] text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <nav
            className="ml-auto hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            <div ref={locationRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setLocationOpen((current) => !current);
                  setAccountOpen(false);
                }}
                aria-expanded={locationOpen}
                aria-haspopup="menu"
                className="flex h-12 items-center gap-2 rounded-xl px-3 text-left text-slate-700 transition duration-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                <MapPin className="h-5 w-5 shrink-0" />

                <span className="min-w-0">
                  <span className="block text-[11px] font-medium leading-none text-slate-500">
                    Deliver to
                  </span>
                  <span className="mt-1 block max-w-[130px] truncate text-sm font-extrabold leading-none">
                    {deliveryLabel}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    locationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {locationOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 w-80 pt-3"
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-100 p-2.5 text-slate-800">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-950">
                          Delivery location
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          See accurate availability and delivery estimates.
                        </p>
                      </div>
                    </div>

                    {deliveryLabel !== DEFAULT_DELIVERY_LABEL && (
                      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          Currently selected
                        </p>
                        <p className="mt-1 truncate text-sm font-extrabold text-emerald-950">
                          {deliveryLabel}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openLocationModal}
                      className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                    >
                      {deliveryLabel === DEFAULT_DELIVERY_LABEL
                        ? "Choose delivery location"
                        : "Update delivery location"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setAccountOpen((current) => !current);
                  setLocationOpen(false);
                }}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex h-12 items-center gap-2 rounded-xl px-3 text-left text-slate-700 transition duration-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                <User className="h-5 w-5 shrink-0" />

                <span className="min-w-0">
                  <span className="block text-[11px] font-medium leading-none text-slate-500">
                    {session?.user ? "Hello" : "Welcome"}
                  </span>
                  <span className="mt-1 block max-w-[115px] truncate text-sm font-extrabold leading-none">
                    {displayName}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 w-[340px] pt-3"
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                    <div className="border-b border-slate-100 bg-slate-50/80 p-5">
                      {session?.user ? (
                        <>
                          <p className="truncate text-base font-black text-slate-950">
                            {session.user.name || "Your account"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {session.user.email}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-black text-slate-950">
                            Welcome to DJADOR
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Sign in for faster checkout, saved items and order
                            tracking.
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                              href="/login"
                              onClick={closeDesktopMenus}
                              className="rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                              Sign in
                            </Link>

                            <Link
                              href="/register"
                              onClick={closeDesktopMenus}
                              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                            >
                              Register
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-3">
                      <SectionLabel>Your account</SectionLabel>

                      <AccountLink
                        href="/profile"
                        icon={User}
                        label="My profile"
                        onClick={closeDesktopMenus}
                      />
                      <AccountLink
                        href="/orders"
                        icon={Package}
                        label="My orders"
                        onClick={closeDesktopMenus}
                      />
                      <AccountLink
                        href="/wishlist"
                        icon={Heart}
                        label="Wishlist"
                        badge={wishlistCount}
                        onClick={closeDesktopMenus}
                      />
                      <AccountLink
                        href="/notifications"
                        icon={Bell}
                        label="Notifications"
                        badge={notificationCount}
                        onClick={closeDesktopMenus}
                      />

                      <button
                        type="button"
                        onClick={openLocationModal}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        <MapPin className="h-[18px] w-[18px]" />
                        <span className="flex-1">Saved addresses</span>
                      </button>

                      <div className="my-3 border-t border-slate-100" />

                      <SectionLabel>Customer care</SectionLabel>

                      <AccountLink
                        href="/support"
                        icon={CircleHelp}
                        label="Help center"
                        onClick={closeDesktopMenus}
                      />
                      <AccountLink
                        href="/returns"
                        icon={RotateCcw}
                        label="Returns & refunds"
                        onClick={closeDesktopMenus}
                      />

                      {session?.user && (
                        <>
                          <div className="my-3 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() =>
                              signOut({ callbackUrl: "/login" })
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                          >
                            <LogOut className="h-[18px] w-[18px]" />
                            Sign out
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <HeaderIconLink
              href="/wishlist"
              label="Wishlist"
              count={wishlistCount}
              className={iconActionClass}
            >
              <Heart className="h-5 w-5" />
            </HeaderIconLink>

            <HeaderIconLink
              href="/notifications"
              label="Notifications"
              count={notificationCount}
              className={iconActionClass}
            >
              <Bell className="h-5 w-5" />
            </HeaderIconLink>

            <Link
              href="/cart"
              aria-label={`Cart${
                cartCount ? `, ${cartCount} items` : ""
              }`}
              className="relative ml-1 flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-extrabold text-slate-800 transition duration-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <CountBadge count={cartCount} />}
              </span>
              <span>Cart</span>
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Link
              href="/wishlist"
              aria-label={`Wishlist${
                wishlistCount ? `, ${wishlistCount} items` : ""
              }`}
              className={iconActionClass}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <CountBadge count={wishlistCount} />
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart${
                cartCount ? `, ${cartCount} items` : ""
              }`}
              className={iconActionClass}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <CountBadge count={cartCount} />}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={iconActionClass}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 lg:hidden sm:px-6">
          <form
            action="/products"
            method="GET"
            className="relative"
            role="search"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands and categories"
              aria-label="Search products"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-11 text-sm outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="relative flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="border-b border-slate-800 bg-slate-950 px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <Link href="/" onClick={closeMobileMenu}>
                  <p className="text-xl font-black tracking-[-0.04em]">
                    DJADOR
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
                    Family Store
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="rounded-full p-2 text-white transition hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-slate-300">
                  {session?.user ? "Signed in as" : "Welcome to DJADOR"}
                </p>
                <p className="mt-1 truncate text-sm font-bold">
                  {session?.user?.name ||
                    session?.user?.email ||
                    "Sign in to access your account"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <MobileMenuLink
                href="/"
                icon={Home}
                label="Home"
                onClick={closeMobileMenu}
              />
              <MobileMenuLink
                href="/products"
                icon={LayoutGrid}
                label="Shop all products"
                onClick={closeMobileMenu}
              />

              <button
                type="button"
                onClick={openLocationModal}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <MapPin className="h-5 w-5 text-slate-500" />
                <span className="min-w-0 flex-1">
                  <span className="block">Delivery location</span>
                  <span className="mt-0.5 block truncate text-xs font-normal text-slate-500">
                    {deliveryLabel}
                  </span>
                </span>
              </button>

              <MenuDivider />
              <SectionLabel>Your shopping</SectionLabel>

              <MobileMenuLink
                href="/profile"
                icon={User}
                label="My profile"
                onClick={closeMobileMenu}
              />
              <MobileMenuLink
                href="/orders"
                icon={Package}
                label="My orders"
                onClick={closeMobileMenu}
              />
              <MobileMenuLink
                href="/wishlist"
                icon={Heart}
                label="Wishlist"
                onClick={closeMobileMenu}
                badge={wishlistCount}
              />
              <MobileMenuLink
                href="/notifications"
                icon={Bell}
                label="Notifications"
                onClick={closeMobileMenu}
                badge={notificationCount}
              />
              <MobileMenuLink
                href="/cart"
                icon={ShoppingCart}
                label="Cart"
                onClick={closeMobileMenu}
                badge={cartCount}
              />

              <MenuDivider />
              <SectionLabel>Categories</SectionLabel>

              <div className="grid grid-cols-2 gap-2 px-1">
                {categoryLinks.map((category) => (
                  <Link
                    key={category.label}
                    href={category.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

              <MenuDivider />
              <SectionLabel>Customer care</SectionLabel>

              <MobileMenuLink
                href="/support"
                icon={CircleHelp}
                label="Help center"
                onClick={closeMobileMenu}
              />
              <MobileMenuLink
                href="/returns"
                icon={RotateCcw}
                label="Returns & refunds"
                onClick={closeMobileMenu}
              />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              {session?.user ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-slate-50"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {locationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close delivery location panel"
            onClick={closeLocationModal}
            className="absolute inset-0 cursor-default"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-location-title"
            className="relative h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Delivery preferences
                </p>

                <h2
                  id="delivery-location-title"
                  className="mt-2 text-2xl font-black tracking-tight text-slate-950"
                >
                  Select your delivery location
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add a ZIP code so we can show accurate availability and
                  delivery estimates.
                </p>
              </div>

              <button
                type="button"
                onClick={closeLocationModal}
                className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close location panel"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={saveZipCode} className="mt-8">
              <label
                htmlFor="delivery-zip"
                className="text-sm font-bold text-slate-900"
              >
                ZIP code
              </label>

              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  ref={locationInputRef}
                  id="delivery-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={zipCode}
                  onChange={(event) => {
                    setZipCode(event.target.value);
                    setLocationError("");
                  }}
                  placeholder="Enter ZIP code"
                  maxLength={10}
                  className="h-14 w-full rounded-2xl border border-slate-300 pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                />
              </div>

              {locationError && (
                <p
                  role="alert"
                  className="mt-3 text-sm font-medium text-rose-600"
                >
                  {locationError}
                </p>
              )}

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Save delivery location
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LocateFixed
                className={`h-5 w-5 ${locating ? "animate-pulse" : ""}`}
              />
              {locating ? "Finding your location..." : "Use my current location"}
            </button>

            {deliveryLabel !== DEFAULT_DELIVERY_LABEL && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Current delivery location
                </p>
                <p className="mt-1 text-sm font-extrabold text-emerald-950">
                  {deliveryLabel}
                </p>

                <button
                  type="button"
                  onClick={clearSavedLocation}
                  className="mt-3 text-sm font-bold text-emerald-800 underline underline-offset-4 transition hover:text-emerald-950"
                >
                  Remove saved location
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
      {children}
    </p>
  );
}

function MenuDivider() {
  return <div className="my-5 border-t border-slate-200" />;
}

function AccountLink({
  href,
  icon: Icon,
  label,
  badge = 0,
  onClick,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
    >
      <Icon className="h-[18px] w-[18px]" />
      <span className="flex-1">{label}</span>

      {badge > 0 && (
        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[10px] font-black text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

function HeaderIconLink({
  href,
  label,
  count,
  className,
  children,
}: {
  href: string;
  label: string;
  count: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}${count ? `, ${count}` : ""}`}
      title={label}
      className={className}
    >
      {children}

      {count > 0 && <CountBadge count={count} />}

      <span className="pointer-events-none absolute top-[calc(100%+8px)] z-50 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function MobileMenuLink({
  href,
  icon: Icon,
  label,
  onClick,
  badge = 0,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
    >
      <Icon className="h-5 w-5 text-slate-500" />
      <span className="flex-1">{label}</span>

      {badge > 0 && (
        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-[10px] font-black text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}