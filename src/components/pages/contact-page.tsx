import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { MapEmbed } from "@/components/layout/map-embed";
import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
} from "@/components/ui/social-icons";

export async function contactMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    href: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
    image: `/generated/og/contact-${locale}.png`,
  });
}

export async function ContactPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const cards = [
    {
      id: "call",
      icon: Phone,
      title: t("callTitle"),
      text: t("callText"),
      value: site.phone,
      href: site.phoneHref,
      external: false,
      accent: "bg-race text-paper",
    },
    {
      id: "email",
      icon: Mail,
      title: t("emailTitle"),
      text: t("emailText"),
      value: site.email,
      href: site.emailHref,
      external: false,
      accent: "bg-cobalt text-paper",
    },
    {
      id: "visit",
      icon: MapPin,
      title: t("visitTitle"),
      text: t("visitText"),
      value: `${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
      href: site.mapsUrl,
      external: true,
      accent: "bg-sun text-ink",
    },
    {
      id: "hours",
      icon: Clock,
      title: t("hoursTitle"),
      text: t("hoursText"),
      value: site.phone,
      href: site.phoneHref,
      external: false,
      accent: "bg-mint text-paper",
    },
  ] as const;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: nav("home"),
        item: absoluteUrl(getPathname({ locale, href: "/" })),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("eyebrow"),
        item: absoluteUrl(getPathname({ locale, href: "/contact" })),
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        accent="bg-race"
        meta={
          <div className="border-2 border-ink bg-cream p-4 shadow-[5px_5px_0_var(--color-ink)]">
            <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink/45">
              {t("callTitle")}
            </p>
            <a
              href={site.phoneHref}
              className="mt-1 block font-display text-xl leading-none tracking-[-0.02em] hover:text-race"
            >
              {site.phone}
            </a>
            <p className="mt-3 border-t border-ink/10 pt-3 font-mono text-[9px] leading-relaxed tracking-[0.12em] uppercase text-ink/50">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
          </div>
        }
      >
        <a href={site.phoneHref} className="btn btn-primary">
          <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          {common("callToBook")}
        </a>
        <a href={site.emailHref} className="btn btn-outline">
          <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          {site.email}
        </a>
      </PageHero>

      <section className="border-b-2 border-ink bg-paper">
        <div className="wrap grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
          <ContactForm locale={locale} />

          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {cards.map((card) => (
                <a
                  key={card.id}
                  href={card.href}
                  {...(card.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="group relative flex flex-col border-2 border-ink bg-cream p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center border-2 border-ink ${card.accent}`}
                  >
                    <card.icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="mt-4 font-display text-[1.05rem] leading-none uppercase">
                    {card.title}
                  </span>
                  <span className="mt-2 text-[0.82rem] leading-relaxed text-ink/65">
                    {card.text}
                  </span>
                  <span className="mt-4 flex items-center justify-between gap-2 border-t-2 border-ink/10 pt-3 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/70">
                    <span className="truncate">{card.value}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-race"
                      strokeWidth={2}
                    />
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-auto border-2 border-ink bg-ink p-5 text-paper">
              <p className="eyebrow text-paper/45">{common("follow")}</p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href={site.socials.google}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Google"
                  className="flex h-10 w-10 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  <GoogleIcon className="h-4 w-4" />
                </a>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] uppercase text-paper/70 underline decoration-sun decoration-2 underline-offset-4 hover:text-sun"
                >
                  {common("openInMaps")}
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-deep">
        <div className="wrap py-12 sm:py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-ink/50">{t("visitTitle")}</p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] leading-none uppercase">
                {t("mapTitle")}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">
                {t("visitText")}
              </p>
            </div>
            <Link
              href="/gallery"
              className="font-mono text-[10px] tracking-[0.14em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun"
            >
              {common("viewGallery")}
            </Link>
          </div>

          <div className="mt-8">
            <MapEmbed />
          </div>
        </div>
      </section>

      <JsonLd locale={locale} data={breadcrumb} />
    </>
  );
}
