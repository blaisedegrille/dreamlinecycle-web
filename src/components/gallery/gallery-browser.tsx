"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { GalleryAlbum, GalleryImage } from "@/lib/types";
import { cn } from "@/lib/format";
import { GalleryPicture } from "@/components/ui/gallery-picture";

export function GalleryBrowser({
  images,
  albums,
  locale,
  showFilters = true,
}: {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  locale: Locale;
  showFilters?: boolean;
}) {
  const t = useTranslations("gallery");
  const common = useTranslations("common");
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const touchStart = useRef<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? images : images.filter((image) => image.album === filter)),
    [filter, images],
  );

  const current = active !== null ? filtered[active] : undefined;
  const currentAlbum = current
    ? albums.find((album) => album.slug === current.album)
    : undefined;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => {
    setActive((value) =>
      value === null ? value : (value + 1) % Math.max(filtered.length, 1),
    );
  }, [filtered.length]);
  const previous = useCallback(() => {
    setActive((value) =>
      value === null
        ? value
        : (value - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1),
    );
  }, [filtered.length]);

  useEffect(() => {
    if (active === null) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [active, close, next, previous]);

  useEffect(() => {
    setActive(null);
  }, [filter]);

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink/30 bg-cream/60 px-6 py-16 text-center">
        <p className="font-serif text-2xl italic text-ink/60">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div>
      {showFilters ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={cn(
              "border-2 border-ink px-3 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
              filter === "all"
                ? "bg-ink text-paper"
                : "bg-transparent text-ink hover:bg-ink hover:text-paper",
            )}
          >
            {t("all")}
            <span className="ml-2 opacity-55">{images.length}</span>
          </button>
          {albums.map((album) => (
            <button
              key={album.slug}
              type="button"
              onClick={() => setFilter(album.slug)}
              aria-pressed={filter === album.slug}
              className={cn(
                "border-2 border-ink px-3 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
                filter === album.slug
                  ? "bg-ink text-paper"
                  : "bg-transparent text-ink hover:bg-ink hover:text-paper",
              )}
            >
              {album.title[locale]}
              <span className="ml-2 opacity-55">{album.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => {
          const album = albums.find((item) => item.slug === image.album);
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${t("open")}: ${image.alt[locale]}`}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden border-2 border-ink bg-paper-deep text-left"
            >
              <span
                className="block w-full"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              >
                <GalleryPicture
                  image={image}
                  locale={locale}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </span>

              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] tracking-[0.16em] uppercase text-paper/65">
                    {album?.title[locale]}
                  </span>
                  <span className="mt-1 block truncate font-display text-sm leading-none text-paper uppercase">
                    {image.caption?.[locale] || image.alt[locale]}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-paper/60 text-paper">
                  <Expand aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </span>

              <span className="absolute top-2 right-2 border border-ink bg-paper/90 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] uppercase opacity-0 transition-opacity group-hover:opacity-100">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("open")}
          className="fixed inset-0 z-[120] flex flex-col bg-ink/97 text-paper"
        >
          <div className="flex items-center justify-between gap-4 border-b border-paper/15 px-4 py-3 sm:px-6">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper/70">
              {String((active ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(filtered.length).padStart(2, "0")}
            </span>
            <span className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.16em] uppercase text-paper/40 sm:flex">
              {currentAlbum?.title[locale]}
              <span className="text-sun">✳</span>
              {common("photos", { count: filtered.length })}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="flex h-10 w-10 items-center justify-center border border-paper/50 transition-colors hover:bg-paper hover:text-ink"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden p-3 sm:p-6"
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return;
              const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
              if (Math.abs(delta) > 50) {
                if (delta < 0) next();
                else previous();
              }
              touchStart.current = null;
            }}
          >
            <button
              type="button"
              onClick={previous}
              aria-label={t("previous")}
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-paper/40 bg-ink/60 text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink sm:left-5"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </button>

            <figure className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-3">
              <div className="h-[calc(100dvh-12rem)] w-full sm:h-[calc(100dvh-13rem)]">
                <GalleryPicture
                  image={current}
                  locale={locale}
                  fit="contain"
                  priority
                  sizes="100vw"
                  className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                />
              </div>
              <figcaption className="max-w-2xl text-center font-mono text-[10px] leading-relaxed tracking-[0.1em] uppercase text-paper/65">
                {current.caption?.[locale] || current.alt[locale]}
                <span className="mx-2 text-paper/30">/</span>
                <span className="text-sun">{currentAlbum?.title[locale]}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={next}
              aria-label={t("next")}
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-paper/40 bg-ink/60 text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink sm:right-5"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <p className="hidden border-t border-paper/10 py-2 text-center font-mono text-[9px] tracking-[0.18em] uppercase text-paper/35 sm:block">
            Esc · ← · →
          </p>
        </div>
      ) : null}
    </div>
  );
}
