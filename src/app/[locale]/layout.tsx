import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { routing, locales, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { JsonLd } from "@/components/seo/json-ld";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f4ebdd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("home.title"),
      template: "%s — Dreamline Cycle",
    },
    description: t("home.description"),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    formatDetection: { telephone: true, address: true, email: true },
    alternates: {
      canonical: `${site.url}/${locale}/`,
      types: {
        "application/rss+xml": [
          {
            url: `${site.url}/rss/${locale}.xml`,
            title: `Dreamline Cycle — ${locale.toUpperCase()}`,
          },
        ],
      },
    },
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    other: {
      "format-detection": "telephone=yes",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "nav" });
  const typedLocale = locale as Locale;

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});",
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="skip-link">
            {t("skip")}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer locale={typedLocale} />
          <ConsentBanner />
        </NextIntlClientProvider>
        <JsonLd locale={typedLocale} />
      </body>
    </html>
  );
}
