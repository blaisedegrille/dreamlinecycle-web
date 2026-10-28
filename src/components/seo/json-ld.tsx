import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";

type JsonLdProps = {
  locale: Locale;
  data?: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ locale, data }: JsonLdProps) {
  const graph = data ?? businessGraph(locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function businessGraph(locale: Locale) {
  const name = "Dreamline Cycle";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BikeStore",
        "@id": `${site.url}/#business`,
        name,
        legalName: site.legalName,
        url: `${site.url}/${locale}/`,
        telephone: site.phone,
        email: site.email,
        image: `${site.url}/icon-512.png`,
        logo: `${site.url}/icon-512.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        sameAs: [site.socials.facebook, site.socials.instagram],
        areaServed: {
          "@type": "City",
          name: "Pécs",
        },
        knowsLanguage: ["hu", "en", "de"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/${locale}/`,
        name,
        inLanguage: locale,
        publisher: { "@id": `${site.url}/#business` },
      },
    ],
  };
}
