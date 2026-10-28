"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import { site } from "@/content/site";

export function MapEmbed() {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <div className="relative border-2 border-ink bg-paper-deep">
        <iframe
          title={t("mapTitle")}
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[340px] w-full grayscale-[35%] sm:h-[420px]"
          allowFullScreen
        />
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
          {common("openInMaps")}
        </a>
      </div>
    );
  }

  return (
    <div className="grid-paper relative flex min-h-[300px] flex-col items-start justify-end gap-3 border-2 border-ink bg-paper-deep p-6 sm:min-h-[380px] sm:p-8">
      <div className="absolute top-5 right-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0_var(--color-ink)]">
        <MapPin aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <p className="max-w-md font-mono text-[10px] leading-relaxed tracking-[0.1em] uppercase text-ink/65">
        {t("mapConsent")}
      </p>
      <button
        type="button"
        onClick={() => setShown(true)}
        className="btn btn-sun"
      >
        <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
        {t("loadMap")}
      </button>
      <a
        href={site.mapsUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun"
      >
        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
        {common("openInMaps")}
      </a>
    </div>
  );
}
