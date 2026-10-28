# Dreamline Cycle — Website Rebuild Plan

**Status:** implementation complete; pre-launch content and deployment details remain
**Stack:** Next.js 16 + React 19 + TypeScript
**Runtime:** Node.js 24 LTS (currently v24.22.1)
**Output:** fully static (`out/`) — host anywhere
**Replaces:** https://www.dreamlinecycle.hu (WordPress)

---

## 1. Overview

| Item            | Decision                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Goal            | Replace the WordPress site with a fast, multilingual, design-led website for a Pécs bike workshop.                    |
| Audience        | Local riders (HU), expats/tourists (EN), German-speaking riders (DE), custom-build customers worldwide.               |
| Languages       | Hungarian (source copy), English, German. Localized URL slugs.                                                        |
| Content sources | MDX files for blog · image folders for gallery · JSON dictionaries for UI copy · TS files for services/FAQ/site data. |
| Rendering       | 100% static generation (SSG) via `output: "export"`. No server required.                                              |
| Styling         | Tailwind CSS 4 (CSS-first `@theme`) + custom retro-cycling design system.                                             |
| Motion          | CSS for marquee, textures and hover; no animation dependency.                                                         |
| Analytics       | GA4 behind a consent banner, Google Consent Mode v2. No tracking before opt-in.                                       |
| Forms           | Static-friendly: POST to a configurable endpoint (Formspree/Web3Forms) + `tel:`/`mailto:` fallback.                   |
| Deployment      | Upload `out/` to any static host/CDN; also ship a Node 24 builder + nginx runtime Docker image.                       |

### Implementation status (2026-10-28)

- The localized static export, content pipelines, metadata routes, consent-gated analytics, gallery, journal and contact/legal pages are implemented.
- Verified: `npm run typecheck`, `npm run lint`, and `npm run build`; the build emits localized URL directories under `out/`.
- Remaining before launch: replace sample gallery/blog imagery with approved photos, confirm legal/operator details and form provider, configure the production domain/analytics as desired, supply old WordPress URLs for redirects, and run Lighthouse plus the browser test suite in the deployment environment.

### Success criteria

- [ ] Lighthouse mobile ≥ 95 for Performance, SEO, Accessibility, Best Practices.
- [ ] LCP < 2.0 s on simulated 4G, CLS < 0.05, initial JS < 150 KB gzip.
- [ ] Three complete locales with correct `hreflang`, canonicals and localized URLs.
- [ ] Adding a photo = drop a file in a folder + rebuild. No code change.
- [ ] Adding a post = add one `.mdx` file + rebuild. No code change.
- [ ] WCAG 2.2 AA: keyboard nav, focus states, contrast, `prefers-reduced-motion`.
- [ ] Works without JavaScript for core content, phone, email, map link.
- [ ] Old WordPress URLs 301-redirect to their new equivalents.

---

## 2. Decisions & versions

| Area                | Choice                                                               | Version           |
| ------------------- | -------------------------------------------------------------------- | ----------------- |
| Framework           | Next.js App Router, TypeScript strict                                | 16.4.x            |
| UI                  | React                                                                | 19.3.x            |
| Language            | TypeScript (pin 5.9 until TS 7 is verified with Next 16)             | 5.9.x             |
| Styling             | Tailwind CSS 4 + `@tailwindcss/postcss`                              | 4.3.x             |
| i18n                | `next-intl` (localized pathnames, typed messages)                    | 4.14.x            |
| Motion              | CSS animations and transitions                                       | —                 |
| Icons               | `lucide-react` + custom brand SVGs                                   | 1.x               |
| Blog                | `gray-matter` + `next-mdx-remote/rsc` + `remark-gfm` + `rehype-slug` | 4 / 6 / 4         |
| Validation          | `zod`                                                                | 4.x               |
| Image + OG pipeline | `sharp` + `satori`                                                   | latest            |
| Tests               | Vitest + Playwright + `@axe-core/playwright`                         | 5 / 1.64          |
| Lint/format         | ESLint flat config + Prettier                                        | latest compatible |
| Package manager     | npm (preinstalled)                                                   | 11.19.x           |

**Static-export consequences (designed around, not worked around):**

