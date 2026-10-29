#!/usr/bin/env node
/**
 * Generates the placeholder gallery and blog artwork so the site builds and
 * looks complete before real photography arrives. Drop real photos into
 * content/gallery/<album>/ and this script leaves those albums alone.
 *
 * Usage: node scripts/make-placeholders.mjs [--force]
 */
import fs from "node:fs";
import path from "node:path";
import {
  colorways,
  el,
  renderJpeg,
  renderPng,
  bikeDataUri,
  root,
  writeJson,
} from "./lib/design.mjs";

const force = process.argv.includes("--force");
const galleryRoot = path.join(root, "content", "gallery");
const blogArtRoot = path.join(root, "public", "generated", "blog");
const publicRoot = path.join(root, "public");

const ALBUMS = [
  {
    slug: "builds",
    order: 1,
    title: {
      hu: "Építések",
      en: "Builds",
      de: "Aufbauten",
    },
    description: {
      hu: "Egyedi kerékpárok, a vázlattól az első tekerésig.",
      en: "Custom bicycles, from first sketch to first ride.",
      de: "Individuelle Fahrräder, vom ersten Entwurf bis zur ersten Fahrt.",
    },
    images: [
      {
        file: "builds-01-steel-road",
        title: "STEEL ROAD",
        subtitle: "hand-built in Pécs",
        label: "BUILD 001",
        meta: "STEEL / 700C",
        width: 1600,
        height: 1200,
        variant: 0,
        alt: {
          hu: "Retró plakát acél országúti kerékpárról",
          en: "Retro poster of a steel road bicycle",
          de: "Retro-Poster eines Stahl-Rennrads",
        },
      },
      {
        file: "builds-02-gravel-one",
        title: "GRAVEL ONE",
        subtitle: "all-road, all day",
        label: "BUILD 002",
        meta: "STEEL / 650B",
        width: 1600,
        height: 1200,
        variant: 1,
        alt: {
          hu: "Retró plakát gravel kerékpárról",
          en: "Retro poster of a gravel bicycle",
          de: "Retro-Poster eines Gravelbikes",
        },
      },
      {
        file: "builds-03-city-custom",
        title: "CITY CUSTOM",
        subtitle: "for the daily commute",
        label: "BUILD 003",
        meta: "CITY / 8-SPEED",
        width: 1200,
        height: 1600,
        variant: 2,
        alt: {
          hu: "Retró plakát városi kerékpárról",
          en: "Retro poster of a city bicycle",
          de: "Retro-Poster eines Stadtrads",
        },
      },
      {
        file: "builds-04-trail-29",
        title: "TRAIL 29",
        subtitle: "mountain geometry",
        label: "BUILD 004",
        meta: "MTB / 29ER",
        width: 1600,
        height: 1200,
        variant: 1,
        alt: {
          hu: "Retró plakát hegyi kerékpárról",
          en: "Retro poster of a mountain bike",
          de: "Retro-Poster eines Mountainbikes",
        },
      },
      {
        file: "builds-05-randonneur",
        title: "RANDONNEUR",
        subtitle: "long distance, steel",
        label: "BUILD 005",
        meta: "STEEL / 700C",
        width: 1600,
        height: 1200,
        variant: 0,
        alt: {
          hu: "Retró plakát randonneur kerékpárról",
          en: "Retro poster of a randonneur bicycle",
          de: "Retro-Poster eines Randonneur-Rads",
        },
      },
      {
        file: "builds-06-winter-trainer",
        title: "WINTER TRAINER",
        subtitle: "fenders & lights",
        label: "BUILD 006",
        meta: "ALL-WEATHER",
        width: 1400,
        height: 1400,
        variant: 2,
        alt: {
          hu: "Retró plakát téli, sárvédős kerékpárról",
          en: "Retro poster of a winter bicycle with fenders",
          de: "Retro-Poster eines Winterrads mit Schutzblechen",
        },
      },
    ],
  },
  {
    slug: "workshop",
    order: 2,
    title: {
      hu: "Műhely",
      en: "Workshop",
      de: "Werkstatt",
    },
    description: {
      hu: "Pillanatok a Hegyalja utcai műhelyből.",
      en: "Moments from the workshop on Hegyalja utca.",
      de: "Momente aus der Werkstatt in der Hegyalja utca.",
    },
    images: [
      {
        file: "workshop-01-wheel-day",
        title: "WHEEL DAY",
        subtitle: "lace, tension, true",
        label: "WORKSHOP 01",
        meta: "HAND BUILT",
        width: 1600,
        height: 1200,
        variant: 1,
        alt: {
          hu: "Retró plakát kézi keréképítésről",
          en: "Retro poster about hand-built wheels",
          de: "Retro-Poster über handgebaute Laufräder",
        },
      },
      {
        file: "workshop-02-frame-stand",
        title: "ON THE STAND",
        subtitle: "frame prep & alignment",
        label: "WORKSHOP 02",
        meta: "FRAME WORK",
        width: 1400,
        height: 1400,
        variant: 2,
        alt: {
          hu: "Retró plakát vázkészítésről",
          en: "Retro poster about frame preparation",
          de: "Retro-Poster über Rahmenvorbereitung",
        },
      },
      {
        file: "workshop-03-bench-tools",
        title: "BENCH",
        subtitle: "the right tool, every time",
        label: "WORKSHOP 03",
        meta: "TOOLS",
        width: 1600,
        height: 1200,
        variant: 0,
        alt: {
          hu: "Retró plakát a műhely munkapadjáról",
          en: "Retro poster of the workshop bench",
          de: "Retro-Poster der Werkbank",
        },
      },
      {
        file: "workshop-04-packing",
        title: "BOXED",
        subtitle: "packed for the world",
        label: "WORKSHOP 04",
        meta: "SHIPPING",
        width: 1200,
        height: 1600,
        variant: 1,
        alt: {
          hu: "Retró plakát kerékpár csomagolásáról",
          en: "Retro poster about packing a bicycle",
          de: "Retro-Poster über das Verpacken eines Fahrrads",
        },
      },
    ],
  },
  {
    slug: "details",
    order: 3,
    title: {
      hu: "Részletek",
      en: "Details",
      de: "Details",
    },
    description: {
      hu: "Agresszívumok, agyak, szalagok — amiken elakad a szem.",
      en: "Hubs, badges, tape — the bits that reward a closer look.",
      de: "Naben, Plaketten, Lenkerband — die Dinge, die den Blick lohnen.",
    },
    images: [
      {
        file: "details-01-hub",
        title: "HUB",
        subtitle: "bearings & engagement",
        label: "DETAIL 01",
        meta: "MACRO",
        width: 1400,
        height: 1400,
        variant: 2,
        alt: {
          hu: "Retró plakát kerékagy részletről",
          en: "Retro poster of a hub detail",
          de: "Retro-Poster eines Naben-Details",
        },
      },
      {
        file: "details-02-head-badge",
        title: "HEAD BADGE",
        subtitle: "a small signature",
        label: "DETAIL 02",
        meta: "MACRO",
        width: 1600,
        height: 1200,
        variant: 1,
        alt: {
          hu: "Retró plakát kerékpár fejjelvényről",
          en: "Retro poster of a bicycle head badge",
          de: "Retro-Poster eines Steuerkopfschilds",
        },
      },
      {
        file: "details-03-chain-wax",
        title: "CHAIN WAX",
        subtitle: "clean, dry, quiet",
        label: "DETAIL 03",
        meta: "DRIVETRAIN",
        width: 1400,
        height: 1400,
        variant: 0,
        alt: {
          hu: "Retró plakát láncwaxolásról",
          en: "Retro poster about chain waxing",
          de: "Retro-Poster über Kettenwachs",
        },
      },
      {
        file: "details-04-bar-tape",
        title: "BAR TAPE",
        subtitle: "grey, the right grey",
        label: "DETAIL 04",
        meta: "COCKPIT",
        width: 1600,
        height: 1200,
        variant: 2,
        alt: {
          hu: "Retró plakát kormányszalagról",
          en: "Retro poster of handlebar tape",
          de: "Retro-Poster von Lenkerband",
        },
      },
    ],
  },
];

