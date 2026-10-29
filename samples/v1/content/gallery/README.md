# Gallery photos

Drop photos into an album folder (for example `builds/`) and run `npm run gallery`
(or just `npm run dev` / `npm run build`). No code changes needed.

- Albums are folders inside `content/gallery/`.
- Each album can have an `album.json` with localized title, description, cover,
  ordering and alt text. Missing alt text falls back to the album title.
- Supported formats: jpg, jpeg, png, webp, avif, tif, tiff.
- Generate 480 / 960 / 1600 px AVIF, WebP and JPEG versions automatically.
- Placeholder posters live in this folder until you replace them. Delete the
  whole folder contents and add your own photos to start fresh.

`album.json` shape:

```json
{
  "order": 1,
  "title": { "hu": "Építések", "en": "Builds", "de": "Aufbauten" },
  "description": { "hu": "…", "en": "…", "de": "…" },
  "cover": "my-photo.jpg",
  "placeholder": false,
  "orderFiles": ["my-photo.jpg"],
  "images": {
    "my-photo.jpg": {
      "alt": { "hu": "…", "en": "…", "de": "…" },
      "caption": { "hu": "…", "en": "…", "de": "…" }
    }
  }
}
```

Set `STRICT_GALLERY=1` to make a missing `alt` fail the build.
