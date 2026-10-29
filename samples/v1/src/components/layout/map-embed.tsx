"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/format";

type MapSize = "page" | "footer" | "compact";

export function MapEmbed({ size = "page" }: { size?: MapSize }) {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [shown, setShown] = useState(false);
  const compact = size === "compact";
  const footer = size === "footer";

  if (shown) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-paper-deep",
          compact || footer ? "border border-paper/30" : "border-2 border-ink",
        )}
      >
        <iframe
          title={t("mapTitle")}
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={cn(
            "w-full grayscale-[35%]",
            compact
              ? "h-36 sm:h-40"
              : footer
                ? "h-[320px] sm:h-[420px] lg:h-[480px]"
                : "h-[340px] sm:h-[420px]",
          )}
          allowFullScreen
        />
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "absolute bottom-2 left-2 inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1.5 font-mono tracking-[0.12em] uppercase shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
            compact
              ? "text-[8px]"
              : footer
                ? "bottom-4 left-4 gap-2 px-3 py-2 text-[10px]"
                : "bottom-3 left-3 gap-2 px-3 py-2 text-[10px]",
          )}
        >
          <ExternalLink
            aria-hidden="true"
            className={cn("shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")}
            strokeWidth={2}
          />
          {common("openInMaps")}
        </a>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid-paper relative flex flex-col items-start justify-end gap-3 bg-paper-deep",
        compact
          ? "min-h-36 border border-paper/30 p-3"
          : footer
            ? "min-h-[320px] items-center border border-paper/30 px-5 py-10 text-center sm:min-h-[420px] sm:px-8 sm:py-12 lg:min-h-[480px]"
            : "min-h-[300px] border-2 border-ink p-6 sm:min-h-[380px] sm:p-8",
      )}
    >
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0_var(--color-ink)]",
          compact
            ? "top-3 right-3 h-9 w-9"
            : footer
              ? "top-7 right-1/2 h-14 w-14 translate-x-1/2 sm:top-8 sm:h-16 sm:w-16"
              : "top-5 right-5 h-16 w-16",
        )}
      >
        <MapPin
          aria-hidden="true"
          className={compact ? "h-4 w-4" : footer ? "h-7 w-7" : "h-7 w-7"}
          strokeWidth={1.8}
        />
      </div>
      <p
        className={cn(
          "font-mono leading-relaxed tracking-[0.1em] uppercase",
          compact
            ? "max-w-[14rem] pr-9 text-[8px] text-paper/60"
            : footer
              ? "mx-auto mt-14 max-w-xl text-[10px] text-paper/65 sm:mt-16 sm:text-xs"
              : "max-w-md text-[10px] text-ink/65",
        )}
      >
        {t("mapConsent")}
      </p>
      <button
        type="button"
        onClick={() => setShown(true)}
        className={cn(
          compact
            ? "inline-flex items-center gap-1.5 border-2 border-ink bg-sun px-2 py-1 font-mono text-[8px] tracking-[0.12em] uppercase text-ink transition-colors hover:bg-paper"
            : footer
              ? "mt-2 inline-flex items-center gap-2 border-2 border-ink bg-sun px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              : "btn btn-sun",
        )}
      >
        <MapPin
          aria-hidden="true"
          className={compact ? "h-3 w-3" : "h-4 w-4"}
          strokeWidth={2}
        />
        {t("loadMap")}
      </button>
      <a
        href={site.mapsUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          "inline-flex items-center gap-1.5 font-mono tracking-[0.12em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun",
          compact
            ? "text-[8px] text-paper/75"
            : footer
              ? "mt-1 text-[9px] text-paper/75 sm:text-[10px]"
              : "text-[10px]",
        )}
      >
        <ExternalLink
          aria-hidden="true"
          className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
          strokeWidth={2}
        />
        {common("openInMaps")}
      </a>
    </div>
  );
}