const BLOG_ART = [
  {
    key: "hand-built-wheels",
    title: "WHEEL BUILDING",
    subtitle: "why hand-built wheels last",
    label: "JOURNAL / 01",
    colorway: 2,
  },
  {
    key: "custom-build-process",
    title: "CUSTOM BUILD",
    subtitle: "from sketch to first ride",
    label: "JOURNAL / 02",
    colorway: 1,
  },
  {
    key: "winter-service",
    title: "WINTER SERVICE",
    subtitle: "a checklist for the dark months",
    label: "JOURNAL / 03",
    colorway: 4,
  },
];

function grain(color, opacity = 0.16, size = 18) {
  return el("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
    },
  });
}

function sticker({ ink, accent, size = 168, rotate = -7 }) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 9999,
        border: `3px solid ${ink}`,
        background: accent,
        color: "#17150F",
        transform: `rotate(${rotate}deg)`,
        fontFamily: "Mono",
        fontSize: Math.round(size * 0.11),
        letterSpacing: "1px",
        lineHeight: 1.35,
        textAlign: "center",
        boxShadow: `6px 6px 0 ${ink}`,
      },
    },
    el("span", {}, "HAND"),
    el("span", {}, "BUILT"),
    el("span", { style: { fontSize: Math.round(size * 0.085) } }, "PÉCS"),
  );
}

