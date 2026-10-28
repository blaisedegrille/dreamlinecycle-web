import { ArrowDownRight, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { gatewayCopy } from "@/content/gateway";
import { BikeIllustration } from "@/components/brand/bike-illustration";
import { Logo } from "@/components/brand/logo";
import { LanguageGateway } from "@/components/gateway/language-gateway";

const marquee = [
  "Custom builds",
  "Full service",
  "Hand-built wheels",
  "Pécs · HU",
  "Worldwide shipping",
];

export default function GatewayPage() {
  const copy = gatewayCopy.hu;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-paper">
      <div className="pointer-events-none absolute inset-0 grid-paper opacity-70" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-[26rem] w-[26rem] rounded-full border-[22px] border-race/20 sm:h-[34rem] sm:w-[34rem]"
      />

      <header className="relative z-10 border-b-2 border-ink/10">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Logo markClassName="h-10 w-10" />
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.14em] uppercase text-ink/65">
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              Pécs, Hegyalja u. 20.
            </span>
            <a
              href={site.phoneHref}
              className="flex items-center gap-1.5 border-2 border-ink px-2.5 py-1.5 transition-colors hover:bg-ink hover:text-paper"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.2} />
              {site.phone}
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="wrap grid gap-12 pt-10 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-16 lg:pb-20">
          <div>
            <p className="eyebrow flex items-center gap-2 text-ink/60">
              <span className="inline-block h-2 w-2 rounded-full bg-race" />
              Pécs · Magyarország
            </p>

            <h1 className="mt-4 display text-[clamp(3rem,8.2vw,6.4rem)] leading-[0.84]">
              Dreamline
              <br />
              <span className="serif-accent inline-block text-[0.72em] normal-case text-race">
                Cycle.
              </span>
            </h1>

            <div className="mt-6 max-w-xl border-l-4 border-ink pl-4">
              <p className="font-display text-[clamp(1.4rem,3.3vw,2.2rem)] leading-[0.95] uppercase">
                Válassz nyelvet
              </p>
              <p className="mt-1 font-serif text-xl text-ink/70 italic">
                Choose your language · Sprache wählen
              </p>
            </div>

            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink/75">
              {copy.text} · {gatewayCopy.en.text} · {gatewayCopy.de.text}
            </p>

            <div className="mt-8">
              <LanguageGateway />
            </div>

            <p className="mt-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/50">
              <ArrowDownRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              {copy.note}
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-[4/5] max-w-[26rem]">
              <div className="absolute inset-0 overflow-hidden rounded-t-[13rem] border-[3px] border-ink bg-paper-deep">
                <span className="absolute inset-x-0 top-0 h-3 bg-cobalt" aria-hidden="true" />
                <BikeIllustration className="absolute top-1/2 left-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2 text-ink" />
                <span className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-sun px-4 py-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase">
                  Hand built in Pécs
                </span>
              </div>

              <span className="absolute -top-3 -left-3 flex h-24 w-24 rotate-[-8deg] flex-col items-center justify-center rounded-full border-2 border-ink bg-race text-center font-mono text-[9px] leading-[1.4] tracking-[0.14em] text-paper uppercase shadow-[4px_4px_0_var(--color-ink)]">
                <span>Est.</span>
                <span className="font-display text-lg leading-none tracking-normal">Pécs</span>
                <span>HU</span>
              </span>

              <span className="absolute -right-4 bottom-16 rotate-[7deg] border-2 border-ink bg-cream px-3 py-2 font-mono text-[9px] tracking-[0.16em] uppercase shadow-[4px_4px_0_var(--color-ink)]">
                Service · Build · Ride
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 border-y-2 border-ink bg-ink py-2.5 text-paper">
        <div className="marquee">
          {[0, 1].map((copyIndex) => (
            <div className="marquee-track" key={copyIndex} aria-hidden={copyIndex === 1}>
              {marquee.map((item) => (
                <span
                  key={`${copyIndex}-${item}`}
                  className="flex items-center gap-6 px-4 font-mono text-[10px] tracking-[0.2em] uppercase"
                >
                  {item}
                  <span className="text-sun">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10">
        <div className="wrap flex flex-col gap-2 py-4 font-mono text-[9px] tracking-[0.12em] uppercase text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dreamline Cycle. Pécs, Hegyalja u. 20.</p>
          <p>
            {site.email} · {site.phone}
          </p>
        </div>
      </footer>
    </div>
  );
}
