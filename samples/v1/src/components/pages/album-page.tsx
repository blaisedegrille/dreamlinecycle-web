import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { getAlbum, getAlbumCover, getAlbums, getImages } from "@/lib/gallery";
import type { Locale } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { GalleryPicture } from "@/components/ui/gallery-picture";
import { JsonLd } from "@/components/seo/json-ld";

export async function albumMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const album = getAlbum(slug);
  if (!album) return {};

  const cover = getAlbumCover(album);
  return buildMetadata({
    locale,
    href: { pathname: "/gallery/[album]", params: { album: slug } },
    title: album.title[locale],
    description: album.description[locale],
    image: cover?.src.jpg,
  });
}

export async function AlbumPageContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const album = getAlbum(slug);
  if (!album) notFound();

  const t = await getTranslations({ locale, namespace: "gallery" });
  const common = await getTranslations({ locale, namespace: "common" });
  const albums = getAlbums();
  const images = getImages(slug);
  const index = albums.findIndex((item) => item.slug === slug);
  const nextAlbum = albums[(index + 1) % Math.max(albums.length, 1)];
  const previousAlbum = albums[(index - 1 + Math.max(albums.length, 1)) % Math.max(albums.length, 1)];
  const nextCover = nextAlbum ? getAlbumCover(nextAlbum) : undefined;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("eyebrow"),
        item: absoluteUrl(getPathname({ locale, href: "/gallery" })),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: album.title[locale],
        item: absoluteUrl(
          getPathname({
            locale,
            href: { pathname: "/gallery/[album]", params: { album: slug } },
          }),
        ),
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={`${t("eyebrow")} / ${t("album")}`}
        title={album.title[locale]}
        intro={album.description[locale]}
        accent="bg-sun"
        meta={
          <div className="flex items-center gap-4 border-2 border-ink bg-cream px-4 py-3 shadow-[5px_5px_0_var(--color-ink)]">
            <div>
              <p className="font-display text-3xl leading-none tracking-[-0.04em]">
                {String(images.length).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.14em] uppercase text-ink/50">
                {common("photo")}
              </p>
            </div>
            <span className="h-8 w-px bg-ink/15" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl leading-none tracking-[-0.04em]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.14em] uppercase text-ink/50">
                {t("album")}
              </p>
            </div>
          </div>
        }
      >
        <Link href="/gallery" className="btn btn-outline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          {t("backToGallery")}
        </Link>
      </PageHero>

      <section className="bg-paper">
        <div className="wrap py-12 sm:py-16 lg:py-20">
          <GalleryBrowser
            images={images}
            albums={albums}
            locale={locale}
            showFilters={false}
          />
        </div>
      </section>

      {nextAlbum ? (
        <section className="border-t-2 border-ink bg-paper-deep">
          <div className="wrap py-12 sm:py-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-ink/50">{t("album")}</p>
                <p className="mt-2 font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-none uppercase">
                  {nextAlbum.title[locale]}
                </p>
              </div>
              <Link
                href={{ pathname: "/gallery/[album]", params: { album: nextAlbum.slug } }}
                className="group flex items-center gap-4"
              >
                {nextCover ? (
                  <span className="block h-20 w-28 overflow-hidden border-2 border-ink">
                    <GalleryPicture
                      image={nextCover}
                      locale={locale}
                      sizes="112px"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                ) : null}
                <span className="btn btn-ink">
                  {common("viewAll")}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </Link>
            </div>

            {previousAlbum && previousAlbum.slug !== nextAlbum.slug ? (
              <p className="mt-6 border-t border-ink/10 pt-4 font-mono text-[10px] tracking-[0.12em] uppercase text-ink/45">
                {t("previous")}:{" "}
                <Link
                  href={{ pathname: "/gallery/[album]", params: { album: previousAlbum.slug } }}
                  className="underline decoration-race decoration-2 underline-offset-4 hover:text-race"
                >
                  {previousAlbum.title[locale]}
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <JsonLd locale={locale} data={breadcrumb} />
    </>
  );
}