function topBar(ink, width, label) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Mono",
        fontSize: Math.max(14, Math.round(width * 0.0135)),
        letterSpacing: "3px",
        color: ink,
        textTransform: "uppercase",
      },
    },
    el("span", {}, "Dreamline Cycle"),
    el("span", {}, label),
  );
}

function bikeImage(color, style) {
  return el("img", {
    src: bikeDataUri(color),
    width: style.width,
    height: Math.round(style.width * 0.62),
    style,
  });
}

function tag(colorway, label, width) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colorway.tagBg,
        color: colorway.tagInk,
        fontFamily: "Mono",
        fontSize: Math.max(14, Math.round(width * 0.0145)),
        letterSpacing: "2px",
        padding: `${Math.round(width * 0.012)}px ${Math.round(width * 0.018)}px`,
        boxShadow: `5px 5px 0 ${colorway.ink}`,
        whiteSpace: "nowrap",
      },
    },
    label,
  );
}

function heroLayout(spec, cw, width, height) {
  const pad = Math.round(width * 0.045);
  const bikeWidth = Math.round(width * (width > height ? 0.62 : 0.82));
  return el(
    "div",
    {
      style: {
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: cw.bg,
        padding: pad,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Grotesk",
      },
    },
    grain(cw.ink),
    el("div", {
      style: {
        position: "absolute",
        top: Math.round(height * 0.1),
        left: Math.round(width * 0.02),
        fontFamily: "Archivo",
        fontSize: Math.round(width * 0.24),
        lineHeight: 0.8,
        color: cw.accent,
        opacity: 0.22,
        letterSpacing: "-0.04em",
      },
    }, spec.label.replace(/[^0-9]/g, "").slice(-2) || "01"),
    el("div", { style: { position: "relative", zIndex: 2 } }, topBar(cw.ink, width, spec.meta)),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flex: 1,
          marginTop: Math.round(height * 0.02),
        },
      },
      bikeImage(cw.ink, { width: bikeWidth, alignSelf: "center" }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            right: 0,
            top: Math.round(height * 0.02),
          },
        },
        sticker({ ink: cw.ink, accent: cw.accent, size: Math.round(width * 0.115) }),
      ),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 2,
        },
      },
      el(
        "div",
        { style: { display: "flex", flexDirection: "column", maxWidth: "70%" } },
        el(
          "span",
          {
            style: {
              fontFamily: "Archivo",
              fontSize: Math.round(width * 0.075),
              lineHeight: 0.9,
              color: cw.ink,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            },
          },
          spec.title,
        ),
        el(
          "span",
          {
            style: {
              fontFamily: "Instrument",
              fontStyle: "italic",
              fontSize: Math.round(width * 0.034),
              color: cw.ink,
              marginTop: Math.round(height * 0.014),
            },
          },
          spec.subtitle,
        ),
      ),
      tag(cw, spec.label, width),
    ),
  );
}

function splitLayout(spec, cw, width, height) {
  const pad = Math.round(width * 0.045);
  const portrait = height > width;
  return el(
    "div",
    {
      style: {
        width,
        height,
        display: "flex",
        flexDirection: portrait ? "column" : "row",
        background: cw.bg,
        padding: pad,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Grotesk",
        gap: Math.round(width * 0.02),
      },
    },
    grain(cw.ink, 0.12),
    el("div", {
      style: {
        position: "absolute",
        right: Math.round(-width * 0.12),
        bottom: Math.round(-height * 0.18),
        width: Math.round(width * 0.62),
        height: Math.round(width * 0.62),
        borderRadius: 9999,
        border: `18px solid ${cw.accent}`,
        opacity: 0.5,
      },
    }),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: portrait ? "none" : 1,
          position: "relative",
          zIndex: 2,
        },
      },
      el(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        topBar(cw.ink, width, spec.meta),
        el(
          "span",
          {
            style: {
              fontFamily: "Mono",
              fontSize: Math.round(width * 0.015),
              letterSpacing: "2px",
              color: cw.accent,
              marginTop: Math.round(height * 0.06),
            },
          },
          spec.label,
        ),
        el(
          "span",
          {
            style: {
              fontFamily: "Archivo",
              fontSize: Math.round(width * (portrait ? 0.105 : 0.072)),
              lineHeight: 0.91,
              color: cw.ink,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginTop: Math.round(height * 0.024),
              maxWidth: portrait ? "100%" : "78%",
            },
          },
          spec.title,
        ),
        el(
          "span",
          {
            style: {
              fontFamily: "Instrument",
              fontStyle: "italic",
              fontSize: Math.round(width * 0.034),
              color: cw.ink,
              marginTop: Math.round(height * 0.02),
            },
          },
          spec.subtitle,
        ),
      ),
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: Math.round(width * 0.02) } },
        tag(cw, spec.label, width),
        sticker({
          ink: cw.ink,
          accent: cw.accent,
          size: Math.round(width * 0.1),
          rotate: 6,
        }),
      ),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          position: "relative",
          zIndex: 1,
        },
      },
      bikeImage(cw.ink, {
        width: Math.round(width * (portrait ? 1.02 : 0.6)),
        alignSelf: "center",
        transform: portrait ? "rotate(-8deg)" : "rotate(-5deg)",
      }),
    ),
  );
}

