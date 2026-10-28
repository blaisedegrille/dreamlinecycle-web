import { ArrowDownRight, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { BikeIllustration } from "@/components/brand/bike-illustration";

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="pointer-events-none absolute inset-0 grid-paper opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 -left-24 h-72 w-72 rounded-full border-[20px] border-cobalt/15 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 bg-sun/30 sm:h-64 sm:w-64"
      />

      <div className="wrap relative grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-12 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow flex items-center gap-2 text-ink/60">
            <span className="inline-block h-2 w-2 rounded-full bg-race" aria-hidden="true" />
            {t("eyebrow")}
          </p>

          <h1 className="hero-rise mt-4 display text-[clamp(3.6rem,11vw,8rem)] leading-[0.8]">
            {t("titleTop")}
            <br />
            <span className="serif-accent hero-rise-1 inline-block normal-case text-race">
              {t("titleAccent")}
            </span>
          </h1>

          <p className="hero-rise-2 mt-6 max-w-lg text-[1.02rem] leading-relaxed text-ink/75 sm:text-[1.1rem]">
            {t("intro")}
          </p>

          <div className="hero-rise-3 mt-8 flex flex-wrap items-center gap-3">
            <a href={site.phoneHref} className="btn btn-primary">
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              {common("callToBook")}
            </a>
            <Link href="/gallery" className="btn btn-outline">
              {common("viewGallery")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>

          <div className="hero-rise-4 mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-ink/10 pt-5 font-mono text-[10px] tracking-[0.12em] uppercase text-ink/60">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-race" strokeWidth={2.2} />
              {site.address.city}, {site.address.street}
            </span>
            <a
              href={site.phoneHref}
              className="flex items-center gap-1.5 transition-colors hover:text-race"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
              {site.phone}
            </a>
            <span className="flex items-center gap-1.5 text-ink/40">
              <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              {nav("language")}: HU · EN · DE
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto w-full max-w-[28rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[13rem] border-[3px] border-ink bg-cream shadow-[8px_8px_0_var(--color-ink)]">
              <span className="absolute inset-x-0 top-0 z-10 flex h-3">
                <span className="flex-1 bg-race" />
                <span className="flex-1 bg-sun" />
                <span className="flex-1 bg-cobalt" />
              </span>
              <div className="absolute inset-0 grid-paper opacity-50" aria-hidden="true" />
              <div
                aria-hidden="true"
                className="absolute right-4 bottom-20 h-24 w-24 rounded-full border-2 border-ink/20 sm:h-32 sm:w-32"
              />
              <BikeIllustration className="absolute top-[46%] left-1/2 w-[136%] -translate-x-1/2 -translate-y-1/2 text-ink" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t-2 border-ink bg-paper px-4 py-3">
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase">
                  {t("stickerThree")}
                </span>
                <span className="font-serif text-sm leading-none italic">hand built</span>
              </div>
            </div>

            <div className="absolute -top-4 -right-3 rotate-[8deg] sm:-right-6">
              <span className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-ink bg-race text-center font-mono text-[8px] leading-[1.5] tracking-[0.12em] text-paper uppercase shadow-[4px_4px_0_var(--color-ink)] sm:h-28 sm:w-28 sm:text-[9px]">
                <span>{t("stickerOne")}</span>
                <span className="my-1 block h-px w-8 bg-paper/50" />
                <span>Pécs</span>
              </span>
            </div>

            <div className="absolute -bottom-4 -left-3 rotate-[-6deg] border-2 border-ink bg-sun px-3 py-2 font-mono text-[9px] tracking-[0.14em] uppercase shadow-[4px_4px_0_var(--color-ink)] sm:-left-7 sm:text-[10px]">
              {t("stickerTwo")}
            </div>

            <svg
              aria-hidden="true"
              viewBox="0 0 120 120"
              className="animate-spin-slow absolute -right-8 bottom-24 hidden h-20 w-20 text-cobalt sm:block"
            >
              <defs>
                <path id="hero-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text className="fill-current font-mono text-[8.5px] tracking-[0.24em] uppercase">
                <textPath href="#hero-circle">
                  Dreamline Cycle · Pécs · Hand built ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
