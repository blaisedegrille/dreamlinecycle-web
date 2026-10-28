import type { Metadata } from "next";
import { ArrowUpRight, Phone } from "lucide-react";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/content/site";
import { BikeIllustration } from "@/components/brand/bike-illustration";
import { Logo } from "@/components/brand/logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Dreamline Cycle",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-paper">
          <div className="pointer-events-none absolute inset-0 grid-paper opacity-70" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full border-[22px] border-cobalt/20"
          />

          <header className="relative z-10 border-b-2 border-ink/10">
            <div className="wrap flex h-16 items-center justify-between gap-4">
              <a href="/hu/" aria-label={site.name}>
                <Logo markClassName="h-10 w-10" />
              </a>
              <a
                href={site.phoneHref}
                className="flex items-center gap-1.5 border-2 border-ink px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors hover:bg-ink hover:text-paper"
              >
                <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
                {site.phone}
              </a>
            </div>
          </header>

          <main className="relative z-10 flex flex-1 items-center">
            <div className="wrap grid gap-10 py-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="font-mono text-xs tracking-[0.22em] uppercase text-race">Error · 404</p>
                <h1 className="mt-3 display text-[clamp(3.4rem,10vw,7.5rem)] leading-[0.82]">
                  Chain
                  <br />
                  <span className="serif-accent inline-block text-[0.76em] normal-case text-race">
                    slipped.
                  </span>
                </h1>
                <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/75">
                    This page can&apos;t be found. Let&apos;s ride back to the workshop, or take a look at the builds.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/hu/" className="btn btn-primary">
                    Vissza a főoldalra
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                  </a>
                  <a href="/galeria/" className="btn btn-outline">
                    Galéria
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  {[
                    { locale: "hu", label: "Magyar" },
                    { locale: "en", label: "English" },
                    { locale: "de", label: "Deutsch" },
                  ].map((item) => (
                    <a
                      key={item.locale}
                      href={`/${item.locale}/`}
                      hrefLang={item.locale}
                      lang={item.locale}
                      className="border-2 border-ink px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors hover:bg-ink hover:text-paper"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative mx-auto aspect-[4/5] max-w-[24rem] overflow-hidden rounded-t-[12rem] border-[3px] border-ink bg-cream">
                  <span className="absolute inset-x-0 top-0 h-3 bg-race" aria-hidden="true" />
                  <BikeIllustration className="absolute top-1/2 left-1/2 w-[135%] -translate-x-1/2 -translate-y-1/2 text-ink" />
                  <span className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-sun px-4 py-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase">
                    Dreamline Cycle · Pécs
                  </span>
                </div>
              </div>
            </div>
          </main>

          <footer className="relative z-10 border-t-2 border-ink/10">
            <div className="wrap flex flex-col gap-2 py-4 font-mono text-[9px] tracking-[0.12em] uppercase text-ink/55 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Dreamline Cycle.</p>
              <p>
                {site.address.street} · {site.address.postalCode} {site.address.city}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
