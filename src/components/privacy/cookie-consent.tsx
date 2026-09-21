"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

import {
  COOKIE_PREFERENCES_CHANGED_EVENT,
  DEFAULT_COOKIE_PREFERENCES,
  OPEN_COOKIE_PREFERENCES_EVENT,
  getCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "../../lib/cookie-consent";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] =
    useState(false);

  const [preferences, setPreferences] =
    useState<CookiePreferences>(
      DEFAULT_COOKIE_PREFERENCES
    );

  /*
   * On first page load:
   *
   * No saved preference -> show banner.
   * Saved preference    -> keep banner hidden.
   */
  useEffect(() => {
    const savedPreferences =
      getCookiePreferences();

    if (savedPreferences) {
      setPreferences(savedPreferences);
      setIsOpen(false);
    } else {
      setPreferences(
        DEFAULT_COOKIE_PREFERENCES
      );
      setShowPreferences(false);
      setIsOpen(true);
    }

    function handleOpenPreferences() {
      const currentPreferences =
        getCookiePreferences();

      setPreferences(
        currentPreferences ??
          DEFAULT_COOKIE_PREFERENCES
      );

      setShowPreferences(true);
      setIsOpen(true);
    }

    function handlePreferenceChange(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<CookiePreferences>;

      if (customEvent.detail) {
        setPreferences(
          customEvent.detail
        );
      }
    }

    window.addEventListener(
      OPEN_COOKIE_PREFERENCES_EVENT,
      handleOpenPreferences
    );

    window.addEventListener(
      COOKIE_PREFERENCES_CHANGED_EVENT,
      handlePreferenceChange
    );

    return () => {
      window.removeEventListener(
        OPEN_COOKIE_PREFERENCES_EVENT,
        handleOpenPreferences
      );

      window.removeEventListener(
        COOKIE_PREFERENCES_CHANGED_EVENT,
        handlePreferenceChange
      );
    };
  }, []);

  /*
   * Escape closes the detailed preference manager.
   *
   * If the visitor has never made a choice,
   * return to the main banner instead.
   */
  useEffect(() => {
    if (!isOpen || !showPreferences) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key !== "Escape") {
        return;
      }

      const savedPreferences =
        getCookiePreferences();

      if (savedPreferences) {
        setShowPreferences(false);
        setIsOpen(false);
      } else {
        setShowPreferences(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, showPreferences]);

  function savePreferences(
    analytics: boolean,
    marketing: boolean
  ) {
    const saved =
      saveCookiePreferences({
        analytics,
        marketing,
      });

    setPreferences(saved);
    setShowPreferences(false);
    setIsOpen(false);
  }

  function acceptAll() {
    savePreferences(true, true);
  }

  function rejectOptional() {
    savePreferences(false, false);
  }

  function saveSelectedPreferences() {
    savePreferences(
      preferences.analytics,
      preferences.marketing
    );
  }

  function openPreferences() {
    const currentPreferences =
      getCookiePreferences();

    setPreferences(
      currentPreferences ??
        DEFAULT_COOKIE_PREFERENCES
    );

    setShowPreferences(true);
    setIsOpen(true);
  }

  function closePreferences() {
    const savedPreferences =
      getCookiePreferences();

    /*
     * Returning visitor:
     * close the preference manager completely.
     */
    if (savedPreferences) {
      setPreferences(savedPreferences);
      setShowPreferences(false);
      setIsOpen(false);
      return;
    }

    /*
     * First-time visitor:
     * they still need to make a choice,
     * so return to the main banner.
     */
    setPreferences(
      DEFAULT_COOKIE_PREFERENCES
    );
    setShowPreferences(false);
    setIsOpen(true);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white shadow-[0_-10px_35px_rgba(15,23,42,0.10)]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-6 sm:px-7 lg:px-8">
        {!showPreferences ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-[650px]">
              <div className="flex items-center gap-2.5">
                <Cookie
                  className="h-5 w-5 text-slate-700"
                  aria-hidden="true"
                />

                <h2
                  id="cookie-consent-title"
                  className="text-[18px] font-semibold tracking-[-0.01em] text-slate-950"
                >
                  Your privacy choices
                </h2>
              </div>

              <p
                id="cookie-consent-description"
                className="mt-3 text-[14px] leading-6 text-slate-600"
              >
                DJADOR Family Store uses necessary
                browser technologies to support
                essential website features. You can
                also choose whether optional
                analytics and marketing technologies
                may be used.
              </p>

              <a
                href="/privacy"
                className="mt-3 inline-block text-[13px] font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
              >
                Read our Privacy Policy
              </a>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:justify-end">
              <button
                type="button"
                onClick={openPreferences}
                className="min-h-11 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Manage preferences
              </button>

              <button
                type="button"
                onClick={rejectOptional}
                className="min-h-11 rounded-md border border-slate-900 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Reject optional
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="min-h-11 rounded-md bg-slate-950 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-5">
              <div className="max-w-3xl">
                <h2
                  id="cookie-consent-title"
                  className="text-[21px] font-semibold tracking-[-0.02em] text-slate-950"
                >
                  Cookie preferences
                </h2>

                <p
                  id="cookie-consent-description"
                  className="mt-2 text-[14px] leading-6 text-slate-600"
                >
                  Choose which optional technologies
                  DJADOR Family Store may use on this
                  browser. Necessary technologies
                  cannot be disabled because they
                  support essential website
                  functions.
                </p>
              </div>

              <button
                type="button"
                onClick={closePreferences}
                aria-label="Close cookie preferences"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              >
                <X
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-8 py-5">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[15px] font-semibold text-slate-950">
                      Necessary
                    </h3>

                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                      Always active
                    </span>
                  </div>

                  <p className="mt-2 text-[14px] leading-6 text-slate-600">
                    Required for essential features
                    such as authentication, sessions,
                    account security, shopping
                    functionality, and other core
                    website operations.
                  </p>
                </div>

                <div
                  role="switch"
                  aria-checked="true"
                  aria-disabled="true"
                  aria-label="Necessary technologies always enabled"
                  className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-slate-950"
                >
                  <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-8 py-5">
                <div className="max-w-3xl">
                  <h3 className="text-[15px] font-semibold text-slate-950">
                    Analytics
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-slate-600">
                    Allows optional analytics
                    technologies when they are
                    available so we can understand
                    website usage and improve the
                    shopping experience.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label="Analytics cookies"
                  aria-checked={
                    preferences.analytics
                  }
                  onClick={() =>
                    setPreferences(
                      (current) => ({
                        ...current,
                        analytics:
                          !current.analytics,
                      })
                    )
                  }
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
                    preferences.analytics
                      ? "bg-slate-950"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      preferences.analytics
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-8 py-5">
                <div className="max-w-3xl">
                  <h3 className="text-[15px] font-semibold text-slate-950">
                    Marketing
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-slate-600">
                    Allows optional marketing
                    technologies when they are
                    available. These may be used to
                    measure campaigns or provide more
                    relevant advertising.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label="Marketing cookies"
                  aria-checked={
                    preferences.marketing
                  }
                  onClick={() =>
                    setPreferences(
                      (current) => ({
                        ...current,
                        marketing:
                          !current.marketing,
                      })
                    )
                  }
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
                    preferences.marketing
                      ? "bg-slate-950"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      preferences.marketing
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={rejectOptional}
                className="min-h-11 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Reject optional
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="min-h-11 rounded-md border border-slate-900 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Accept all
              </button>

              <button
                type="button"
                onClick={
                  saveSelectedPreferences
                }
                className="min-h-11 rounded-md bg-slate-950 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}