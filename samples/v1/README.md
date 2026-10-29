# Dreamline Cycle

Multilingual (Hungarian, English, German) bicycle workshop website for Dreamline Cycle in Pécs. Built with Next.js 16 and React 19, exported as static files to `out/` for deployment on any static host or CDN.

## Requirements

- Node.js 24 LTS (`.nvmrc` and `package.json` pin the supported major)
- npm 11

```sh
npm ci
npm run dev
```

The development server runs at <http://localhost:3000>. Content assets are generated before development and production builds.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Generate content assets and start Next.js in development mode |
| `npm run build` | Generate content assets and produce the static site in `out/` |
| `npm run start` | Serve the exported `out/` directory locally |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Build and test the exported site with Playwright |
| `npm run gallery` | Rebuild gallery derivatives and manifest |
| `npm run rss` | Regenerate locale-specific RSS feeds |

## Configuration

Copy `.env.example` to `.env.local` for local work. `NEXT_PUBLIC_*` values are embedded in the generated site at build time; configure them in the build environment, not only on the static host.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin used by metadata, sitemap and RSS |
| `NEXT_PUBLIC_BASE_PATH` | Optional path prefix for project-site hosting; set automatically by the Pages workflow |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID; loaded only after analytics consent |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Optional HTTPS endpoint accepting the contact form's JSON POST |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile public site key |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Search Console verification token |

The form falls back to a prefilled `mailto:` when no endpoint is configured. A form endpoint must validate inputs and verify Turnstile tokens server-side; the browser widget alone is not spam protection. Do not put private keys or Turnstile secrets in `NEXT_PUBLIC_*` variables.

## Content

### Gallery

Add JPEG, PNG, WebP or AVIF source photos under `content/gallery/<album>/`. Each album has an `album.json` file with its slug and HU/EN/DE title and description. `npm run build` creates resized AVIF/WebP/JPEG variants and a manifest; generated files are intentionally ignored by Git. See `content/gallery/README.md` for the format. Replace the included sample imagery with approved workshop photos before launch.

### Journal

Add `.md` or `.mdx` posts to `content/blog/{hu,en,de}/`. Include frontmatter for `title`, `description`, `date`, `cover`, `coverAlt`, `tags` and (where translations correspond) a shared `translationKey`. Blog RSS feeds are regenerated during the build. Posts are static content and require a rebuild to publish.

## Localized routes

The static export contains the localized directories, including `/hu/szolgaltatasok/`, `/en/services/`, `/de/leistungen/`, and their gallery, journal, contact and legal routes. `/` is a language-selection gateway. Static hosting must serve directory `index.html` files and `404.html`; the included nginx config does this.

## Deployment

Run `npm run build` and upload the contents of `out/` to a static host. Alternatively:

```sh
docker build -t dreamlinecycle-web .
docker run --rm -p 8080:80 dreamlinecycle-web
```

Set public environment variables at build time. The static export does not run Next.js middleware, API routes or server actions. The contact form therefore requires an external form endpoint for submission; without one, it opens the visitor's email client. Add redirects for legacy WordPress URLs at the host once the old URL list is available; no legacy mappings are guessed in this project.

### GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys `main` to the default project URL: <https://blaisedegrille.github.io/dreamlinecycle-web/>. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow runs lint, typecheck, unit and browser tests, then builds with the repository path prefix so page links, images, feeds and metadata work from the project URL. No custom domain is configured.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Playwright needs its Chromium browser installed once (`npx playwright install chromium`).
