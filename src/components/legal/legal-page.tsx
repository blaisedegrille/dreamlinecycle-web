import { getTranslations } from "next-intl/server";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { LegalSection } from "@/lib/types";
import { PageHero } from "@/components/ui/page-hero";

export async function LegalPage({
  locale,
  title,
  intro,
  eyebrow,
  sections,
}: {
  locale: Locale;
  title: string;
  intro: string;
  eyebrow: string;
  sections: LegalSection[];
}) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        meta={
          <div className="flex items-center gap-3 border-2 border-ink bg-cream px-4 py-3 shadow-[5px_5px_0_var(--color-ink)]">
            <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-sun">
              <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-mono text-[9px] leading-relaxed tracking-[0.12em] uppercase text-ink/60">
              {t("updated")}
            </span>
          </div>
        }
      />

      <section className="bg-paper">
        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <aside>
            <div className="border-t-2 border-ink pt-4 lg:sticky lg:top-28">
              <p className="eyebrow text-ink/45">{t("sections.content")}</p>
              <nav aria-label={title} className="mt-3">
                <ol className="space-y-2.5 border-l-2 border-ink/10">
                  {sections.map((section, index) => (
                    <li key={section.heading[locale]}>
                      <a
                        href={`#section-${index + 1}`}
                        className="block pl-3 text-[0.86rem] leading-snug text-ink/70 transition-colors hover:text-race"
                      >
                        {section.heading[locale]}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun"
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                {common("contactUs")}
              </Link>
            </div>
          </aside>

          <article className="max-w-3xl">
            {sections.map((section, index) => (
              <section
                key={section.heading[locale]}
                id={`section-${index + 1}`}
                className="scroll-mt-28 border-b-2 border-ink/10 py-8 first:pt-0 last:border-b-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-race">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] leading-none uppercase">
                    {section.heading[locale]}
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {section.body[locale].map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.98rem] leading-relaxed text-ink/75"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-ink pt-5">
              <Link href="/privacy" className="btn btn-outline">
                {t("privacyTitle")}
              </Link>
              <Link href="/imprint" className="btn btn-outline">
                {t("imprintTitle")}
              </Link>
              <Link href="/contact" className="btn btn-primary">
                {common("contactUs")}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
