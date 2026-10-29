import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { legalSections } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { LegalPage } from "@/components/legal/legal-page";

export async function privacyMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    href: "/privacy",
    title: t("privacy.title"),
    description: t("privacy.description"),
    image: `/generated/og/privacy-${locale}.png`,
  });
}

export async function PrivacyPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPage
      locale={locale}
      eyebrow={t("sections.data")}
      title={t("privacyTitle")}
      intro={t("privacyIntro")}
      sections={legalSections}
    />
  );
}