| Limitation                                          | Our solution                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| No middleware                                       | Branded language gateway at `/` with client-side browser-language detection + remembered choice. |
| No Image Optimization API                           | Build-time `sharp` pipeline generates AVIF/WebP/JPEG at 480/960/1600 px + blur placeholders.     |
| No API routes                                       | Contact form posts to an external form endpoint; `tel:`/`mailto:` always available.              |
| No middleware / localized rewrites in static export | A localized catch-all route emits every configured translated path via `generateStaticParams()`. |
| OG images at request time                           | Pre-generate branded PNGs at build time with `satori` + `sharp`.                                 |
| `redirects()` unsupported                           | Ship host redirects (`_redirects`, nginx `map`, `.htaccess`) for old WP URLs.                    |

---

## 3. Information architecture

Localized slugs via next-intl pathnames:

| Page     | HU                    | EN                    | DE                    |
| -------- | --------------------- | --------------------- | --------------------- |
| Home     | `/hu`                 | `/en`                 | `/de`                 |
| Services | `/hu/szolgaltatasok`  | `/en/services`        | `/de/leistungen`      |
| Gallery  | `/hu/galeria`         | `/en/gallery`         | `/de/galerie`         |
| Album    | `/hu/galeria/[album]` | `/en/gallery/[album]` | `/de/galerie/[album]` |
| Blog     | `/hu/blog`            | `/en/blog`            | `/de/blog`            |
| Post     | `/hu/blog/[slug]`     | `/en/blog/[slug]`     | `/de/blog/[slug]`     |
| Contact  | `/hu/kapcsolat`       | `/en/contact`         | `/de/kontakt`         |
| Privacy  | `/hu/adatvedelem`     | `/en/privacy`         | `/de/datenschutz`     |
| Imprint  | `/hu/impresszum`      | `/en/imprint`         | `/de/impressum`       |

Plus: `/` language gateway, static `404.html`, `sitemap.xml`, `robots.txt`, `rss/{hu,en,de}.xml`, `manifest.webmanifest`.

---

## 4. Page specifications

### 4.1 Global shell

- Slim announcement bar: Pécs address · phone · "call before visiting" note.
- Sticky header that condenses on scroll: wordmark, nav, language switcher, phone CTA.
- Mobile full-screen menu with oversized links and social row.
- Footer: giant wordmark, nav columns, contact, socials, legal links, "Cookie settings", back-to-top.
- Skip link, visible focus rings, reduced-motion support.
- Cookie banner (Accept / Reject / Preferences) — blocks GA and map embed until consent.

### 4.2 Home page

```
┌────────────────────────────────────────────────────┐
│ ANNOUNCEMENT · Pécs, Hegyalja u. 20 · +36 30 ...   │
│ HEADER   wordmark      nav      HU|EN|DE   [Call]  │
├────────────────────────────────────────────────────┤
│ HERO                                               │
│  eyebrow             ┌──────────────────┐          │
│  RIDE                │   bike photo     │  sticker │
│  DIFFERENT.          │   arch frame     │  badge   │
│  subcopy   [CTA][CTA]└──────────────────┘          │
│  ── ticker: SERVICE ✳ CUSTOM BUILDS ✳ WHEELS ──    │
├────────────────────────────────────────────────────┤
│ ABOUT      big statement · workshop photo · facts  │
├────────────────────────────────────────────────────┤
│ SERVICES   01–07 numbered "ticket" cards            │
├────────────────────────────────────────────────────┤
│ BUILDS     asymmetric gallery contact sheet → link  │
├────────────────────────────────────────────────────┤
│ PROCESS    01 consult · 02 design · 03 build · 04 ride │
├────────────────────────────────────────────────────┤
│ BLOG       3 latest posts as zine cards             │
├────────────────────────────────────────────────────┤
│ CONTACT    poster block · map · phone/email/form    │
├────────────────────────────────────────────────────┤
│ FOOTER     giant wordmark · links · socials         │
└────────────────────────────────────────────────────┘
```

- Hero headline localized: HU “TEKERJ MÁSKÉPP.” · EN “RIDE DIFFERENT.” · DE “ANDERS FAHREN.”
- Primary CTA = call the workshop; secondary = view builds.
- No invented stats, opening hours, prices, founding year or testimonials. Factual plates only (“full service”, “custom builds with warranty”, “worldwide shipping”).
- Testimonials section renders only when real quotes are added to `src/content/testimonials.ts`; until then a bold review/Google block is shown.

