import Link from "next/link";
import {
  BadgePercent,
  BriefcaseBusiness,
  Home,
  PackagePlus,
  Shirt,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Store,
  UserRound,
  UsersRound,
  Utensils,
} from "lucide-react";
import FeaturedProducts from "../components/home/featured-products";
import PromoGrid from "../components/home/promo-grid";

const categories = [
  { name: "For You", href: "/products", icon: Store },
  { name: "Women", href: "/fashion-finds?subcategory=women", icon: UserRound },
  { name: "Men", href: "/fashion-finds?subcategory=men", icon: UsersRound },
  { name: "Beauty", href: "/beauty-and-hair-care", icon: Sparkles },
  { name: "Hair Care", href: "/beauty-and-hair-care", icon: SprayCan },
  { name: "Shoes", href: "/fashion-finds?subcategory=shoes", icon: Shirt },
  { name: "Bags", href: "/fashion-finds?subcategory=accessories", icon: ShoppingBag },
  { name: "Food & Grocery", href: "/food-and-grocery", icon: Utensils },
  { name: "Home Essentials", href: "/home-essentials", icon: Home },
  { name: "Deals", href: "/products", icon: BadgePercent },
  { name: "New Arrivals", href: "/products", icon: PackagePlus },
  { name: "Accessories", href: "/fashion-finds?subcategory=accessories", icon: BriefcaseBusiness },
];

export default function HomePage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-4 overflow-x-auto rounded-xl bg-white px-4 py-3 shadow-sm">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <PromoGrid />

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Trending Products
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-blue-600"
            >
              View All
            </Link>
          </div>
          <FeaturedProducts />
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Women&apos;s Collection
          </h2>
          <FeaturedProducts />
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Men&apos;s Collection
          </h2>
          <FeaturedProducts />
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Beauty & Hair Care
          </h2>
          <FeaturedProducts />
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Food & Grocery
          </h2>
          <FeaturedProducts />
        </section>
      </section>
    </main>
  );
}