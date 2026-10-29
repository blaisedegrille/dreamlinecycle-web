import fs from "node:fs";
import path from "node:path";
import type { GalleryAlbum, GalleryImage } from "./types";

export type GalleryData = {
  albums: GalleryAlbum[];
  images: GalleryImage[];
};

const manifestPath = path.join(process.cwd(), "src", "generated", "gallery.json");

let cache: GalleryData | null = null;

export function getGallery(): GalleryData {
  if (cache) return cache;

  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    cache = JSON.parse(raw) as GalleryData;
  } catch {
    cache = { albums: [], images: [] };
  }

  return cache;
}

export function getAlbums(): GalleryAlbum[] {
  return getGallery().albums;
}

export function getAlbum(slug: string): GalleryAlbum | undefined {
  return getGallery().albums.find((album) => album.slug === slug);
}

export function getImages(album?: string): GalleryImage[] {
  const images = getGallery().images;
  return album ? images.filter((image) => image.album === album) : images;
}

export function getAlbumCover(album: GalleryAlbum): GalleryImage | undefined {
  const images = getImages(album.slug);
  return (
    images.find((image) => image.id === album.cover) ??
    images.find((image) => image.id.startsWith(album.cover)) ??
    images[0]
  );
}

export function galleryImageSrc(
  image: GalleryImage,
  format: "avif" | "webp" | "jpg",
): string {
  return image.src[format];
}
