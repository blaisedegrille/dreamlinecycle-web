"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useParams, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localeNames, localeShort, locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/format";

type LinkHref = ComponentProps<typeof Link>["href"];

export function LanguageSwitcher({
  variant = "dropdown",
  onNavigate,
  className,
}: {
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const href = { pathname, params } as unknown as LinkHref;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={t("language")}
        className={cn("flex flex-wrap gap-2", className)}
      >
        {locales.map((item) => (
          <Link
            key={item}
            href={href}
            locale={item}
            hrefLang={item}
            onClick={onNavigate}
            aria-current={item === locale ? "true" : undefined}
            className={cn(
              "flex min-w-[4.25rem] items-center justify-center gap-1.5 border-2 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
              item === locale
                ? "border-paper bg-paper text-ink"
                : "border-paper/40 text-paper/80 hover:border-paper hover:text-paper",
            )}
          >
            <span>{localeShort[item]}</span>
            <span className="sr-only">{localeNames[item]}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language")}
        className="flex items-center gap-1.5 border-2 border-ink px-2.5 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors hover:bg-ink hover:text-paper"
      >
        {localeShort[locale]}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          strokeWidth={2.4}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute top-full right-0 z-50 mt-2 w-44 border-2 border-ink bg-cream py-1 shadow-[5px_5px_0_var(--color-ink)]"
        >
          {locales.map((item) => (
            <li key={item} role="option" aria-selected={item === locale}>
              <Link
                href={href}
                locale={item}
                hrefLang={item}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                aria-current={item === locale ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-paper",
                  item === locale && "bg-sun",
                )}
              >
                <span>{localeNames[item]}</span>
                <span className="opacity-60">{localeShort[item]}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
