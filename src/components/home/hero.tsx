import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { getImages } from "@/lib/gallery";
import type { Locale } from "@/i18n/routing";
import { BikeIllustration } from "@/components/brand/bike-illustration";
import { GalleryPicture } from "@/components/ui/gallery-picture";

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const heroImage = getImages().find((image) => !image.placeholder);

  return (
    <section className="relative overflow-hidden border-b border-ink/15 bg-paper">
      <div className="wrap grid gap-9 py-10 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow flex items-center gap-2 text-ink/60">
            <span className="inline-block h-2 w-2 bg-race" aria-hidden="true" />
            {t("eyebrow")}
          </p>

          <h1 className="mt-5 font-display text-[clamp(3.8rem,9.8vw,7.8rem)] leading-[0.84] font-bold tracking-[-0.075em] uppercase">
            {t("titleTop")}
            <br />
            <span className="text-race">{t("titleAccent")}</span>
          </h1>

          <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-ink/70 sm:text-lg">
            {t("intro")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={site.phoneHref} className="btn btn-primary">
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              {common("callToBook")}
            </a>
            <Link href="/gallery" className="btn btn-outline">
              {common("viewGallery")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink/15 pt-4 font-mono text-[10px] tracking-[0.08em] uppercase text-ink/60">
            <span className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-race" strokeWidth={2} />
              {site.address.city}, {site.address.street}
            </span>
            <a href={site.phoneHref} className="transition-colors hover:text-race">
              {site.phone}
            </a>
            <span>HU · EN · DE</span>
          </div>
        </div>

        <div className="relative min-h-64 overflow-hidden bg-paper-deep lg:min-h-[30rem]">
          {heroImage ? (
            <GalleryPicture
              image={heroImage}
              locale={locale}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          ) : (
            <div className="absolute inset-0 grid-paper flex items-center justify-center bg-paper-deep">
              <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.12em] text-ink/50 uppercase">
                Technical study · 01
              </span>
              <BikeIllustration className="w-[115%] text-ink" />
              <span className="absolute right-4 bottom-4 font-mono text-[9px] tracking-[0.12em] text-ink/50 uppercase">
                Frame · wheel · detail
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-ink px-4 py-3 text-white sm:px-5">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase">
              {site.name} · {site.address.city}
            </span>
            <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase">01 / 03</span>
          </div>
        </div>
      </div>
    </section>
  );
}
