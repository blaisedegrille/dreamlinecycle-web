import { getTranslations } from "next-intl/server";
import { ArrowDownRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { processSteps } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/format";

export async function HomeProcess({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section className="relative overflow-hidden border-b border-ink bg-ink text-paper">
      <div className="wrap relative py-14 sm:py-18 lg:py-24">
        <SectionHeading
          eyebrow={t("processEyebrow")}
          title={t("processTitle")}
          intro={t("processIntro")}
          tone="dark"
          action={
            <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-paper/45 md:flex">
          <ArrowDownRight aria-hidden="true" className="h-4 w-4 text-race" strokeWidth={2} />
              04 steps
            </span>
          }
        />

        <ol className="mt-12 grid gap-px border-t border-paper/20 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li
              key={step.number}
              className={cn(
                "group relative border-paper/20 py-7 pr-4 sm:border-r sm:px-6 sm:first:pl-0 lg:py-9",
                index === processSteps.length - 1 && "sm:border-r-0",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.05em] text-race">
                  {step.number}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-2 block h-2 w-2 border border-paper/70 transition-colors group-hover:bg-race group-hover:border-race"
                />
              </div>
              <h3 className="mt-5 font-display text-xl leading-none tracking-[-0.02em] uppercase">
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
  );
}
