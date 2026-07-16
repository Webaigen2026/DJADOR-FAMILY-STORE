"use client";

import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

type ContactErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

type AddressErrors = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export default function CheckoutForm() {
  const [step, setStep] = useState<Step>(1);

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [contactErrors, setContactErrors] =
    useState<ContactErrors>({});

  const [addressErrors, setAddressErrors] =
    useState<AddressErrors>({});

  function validateContact() {
    const errors: ContactErrors = {};

    if (!contact.firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!contact.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!contact.email.trim()) {
      errors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!contact.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (
      !/^[0-9+\-().\s]{7,20}$/.test(contact.phone.trim())
    ) {
      errors.phone = "Enter a valid phone number.";
    }

    setContactErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function validateAddress() {
    const errors: AddressErrors = {};

    if (!address.street.trim()) {
      errors.street = "Street address is required.";
    }

    if (!address.city.trim()) {
      errors.city = "City is required.";
    }

    if (!address.state.trim()) {
      errors.state = "State is required.";
    }

    if (!address.zip.trim()) {
      errors.zip = "ZIP code is required.";
    } else if (!/^[A-Za-z0-9 -]{3,10}$/.test(address.zip.trim())) {
      errors.zip = "Enter a valid ZIP code.";
    }

    if (!address.country.trim()) {
      errors.country = "Country is required.";
    }

    setAddressErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function continueToAddress() {
    if (!validateContact()) return;

    setStep(2);
  }

  function continueToPayment() {
    if (!validateAddress()) return;

    setStep(3);
  }

  function continueToReview() {
    const contactIsValid = validateContact();
    const addressIsValid = validateAddress();

    if (!contactIsValid) {
      setStep(1);
      return;
    }

    if (!addressIsValid) {
      setStep(2);
      return;
    }

    setStep(4);
  }

  const inputClass =
    "h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-900";

  const errorInputClass =
    "h-11 rounded-xl border border-red-400 px-4 text-sm outline-none transition focus:border-red-600";

  return (
    <div className="space-y-4">
      {/* STEP 1 */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step 1
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Contact information
            </h2>

            {step !== 1 && contact.email ? (
              <p className="mt-1 text-sm text-slate-500">
                {contact.firstName} {contact.lastName} ·{" "}
                {contact.email}
              </p>
            ) : null}
          </div>

          <span className="text-sm font-medium text-slate-500">
            {step === 1 ? "Active" : "Edit"}
          </span>
        </button>

        {step === 1 ? (
          <div className="border-t border-slate-200 px-5 pb-5 pt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={contact.firstName}
                  onChange={(e) => {
                    setContact({
                      ...contact,
                      firstName: e.target.value,
                    });

                    setContactErrors({
                      ...contactErrors,
                      firstName: undefined,
                    });
                  }}
                  className={
                    contactErrors.firstName
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.firstName ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {contactErrors.firstName}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={contact.lastName}
                  onChange={(e) => {
                    setContact({
                      ...contact,
                      lastName: e.target.value,
                    });

                    setContactErrors({
                      ...contactErrors,
                      lastName: undefined,
                    });
                  }}
                  className={
                    contactErrors.lastName
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.lastName ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {contactErrors.lastName}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contact.email}
                  onChange={(e) => {
                    setContact({
                      ...contact,
                      email: e.target.value,
                    });

                    setContactErrors({
                      ...contactErrors,
                      email: undefined,
                    });
                  }}
                  className={
                    contactErrors.email
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {contactErrors.email ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {contactErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => {
                    setContact({
                      ...contact,
                      phone: e.target.value,
                    });

                    setContactErrors({
                      ...contactErrors,
                      phone: undefined,
                    });
                  }}
                  className={
                    contactErrors.phone
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {contactErrors.phone ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {contactErrors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={continueToAddress}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Continue to Address
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 2 */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step 2
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Address information
            </h2>

            {step !== 2 && address.street ? (
              <p className="mt-1 text-sm text-slate-500">
                {address.street}, {address.city},{" "}
                {address.state}
              </p>
            ) : null}
          </div>

          <span className="text-sm font-medium text-slate-500">
            {step === 2 ? "Active" : "Edit"}
          </span>
        </button>

        {step === 2 ? (
          <div className="border-t border-slate-200 px-5 pb-5 pt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      street: e.target.value,
                    });

                    setAddressErrors({
                      ...addressErrors,
                      street: undefined,
                    });
                  }}
                  className={
                    addressErrors.street
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {addressErrors.street ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {addressErrors.street}
                  </p>
                ) : null}
              </div>

              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={address.apartment}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    apartment: e.target.value,
                  })
                }
                className={`${inputClass} md:col-span-2`}
              />

              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      city: e.target.value,
                    });

                    setAddressErrors({
                      ...addressErrors,
                      city: undefined,
                    });
                  }}
                  className={
                    addressErrors.city
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {addressErrors.city ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {addressErrors.city}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      state: e.target.value,
                    });

                    setAddressErrors({
                      ...addressErrors,
                      state: undefined,
                    });
                  }}
                  className={
                    addressErrors.state
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {addressErrors.state ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {addressErrors.state}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={address.zip}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      zip: e.target.value,
                    });

                    setAddressErrors({
                      ...addressErrors,
                      zip: undefined,
                    });
                  }}
                  className={
                    addressErrors.zip
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {addressErrors.zip ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {addressErrors.zip}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => {
                    setAddress({
                      ...address,
                      country: e.target.value,
                    });

                    setAddressErrors({
                      ...addressErrors,
                      country: undefined,
                    });
                  }}
                  className={
                    addressErrors.country
                      ? `${errorInputClass} w-full`
                      : `${inputClass} w-full`
                  }
                />

                {addressErrors.country ? (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {addressErrors.country}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={continueToPayment}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 3 */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step 3
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Payment method
            </h2>

            {step !== 3 ? (
              <p className="mt-1 text-sm text-slate-500">
                Credit / Debit Card
              </p>
            ) : null}
          </div>

          <span className="text-sm font-medium text-slate-500">
            {step === 3 ? "Active" : "Edit"}
          </span>
        </button>

        {step === 3 ? (
          <div className="border-t border-slate-200 px-5 pb-5 pt-4">
            <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked
                  readOnly
                  className="mt-1"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    Credit / Debit Card
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Pay securely using your card
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={continueToReview}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Continue to Review
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 4 */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={continueToReview}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step 4
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Review order
            </h2>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {step === 4 ? "Active" : "Edit"}
          </span>
        </button>

        {step === 4 ? (
          <div className="border-t border-slate-200 px-5 pb-5 pt-4">
            <div className="space-y-3 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">
                  Contact:
                </span>{" "}
                {contact.firstName} {contact.lastName},{" "}
                {contact.email}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">
                  Address:
                </span>{" "}
                {address.street}
                {address.apartment
                  ? `, ${address.apartment}`
                  : ""}
                , {address.city}, {address.state},{" "}
                {address.zip}, {address.country}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">
                  Payment:
                </span>{" "}
                Credit / Debit Card
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}