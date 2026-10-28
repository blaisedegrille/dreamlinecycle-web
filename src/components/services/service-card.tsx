import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/format";
import { ServiceGlyph } from "@/components/ui/service-glyph";

export function ServiceCard({
  service,
  locale,
  className,
  showPoints = true,
}: {
  service: Service;
  locale: Locale;
  className?: string;
  showPoints?: boolean;
}) {
  return (
    <article
      id={service.id}
      className={cn(
        "ticket group flex scroll-mt-28 flex-col p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="plate">{service.number}</span>
        <ServiceGlyph
          icon={service.icon}
          className="h-9 w-9 text-race transition-transform duration-300 group-hover:-rotate-12 sm:h-10 sm:w-10"
        />
      </div>

      <h3 className="mt-6 font-display text-[1.25rem] leading-[1.02] tracking-[-0.02em] uppercase sm:text-[1.35rem]">
        {service.title[locale]}
      </h3>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/70">
        {service.description[locale]}
      </p>

      {showPoints ? (
        <ul className="mt-auto space-y-1.5 border-t-2 border-ink/10 pt-4 text-[0.78rem] leading-snug text-ink/75">
          {service.points[locale].map((point) => (
            <li key={point} className="flex items-start gap-2">
              <ArrowUpRight
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-race"
                strokeWidth={2.4}
              />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
