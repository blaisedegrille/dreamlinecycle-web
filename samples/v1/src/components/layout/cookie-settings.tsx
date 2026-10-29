"use client";

import { openConsentSettings } from "@/lib/consent";
import { cn } from "@/lib/format";

export function CookieSettings({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className={cn(
        "text-left font-mono text-[11px] tracking-[0.08em] uppercase underline-offset-4 transition-colors hover:text-sun hover:underline",
        className,
      )}
    >
      {label}
    </button>
  );
}
