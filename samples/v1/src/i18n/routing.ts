import { defineRouting } from "next-intl/routing";

export const locales = ["hu", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hu";

export const localeNames: Record<Locale, string> = {
  hu: "Magyar",
  en: "English",
  de: "Deutsch",
};

export const localeShort: Record<Locale, string> = {
  hu: "HU",
  en: "EN",
  de: "DE",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/services": {
      hu: "/szolgaltatasok",
      en: "/services",
      de: "/leistungen",
    },
    "/gallery": {
      hu: "/galeria",
      en: "/gallery",
      de: "/galerie",
    },
    "/gallery/[album]": {
      hu: "/galeria/[album]",
      en: "/gallery/[album]",
      de: "/galerie/[album]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": {
      hu: "/kapcsolat",
      en: "/contact",
      de: "/kontakt",
    },
    "/privacy": {
      hu: "/adatvedelem",
      en: "/privacy",
      de: "/datenschutz",
    },
    "/imprint": {
      hu: "/impresszum",
      en: "/imprint",
      de: "/impressum",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