### 4.3 Services page

- Intro + 7 services from the original site:
  1. Full bicycle servicing
  2. Custom bicycle builds with warranty
  3. Custom wheel building
  4. Protective film & waxing
  5. Loan bike during service
  6. Warranty used-bike sales
  7. Worldwide bike shipping
- Each service: number, icon/photo, short description, “call to book” link.
- “How it works” 4-step strip, FAQ accordion (from `src/content/faq.ts`), contact CTA.
- Home page links here; no duplicated long copy.

### 4.4 Gallery

- Album chips (“All”, “Builds”, “Workshop”, “Details”) + photo count.
- Responsive contact-sheet grid, varied aspect ratios, hover caption + index number.
- Accessible lightbox: keyboard arrows/Esc, focus trap, swipe, caption, counter, download disabled.
- Deep-linkable albums. `ImageObject` JSON-LD. Lazy loading + responsive `<picture>`.
- Empty/placeholder state documented.

### 4.5 Blog

- Index: featured latest post, tag filter, client-side text filter (no search lib), grid of zine-style cards.
- Post: cover, title, date, reading time, tags, author, TOC, MDX body, share links, related posts, CTA.
- Typographic MDX components: figures with captions, pull quotes, callouts, video embeds, tables, code.
- Per-locale RSS. Draft flag. `BlogPosting` JSON-LD. Fallback notice when a translation is missing.

### 4.6 Contact

- Phone, email, address, socials, “call before visiting” notice.
- Google Maps: static link always; embedded map only after consent (no third-party cookies before opt-in).
- Contact form: name, email, phone (optional), service, message, consent checkbox; zod validation, honeypot, loading/success/error states; mailto fallback.
- FAQ + service area + worldwide shipping note.

### 4.7 Legal / system pages

- Privacy policy (analytics, cookies, form provider, hosting) and imprint, in all 3 locales.
- Cookie preferences re-openable from footer.
- Branded 404 with links home/gallery/blog.
- `sitemap.xml` with locale alternates, `robots.txt`, `manifest.webmanifest`, favicons.

---

## 5. Content model

### 5.1 Gallery (folder-driven)

```
content/gallery/
├─ builds/
│  ├─ album.json          # localized title/description/cover/order
│  ├─ 01-steel-road.jpg
│  └─ 02-gravel-build.jpg
├─ workshop/
└─ details/
```

- `album.json`: `{ "title": {hu,en,de}, "description": {...}, "cover": "01-...jpg", "order": [...] }`
- Optional `alt` map per file; otherwise derived from filename. Alt is required (or explicitly `decorative`).
- Accepted: `.jpg .jpeg .png .webp .avif`. EXIF orientation normalized.
- `scripts/sync-gallery.mjs` (run on `predev` / `prebuild`):
  - scans folders, sorts by `album.json` order then filename
  - emits 480/960/1600 px AVIF + WebP + JPEG into `public/generated/gallery/…`
  - writes `src/generated/gallery.json` with dimensions, srcsets, blur data URL, alt, captions
  - incremental: skips unchanged files by hash → fast rebuilds
- Generated output is gitignored; CI rebuilds it. No runtime `fs` access needed.

### 5.2 Blog (MDX)

```
content/blog/
├─ hu/elso-verejtokozo-kerekpar.md
├─ en/first-custom-bike.md
└─ de/erstes-custom-bike.md
```

```yaml
---
title: "..."
description: "..."
date: 2026-10-28
updated: 2026-10-30 # optional
cover: /images/blog/slug.jpg
coverAlt: "..."
tags: [custom, workshop]
author: Dreamline Cycle
translationKey: first-custom-bike # links locales for hreflang
slug: first-custom-bike # optional localized slug
draft: false
---
```

- Parsed at build time (`gray-matter`), compiled with `next-mdx-remote/rsc`.
- Reading time, related posts, tag pages optional, per-locale RSS, sitemap entries.
- Skip `draft: true` in production builds.

### 5.3 Other content

- `messages/{hu,en,de}.json` — all UI strings, section copy, nav, form labels, legal. Typed via next-intl.
- `src/content/site.ts` — contact data, socials, address, map link, optional hours, env-driven analytics/form settings.
- `src/content/services.ts`, `faq.ts`, `testimonials.ts`, `process.ts`.

