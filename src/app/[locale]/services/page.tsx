import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Phone, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { faqItems, processSteps, services } from "@/content/site-content";
import type { Locale } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { JsonLd } from "@/components/seo/json-ld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as Locale,
    href: "/services",
    title: t("services.title"),
    description: t("services.description"),
    image: `/generated/og/services-${locale}.png`,
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });
  const common = await getTranslations({ locale, namespace: "common" });
  const hero = await getTranslations({ locale, namespace: "home" });
  const facts = hero.raw("facts") as { value: string; label: string }[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        accent="bg-cobalt"
        meta={
          <div className="grid grid-cols-3 gap-3 border-2 border-ink bg-cream p-4 shadow-[5px_5px_0_var(--color-ink)] lg:grid-cols-1">
            {facts.map((item) => (
              <div key={item.label} className="min-w-16">
                <p className="font-display text-2xl leading-none tracking-[-0.04em]">{item.value}</p>
                <p className="mt-1 font-mono text-[8px] tracking-[0.14em] uppercase text-ink/50">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        }
      >
        <a href={site.phoneHref} className="btn btn-primary">
          <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          {common("callToBook")}
        </a>
        <Link href="/contact" className="btn btn-outline">
          {common("contactUs")}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      <section className="border-b-2 border-ink bg-paper">
        <div className="wrap py-14 sm:py-18 lg:py-24">
          <SectionHeading eyebrow={t("eyebrow")} title={t("listTitle")} intro={t("listIntro")} />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} className="h-full" />
            ))}

            <div className="relative flex flex-col justify-between gap-5 overflow-hidden border-2 border-ink bg-sun p-6 shadow-[6px_6px_0_var(--color-ink)] sm:col-span-2">
              <span
                aria-hidden="true"
                className="absolute -right-6 -bottom-8 h-32 w-32 rounded-full border-[12px] border-ink/10"
              />
              <div className="relative">
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink/60">
                  {t("bookTitle")}
                </p>
                <p className="mt-2 max-w-md font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-[0.95] uppercase">
                  {t("bookText")}
                </p>
              </div>
              <a href={site.phoneHref} className="btn btn-ink relative self-start">
                <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1.4px)",
            backgroundSize: "15px 15px",
            opacity: 0.06,
          }}
        />
        <div className="wrap relative py-14 sm:py-18 lg:py-24">
          <SectionHeading
            eyebrow={hero("processEyebrow")}
            title={t("processTitle")}
            intro={hero("processIntro")}
            tone="dark"
          />
          <ol className="mt-10 grid gap-px border-t border-paper/20 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li
                key={step.number}
                className={
                  "relative border-paper/20 py-7 sm:border-r sm:px-6 sm:first:pl-0 lg:py-9 " +
                  (index === processSteps.length - 1 ? "sm:border-r-0" : "")
                }
              >
                <span className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-none tracking-[-0.05em] text-sun">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-xl leading-none uppercase">
                  {step.title[locale]}
                </h3>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-paper/65">
                  {step.text[locale]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-paper">
        <div className="wrap grid gap-10 py-14 sm:py-18 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
          <div>
            <SectionHeading eyebrow={t("eyebrow")} title={t("faqTitle")} intro={t("faqIntro")} />
            <a
              href={site.phoneHref}
              className="mt-7 inline-flex items-center gap-2 border-2 border-ink bg-cream px-4 py-3 font-mono text-[11px] tracking-[0.1em] uppercase shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-race" strokeWidth={2.2} />
              {site.phone}
            </a>
          </div>

          <div className="border-t-2 border-ink">
            {faqItems.map((item) => (
              <details key={item.question[locale]} className="group border-b-2 border-ink/15">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 font-display text-[1.05rem] leading-snug tracking-[-0.01em] uppercase transition-colors hover:text-race sm:text-[1.15rem]">
                  {item.question[locale]}
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink transition-transform group-open:rotate-45">
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                </summary>
                <p className="max-w-2xl pb-5 text-[0.92rem] leading-relaxed text-ink/70">
                  {item.answer[locale]}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-race text-paper">
        <div className="wrap flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div>
            <p className="eyebrow text-paper/70">{t("bookTitle")}</p>
            <p className="mt-2 max-w-xl font-display text-[clamp(1.6rem,4vw,3rem)] leading-[0.95] uppercase">
              {t("bookText")}
            </p>
          </div>
          <a
            href={site.phoneHref}
            className="btn border-paper bg-paper text-ink shadow-[5px_5px_0_var(--color-ink)] hover:bg-sun"
          >
            <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            {site.phone}
          </a>
        </div>
      </section>

      <JsonLd locale={locale} data={faqJsonLd} />
    </>
  );
}
