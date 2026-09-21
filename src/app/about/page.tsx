import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Package,
  Search,
  Headphones,
} from "lucide-react";

const categories = [
  {
    title: "Fashion",
    description: "Clothing & accessories",
    image: "/images/fashion/promo-fashion.png",
    href: "/products?category=Fashion",
  },
  {
    title: "Beauty",
    description: "Beauty & personal care",
    image: "/images/beauty-hair/promo-beauty-care.png",
    href: "/products?category=Beauty",
  },
  {
    title: "Home",
    description: "Products for your space",
    image: "/images/home-essentials/promo-home.png",
    href: "/products?category=Home",
  },
  {
    title: "Food & Everyday",
    description: "Everyday essentials",
    image: "/images/food/promo-pantry.png",
    href: "/products?category=Food",
  },
];

const shoppingFeatures = [
  {
    title: "Browse",
    description: "Explore products across our everyday categories.",
    icon: Search,
    href: "/products",
  },
  {
    title: "Save",
    description: "Keep the products you like in your wishlist.",
    icon: Heart,
    href: "/account/wishlist",
  },
  {
    title: "Manage",
    description: "Track your orders, delivery progress, addresses, and returns.",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Get support",
    description: "Find help with orders, returns, and shopping questions.",
    icon: Headphones,
    href: "/account/help",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-950">
      {/* HERO */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                About DJADOR Family Store
              </p>

              <h1 className="max-w-[650px] text-[38px] font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[44px] lg:text-[48px]">
                Shopping for everyday life, all in one place.
              </h1>
            </div>

            <div className="max-w-[570px] lg:justify-self-end">
              <p className="text-[16px] leading-8 text-slate-600">
                DJADOR FAMILY STORE brings together fashion, beauty, home,
                food, and everyday products in one convenient online shopping
                experience.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 border-b border-slate-950 pb-1 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-60"
              >
                Explore our products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-28">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Our Story
              </p>

              <h2 className="max-w-[470px] text-[28px] font-bold leading-[1.2] tracking-[-0.025em] text-slate-950 sm:text-[30px] lg:text-[32px]">
                A straightforward way to shop across categories.
              </h2>
            </div>

            <div className="max-w-[620px] space-y-5 text-[16px] leading-7 text-slate-600">
              <p>
                DJADOR FAMILY STORE was created to bring a broad mix of
                products into one accessible online store.
              </p>

              <p>
                From fashion and beauty to home products, food, and everyday
                essentials, our goal is simple: make it easier to find what you
                need without moving between multiple shopping experiences.
              </p>

              <p>
                As our product selection grows, we remain focused on keeping
                shopping clear, useful, and easy to manage — from browsing
                products to tracking orders and getting support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mb-9 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                What you&apos;ll find
              </p>

              <h2 className="text-[28px] font-bold tracking-[-0.025em] text-slate-950 sm:text-[30px]">
                Shop across everyday categories.
              </h2>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-60 sm:inline-flex"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-5">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-[17px] font-semibold text-slate-950 transition-colors group-hover:text-slate-600">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 sm:hidden"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* SHOPPING EXPERIENCE */}
      <section>
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-28">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Shopping with DJADOR
              </p>

              <h2 className="max-w-[400px] text-[28px] font-bold leading-[1.2] tracking-[-0.025em] text-slate-950 sm:text-[30px]">
                Simple from browsing to support.
              </h2>

              <p className="mt-5 max-w-[430px] text-[15px] leading-7 text-slate-600">
                Find products, save favorites, manage orders, and get help
                without making shopping more complicated than it needs to be.
              </p>
            </div>

            <div className="border-t border-slate-200">
              {shoppingFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group grid gap-4 border-b border-slate-200 py-6 transition-colors hover:bg-slate-50 sm:grid-cols-[44px_150px_1fr_24px] sm:items-center sm:px-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </div>

                    <h3 className="text-[16px] font-semibold text-slate-950">
                      {feature.title}
                    </h3>

                    <p className="text-[15px] leading-6 text-slate-600">
                      {feature.description}
                    </p>

                    <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-950" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}