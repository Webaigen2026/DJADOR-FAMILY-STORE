"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

type FormData = {
  label: string;
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

const initialForm: FormData = {
  label: "Home",
  fullName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  isDefault: false,
};

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>(initialForm);

  const loadAddresses = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/addresses", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load addresses");
      }

      const data = await response.json();

      setAddresses(data.addresses ?? []);
    } catch {
      setError("We couldn't load your saved addresses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddForm() {
    setError("");
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  }

  function openEditForm(address: Address) {
    setError("");

    setEditingId(address.id);

    setForm({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 ?? "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `/api/addresses/${editingId}`
        : "/api/addresses";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (editingId
              ? "Failed to update address"
              : "Failed to save address")
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to remove address"
        );
      }

      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
      }

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove address"
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function setDefaultAddress(address: Address) {
    if (address.isDefault) return;

    try {
      setDefaultingId(address.id);
      setError("");

      const response = await fetch(
        `/api/addresses/${address.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2 ?? "",
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            isDefault: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to set default address"
        );
      }

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to set default address"
      );
    } finally {
      setDefaultingId(null);
    }
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-6 w-6 shrink-0 text-slate-900" />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Saved Addresses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your delivery addresses for faster checkout.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
        </div>
      ) : null}

      {/* Empty */}
      {!loading && addresses.length === 0 && !showForm ? (
        <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <MapPin className="h-7 w-7 text-slate-500" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-950">
            No saved addresses
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add a delivery address to make checkout faster and easier.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      ) : null}

      {/* Add / Edit Form */}
      {showForm ? (
        <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update your delivery information below."
                  : "Enter the delivery information below."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              aria-label="Close address form"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >
            <Field label="Address Label">
              <select
                value={form.label}
                onChange={(event) =>
                  updateField("label", event.target.value)
                }
                className={inputClass}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Full Name">
              <input
                required
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                className={inputClass}
                placeholder="Full name"
              />
            </Field>

            <Field label="Phone Number">
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                className={inputClass}
                placeholder="Phone number"
              />
            </Field>

            <Field label="Country">
              <input
                required
                value={form.country}
                onChange={(event) =>
                  updateField("country", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Street Address">
                <input
                  required
                  value={form.address1}
                  onChange={(event) =>
                    updateField("address1", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Street address"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Apartment, Suite, Unit (Optional)">
                <input
                  value={form.address2}
                  onChange={(event) =>
                    updateField("address2", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Apartment, suite, unit, etc."
                />
              </Field>
            </div>

            <Field label="City">
              <input
                required
                value={form.city}
                onChange={(event) =>
                  updateField("city", event.target.value)
                }
                className={inputClass}
                placeholder="City"
              />
            </Field>

            <Field label="State">
              <input
                required
                value={form.state}
                onChange={(event) =>
                  updateField("state", event.target.value)
                }
                className={inputClass}
                placeholder="State"
              />
            </Field>

            <Field label="ZIP Code">
              <input
                required
                value={form.zip}
                onChange={(event) =>
                  updateField("zip", event.target.value)
                }
                className={inputClass}
                placeholder="ZIP code"
              />
            </Field>

            <div className="flex items-end">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  disabled={
                    editingId !== null && form.isDefault
                  }
                  onChange={(event) =>
                    updateField(
                      "isDefault",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                Make this my default address
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 sm:col-span-2">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Address"
                    : "Save Address"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {/* Address Cards */}
      {!loading && addresses.length > 0 ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={`relative rounded-xl border bg-white p-6 shadow-sm ${
                address.isDefault
                  ? "border-emerald-200"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-950">
                        {address.label}
                      </h2>

                      {address.isDefault ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <Check className="h-3 w-3" />
                          Default
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {address.fullName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-1 text-sm leading-6 text-slate-600">
                <p>{address.address1}</p>

                {address.address2 ? (
                  <p>{address.address2}</p>
                ) : null}

                <p>
                  {address.city}, {address.state}{" "}
                  {address.zip}
                </p>

                <p>{address.country}</p>

                <p className="pt-2 font-medium text-slate-700">
                  {address.phone}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() =>
                      setDefaultAddress(address)
                    }
                    disabled={
                      defaultingId === address.id
                    }
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    {defaultingId === address.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}

                    Set as Default
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() =>
                    removeAddress(address.id)
                  }
                  disabled={
                    deletingId === address.id
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === address.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";