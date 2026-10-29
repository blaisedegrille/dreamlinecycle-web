import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/format";

export async function HomeContact({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });

  const rows = [
    {
      icon: Phone,
      label: common("phone"),
      value: site.phone,
      href: site.phoneHref,
      external: false,
      accent: "bg-race text-paper",
    },
    {
      icon: Mail,
      label: common("email"),
      value: site.email,
      href: site.emailHref,
      external: false,
      accent: "bg-cobalt text-paper",
    },
    {
      icon: MapPin,
      label: common("address"),
      value: `${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
      href: site.mapsUrl,
      external: true,
      accent: "bg-sun text-ink",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-paper-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-20 font-display text-[18rem] leading-none tracking-[-0.06em] text-ink/[0.045] uppercase select-none sm:text-[24rem]"
      >
        Pécs
      </div>

      <div className="wrap relative grid gap-10 py-14 sm:py-18 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-2 text-ink/55">
            <span className="inline-block h-2 w-2 rounded-full bg-race" aria-hidden="true" />
            {t("contactEyebrow")}
          </p>
          <h2 className="display mt-4 text-[clamp(2.3rem,5.6vw,4.6rem)] leading-[0.87]">
            {t("contactTitle")}
          </h2>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink/75">
            {t("contactBody")}
          </p>
          <p className="mt-6 flex max-w-md items-start gap-2 border-l-4 border-race pl-3 font-mono text-[10px] leading-relaxed tracking-[0.08em] uppercase text-ink/55">
            <ArrowUpRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            {t("contactNote")}
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="border-2 border-ink bg-cream shadow-[8px_8px_0_var(--color-ink)]">
            <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {site.name}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase text-ink/50">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
                {site.address.city} · HU
              </span>
            </div>

            <ul>
              {rows.map((row) => (
                <li key={row.label} className="border-b border-ink/10 last:border-b-0">
                  <a
                    href={row.href}
                    {...(row.external
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper/70"
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink",
                        row.accent,
                      )}
                    >
                      <row.icon aria-hidden="true" className="h-4.5 w-4.5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-ink/45">
                        {row.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.95rem] font-medium">
                        {row.value}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-race"
                      strokeWidth={2}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3 border-t-2 border-ink bg-paper px-5 py-4">
              <a href={site.phoneHref} className="btn btn-primary">
                <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                {common("callToBook")}
              </a>
              <Link href="/contact" className="btn btn-ghost text-ink/70 hover:text-race">
                {common("contactUs")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