function detailLayout(spec, cw, width, height) {
  const pad = Math.round(width * 0.045);
  const number = spec.label.replace(/[^0-9]/g, "").slice(-2) || "01";
  return el(
    "div",
    {
      style: {
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: cw.bg,
        padding: pad,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Grotesk",
      },
    },
    grain(cw.ink, 0.12),
    el("div", {
      style: {
        position: "absolute",
        top: Math.round(-height * 0.12),
        right: Math.round(-width * 0.04),
        fontFamily: "Archivo",
        fontSize: Math.round(width * 0.5),
        lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `3px ${cw.accent}`,
        letterSpacing: "-0.06em",
      },
    }, number),
    el("div", {
      style: {
        position: "absolute",
        top: 0,
        left: Math.round(width * 0.06),
        width: 14,
        height: "100%",
        background: cw.accent,
        opacity: 0.85,
      },
    }),
    el(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
          paddingLeft: Math.round(width * 0.045),
        },
      },
      el(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        el("span", {
          style: {
            fontFamily: "Mono",
            fontSize: Math.max(13, Math.round(width * 0.013)),
            letterSpacing: "3px",
            color: cw.ink,
          },
        }, "Dreamline Cycle"),
        el("span", {
          style: {
            fontFamily: "Mono",
            fontSize: Math.max(13, Math.round(width * 0.013)),
            letterSpacing: "3px",
            color: cw.ink,
            marginTop: 6,
            opacity: 0.7,
          },
        }, spec.meta),
      ),
      el("span", {
        style: {
          fontFamily: "Mono",
          fontSize: Math.max(13, Math.round(width * 0.013)),
          letterSpacing: "3px",
          color: cw.ink,
        },
      }, "Pécs / HU"),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
          paddingLeft: Math.round(width * 0.045),
        },
      },
      el(
        "span",
        {
          style: {
            fontFamily: "Archivo",
            fontSize: Math.round(width * 0.1),
            lineHeight: 0.88,
            color: cw.ink,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            maxWidth: "82%",
          },
        },
        spec.title,
      ),
      el(
        "span",
        {
          style: {
            fontFamily: "Instrument",
            fontStyle: "italic",
            fontSize: Math.round(width * 0.036),
            color: cw.ink,
            marginTop: Math.round(height * 0.02),
          },
        },
        spec.subtitle,
      ),
      el(
        "div",
        { style: { display: "flex", marginTop: Math.round(height * 0.035) } },
        tag(cw, spec.label, width),
      ),
    ),
    el(
      "div",
      {
        style: {
          position: "absolute",
          right: Math.round(-width * 0.1),
          bottom: Math.round(-height * 0.05),
          display: "flex",
          opacity: 0.92,
        },
      },
      bikeImage(cw.accent, {
        width: Math.round(width * 0.78),
        transform: "rotate(-10deg)",
      }),
    ),
  );
}

function posterMarkup(spec, colorwayIndex, width, height, variant = spec.variant) {
  const cw = colorways[colorwayIndex % colorways.length];
  if (variant === 1) return splitLayout(spec, cw, width, height);
  if (variant === 2) return detailLayout(spec, cw, width, height);
  return heroLayout(spec, cw, width, height);
}

