"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/format";

export function MapEmbed({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-paper-deep",
          compact ? "border border-paper/30" : "border-2 border-ink",
        )}
      >
        <iframe
          title={t("mapTitle")}
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={cn(
            "w-full grayscale-[35%]",
            compact ? "h-36 sm:h-40" : "h-[340px] sm:h-[420px]",
          )}
          allowFullScreen
        />
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "absolute bottom-2 left-2 inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1.5 font-mono tracking-[0.12em] uppercase shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
            compact ? "text-[8px]" : "bottom-3 left-3 gap-2 px-3 py-2 text-[10px]",
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
          : "min-h-[300px] border-2 border-ink p-6 sm:min-h-[380px] sm:p-8",
      )}
    >
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0_var(--color-ink)]",
          compact ? "top-3 right-3 h-9 w-9" : "top-5 right-5 h-16 w-16",
        )}
      >
        <MapPin
          aria-hidden="true"
          className={compact ? "h-4 w-4" : "h-7 w-7"}
          strokeWidth={1.8}
        />
      </div>
      <p
        className={cn(
          "font-mono leading-relaxed tracking-[0.1em] uppercase",
          compact
            ? "max-w-[14rem] pr-9 text-[8px] text-paper/60"
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
          compact ? "text-[8px] text-paper/75" : "text-[10px]",
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
