import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { Marquee } from "@/components/ui/marquee";
import { HomeHero } from "@/components/home/hero";
import { HomeAbout } from "@/components/home/about";
import { HomeServices } from "@/components/home/services-preview";
import { HomeGallery } from "@/components/home/gallery-preview";
import { HomeProcess } from "@/components/home/process-section";
import { HomeBlog } from "@/components/home/blog-preview";
import { HomeContact } from "@/components/home/contact-cta";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as Locale,
    href: "/",
    title: t("home.title"),
    description: t("home.description"),
    image: `/generated/og/home-${locale}.png`,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: "home" });
  const ticker = t.raw("ticker") as string[];

  return (
    <>
      <HomeHero locale={locale as Locale} />
      <Marquee items={ticker} />
      <HomeAbout locale={locale as Locale} />
      <HomeServices locale={locale as Locale} />
      <HomeGallery locale={locale as Locale} />
      <HomeProcess locale={locale as Locale} />
      <HomeBlog locale={locale as Locale} />
      <HomeContact locale={locale as Locale} />
    </>
  );
}
