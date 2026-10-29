import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { services } from "@/content/site-content";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";

export async function HomeServices({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="border-b-2 border-ink bg-paper-deep">
      <div className="wrap py-14 sm:py-18 lg:py-24">
        <SectionHeading
          eyebrow={t("servicesEyebrow")}
          title={t("servicesTitle")}
          intro={t("servicesIntro")}
          action={
            <Link href="/services" className="btn btn-outline">
              {common("viewAll")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          }
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              locale={locale}
              showPoints={false}
              className="h-full"
            />
          ))}

          <div className="relative flex flex-col justify-between gap-6 overflow-hidden border-2 border-ink bg-ink p-5 text-paper shadow-[6px_6px_0_var(--color-race)] sm:col-span-2 sm:p-7 lg:col-span-2">
            <div className="relative">
              <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-sun">
                {t("servicesEyebrow")} · 07
              </p>
              <p className="mt-3 max-w-md font-display text-[clamp(1.5rem,3.5vw,2.4rem)] leading-[0.95] uppercase">
                {t("contactTitle")}
              </p>
            </div>
            <div className="relative flex flex-wrap items-center gap-3">
              <a
                href={site.phoneHref}
                className="btn border-paper bg-paper text-ink shadow-[5px_5px_0_var(--color-race)] hover:bg-sun"
              >
                <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                {site.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase underline decoration-sun decoration-2 underline-offset-4 hover:text-sun"
              >
                {common("contactUs")}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
