import { getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import type { AppHref } from "@/lib/seo";
import { getAlbums } from "@/lib/gallery";
import { getPostParams } from "@/lib/blog";

export type ResolvedRoute =
  | { kind: "services" }
  | { kind: "gallery" }
  | { kind: "album"; slug: string }
  | { kind: "blog" }
  | { kind: "post"; slug: string }
  | { kind: "contact" }
  | { kind: "privacy" }
  | { kind: "imprint" };

export type LocalizedRouteParams = {
  locale: Locale;
  slug: string[];
  route: ResolvedRoute;
};

/**
 * Turns an internal href into the localized URL segments that follow the
 * locale prefix. Static export has no middleware to rewrite requests, so the
 * catch-all page needs these segments as its params.
 */
export function localizedSegments(locale: Locale, href: AppHref): string[] {
  const pathname = getPathname({ locale, href });
  return pathname
    .replace(new RegExp(`^/${locale}`), "")
    .split("/")
    .filter(Boolean);
}

const staticRoutes: Array<{ href: AppHref; route: ResolvedRoute }> = [
  { href: "/services", route: { kind: "services" } },
  { href: "/gallery", route: { kind: "gallery" } },
  { href: "/blog", route: { kind: "blog" } },
  { href: "/contact", route: { kind: "contact" } },
  { href: "/privacy", route: { kind: "privacy" } },
  { href: "/imprint", route: { kind: "imprint" } },
];

export function getLocalizedRoutes(): LocalizedRouteParams[] {
  const entries: LocalizedRouteParams[] = [];

  for (const locale of locales) {
    for (const item of staticRoutes) {
      entries.push({
        locale,
        slug: localizedSegments(locale, item.href),
        route: item.route,
      });
    }

    for (const album of getAlbums()) {
      entries.push({
        locale,
        slug: localizedSegments(locale, {
          pathname: "/gallery/[album]",
          params: { album: album.slug },
        }),
        route: { kind: "album", slug: album.slug },
      });
    }
  }

  for (const { locale, slug } of getPostParams()) {
    entries.push({
      locale,
      slug: localizedSegments(locale, {
        pathname: "/blog/[slug]",
        params: { slug },
      }),
      route: { kind: "post", slug },
    });
  }

  return entries;
}

export function resolveRoute(locale: Locale, slug: string[]): ResolvedRoute | null {
  const key = slug.join("/");
  const match = getLocalizedRoutes().find(
    (entry) => entry.locale === locale && entry.slug.join("/") === key,
  );
  return match?.route ?? null;
}