---

## 6. Design system — “Bold Retro Cycling”

A modern reinterpretation of 70s/80s cycling posters: aged paper, heavy ink type, racing colors, halftone textures, sticker badges and thick rules — laid out on a clean contemporary grid so it stays premium, not kitschy.

### 6.1 Palette

| Token    | Hex       | Use                           |
| -------- | --------- | ----------------------------- |
| `paper`  | `#F4EBDD` | page background               |
| `ink`    | `#17150F` | text, borders, footer         |
| `race`   | `#E8401C` | primary CTA, highlights       |
| `cobalt` | `#2440E8` | secondary blocks, links       |
| `sun`    | `#F2C230` | badges, marquee, accents      |
| `mint`   | `#0F7A63` | success states, small accents |
| `steel`  | `#8C8778` | muted text (contrast-checked) |

Rules: ink text on paper/sun/mint; paper text on ink/race/cobalt. No gradients on text. Accent colors never used for long body copy.

### 6.2 Typography

| Role      | Font                      | Usage                                                    |
| --------- | ------------------------- | -------------------------------------------------------- |
| Display   | `Archivo Black`           | hero, section titles, footer wordmark (uppercase, tight) |
| Editorial | `Instrument Serif` italic | pull quotes, eyebrow accents                             |
| Body      | `Space Grotesk`           | paragraphs, nav, buttons                                 |
| Mono      | `Space Mono`              | labels, numbering, dates, tags                           |

- All via `next/font/google`, subsets `latin` + `latin-ext` (Hungarian ő/ű), `display: swap`, self-hosted at build.
- Fluid type with `clamp()`; hero 56 → 160 px.

### 6.3 Texture & components

- Halftone dots (CSS radial-gradient), subtle grain (inline SVG), 2 px rules, hard offset shadows, 2–6° sticker rotations.
- `Button` (solid/outline/ghost), `StickerBadge`, `SectionHeading`, `Marquee`, `TicketCard`, `FactPlate`, `Reveal`, `TiltCard`, `Picture`, `Lightbox`, `Accordion`, `LanguageSwitcher`, `ConsentBanner`, `ContactForm`.
- Rounded corners kept minimal (0–4 px) except pill chips.
- Breakpoints: 360 / 640 / 768 / 1024 / 1280 / 1536.

### 6.4 Motion

- Scroll reveals (12–24 px + fade, stagger), marquee, image parallax, hover lift/tilt, lightbox zoom.
- 150–400 ms, ease-out; no motion that blocks reading.
- All disabled under `prefers-reduced-motion`; no heavy WebGL/three.js.

### 6.5 Accessibility

- Contrast AA on every token pairing.
- Visible `:focus-visible` outline in `cobalt`/`race`.
- Semantic landmarks, one `h1` per page, correct heading order.
- Gallery alt text required at build time (fails build if missing, unless decorative).
- Lightbox/menu/accordion with keyboard + ARIA, focus restoration.
- Form labels, inline errors, `aria-live` status.

---

## 7. Technical architecture

```
dreamlinecycle-web/
├─ content/
│  ├─ blog/{hu,en,de}/*.mdx
│  └─ gallery/<album>/…
├─ messages/{hu,en,de}.json
├─ public/
│  ├─ images/ (brand, placeholder art, blog covers)
│  ├─ generated/ (gallery variants, OG images)   [gitignored]
│  ├─ _redirects                                  (old WP URLs)
│  └─ favicon.svg, site.webmanifest, 404.html
├─ scripts/
│  ├─ sync-gallery.mjs
│  ├─ generate-og.mjs
│  ├─ generate-rss.mjs
│  └─ make-placeholders.mjs
├─ src/
│  ├─ app/
│  │  ├─ (gateway)/layout.tsx, page.tsx        # `/` language gateway
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx, page.tsx
│  │  │  ├─ services/, gallery/, blog/, contact/, privacy/, imprint/
│  │  │  └─ not-found.tsx
│  │  ├─ sitemap.ts, robots.ts, globals.css
│  ├─ components/
│  │  ├─ layout/    Header, Footer, MobileNav, LanguageSwitcher, ConsentBanner
│  │  ├─ sections/  Hero, Marquee, About, Services, Process, GalleryPreview,
│  │  │             Testimonials, BlogPreview, ContactCta
│  │  ├─ ui/        Button, StickerBadge, SectionHeading, Reveal, Picture, …
│  │  ├─ gallery/   GalleryGrid, AlbumFilter, Lightbox
│  │  ├─ blog/      PostCard, PostBody, TOC, MDXComponents, ShareLinks
│  │  └─ forms/     ContactForm, Field
│  ├─ content/      site, services, faq, testimonials, process
│  ├─ lib/          gallery, blog, seo, jsonld, consent, analytics, i18n, format
│  ├─ generated/    gallery.json, blog.json, search-index.json   [gitignored]
│  └─ types/
├─ tests/           unit/ + e2e/
├─ .github/workflows/ci.yml
├─ Dockerfile · nginx.conf
├─ next.config.ts · postcss.config.mjs · tsconfig.json · eslint.config.mjs
├─ .nvmrc · .env.example · package.json · README.md · plan.md
```

