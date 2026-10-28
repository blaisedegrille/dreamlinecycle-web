export const CONSENT_KEY = "dlc-consent-v1";
export const CONSENT_EVENT = "dlc:consent-changed";
export const OPEN_CONSENT_EVENT = "dlc:open-consent";

export type ConsentChoice = {
  analytics: boolean;
  timestamp: string;
};

export function readConsent(): ConsentChoice | null {
  return parseConsent(getConsentSnapshot());
}

/**
 * Subscription for `useSyncExternalStore`: re-reads consent whenever this tab
 * writes it or another tab changes localStorage.
 */
export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_KEY) callback();
  };
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Snapshot for `useSyncExternalStore`. Returns the raw string so React can
 * compare snapshots by value; parse with `parseConsent`.
 */
export function getConsentSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      analytics: parsed.analytics,
      timestamp: parsed.timestamp ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    analytics,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
    } catch {
      // Storage can be unavailable in private modes; the choice still applies
      // for the current page view.
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
  }
  return choice;
}

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function updateAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  const target = window as GtagWindow;
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push([
    "consent",
    "update",
    {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: granted ? "granted" : "denied",
    },
  ]);
}

export function openConsentSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
