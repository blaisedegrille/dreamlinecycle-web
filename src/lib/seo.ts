import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { withBasePath } from "@/lib/paths";

export type AppHref = Parameters<typeof getPathname>[0]["href"];

export function absoluteUrl(path: string): string {
  return new URL(withBasePath(path), site.url).toString();
}

type BuildMetadataInput = {
  locale: Locale;
  href: AppHref;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  /** Override the hreflang map, e.g. for blog posts whose slugs differ per language. */
  languages?: Record<string, string>;
};

export function buildMetadata({
  locale,
  href,
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  languages: languageOverride,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(getPathname({ locale, href }));

  const languages: Record<string, string> = {};
  for (const item of locales) {
    languages[item] = absoluteUrl(getPathname({ locale: item, href }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: defaultLocale, href }),
  );

  const alternates = languageOverride
    ? {
        canonical,
        languages: {
          ...languageOverride,
          "x-default":
            languageOverride[defaultLocale] ??
            absoluteUrl(getPathname({ locale: defaultLocale, href })),
        },
      }
    : { canonical, languages };

  const ogImage = absoluteUrl(image || `/generated/og/home-${locale}.png`);
  const socialTitle = title.includes(site.name)
    ? title
    : `${title} — ${site.name}`;

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      siteName: site.name,
      locale,
      alternateLocale: locales.filter((item) => item !== locale),
      title: socialTitle,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
    verification: site.googleSiteVerification
      ? { google: site.googleSiteVerification }
      : undefined,
  };
}

export function hreflangAlternates(href: AppHref): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const item of locales) {
    languages[item] = absoluteUrl(getPathname({ locale: item, href }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: defaultLocale, href }),
  );
  return languages;
}
