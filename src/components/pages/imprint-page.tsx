import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { imprintSections } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { LegalPage } from "@/components/legal/legal-page";

export async function imprintMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    href: "/imprint",
    title: t("imprint.title"),
    description: t("imprint.description"),
    image: `/generated/og/imprint-${locale}.png`,
  });
}

export async function ImprintPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPage
      locale={locale}
      eyebrow={t("sections.content")}
      title={t("imprintTitle")}
      intro={t("imprintIntro")}
      sections={imprintSections}
    />
  );
}
