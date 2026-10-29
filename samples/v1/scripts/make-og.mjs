#!/usr/bin/env node
/**
 * Generates 1200×630 Open Graph images for every page and blog post.
 * Output: public/generated/og/*.png
 *
 * Usage: node scripts/make-og.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  bikeDataUri,
  colorways,
  el,
  renderPng,
  root,
} from "./lib/design.mjs";

const outDir = path.join(root, "public", "generated", "og");
const blogRoot = path.join(root, "content", "blog");
const locales = ["hu", "en", "de"];

fs.mkdirSync(outDir, { recursive: true });

const PAGES = {
  home: {
    label: "DREAMLINE CYCLE / PÉCS",
    title: {
      hu: "TEKERJ MÁSKÉPP.",
      en: "RIDE DIFFERENT.",
      de: "ANDERS FAHREN.",
    },
    subtitle: {
      hu: "Egyedi kerékpárok és teljeskörű szerviz",
      en: "Custom bicycles and full-service care",
      de: "Individuelle Fahrräder und kompletter Service",
    },
    colorway: 0,
  },
  services: {
    label: "SZOLGÁLTATÁSOK / SERVICES",
    title: {
      hu: "Amit a műhelyben művelünk",
      en: "What we do in the workshop",
      de: "Was wir in der Werkstatt machen",
    },
    subtitle: {
      hu: "Szerviz · Egyedi építés · Kézi kerekek",
      en: "Service · Custom builds · Hand-built wheels",
      de: "Service · Individuelle Aufbauten · Laufradbau",
    },
    colorway: 2,
  },
  gallery: {
    label: "GALÉRIA / GALLERY",
    title: {
      hu: "Építések és műhelypillanatok",
      en: "Builds and workshop moments",
      de: "Aufbauten und Werkstattmomente",
    },
    subtitle: {
      hu: "Egyedi gépek, pécsi kézzel",
      en: "One-off machines, made in Pécs",
      de: "Einzelstücke aus Pécs",
    },
    colorway: 1,
  },
  blog: {
    label: "MŰHELYNAPLÓ / JOURNAL",
    title: {
      hu: "Történetek a műhelyből",
      en: "Stories from the workshop",
      de: "Geschichten aus der Werkstatt",
    },
    subtitle: {
      hu: "Építési naplók és gyakorlati tanácsok",
      en: "Build logs and practical advice",
      de: "Aufbauberichte und praktische Tipps",
    },
    colorway: 4,
  },
  contact: {
    label: "KAPCSOLAT / CONTACT",
    title: {
      hu: "Beszéljük meg a következő gépet",
      en: "Let's talk about the next machine",
      de: "Reden wir über das nächste Rad",
    },
    subtitle: {
      hu: "Pécs, Hegyalja u. 20. · +36 30 688 3723",
      en: "Hegyalja u. 20, Pécs · +36 30 688 3723",
      de: "Hegyalja u. 20, Pécs · +36 30 688 3723",
    },
    colorway: 5,
  },
  privacy: {
    label: "ADATVÉDELEM / PRIVACY",
    title: {
      hu: "Adatvédelmi tájékoztató",
      en: "Privacy policy",
      de: "Datenschutzerklärung",
    },
    subtitle: {
      hu: "Átlátható adatkezelés, sütik és jogaid",
      en: "Clear data handling, cookies and your rights",
      de: "Klare Datenverarbeitung, Cookies und Ihre Rechte",
    },
    colorway: 3,
  },
  imprint: {
    label: "IMPRESSZUM / IMPRINT",
    title: {
      hu: "Impresszum",
      en: "Imprint",
      de: "Impressum",
    },
    subtitle: {
      hu: "Dreamline Cycle · Pécs, Hegyalja u. 20.",
      en: "Dreamline Cycle · Hegyalja u. 20, Pécs",
      de: "Dreamline Cycle · Hegyalja u. 20, Pécs",
    },
    colorway: 3,
  },
};

function trim(value, length) {
  if (value.length <= length) return value;
  const cut = value.slice(0, length);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function ogMarkup({ label, title, subtitle, colorwayIndex }) {
  const cw = colorways[colorwayIndex % colorways.length];
  const size = title.length > 34 ? 52 : title.length > 24 ? 62 : 74;

  return el(
    "div",
    {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: cw.bg,
        padding: 56,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Grotesk",
      },
    },
    el("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(${cw.ink} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        opacity: 0.12,
      },
    }),
    el("div", {
      style: {
        position: "absolute",
        right: -70,
        top: 60,
        width: 380,
        height: 380,
        borderRadius: 9999,
        border: `16px solid ${cw.accent}`,
        opacity: 0.55,
      },
    }),
    el("div", {
      style: {
        position: "absolute",
        right: -20,
        bottom: -60,
        display: "flex",
      },
    }, el("img", {
      src: bikeDataUri(cw.ink),
      width: 620,
      height: 384,
      style: { transform: "rotate(-8deg)" },
    })),
    el(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Mono",
          fontSize: 17,
          letterSpacing: "3px",
          color: cw.ink,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 2,
        },
      },
      el("span", {}, "Dreamline Cycle"),
      el("span", {}, label),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          maxWidth: 700,
          position: "relative",
          zIndex: 2,
        },
      },
      el("div", {
        style: {
          width: 84,
          height: 10,
          background: cw.accent,
          marginBottom: 24,
        },
      }),
      el(
        "span",
        {
          style: {
            fontFamily: "Archivo",
            fontSize: size,
            lineHeight: 0.94,
            letterSpacing: "-0.035em",
            color: cw.ink,
            textTransform: "uppercase",
          },
        },
        title,
      ),
      el(
        "span",
        {
          style: {
            fontFamily: "Instrument",
            fontStyle: "italic",
            fontSize: 30,
            color: cw.ink,
            marginTop: 22,
          },
        },
        subtitle,
      ),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          zIndex: 2,
        },
      },
      el("div", {
        style: {
          display: "flex",
          background: cw.tagBg,
          color: cw.tagInk,
          fontFamily: "Mono",
          fontSize: 15,
          letterSpacing: "2px",
          padding: "10px 16px",
        },
      }, "PÉCS · HU"),
      el("span", {
        style: {
          fontFamily: "Mono",
          fontSize: 15,
          letterSpacing: "2px",
          color: cw.ink,
          opacity: 0.75,
        },
      }, "DREAMLINECYCLE.HU"),
    ),
  );
}

async function writeOg(name, config) {
  const markup = ogMarkup(config);
  const buffer = await renderPng(markup, 1200, 630);
  fs.writeFileSync(path.join(outDir, `${name}.png`), buffer);
}

function readPosts(locale) {
  const dir = path.join(blogRoot, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      const slug = parsed.data.slug || file.replace(/\.mdx?$/, "");
      return {
        slug,
        title: parsed.data.title || slug,
        description: parsed.data.description || "",
        date: parsed.data.date ? String(parsed.data.date).slice(0, 10) : "",
        translationKey: parsed.data.translationKey,
      };
    })
    .filter((post) => !post.draft);
}

async function main() {
  console.log("Dreamline Cycle — Open Graph images");

  for (const [page, config] of Object.entries(PAGES)) {
    for (const locale of locales) {
      await writeOg(`${page}-${locale}`, {
        label: config.label,
        title: config.title[locale],
        subtitle: config.subtitle[locale],
        colorwayIndex: config.colorway,
      });
    }
    console.log(`  ✓ ${page} (${locales.join(", ")})`);
  }

  const seen = new Set();
  for (const locale of locales) {
    for (const post of readPosts(locale)) {
      const name = `blog-${locale}-${post.slug}`;
      if (seen.has(name)) continue;
      seen.add(name);
      await writeOg(name, {
        label: post.date ? `JOURNAL / ${post.date.slice(0, 4)}` : "JOURNAL",
        title: trim(post.title, 58),
        subtitle: trim(post.description, 92) || "Dreamline Cycle · Pécs",
        colorwayIndex: 4,
      });
    }
  }
  console.log(`  ✓ ${seen.size} blog cover image(s)`);

  console.log(`OG images: ${Object.keys(PAGES).length * locales.length + seen.size} → public/generated/og/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
