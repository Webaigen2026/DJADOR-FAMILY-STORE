import Link from "next/link";
import ProductGrid from "../../components/products/product-grid";
import { prisma } from "../../lib/prisma";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  stock?: number;
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

function normalizeCategory(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryTitle(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const category = normalizeCategory(params.category);
  const search = params.search?.toLowerCase().trim() || "";

  const products = await getProducts();

  const filteredProducts = products.filter((product) => {
    const productCategory = normalizeCategory(product.category);
    const productName = product.name.toLowerCase();

    const matchesCategory = category
      ? productCategory === category
      : true;

    const matchesSearch = search
      ? productName.includes(search)
      : true;

    return matchesCategory && matchesSearch;
  });

  const pageTitle = category
    ? `${formatCategoryTitle(category)} Collection`
    : search
      ? `Search Results for "${params.search}"`
      : "All Products";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* PAGE BACKGROUND DESIGN */}
      <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-blue-100/60 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 top-[420px] h-[460px] w-[460px] rounded-full bg-violet-100/50 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-[360px] w-[360px] rounded-full bg-cyan-100/40 blur-[110px]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        {/* PAGE HEADER */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-white/80 bg-white/85 px-6 py-7 shadow-sm backdrop-blur sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            DJADOR Family Store
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Browse available products, review product information, and
                choose the items that are right for you.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Products
              </p>

              <p className="mt-1 text-xl font-bold text-slate-950">
                {filteredProducts.length}
              </p>
            </div>
          </div>
        </section>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white/90 px-6 py-20 text-center shadow-sm backdrop-blur">
            <h2 className="text-2xl font-bold text-slate-950">
              No products found
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              We do not currently have active products in this collection.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View All Products
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}