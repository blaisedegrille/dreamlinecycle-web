import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  align = "left",
  tone = "light",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow flex items-center gap-2",
              tone === "dark" ? "text-paper/60" : "text-ink/55",
            )}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-race" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "display mt-3 text-[clamp(2.1rem,5vw,4rem)] leading-[0.9]",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-[1.02rem] leading-relaxed",
              tone === "dark" ? "text-paper/70" : "text-ink/72",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
