#!/usr/bin/env node
/**
 * Scans content/gallery/<album>/, generates responsive AVIF/WebP/JPEG variants
 * and writes src/generated/gallery.json for the app. Incremental: unchanged
 * source files reuse their cached derivatives.
 *
 * Usage: node scripts/sync-gallery.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const galleryRoot = path.join(root, "content", "gallery");
const outRoot = path.join(root, "public", "generated", "gallery");
const manifestPath = path.join(root, "src", "generated", "gallery.json");
const cachePath = path.join(root, ".cache", "gallery-cache.json");
const locales = ["hu", "en", "de"];
const targetWidths = [480, 960, 1600];
const strict = process.env.STRICT_GALLERY === "1";

const imageExtensions = /\.(jpe?g|png|webp|avif|tiff?)$/i;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_]/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function localized(value, fallback) {
  if (typeof value === "string") {
    return Object.fromEntries(locales.map((locale) => [locale, value]));
  }
  if (value && typeof value === "object") {
    const base = value.en || value.hu || value.de || fallback;
    return Object.fromEntries(
      locales.map((locale) => [locale, value[locale] || base || fallback]),
    );
  }
  return Object.fromEntries(locales.map((locale) => [locale, fallback]));
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function cacheKey(album, file) {
  return `${album}/${file}`;
}

function targetWidthsFor(width) {
  const widths = targetWidths.filter((target) => target < width);
  widths.push(Math.min(1600, width));
  return [...new Set(widths)].sort((a, b) => a - b);
}

function publicPath(album, file) {
  return `/generated/gallery/${album}/${file}`;
}

async function processImage({ album, file, source, cache, manifestImages }) {
  const buffer = fs.readFileSync(source);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12);
  const key = cacheKey(album.slug, file);
  const base = slugify(file.replace(/\.[^.]+$/, "")) || "photo";
  const cached = cache[key];

  let entry = cached && cached.hash === hash ? cached : null;

  if (entry && entry.variants) {
    const missing = Object.values(entry.variants)
      .flatMap((variant) => [variant.avif, variant.webp, variant.jpg])
      .some((relative) => !fs.existsSync(path.join(root, "public", relative)));
    if (missing) entry = null;
  }

  if (!entry) {
    const image = sharp(buffer).rotate();
    const meta = await image.metadata();
    if (!meta.width || !meta.height) {
      throw new Error(`Could not read image dimensions: ${source}`);
    }
    const orientation = meta.orientation ?? 1;
    const swapped = orientation >= 5 && orientation <= 8;
    const width = swapped ? meta.height : meta.width;
    const height = swapped ? meta.width : meta.height;

    const variants = {};
    const albumOut = path.join(outRoot, album.slug);
    fs.mkdirSync(albumOut, { recursive: true });

    for (const target of targetWidthsFor(width)) {
      const prefix = `${base}-${hash}-${target}`;
      const pipeline = sharp(buffer).rotate().resize({
        width: target,
        withoutEnlargement: true,
        fit: "inside",
      });

      const [avif, webp, jpg] = await Promise.all([
        pipeline.clone().avif({ quality: 52, effort: 4 }).toBuffer(),
        pipeline.clone().webp({ quality: 78 }).toBuffer(),
        pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
      ]);

      const avifFile = `${prefix}.avif`;
      const webpFile = `${prefix}.webp`;
      const jpgFile = `${prefix}.jpg`;

      fs.writeFileSync(path.join(albumOut, avifFile), avif);
      fs.writeFileSync(path.join(albumOut, webpFile), webp);
      fs.writeFileSync(path.join(albumOut, jpgFile), jpg);

      variants[target] = {
        avif: `/generated/gallery/${album.slug}/${avifFile}`,
        webp: `/generated/gallery/${album.slug}/${webpFile}`,
        jpg: `/generated/gallery/${album.slug}/${jpgFile}`,
      };
    }

    const blur = await sharp(buffer)
      .rotate()
      .resize({ width: 24 })
      .jpeg({ quality: 42 })
      .toBuffer();

    entry = {
      hash,
      width,
      height,
      aspect: Number((width / height).toFixed(4)),
      blur: `data:image/jpeg;base64,${blur.toString("base64")}`,
      variants,
    };
  }

  cache[key] = entry;

  const widths = Object.keys(entry.variants)
    .map(Number)
    .sort((a, b) => a - b);
  const largest = widths[widths.length - 1];
  const imageMeta = album.meta?.images?.[file] ?? {};
  const fallbackAlt = `${album.title.en} — ${humanize(file)}`;

  let alt = imageMeta.alt;
  if (!alt) {
    if (strict) {
      throw new Error(
        `Missing alt text for ${source}. Add it to ${path.join(path.dirname(source), "album.json")} or set STRICT_GALLERY=0.`,
      );
    }
    console.warn(`  ! missing alt text for ${album.slug}/${file} — using fallback`);
    alt = Object.fromEntries(
      locales.map((locale) => [
        locale,
        `${album.title[locale] || album.title.en} — ${humanize(file)}`,
      ]),
    );
  }

  const image = {
    id: base,
    album: album.slug,
    width: entry.width,
    height: entry.height,
    aspect: entry.aspect,
    alt: localized(alt, fallbackAlt),
    caption: imageMeta.caption ? localized(imageMeta.caption, "") : undefined,
    src: {
      avif: entry.variants[largest].avif,
      webp: entry.variants[largest].webp,
      jpg: entry.variants[largest].jpg,
      avifSrcSet: widths.map((w) => `${entry.variants[w].avif} ${w}w`).join(", "),
      webpSrcSet: widths.map((w) => `${entry.variants[w].webp} ${w}w`).join(", "),
      jpgSrcSet: widths.map((w) => `${entry.variants[w].jpg} ${w}w`).join(", "),
    },
    blurDataURL: entry.blur,
    placeholder: Boolean(album.meta?.placeholder),
  };

  manifestImages.push(image);
  return image;
}

async function main() {
  const cache = readJson(cachePath, {});
  const images = [];
  const albums = [];

  if (!fs.existsSync(galleryRoot)) {
    fs.mkdirSync(galleryRoot, { recursive: true });
  }

  const albumDirs = fs
    .readdirSync(galleryRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);

  const albumData = albumDirs.map((dir) => {
    const metaPath = path.join(galleryRoot, dir, "album.json");
    const meta = readJson(metaPath, {});
    const title = localized(meta.title, humanize(dir));
    const description = localized(meta.description, "");
    const files = fs
      .readdirSync(path.join(galleryRoot, dir))
      .filter((file) => imageExtensions.test(file) && !file.startsWith("."));
    return {
      slug: dir,
      meta,
      title,
      description,
      files,
      order: Array.isArray(meta.order) ? meta.order : null,
      sortOrder: Array.isArray(meta.order) ? 0 : Number(meta.order) || 999,
    };
  });

  albumData.sort(
    (a, b) => a.sortOrder - b.sortOrder || naturalCompare(a.slug, b.slug),
  );

  for (const album of albumData) {
    let files = [...album.files];

    if (album.order) {
      const position = new Map(album.order.map((file, index) => [file, index]));
      files.sort((a, b) => {
        const ai = position.has(a) ? position.get(a) : Number.MAX_SAFE_INTEGER;
        const bi = position.has(b) ? position.get(b) : Number.MAX_SAFE_INTEGER;
        return ai - bi || naturalCompare(a, b);
      });
    } else {
      files.sort(naturalCompare);
    }

    if (files.length === 0) {
      console.log(`· ${album.slug}: no photos yet`);
      continue;
    }

    console.log(`· ${album.slug}: ${files.length} photo(s)`);
    const albumImages = [];
    for (const file of files) {
      const image = await processImage({
        album,
        file,
        source: path.join(galleryRoot, album.slug, file),
        cache,
        manifestImages: images,
      });
      albumImages.push(image);
    }

    const requestedCover = album.meta?.cover;
    const cover =
      albumImages.find(
        (image) =>
          image.id === requestedCover ||
          image.id === slugify(requestedCover ?? "") ||
          image.src.jpg.endsWith(`/${requestedCover}`),
      ) ?? albumImages[0];

    albums.push({
      slug: album.slug,
      title: album.title,
      description: album.description,
      cover: cover.id,
      count: albumImages.length,
      placeholder: albumImages.every((image) => image.placeholder),
    });
  }

  // Remove stale generated variants that are no longer referenced.
  const referenced = new Set(
    images.flatMap((image) => [
      image.src.avif,
      image.src.webp,
      image.src.jpg,
      ...Object.values(image.src)
        .filter((value) => typeof value === "string" && value.includes(" "))
        .flatMap((value) => value.split(", "))
        .map((part) => part.replace(/ \d+w$/, "")),
    ]),
  );

  if (fs.existsSync(outRoot)) {
    let removed = 0;
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
        } else {
          const relative = `/${path.relative(path.join(root, "public"), full).split(path.sep).join("/")}`;
          if (!referenced.has(relative)) {
            fs.unlinkSync(full);
            removed += 1;
          }
        }
      }
    };
    walk(outRoot);
    if (removed > 0) console.log(`· cleaned ${removed} stale file(s)`);
  }

  // Drop cache entries for images that no longer exist.
  const liveKeys = new Set(
    albumData.flatMap((album) =>
      album.files.map((file) => cacheKey(album.slug, file)),
    ),
  );
  for (const key of Object.keys(cache)) {
    if (!liveKeys.has(key)) delete cache[key];
  }

  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), albums, images }, null, 2)}\n`,
  );

  const placeholderCount = images.filter((image) => image.placeholder).length;
  if (placeholderCount > 0) {
    console.log(
      `⚠ ${placeholderCount} placeholder image(s) in use. Replace content/gallery photos before launch.`,
    );
  }
  console.log(
    `Gallery: ${images.length} image(s) in ${albums.length} album(s) → src/generated/gallery.json`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
