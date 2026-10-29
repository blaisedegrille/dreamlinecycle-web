import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { getAlbums } from "@/lib/gallery";
import { getAllPosts, getPostTranslations } from "@/lib/blog";
import type { AppHref } from "@/lib/seo";

export const dynamic = "force-static";

function languagesFor(href: AppHref, xDefault?: AppHref) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(getPathname({ locale, href }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: defaultLocale, href: xDefault ?? href }),
  );
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPages: Array<{
    href: AppHref;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { href: "/", priority: 0.9, changeFrequency: "monthly" },
    { href: "/services", priority: 0.8, changeFrequency: "monthly" },
    { href: "/gallery", priority: 0.7, changeFrequency: "weekly" },
    { href: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { href: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { href: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { href: "/imprint", priority: 0.2, changeFrequency: "yearly" },
  ];

  entries.push({
    url: absoluteUrl("/"),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((locale) => [locale, absoluteUrl(`/${locale}/`)]),
        ),
        "x-default": absoluteUrl("/"),
      },
    },
  });

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(getPathname({ locale, href: page.href })),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: languagesFor(page.href) },
      });
    }
  }

  for (const album of getAlbums()) {
    const href = {
      pathname: "/gallery/[album]",
      params: { album: album.slug },
    } as const;
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(getPathname({ locale, href })),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
        alternates: { languages: languagesFor(href) },
      });
    }
  }

  for (const locale of locales) {
    for (const post of getAllPosts(locale)) {
      const translations = getPostTranslations(post.translationKey);
      const languages: Record<string, string> = {};
      for (const [itemLocale, itemSlug] of Object.entries(translations)) {
        languages[itemLocale] = absoluteUrl(
          getPathname({
            locale: itemLocale as Locale,
            href: { pathname: "/blog/[slug]", params: { slug: itemSlug } },
          }),
        );
      }
      const defaultSlug = translations[defaultLocale];
      if (defaultSlug) {
        languages["x-default"] = absoluteUrl(
          getPathname({
            locale: defaultLocale,
            href: { pathname: "/blog/[slug]", params: { slug: defaultSlug } },
          }),
        );
      }

      entries.push({
        url: absoluteUrl(post.href),
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: Object.keys(languages).length > 1 ? { languages } : undefined,
      });
    }
  }

  return entries;
}