async function buildAlbum(album) {
  const dir = path.join(galleryRoot, album.slug);
  const existing = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(file))
    : [];

  if (existing.length > 0 && !force) {
    console.log(`· ${album.slug}: ${existing.length} photo(s) found — leaving as is`);
    return;
  }

  fs.mkdirSync(dir, { recursive: true });

  const images = {};
  for (const [index, spec] of album.images.entries()) {
    const file = `${spec.file}.jpg`;
    const colorway = index % colorways.length;
    const markup = posterMarkup(spec, colorway, spec.width, spec.height);
    const buffer = await renderJpeg(markup, spec.width, spec.height, 88);
    const target = path.join(dir, file);
    fs.writeFileSync(target, buffer);
    images[file] = {
      alt: spec.alt,
      caption: {
        hu: `${spec.title} — ${spec.label.toLowerCase()}`,
        en: `${spec.title} — ${spec.label.toLowerCase()}`,
        de: `${spec.title} — ${spec.label.toLowerCase()}`,
      },
    };
    console.log(`  ✓ ${album.slug}/${file} (${spec.width}×${spec.height})`);
  }

  const manifestFile = path.join(dir, "album.json");
  if (!fs.existsSync(manifestFile) || force) {
    writeJson(manifestFile, {
      order: album.order,
      title: album.title,
      description: album.description,
      cover: `${album.images[0].file}.jpg`,
      placeholder: true,
      orderFiles: album.images.map((spec) => `${spec.file}.jpg`),
      images,
    });
  }
}

async function buildBlogArt() {
  fs.mkdirSync(blogArtRoot, { recursive: true });
  for (const [index, spec] of BLOG_ART.entries()) {
    const width = 1600;
    const height = 1000;
    const markup = posterMarkup(
      {
        title: spec.title,
        subtitle: spec.subtitle,
        label: spec.label,
        meta: "DREAMLINE CYCLE / PÉCS",
        variant: index % 2 === 0 ? 1 : 0,
      },
      spec.colorway,
      width,
      height,
      index % 2 === 0 ? 1 : 0,
    );
    const buffer = await renderJpeg(markup, width, height, 88);
    fs.writeFileSync(path.join(blogArtRoot, `${spec.key}.jpg`), buffer);
    console.log(`  ✓ blog/${spec.key}.jpg`);
  }
}

async function buildIcons() {
  const icon = (size) => {
    const markup = el(
      "div",
      {
        style: {
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E8401C",
          position: "relative",
          overflow: "hidden",
        },
      },
      el("div", {
        style: {
          position: "absolute",
          width: size * 0.86,
          height: size * 0.86,
          borderRadius: 9999,
          border: `${Math.max(6, size * 0.035)}px solid #F4EBDD`,
        },
      }),
      el("div", {
        style: {
          position: "absolute",
          width: size * 0.62,
          height: size * 0.62,
          borderRadius: 9999,
          border: `${Math.max(2, size * 0.012)}px solid #F4EBDD`,
          opacity: 0.5,
        },
      }),
      el("div", {
        style: {
          display: "flex",
          fontFamily: "Archivo",
          fontSize: size * 0.3,
          color: "#F4EBDD",
          letterSpacing: "-0.06em",
          marginTop: size * 0.01,
        },
      }, "DC"),
    );
    return renderPng(markup, size, size);
  };

  fs.writeFileSync(path.join(publicRoot, "icon-192.png"), await icon(192));
  fs.writeFileSync(path.join(publicRoot, "icon-512.png"), await icon(512));
  fs.writeFileSync(path.join(publicRoot, "apple-touch-icon.png"), await icon(180));
  console.log("  ✓ icons (192, 512, apple-touch)");
}

function writeGalleryReadme() {
  const file = path.join(galleryRoot, "README.md");
  if (fs.existsSync(file)) return;
  fs.mkdirSync(galleryRoot, { recursive: true });
  fs.writeFileSync(
    file,
    `# Gallery photos

Drop photos into an album folder (for example \`builds/\`) and run \`npm run gallery\`
(or just \`npm run dev\` / \`npm run build\`). No code changes needed.

- Albums are folders inside \`content/gallery/\`.
- Each album can have an \`album.json\` with localized title, description, cover,
  ordering and alt text. Missing alt text falls back to the album title.
- Supported formats: jpg, jpeg, png, webp, avif, tif, tiff.
- Generate 480 / 960 / 1600 px AVIF, WebP and JPEG versions automatically.
- Placeholder posters live in this folder until you replace them. Delete the
  whole folder contents and add your own photos to start fresh.

\`album.json\` shape:

\`\`\`json
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
\`\`\`

Set \`STRICT_GALLERY=1\` to make a missing \`alt\` fail the build.
`,
  );
}

console.log("Dreamline Cycle — placeholder artwork");
for (const album of ALBUMS) await buildAlbum(album);
await buildBlogArt();
await buildIcons();
writeGalleryReadme();
console.log("Done.");