### i18n

- next-intl with `localePrefix: "always"`, localized pathnames, `setRequestLocale()` on every static page.
- `/` is a separate root layout (route group) because the site root is not locale-prefixed:
  - detects `navigator.languages` → `/hu`, `/en` or `/de`
  - remembers the choice in `localStorage`
  - shows a branded 3-language chooser as fallback (works without JS).
- Language switcher preserves the current page and maps localized slugs.
- `hreflang` alternates + `x-default` → `/hu` on every page.
- Hungarian copy is authoritative; EN/DE are first-pass translations flagged for native review.

### SEO

- `buildMetadata()` helper: title template, description, canonical, hreflang, OG/Twitter, article dates.
- Static branded OG images per page type + per blog post (`satori` + `sharp`, build time).
- `sitemap.xml` with locale alternates; `robots.txt`; RSS per locale.
- JSON-LD: `BikeStore`/`LocalBusiness` (address, phone, email, socials, service catalog, optional hours), `WebSite`, `BreadcrumbList`, `BlogPosting`, `ImageObject`.
- Semantic HTML, descriptive alts, internal linking, clean 404.
- Old WP redirects: `/galeria/` → `/hu/galeria`, `/blog/` → `/hu/blog`, exported legacy post URLs → new posts (301). Requires old sitemap/URL list.
- Search Console verification via env var; submit sitemap at launch.

### Analytics & privacy

- GA4 via `@next/third-parties/google`, loaded **only after consent**.
- Consent Mode v2: analytics/marketing denied by default, updated on accept.
- Banner: equal-prominence Accept/Reject, preferences, re-open from footer, stored in `localStorage`.
- Map iframe loads only after the visitor clicks “Load map”; it is not embedded in the initial HTML.
- No analytics in development. Optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` alternative.
- Privacy policy covers GA, cookies, form provider, hosting.

### Performance

- Server components by default; client islands only for menu, switcher, filters, lightbox, form and consent.
- Pre-generated responsive images with width/height (zero CLS), `loading="lazy"` below the fold, `fetchpriority="high"` on hero image.
- Font subsetting + `display: swap`; preload display font only.
- No client-side data fetching; all content baked at build.
- Budget: initial JS < 150 KB gzip, images lazy, CSS < 40 KB gzip.

---

## 8. Tooling, Node 24 & scripts

```jsonc
// package.json (excerpt)
{
  "engines": { "node": ">=24.0.0 <25" },
  "packageManager": "npm@11.19.1",
  "scripts": {
    "dev": "npm run content && next dev",
    "build": "npm run content && next build",
    "start": "node scripts/serve-static.mjs",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "content": "node scripts/make-placeholders.mjs && node scripts/sync-gallery.mjs && node scripts/make-og.mjs && node scripts/make-rss.mjs",
    "gallery": "node scripts/sync-gallery.mjs",
    "og": "node scripts/make-og.mjs",
    "rss": "node scripts/make-rss.mjs",
    "format": "prettier --write .",
  },
}
```

- `.nvmrc` → `24.22.1`; `package.json` engines restrict Node to 24.x.
- `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- Vitest: blog headings/translations/content, date/reading-time helpers and consent parsing.
- Playwright: gateway locales, localized metadata, gallery-album language switching, contact labels/axe critical scan and 404.
- Lighthouse CI against the built `out/` output.
- ESLint flat config + Prettier + `tsc --noEmit` in CI.

