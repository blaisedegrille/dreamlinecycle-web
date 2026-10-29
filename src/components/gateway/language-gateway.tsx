"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { localeNames, locales, type Locale } from "@/i18n/routing";
import { gatewayCopy } from "@/content/gateway";
import { withBasePath } from "@/lib/paths";

const LOCALE_KEY = "dlc-locale";

function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value) && locales.includes(value as Locale);
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("languagechange", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("languagechange", callback);
  };
}

/** Previously chosen locale, else the first browser language we support. */
function getSuggestedLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage may be unavailable; fall through to browser languages.
  }
  const languages = navigator.languages ?? [navigator.language];
  for (const language of languages) {
    const prefix = language.toLowerCase().slice(0, 2);
    if (isLocale(prefix)) return prefix;
  }
  return null;
}

const getServerSuggestion = () => null;

const codes: Record<Locale, string> = {
  hu: "HU",
  en: "EN",
  de: "DE",
};

export function LanguageGateway() {
  const suggested = useSyncExternalStore(
    subscribe,
    getSuggestedLocale,
    getServerSuggestion,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {locales.map((locale) => {
        const copy = gatewayCopy[locale];
        return (
          <a
            key={locale}
            href={withBasePath(`/${locale}/`)}
            hrefLang={locale}
            lang={locale}
            onClick={() => {
              try {
                window.localStorage.setItem(LOCALE_KEY, locale);
              } catch {
                // ignore storage errors
              }
            }}
            className="group relative flex min-w-[10rem] flex-1 flex-col justify-between gap-6 border border-ink/20 bg-cream p-4 text-ink transition-colors hover:border-race sm:min-h-[11rem] sm:p-5"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 bg-race"
            />
            {suggested === locale ? (
              <span className="absolute top-3 right-3 border border-ink/20 bg-paper-deep px-2 py-1 font-mono text-[8px] tracking-[0.1em] uppercase">
                {copy.suggested}
              </span>
            ) : null}
            <div className="pt-2">
              <p className="font-display text-[3rem] leading-[0.9] font-bold tracking-[-0.06em]">
                {codes[locale]}
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/55">
                {localeNames[locale]}
              </p>
            </div>
            <span className="flex items-center justify-between border-t border-ink/15 pt-3 font-mono text-[9px] tracking-[0.1em] uppercase">
              {copy.enter}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </a>
        );
      })}
    </div>
  );
}
