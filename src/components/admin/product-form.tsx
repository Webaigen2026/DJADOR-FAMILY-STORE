"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STORE_CATEGORIES } from "../../lib/store-categories";

function formatPrice(amount: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    imageUrl: "",
imageUrls: [] as string[],
    isActive: true,
  });

  function updateField(field: string, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to save product");
      return;
    }

    router.push("/products");
    router.refresh();
  }

  const discount =
    Number(form.originalPrice) > Number(form.price) && Number(form.price) > 0
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.price)) /
            Number(form.originalPrice)) *
            100
        )
      : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-6 py-10">
      <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-bold text-indigo-600">
            Admin / Products / Add New Product
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-950">
            Add New Product
          </h1>
          <p className="mt-3 text-lg text-slate-600">
          Create product listings, manage inventory, and publish items to your store.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-white/60 bg-white/85 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl"
          >
            <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-2xl text-white shadow-lg">
                  📦
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Product Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter product details exactly as customers will see them.
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  form.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {form.isActive ? "✓ Publishing Enabled" : "Draft Mode"}
              </span>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Product Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Premium Hair Oil"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Category
                  </label>
                  <select
  required
  value={form.category}
  onChange={(e) => updateField("category", e.target.value)}
  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
>
  <option value="">Select Category</option>

  {STORE_CATEGORIES.map((category) => (
    <option key={category.slug} value={category.slug}>
      {category.label}
    </option>
  ))}
</select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Brand
                  </label>
                  <input
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    placeholder="NovaCare"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Write clear product details for customers."
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Selling Price
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="499"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Original Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.originalPrice}
                    onChange={(e) =>
                      updateField("originalPrice", e.target.value)
                    }
                    placeholder="799"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    placeholder="25"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

            
              <label className="mb-2 block text-sm font-bold text-slate-800">
  Product Images
</label>

<input
  type="file"
  multiple
  accept="image/*"
  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
  onChange={async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log(data);

    if (data.urls?.length) {
        updateField("imageUrl", data.urls[0]);
        updateField("imageUrls", data.urls);
      }
  }}
/>

{form.imageUrl && (
  <div className="mt-4 flex items-center gap-4">
    <img
      src={form.imageUrl}
      alt="Preview"
      className="h-20 w-20 rounded-xl border object-contain"
    />

    <div>
      <p className="text-sm font-semibold text-green-600">
        Images Uploaded Successfully
      </p>

      <p className="text-xs text-slate-500">
        Main Image: {form.imageUrl}
      </p>
    </div>
  </div>
)}

              <label className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Publish Product
                  </p>
                  <p className="text-xs text-slate-500">
                    Product will be visible on the website after saving.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                <Link
                  href="/products"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </Link>

                <button
                  disabled={loading}
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </form>

          <aside className="h-fit rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-2xl shadow-purple-200/50 backdrop-blur-xl lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Store Preview
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">
                  Product Card
                </h3>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Live
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-72 items-center justify-center bg-slate-100">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={form.name || "Product preview"}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-400">
                    Product Image Preview
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    {form.category || "Category"}
                  </p>

                  {discount > 0 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {discount}% OFF
                    </span>
                  ) : null}
                </div>

                <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                  {form.name || "Product Name"}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {form.description || "Product description preview"}
                </p>

                <div className="mt-4 flex items-end gap-2">
  <span className="text-2xl font-bold text-slate-950">
    {formatPrice(form.price || 0)}
  </span>

  {form.originalPrice ? (
    <span className="pb-1 text-sm text-slate-400 line-through">
      {formatPrice(form.originalPrice)}
    </span>
  ) : null}
</div>
                <div className="mt-4 flex items-center justify-between">
                  <p
                    className={`text-sm font-bold ${
                      Number(form.stock) > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {Number(form.stock) > 0
                      ? `${form.stock} in stock`
                      : "Out of stock"}
                  </p>

                  <p className="text-xs font-semibold text-slate-400">
                    {form.brand || "Brand"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}