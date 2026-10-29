import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAlbumCover, getAlbums, getImages } from "@/lib/gallery";
import type { Locale } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { GalleryPicture } from "@/components/ui/gallery-picture";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";

export async function galleryMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    href: "/gallery",
    title: t("gallery.title"),
    description: t("gallery.description"),
    image: `/generated/og/gallery-${locale}.png`,
  });
}

export async function GalleryPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "gallery" });
  const common = await getTranslations({ locale, namespace: "common" });
  const albums = getAlbums();
  const images = getImages();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        meta={
          <div className="flex items-center gap-4 border-2 border-ink bg-cream px-4 py-3 shadow-[5px_5px_0_var(--color-ink)]">
            <div>
              <p className="font-display text-3xl leading-none tracking-[-0.04em]">{images.length}</p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.14em] uppercase text-ink/50">
                {common("photo")}
              </p>
            </div>
            <span className="h-8 w-px bg-ink/15" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl leading-none tracking-[-0.04em]">{albums.length}</p>
              <p className="mt-1 font-mono text-[8px] tracking-[0.14em] uppercase text-ink/50">
                {t("album")}
              </p>
            </div>
          </div>
        }
      />

      <section className="border-b-2 border-ink bg-paper-deep">
        <div className="wrap py-14 sm:py-18 lg:py-24">
          <SectionHeading eyebrow={t("all")} title={t("album")} intro={t("intro")} />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {albums.map((album) => {
              const cover = getAlbumCover(album);
              return (
                <Link
                  key={album.slug}
                  href={{ pathname: "/gallery/[album]", params: { album: album.slug } }}
                  className="ticket group flex flex-col bg-cream"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-paper">
                    {cover ? (
                      <GalleryPicture
                        image={cover}
                        locale={locale}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : null}
                    <span className="absolute top-3 left-3 border-2 border-ink bg-paper px-2 py-1 font-mono text-[9px] tracking-[0.14em] uppercase">
                      {String(album.count).padStart(2, "0")} {common("photo")}
                    </span>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 p-5">
                    <div>
                      <h3 className="font-display text-2xl leading-none tracking-[-0.02em] uppercase">
                        {album.title[locale]}
                      </h3>
                      <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/65">
                        {album.description[locale]}
                      </p>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-race"
                      strokeWidth={2.2}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap py-14 sm:py-18 lg:py-24">
          <SectionHeading eyebrow={t("eyebrow")} title={t("all")} />
          <div className="mt-8">
            <GalleryBrowser images={images} albums={albums} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
