import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { gatewayCopy } from "@/content/gateway";
import { Logo } from "@/components/brand/logo";
import { BikeIllustration } from "@/components/brand/bike-illustration";
import { LanguageGateway } from "@/components/gateway/language-gateway";
import { getImages } from "@/lib/gallery";
import { GalleryPicture } from "@/components/ui/gallery-picture";

export default function GatewayPage() {
  const copy = gatewayCopy.hu;
  const heroImage = getImages().find((image) => !image.placeholder);

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-ink/15">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <Logo markClassName="h-8 w-8" />
          <div className="flex items-center gap-4 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/65 sm:text-[10px]">
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-race" strokeWidth={2} />
              Pécs, Hegyalja u. 20.
            </span>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-race">
              <Phone aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              {site.phone}
            </a>
          </div>
        </div>
      </header>

      <main className="wrap grid flex-1 gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <p className="eyebrow flex items-center gap-3 text-ink/55">
            <span className="h-px w-8 bg-race" aria-hidden="true" />
            Independent bicycle workshop · Pécs, Hungary
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.6rem,9vw,7rem)] leading-[0.86] font-bold tracking-[-0.075em] uppercase">
            Dreamline
            <br />
            <span className="text-ink/40">Cycle.</span>
          </h1>

          <div className="mt-8 border-l-2 border-race pl-4">
            <p className="font-display text-xl font-semibold uppercase sm:text-2xl">
              Válassz nyelvet
            </p>
            <p className="mt-1 text-sm text-ink/55">
              Choose your language · Sprache wählen
            </p>
          </div>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink/70">
            {copy.text} · {gatewayCopy.en.text} · {gatewayCopy.de.text}
          </p>
          <div className="mt-8">
            <LanguageGateway />
          </div>
          <p className="mt-5 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/45">
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 text-race" />
            {copy.note}
          </p>
        </div>

        <div className="relative hidden min-h-[30rem] overflow-hidden bg-paper-deep lg:block">
          {heroImage ? (
            <GalleryPicture
              image={heroImage}
              locale="hu"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          ) : (
            <div className="absolute inset-0 grid-paper flex items-center justify-center bg-paper-deep">
              <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.12em] text-ink/50 uppercase">
                Technical study · Pécs
              </span>
              <BikeIllustration className="w-[115%] text-ink" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-ink px-5 py-3 text-white">
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase">Hand built in Pécs</span>
            <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase">HU / EN / DE</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-ink/15">
        <div className="wrap flex flex-col gap-2 py-4 font-mono text-[9px] tracking-[0.08em] uppercase text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dreamline Cycle · Pécs, Hungary</p>
          <p>{site.email} · {site.phone}</p>
        </div>
      </footer>
    </div>
  );
}
