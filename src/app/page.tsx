import Link from "next/link";
import {
  BadgePercent,
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
  ArrowRight,
} from "lucide-react";
import PromoGrid from "../components/home/promo-grid";

const categories = [
  { name: "For You", href: "/products", icon: Store },
  { name: "Women", href: "/products?category=women", icon: UserRound },
  { name: "Men", href: "/products?category=men", icon: UsersRound },
  { name: "Beauty", href: "/products?category=beauty", icon: Sparkles },
  { name: "Hair Care", href: "/products?category=hair-care", icon: SprayCan },
  { name: "Shoes", href: "/products?category=shoes", icon: Shirt },
  { name: "Bags", href: "/products?category=bags", icon: ShoppingBag },
  { name: "Food & Grocery", href: "/products?category=food-grocery", icon: Utensils },
  { name: "Home Essentials", href: "/products?category=home-essentials", icon: Home },
  { name: "Deals", href: "/products", icon: BadgePercent },
  { name: "New Arrivals", href: "/products", icon: PackagePlus },
];

const sections = [
  {
    title: "Best Value Deals on Fashion",
    color: "from-orange-500 to-amber-400",
    items: [
      { name: "Women’s Collection", offer: "Special offer", href: "/products?category=women", icon: UserRound },
      { name: "Men’s Collection", offer: "Top deals", href: "/products?category=men", icon: UsersRound },
      { name: "Shoes", offer: "Min. 30% Off", href: "/products?category=shoes", icon: Shirt },
      { name: "Bags", offer: "Best picks", href: "/products?category=bags", icon: ShoppingBag },
    ],
  },
  {
    title: "Beauty & Hair Care",
    color: "from-pink-500 to-rose-400",
    items: [
      { name: "Hair Care", offer: "Best sellers", href: "/products?category=hair-care", icon: SprayCan },
      { name: "Beauty", offer: "Top brands", href: "/products?category=beauty", icon: Sparkles },
      { name: "Wigs", offer: "New arrivals", href: "/products?category=hair-care", icon: UserRound },
      { name: "Personal Care", offer: "Special offer", href: "/products?category=beauty", icon: Sparkles },
    ],
  },
  {
    title: "Everyday Essentials",
    color: "from-emerald-600 to-green-400",
    items: [
      { name: "Food & Grocery", offer: "Fresh deals", href: "/products?category=food-grocery", icon: Utensils },
      { name: "Home Essentials", offer: "Top sellers", href: "/products?category=home-essentials", icon: Home },
      { name: "Kitchen Essentials", offer: "Don’t miss", href: "/products?category=home-essentials", icon: Store },
      { name: "Daily Needs", offer: "Big savings", href: "/products?category=food-grocery", icon: PackagePlus },
    ],
  },
];

function HomeSection({ section }: { section: any }) {
  return (
    <section className={`mt-6 rounded-3xl bg-gradient-to-r ${section.color} p-4 shadow-sm`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">{section.title}</h2>

        <Link
          href="/products"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow hover:bg-slate-100"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item: any) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                <Icon className="h-16 w-16 text-slate-500 transition group-hover:scale-110" />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                {item.name}
              </h3>

              <p className="mt-1 text-sm font-bold text-green-600">
                {item.offer}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Explore collection
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-4 overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <PromoGrid />

        {sections.map((section) => (
          <HomeSection key={section.title} section={section} />
        ))}
      </section>
    </main>
  );
}