export const COOKIE_CONSENT_KEY =
  "djador_cookie_preferences";

export const COOKIE_CONSENT_VERSION = "1.0";

export const COOKIE_PREFERENCES_CHANGED_EVENT =
  "djador-cookie-preferences-changed";

export const OPEN_COOKIE_PREFERENCES_EVENT =
  "djador-open-cookie-preferences";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

export type CookieConsentCategory =
  | "necessary"
  | "analytics"
  | "marketing";

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: COOKIE_CONSENT_VERSION,
  updatedAt: "",
};

/**
 * Read the visitor's saved cookie preferences.
 *
 * Returns null when:
 * - running on the server
 * - no preferences have been saved
 * - stored data is invalid
 * - consent version is outdated
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(
      COOKIE_CONSENT_KEY
    );

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
      return null;
    }

    const value = parsed as Record<string, unknown>;

    if (
      value.version !== COOKIE_CONSENT_VERSION
    ) {
      return null;
    }

    if (
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      necessary: true,
      analytics: value.analytics,
      marketing: value.marketing,
      version: COOKIE_CONSENT_VERSION,
      updatedAt:
        typeof value.updatedAt === "string"
          ? value.updatedAt
          : "",
    };
  } catch {
    return null;
  }
}

/**
 * Save the visitor's optional cookie preferences.
 *
 * Necessary technologies cannot be disabled.
 */
export function saveCookiePreferences(
  preferences: Pick<
    CookiePreferences,
    "analytics" | "marketing"
  >
): CookiePreferences {
  const savedPreferences: CookiePreferences = {
    necessary: true,
    analytics: preferences.analytics === true,
    marketing: preferences.marketing === true,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify(savedPreferences)
      );
    } catch {
      /*
       * Storage can be unavailable in some browser/privacy
       * configurations. The current preference is still
       * returned to the caller for this page session.
       */
    }

    window.dispatchEvent(
      new CustomEvent<CookiePreferences>(
        COOKIE_PREFERENCES_CHANGED_EVENT,
        {
          detail: savedPreferences,
        }
      )
    );
  }

  return savedPreferences;
}

/**
 * Central consent gate.
 *
 * Necessary functionality is always allowed.
 * Optional functionality is denied until the visitor
 * has explicitly enabled the corresponding category.
 */
export function hasCookieConsent(
  category: CookieConsentCategory
): boolean {
  if (category === "necessary") {
    return true;
  }

  const preferences = getCookiePreferences();

  if (!preferences) {
    return false;
  }

  switch (category) {
    case "analytics":
      return preferences.analytics;

    case "marketing":
      return preferences.marketing;

    default:
      return false;
  }
}

/**
 * Convenience helpers for integrations.
 */
export function hasAnalyticsConsent(): boolean {
  return hasCookieConsent("analytics");
}

export function hasMarketingConsent(): boolean {
  return hasCookieConsent("marketing");
}

export function canLoadAnalytics(): boolean {
  return hasAnalyticsConsent();
}

export function canLoadMarketing(): boolean {
  return hasMarketingConsent();
}

/**
 * Reopen the site's Cookie Preferences manager.
 */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(OPEN_COOKIE_PREFERENCES_EVENT)
  );
}