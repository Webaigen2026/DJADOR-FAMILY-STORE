import Link from "next/link";
import ProductGrid from "../../components/products/product-grid";
import { prisma } from "../../lib/prisma";
import { getCategoryLabel } from "../../lib/store-categories";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category?: string | null;
  imageUrl?: string | null;
  image?: string | null;
};

async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function toCategorySlug(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sectionCategories: Record<string, string[]> = {
  fashion: ["women", "men", "shoes", "bags"],

  "beauty-care": [
    "beauty",
    "hair-care",
    "wigs",
    "personal-care",
  ],

  "everyday-essentials": [
    "food-grocery",
    "home-essentials",
    "kitchen",
    "cleaning",
  ],
};

const sectionTitles: Record<string, string> = {
  discover: "Discover DJADOR",
  fashion: "Best Value Deals on Fashion",
  "beauty-care": "Beauty & Hair Care",
  "everyday-essentials": "Everyday Essentials",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    section?: string;
  }>;
}) {
  const params = await searchParams;

  const category = toCategorySlug(params.category);
  const requestedSection =
  params.section?.toLowerCase().trim() || "";

const section =
  requestedSection === "for-you"
    ? "discover"
    : requestedSection;
  const search = params.search?.toLowerCase().trim() || "";

  const products = await getProducts();

  const filteredProducts = products.filter((product) => {
    const productCategory = toCategorySlug(product.category);
    const productName = product.name?.toLowerCase().trim() || "";

    const matchesCategory = category
      ? productCategory === category
      : true;

    const isDiscoverSection = section === "discover";

    const matchesSection = isDiscoverSection
      ? true
      : section
      ? sectionCategories[section]?.includes(productCategory) ?? false
      : true;

    const matchesSearch = search
      ? productName.includes(search)
      : true;

    return matchesCategory && matchesSection && matchesSearch;
  });

  const visibleProducts =
    section === "discover"
      ? filteredProducts.slice(0, 12)
      : filteredProducts;

  const pageTitle = section
    ? sectionTitles[section] || "Products"
    : category
    ? `${getCategoryLabel(category)} Products`
    : search
    ? `Search Results for "${params.search}"`
    : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="mb-10 text-3xl font-bold">
        {pageTitle}
      </h1>

      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No products found
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            We do not have products available here yet.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}