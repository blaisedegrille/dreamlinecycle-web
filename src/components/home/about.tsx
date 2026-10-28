import { getTranslations } from "next-intl/server";
import { ArrowDownRight, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";

export async function HomeAbout({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const facts = t.raw("facts") as { value: string; label: string }[];

  return (
    <section className="border-b-2 border-ink bg-paper" data-reveal>
      <div className="wrap grid gap-10 py-14 sm:py-18 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">
            <span className="border-2 border-ink bg-ink px-2 py-1 text-paper">01</span>
            {t("aboutEyebrow")}
          </p>

          <h2 className="display mt-5 text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[0.88]">
            {t("aboutTitle")}
          </h2>

          <div className="mt-8 inline-flex items-center gap-3 border-2 border-ink bg-cream px-4 py-3 shadow-[4px_4px_0_var(--color-ink)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-sun">
              <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-mono text-[10px] leading-relaxed tracking-[0.12em] uppercase">
              {site.address.city} · {site.address.street}
              <br />
              <span className="text-ink/55">
                {site.address.postalCode} · Hungary
              </span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="text-[1.08rem] leading-[1.75] text-ink/80 sm:text-[1.15rem]">
            {t("aboutBody")}
          </p>

          <blockquote className="relative mt-8 border-l-4 border-race pl-5 sm:pl-6">
            <span
              aria-hidden="true"
              className="absolute -top-6 -left-1 font-serif text-6xl text-race/25"
            >
              &ldquo;
            </span>
            <p className="max-w-xl font-serif text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.25] italic">
              {t("aboutQuote")}
            </p>
          </blockquote>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t-2 border-ink pt-6 sm:gap-5">
            {facts.map((fact) => (
              <div key={fact.label}>
                <p className="font-display text-[clamp(1.8rem,4vw,2.9rem)] leading-none tracking-[-0.04em]">
                  {fact.value}
                </p>
                <p className="mt-2 font-mono text-[9px] leading-snug tracking-[0.12em] uppercase text-ink/55">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-ink/40">
            <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            {t("aboutEyebrow")} · Dreamline Cycle
          </p>
        </div>
      </div>
    </section>
  );
}
