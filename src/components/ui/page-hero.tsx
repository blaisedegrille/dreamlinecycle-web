import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function PageHero({
  eyebrow,
  title,
  intro,
  meta,
  children,
  className,
  accent = "bg-race",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b-2 border-ink", className)}>
      <div className="pointer-events-none absolute inset-0 grid-paper opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[18px] border-ink/10 sm:h-80 sm:w-80"
      />
      <div className="wrap relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow flex items-center gap-2 text-ink/60">
            <span className={cn("inline-block h-2 w-2", accent)} aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="display mt-4 text-[clamp(2.8rem,8vw,6.2rem)] leading-[0.84]">{title}</h1>
          {intro ? (
            <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink/75 sm:text-lg">
              {intro}
            </p>
          ) : null}
          {children ? <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div> : null}
        </div>
        {meta ? <div className="lg:pb-2">{meta}</div> : null}
      </div>
    </section>
  );
}
