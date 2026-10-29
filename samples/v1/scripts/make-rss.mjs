#!/usr/bin/env node
/**
 * Generates per-locale RSS feeds for the workshop journal.
 * Output: public/rss/{hu,en,de}.xml
 *
 * Usage: node scripts/make-rss.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const blogRoot = path.join(root, "content", "blog");
const outDir = path.join(root, "public", "rss");
const locales = ["hu", "en", "de"];
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dreamlinecycle.hu").replace(
  /\/$/,
  "",
);
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const sitePath = (path) => `${siteUrl}${basePath}${path}`;

const channel = {
  hu: {
    title: "Dreamline Cycle — Műhelynapló",
    description:
      "Építési naplók, műhelytitkok és gyakorlati tanácsok a pécsi Dreamline Cycle műhelyből.",
    language: "hu-HU",
  },
  en: {
    title: "Dreamline Cycle — Workshop journal",
    description:
      "Build logs, workshop notes and practical advice from the Dreamline Cycle workshop in Pécs.",
    language: "en-GB",
  },
  de: {
    title: "Dreamline Cycle — Werkstattjournal",
    description:
      "Aufbauberichte, Werkstattnotizen und praktische Tipps aus der Dreamline Cycle Werkstatt in Pécs.",
    language: "de-DE",
  },
};

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRfc822(date) {
  return new Date(`${date}T08:00:00Z`).toUTCString();
}

function readPosts(locale) {
  const dir = path.join(blogRoot, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const data = parsed.data;
      return {
        slug: data.slug || file.replace(/\.mdx?$/, ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date ? String(data.date).slice(0, 10) : "1970-01-01",
        updated: data.updated ? String(data.updated).slice(0, 10) : null,
        tags: data.tags || [],
        cover: data.cover || null,
        draft: Boolean(data.draft),
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function feed(locale, posts) {
  const meta = channel[locale];
  const items = posts
    .map((post) => {
      const url = sitePath(`/${locale}/blog/${post.slug}/`);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      ${post.updated ? `<dc:modified>${escapeXml(post.updated)}</dc:modified>` : ""}
      <description>${escapeXml(post.description)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      ${post.cover ? `<enclosure url="${escapeXml(sitePath(post.cover))}" type="image/jpeg" length="0"/>` : ""}
    </item>`;
    })
    .join("\n");

  const lastBuild = posts[0] ? toRfc822(posts[0].updated || posts[0].date) : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${sitePath(`/${locale}/blog/`)}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${sitePath(`/rss/${locale}.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const locale of locales) {
  const posts = readPosts(locale);
  fs.writeFileSync(path.join(outDir, `${locale}.xml`), feed(locale, posts));
  console.log(`  ✓ rss/${locale}.xml (${posts.length} item(s))`);
}
console.log("RSS feeds written to public/rss/");
