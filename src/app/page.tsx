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
import { prisma } from "../lib/prisma";

const categories = [
  { name: "For You", href: "/products", icon: Store },
  { name: "Women", href: "/products?category=women", icon: UserRound },
  { name: "Men", href: "/products?category=men", icon: UsersRound },
  { name: "Beauty", href: "/products?category=beauty", icon: Sparkles },
  { name: "Hair Care", href: "/products?category=hair-care", icon: SprayCan },
  { name: "Shoes", href: "/products?category=shoes", icon: Shirt },
  { name: "Bags", href: "/products?category=bags", icon: ShoppingBag },
  {
    name: "Food & Grocery",
    href: "/products?category=food-grocery",
    icon: Utensils,
  },
  {
    name: "Home Essentials",
    href: "/products?category=home-essentials",
    icon: Home,
  },
  { name: "Deals", href: "/products", icon: BadgePercent },
  { name: "New Arrivals", href: "/products", icon: PackagePlus },
];

const sections = [
  {
    title: "Best Value Deals on Fashion",
    color: "from-orange-500 to-amber-400",
    href: "/products?category=women",
    items: [
      {
        name: "Women’s Collection",
        offer: "Special offer",
        category: "women",
        href: "/products?category=women",
      },
      {
        name: "Men’s Collection",
        offer: "Top deals",
        category: "men",
        href: "/products?category=men",
      },
      {
        name: "Shoes",
        offer: "Min. 30% Off",
        category: "shoes",
        href: "/products?category=shoes",
      },
      {
        name: "Bags",
        offer: "Best picks",
        category: "bags",
        href: "/products?category=bags",
      },
    ],
  },
  {
    title: "Beauty & Hair Care",
    color: "from-pink-500 to-rose-400",
    href: "/products?category=hair-care",
    items: [
      {
        name: "Hair Care",
        offer: "Best sellers",
        category: "hair-care",
        href: "/products?category=hair-care",
      },
      {
        name: "Beauty",
        offer: "Top brands",
        category: "beauty",
        href: "/products?category=beauty",
      },
      {
        name: "Wigs",
        offer: "New arrivals",
        category: "wigs",
        href: "/products?category=hair-care",
      },
      {
        name: "Personal Care",
        offer: "Special offer",
        category: "personal-care",
        href: "/products?category=beauty",
      },
    ],
  },
  {
    title: "Everyday Essentials",
    color: "from-emerald-600 to-green-400",
    href: "/products?category=food-grocery",
    items: [
      {
        name: "Food & Grocery",
        offer: "Fresh deals",
        category: "food-grocery",
        href: "/products?category=food-grocery",
      },
      {
        name: "Home Essentials",
        offer: "Top sellers",
        category: "home-essentials",
        href: "/products?category=home-essentials",
      },
      {
        name: "Kitchen Essentials",
        offer: "Don’t miss",
        category: "kitchen",
        href: "/products?category=home-essentials",
      },
      {
        name: "Daily Needs",
        offer: "Big savings",
        category: "daily-needs",
        href: "/products?category=food-grocery",
      },
    ],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

async function getPreviewImages() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      name: true,
      category: true,
      imageUrl: true,
    },
  });

  const previews: Record<string, string> = {};

  for (const product of products) {
    const category = product.category?.toLowerCase().trim() || "";
    const name = product.name?.toLowerCase().trim() || "";
    const image = product.imageUrl || "";

    if (!image) continue;

    if (
      (category.includes("women") || name.includes("women")) &&
      !previews["women"]
    )
      previews["women"] = image;

    if (
      (category.includes("men") || name.includes("men")) &&
      !previews["men"]
    )
      previews["men"] = image;

    if (
      (category.includes("shoe") || name.includes("shoe")) &&
      !previews["shoes"]
    )
      previews["shoes"] = image;

    if (
      (category.includes("bag") || name.includes("bag")) &&
      !previews["bags"]
    )
      previews["bags"] = image;

    if (
      (category.includes("beauty") || name.includes("beauty")) &&
      !previews["beauty"]
    )
      previews["beauty"] = image;

    if (
      (category.includes("hair") || name.includes("hair")) &&
      !previews["hair-care"]
    )
      previews["hair-care"] = image;

    if (
      (category.includes("wig") || name.includes("wig")) &&
      !previews["wigs"]
    )
      previews["wigs"] = image;

    if (
      (category.includes("grocery") || category.includes("food")) &&
      !previews["food-grocery"]
    )
      previews["food-grocery"] = image;

    if (
      (category.includes("home") || name.includes("home")) &&
      !previews["home-essentials"]
    )
      previews["home-essentials"] = image;

    if (
      (category.includes("kitchen") || name.includes("kitchen")) &&
      !previews["kitchen"]
    )
      previews["kitchen"] = image;
  }

  return previews;
}

function HomeSection({
  section,
  previews,
}: {
  section: any;
  previews: Record<string, string>;
}) {
  return (
    <section
      className={`mt-6 rounded-2xl bg-gradient-to-r ${section.color} p-4 shadow-sm`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">{section.title}</h2>

        <Link
          href={section.href}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow hover:bg-slate-100"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item: any) => {
          const image = previews[item.category];

          return (
            <Link
              key={item.name}
              href={item.href}
              className="group overflow-hidden rounded-lg bg-white transition hover:shadow-md"
            >
              <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg bg-[#f1f3f6]">
                {image ? (
                  <img
                    src={image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-400">
                    {item.name}
                  </span>
                )}
              </div>

              <div className="px-1 pt-2">
                <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-0.5 text-[15px] font-black text-slate-950">
                  {item.offer}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ProductGrid({
  products,
  title,
}: {
  products: any[];
  title?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>

          <Link
            href="/products"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#f1f3f6]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  {product.name}
                </span>
              )}
            </div>

            <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900">
              {product.name}
            </h3>

            <p className="mt-1 text-sm font-black text-slate-950">
              {formatPrice(product.price)}
            </p>

            <p className="mt-1 text-xs font-semibold text-blue-600">
              Special offer + more
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const previews = await getPreviewImages();

  const latestProducts = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 24,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
    },
  });

  const firstFourProducts = latestProducts.slice(0, 4);
  const secondFourProducts = latestProducts.slice(4, 8);
  const remainingProducts = latestProducts.slice(8);

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

        <HomeSection section={sections[0]} previews={previews} />

        <ProductGrid products={firstFourProducts} />

        <HomeSection section={sections[1]} previews={previews} />

        <ProductGrid products={secondFourProducts} />

        <HomeSection section={sections[2]} previews={previews} />

        <ProductGrid products={remainingProducts} title="Recommended For You" />
      </section>
    </main>
  );
}