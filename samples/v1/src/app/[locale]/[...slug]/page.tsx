import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import { getLocalizedRoutes, resolveRoute } from "@/lib/routes";
import { ServicesPageContent, servicesMetadata } from "@/components/pages/services-page";
import { GalleryPageContent, galleryMetadata } from "@/components/pages/gallery-page";
import { AlbumPageContent, albumMetadata } from "@/components/pages/album-page";
import { BlogPageContent, blogMetadata } from "@/components/pages/blog-page";
import { BlogPostPageContent, blogPostMetadata } from "@/components/pages/blog-post-page";
import { ContactPageContent, contactMetadata } from "@/components/pages/contact-page";
import { PrivacyPageContent, privacyMetadata } from "@/components/pages/privacy-page";
import { ImprintPageContent, imprintMetadata } from "@/components/pages/imprint-page";

type PageProps = { params: Promise<{ locale: string; slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocalizedRoutes().map(({ locale, slug }) => ({ locale, slug }));
}

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const route = resolveRoute(locale, slug);
  if (!route) return {};

  switch (route.kind) {
    case "services":
      return servicesMetadata(locale);
    case "gallery":
      return galleryMetadata(locale);
    case "album":
      return albumMetadata(locale, route.slug);
    case "blog":
      return blogMetadata(locale);
    case "post":
      return blogPostMetadata(locale, route.slug);
    case "contact":
      return contactMetadata(locale);
    case "privacy":
      return privacyMetadata(locale);
    case "imprint":
      return imprintMetadata(locale);
  }
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const route = resolveRoute(locale, slug);
  if (!route) notFound();

  switch (route.kind) {
    case "services":
      return <ServicesPageContent locale={locale} />;
    case "gallery":
      return <GalleryPageContent locale={locale} />;
    case "album":
      return <AlbumPageContent locale={locale} slug={route.slug} />;
    case "blog":
      return <BlogPageContent locale={locale} />;
    case "post":
      return <BlogPostPageContent locale={locale} slug={route.slug} />;
    case "contact":
      return <ContactPageContent locale={locale} />;
    case "privacy":
      return <PrivacyPageContent locale={locale} />;
    case "imprint":
      return <ImprintPageContent locale={locale} />;
  }
}
