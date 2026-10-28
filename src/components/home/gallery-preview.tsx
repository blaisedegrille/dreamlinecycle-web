import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAlbums, getImages } from "@/lib/gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import { GalleryPicture } from "@/components/ui/gallery-picture";
import { cn } from "@/lib/format";

export async function HomeGallery({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });

  const images = getImages();
  if (images.length === 0) return null;

  const albums = getAlbums();
  const preview = images.slice(0, 5);

  return (
    <section className="border-b-2 border-ink bg-paper" data-reveal>
      <div className="wrap py-14 sm:py-18 lg:py-24">
        <SectionHeading
          eyebrow={t("galleryEyebrow")}
          title={t("galleryTitle")}
          intro={t("galleryIntro")}
          action={
            <Link href="/gallery" className="btn btn-outline">
              {common("viewAll")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {preview.map((image, index) => {
            const album = albums.find((item) => item.slug === image.album);
            return (
              <Link
                key={image.id}
                href={{ pathname: "/gallery/[album]", params: { album: image.album } }}
                className={cn(
                  "group relative block overflow-hidden border-2 border-ink bg-paper-deep",
                  index === 0
                    ? "col-span-2 row-span-2 aspect-square lg:aspect-auto"
                    : "aspect-[4/3]",
                )}
              >
                <GalleryPicture
                  image={image}
                  locale={locale}
                  priority={index === 0}
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 50vw, 100vw"
                      : "(min-width: 1024px) 25vw, 50vw"
                  }
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                  <span>
                    <span className="block font-mono text-[8px] tracking-[0.16em] uppercase text-paper/70">
                      {image.placeholder ? "Dreamline" : album?.title[locale]}
                    </span>
                    <span className="mt-0.5 block font-display text-sm leading-none text-paper uppercase sm:text-base">
                      {album?.title[locale]}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-paper transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={2.2}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
