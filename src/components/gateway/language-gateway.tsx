"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { localeNames, locales, type Locale } from "@/i18n/routing";
import { gatewayCopy } from "@/content/gateway";
import { cn } from "@/lib/format";

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

const accents: Record<Locale, string> = {
  hu: "bg-race",
  en: "bg-sun",
  de: "bg-cobalt",
};

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
      {locales.map((locale, index) => {
        const copy = gatewayCopy[locale];
        return (
          <a
            key={locale}
            href={`/${locale}/`}
            hrefLang={locale}
            lang={locale}
            onClick={() => {
              try {
                window.localStorage.setItem(LOCALE_KEY, locale);
              } catch {
                // ignore storage errors
              }
            }}
            className={cn(
              "group relative flex min-w-[13rem] flex-1 flex-col justify-between gap-8 border-2 border-ink bg-paper p-5 text-ink shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-[10px_10px_0_var(--color-ink)] sm:min-h-[15rem]",
              index === 1 && "sm:mt-5",
              index === 2 && "sm:mt-10",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("absolute inset-x-0 top-0 h-2.5", accents[locale])}
            />
            {suggested === locale ? (
              <span className="absolute top-3 right-3 border-2 border-ink bg-sun px-2 py-1 font-mono text-[8px] tracking-[0.14em] uppercase">
                {copy.suggested}
              </span>
            ) : null}
            <div className="pt-2">
              <p className="display text-[3.4rem] leading-[0.8]">
                {codes[locale]}
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/55">
                {localeNames[locale]}
              </p>
            </div>
            <span className="flex items-center justify-between border-t-2 border-ink/15 pt-3 font-mono text-[10px] tracking-[0.14em] uppercase">
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