### Build & deploy

- `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`.
- `npm run build` → `out/` containing HTML, assets, `404.html`, sitemap, RSS, OG images.
- Docker: `node:24-alpine` builder → `nginx:stable-alpine` runtime, immutable caching for generated/static assets, no-cache for HTML, baseline security headers. CSP, non-root runtime and compression remain deployment hardening items.
- GitHub Actions: Node 24 → `npm ci` → lint → typecheck → unit → build → Playwright → Lighthouse → upload `out/` artifact. Deploy step added once host is chosen.
- Legacy URL redirects remain pending the old WordPress URL list; do not invent mappings.

---

## 9. Milestones

| #   | Milestone             | Deliverables                                                                                          | Done when                                                        |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| M0  | Foundation            | Next 16 + TS + Tailwind 4 scaffold, Node 24 pins, fonts, tokens, lint/test/CI, `plan.md`              | `npm run build` passes; CI green                                 |
| M1  | Shell & design system | Header, footer, mobile nav, language switcher, buttons, stickers, textures, motion primitives         | Responsive shell looks right on 360/768/1280; keyboard nav works |
| M2  | Home page             | Hero, ticker, about, services, gallery preview, process, blog preview, contact CTA                    | All 3 locales render; Lighthouse ≥ 90                            |
| M3  | Gallery               | Folder pipeline, variants, manifest, albums, grid, lightbox                                           | Drop 5 photos → rebuild → appear; axe clean                      |
| M4  | Blog                  | MDX pipeline, index/filters, post page, TOC, related, RSS, search index                               | Add `.mdx` → rebuild → post + RSS + sitemap update               |
| M5  | SEO, analytics, legal | Metadata/hreflang, OG images, JSON-LD, sitemap, robots, GA + consent, privacy/imprint, 404, redirects | Rich results valid; GA fires only after consent                  |
| M6  | Contact & forms       | Contact page, form endpoint, validation, map consent, fallback                                        | Form submits; no-JS fallback works                               |
| M7  | QA & launch           | E2E, axe, Lighthouse, content check, deploy docs, README                                              | All success criteria met                                         |

---

## 10. What I need from the owner

| Item                                       | Needed for                  | Fallback until provided                             |
| ------------------------------------------ | --------------------------- | --------------------------------------------------- |
| Logo / brand files                         | Header, footer, favicon, OG | Custom typographic wordmark + chainring mark        |
| Real photos (hero, workshop, 10–20 builds) | Hero, gallery               | Generated retro poster placeholders, clearly marked |
| Opening hours                              | Contact, footer, JSON-LD    | “Call before visiting” (as on current site)         |
| Prices / price range                       | Services, JSON-LD           | Omit prices                                         |
| Real testimonials                          | Social proof                | Hidden section + Google review link                 |
| Form provider choice                       | Contact form                | Env-configurable endpoint + `mailto:`               |
| Host / domain / DNS access                 | Launch                      | Build artifact + Docker image ready                 |
| Old WP URL list or sitemap                 | 301 redirects               | Export from current site before DNS switch          |
| GA4 property ID                            | Analytics                   | Disabled until provided                             |

---

## 11. Risks

| Risk                                               | Mitigation                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| Static export lacks middleware/API/image optimizer | Planned around (gateway, external form, build-time images); verified in M0 spike. |
| Hungarian glyphs (ő, ű) missing from fonts         | Use `latin-ext` subsets and visually verify all 3 locales.                        |
| Placeholder content ships by accident              | `TODO` markers + launch checklist + build warning for placeholder images.         |
| Large photo folders slow builds                    | Hash-based incremental variants, sensible max width (1600 px), AVIF.              |
| EN/DE translation quality                          | First-pass translations reviewed by native speaker before launch.                 |
| Old SEO traffic lost                               | 301 map + Search Console change-of-address after launch.                          |
| Consent/analytics compliance                       | No tracking before opt-in; documented in privacy policy.                          |
| Fake reviews/hours/prices                          | Never invented; sections hide or omit.                                            |

---

## 12. Out of scope (for v1)

E-commerce/checkout, service booking calendar, newsletter, comments, CMS admin UI, user accounts, dark-mode toggle.
