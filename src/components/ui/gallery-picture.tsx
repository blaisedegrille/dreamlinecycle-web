import { cn } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { GalleryImage } from "@/lib/types";
import { withBasePath, withBasePathSrcSet } from "@/lib/paths";

export function GalleryPicture({
  image,
  locale,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  fit = "cover",
}: {
  image: GalleryImage;
  locale: Locale;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={withBasePathSrcSet(image.src.avifSrcSet)} sizes={sizes} />
      <source type="image/webp" srcSet={withBasePathSrcSet(image.src.webpSrcSet)} sizes={sizes} />
      <img
        src={withBasePath(image.src.jpg)}
        srcSet={withBasePathSrcSet(image.src.jpgSrcSet)}
        sizes={sizes}
        alt={image.alt[locale]}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover", className)}
        style={{
          backgroundImage: `url(${image.blurDataURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}
