"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems, site } from "@/content/site";
import { cn } from "@/lib/format";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
} from "@/components/ui/social-icons";

export function Header() {
  const t = useTranslations("nav");
  const topbar = useTranslations("topbar");
  const common = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-ink text-paper">
        <div className="wrap flex h-8 items-center justify-between gap-4 font-mono text-[9px] tracking-[0.16em] uppercase sm:text-[10px]">
          <span className="truncate">
            Pécs, Hegyalja u. 20.
            <span className="mx-2 hidden text-paper/40 sm:inline">/</span>
            <span className="hidden text-paper/70 sm:inline">{topbar("note")}</span>
          </span>
          <a
            href={site.phoneHref}
            className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-sun"
          >
            <Phone aria-hidden="true" className="h-3 w-3" strokeWidth={2.2} />
            {site.phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm transition-[padding] duration-200",
          scrolled ? "shadow-[0_2px_0_rgba(23,21,15,0.08)]" : "",
        )}
      >
        <div
          className={cn(
            "wrap flex items-center justify-between gap-4 transition-all duration-200",
            scrolled ? "py-2" : "py-3.5",
          )}
        >
          <Link
            href="/"
            aria-label={site.name}
            className="shrink-0 transition-transform hover:-rotate-2"
          >
            <Logo
              markClassName={cn(
                "transition-all duration-200",
                scrolled ? "h-8 w-8" : "h-9 w-9",
              )}
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-race",
                      isActive(item.href) &&
                        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:bg-race",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher className="hidden md:block" />
            <a
              href={site.phoneHref}
              className="btn btn-primary hidden px-4 py-2.5 text-[10px] md:inline-flex"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} />
              {t("call")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("menu")}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center border-2 border-ink transition-colors hover:bg-ink hover:text-paper lg:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden"
        >
          <div className="wrap flex items-center justify-between border-b border-paper/20 py-3.5">
            <Link href="/" onClick={() => setOpen(false)} aria-label={site.name}>
              <Logo markClassName="h-9 w-9" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="flex h-10 w-10 items-center justify-center border-2 border-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>

          <div className="wrap flex-1 overflow-y-auto py-6">
            <nav aria-label="Mobile">
              <ul className="divide-y divide-paper/15 border-y border-paper/15">
                {navItems.map((item, index) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="font-display text-[clamp(1.7rem,8vw,2.6rem)] leading-none tracking-[-0.03em] uppercase">
                        {t(item.key)}
                      </span>
                      <span className="flex items-center gap-3 font-mono text-[10px] tracking-[0.16em] text-paper/45">
                        {String(index + 1).padStart(2, "0")}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-5 w-5 text-sun transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-7">
              <p className="eyebrow mb-3 text-paper/50">{t("language")}</p>
              <LanguageSwitcher
                variant="inline"
                onNavigate={() => setOpen(false)}
              />
            </div>

            <div className="mt-7 flex flex-col gap-2">
              <a
                href={site.phoneHref}
                className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em] hover:text-sun"
              >
                <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                {site.phone}
              </a>
              <a
                href={site.emailHref}
                className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em] hover:text-sun"
              >
                <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                {site.email}
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center border-2 border-paper/40 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border-2 border-paper/40 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={site.socials.google}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Google"
                className="flex h-10 w-10 items-center justify-center border-2 border-paper/40 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                <GoogleIcon className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 font-mono text-[10px] tracking-[0.12em] text-paper/40 uppercase">
              {common("callToBook")} · {topbar("note")}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
