import { getTranslations } from "next-intl/server";
import {
  ArrowUp,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { navItems, site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { Chainring, Logo } from "@/components/brand/logo";
import { CookieSettings } from "@/components/layout/cookie-settings";
import { MapEmbed } from "@/components/layout/map-embed";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
} from "@/components/ui/social-icons";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const common = await getTranslations({ locale, namespace: "common" });
  const legal = await getTranslations({ locale, namespace: "legal" });
  const topbar = await getTranslations({ locale, namespace: "topbar" });
  const contact = await getTranslations({ locale, namespace: "contact" });

  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <section className="border-b border-paper/15 px-4 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center text-paper/45">{t("workshop")}</p>
          <h2 className="mt-2 text-center font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none uppercase">
            {contact("mapTitle")}
          </h2>
          <div className="mt-6 sm:mt-8">
            <MapEmbed size="footer" />
          </div>
        </div>
      </section>

      <div className="bg-race text-paper">
        <div className="wrap flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <div>
            <p className="eyebrow text-paper/70">{t("ctaEyebrow")}</p>
            <p className="mt-1.5 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-[-0.03em] uppercase">
              {t("ctaTitle")}
            </p>
            <p className="mt-2 max-w-md text-sm text-paper/85">{t("ctaText")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={site.phoneHref}
              className="btn border-paper bg-paper text-ink shadow-[5px_5px_0_var(--color-ink)] hover:bg-sun"
            >
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              {site.phone}
            </a>
            <Link
              href="/contact"
              className="btn border-paper bg-transparent text-paper shadow-[5px_5px_0_var(--color-ink)] hover:bg-paper hover:text-ink"
            >
              {common("contactUs")}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap-wide overflow-hidden border-b border-paper/15 pt-8 pb-2">
        <p
          className="display footer-wordmark text-center text-[clamp(2.8rem,11.5vw,11rem)] leading-[0.78] text-paper"
        >
          <span className="block">Dreamline</span>
          <span className="outline-word block text-paper/90">Cycle</span>
        </p>
      </div>

      <div className="wrap grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo markClassName="h-10 w-10" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
            {t("tagline")}
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={site.socials.google}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Google"
              className="flex h-9 w-9 items-center justify-center border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <GoogleIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <nav aria-label={t("explore")}>
          <p className="eyebrow text-paper/45">{t("explore")}</p>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-paper/80 transition-colors hover:text-sun"
                >
                  {nav(item.key)}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-paper/45">{t("workshop")}</p>
          <ul className="mt-4 space-y-3 text-sm text-paper/80">
            <li>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 transition-colors hover:text-sun"
              >
                <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={site.emailHref}
                className="inline-flex items-center gap-2 break-all transition-colors hover:text-sun"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-start gap-2 transition-colors hover:text-sun"
              >
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  strokeWidth={2}
                />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </a>
            </li>
            <li className="flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-[0.08em] uppercase text-paper/50">
              <Clock
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                strokeWidth={2}
              />
              {topbar("note")}
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-paper/45">{t("legal")}</p>
          <ul className="mt-4 space-y-2.5 font-mono text-[11px] tracking-[0.08em] uppercase text-paper/80">
            <li>
              <Link
                href="/privacy"
                className="transition-colors hover:text-sun"
              >
                {legal("privacyTitle")}
              </Link>
            </li>
            <li>
              <Link
                href="/imprint"
                className="transition-colors hover:text-sun"
              >
                {legal("imprintTitle")}
              </Link>
            </li>
            <li>
              <CookieSettings
                label={common("cookieSettings")}
                className="text-paper/80 hover:text-sun"
              />
            </li>
            <li>
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 text-paper/80 transition-colors hover:text-sun"
              >
                {t("backToTop")}
                <ArrowUp aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="wrap flex flex-col gap-2 py-4 font-mono text-[9px] tracking-[0.12em] uppercase text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {t("rights")}
          </p>
          <p>{t("built")}</p>
        </div>
      </div>

      <div className="pointer-events-none flex justify-center pb-3">
        <Chainring className="h-5 w-5 text-paper/20" />
      </div>
    </footer>
  );
}
