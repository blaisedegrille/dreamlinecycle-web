"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import {
  OPEN_CONSENT_EVENT,
  readConsent,
  updateAnalyticsConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { cn } from "@/lib/format";

export function ConsentBanner() {
  const t = useTranslations("consent");
  const common = useTranslations("common");
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setDraftAnalytics(stored?.analytics ?? false);
    setReady(true);

    const onOpen = () => {
      const current = readConsent();
      setDraftAnalytics(current?.analytics ?? false);
      setSettingsOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (choice?.analytics) updateAnalyticsConsent(true);
  }, [choice]);

  const decide = (analytics: boolean) => {
    const next = writeConsent(analytics);
    updateAnalyticsConsent(analytics);
    setChoice(next);
    setDraftAnalytics(analytics);
    setSettingsOpen(false);
  };

  const visible = ready && (choice === null || settingsOpen);
  const analyticsEnabled = site.analyticsId.length > 0;
  const gaActive =
    Boolean(site.analyticsId) &&
    choice?.analytics === true &&
    process.env.NODE_ENV === "production";

  return (
    <>
      {gaActive ? <GoogleAnalytics gaId={site.analyticsId} /> : null}

      <div
        role="dialog"
        aria-modal="false"
        aria-label={t("title")}
        aria-live="polite"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[90] border-t-2 border-ink bg-cream transition-transform duration-300 ease-out",
          visible ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <div className="wrap flex flex-col gap-4 py-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              <Cookie aria-hidden="true" className="h-4 w-4 text-race" strokeWidth={2} />
              {t("title")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{t("text")}</p>

            {settingsOpen ? (
              <div className="mt-4 grid gap-2 border-t-2 border-ink/10 pt-4 sm:grid-cols-2">
                <label className="flex items-start gap-3 border-2 border-ink/15 bg-paper/60 p-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 h-4 w-4 accent-[var(--color-mint)]"
                  />
                  <span>
                    <span className="block font-mono text-[10px] tracking-[0.14em] uppercase">
                      {t("necessary")}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-ink/70">
                      {t("necessaryText")}
                    </span>
                  </span>
                </label>
                <label
                  className={cn(
                    "flex items-start gap-3 border-2 p-3 transition-colors",
                    analyticsEnabled
                      ? "cursor-pointer border-ink/15 bg-paper/60"
                      : "cursor-not-allowed border-ink/10 opacity-55",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={draftAnalytics}
                    disabled={!analyticsEnabled}
                    onChange={(event) => setDraftAnalytics(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[var(--color-mint)]"
                  />
                  <span>
                    <span className="block font-mono text-[10px] tracking-[0.14em] uppercase">
                      {t("analytics")}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-ink/70">
                      {t("analyticsText")}
                    </span>
                  </span>
                </label>
              </div>
            ) : null}

            <Link
              href="/privacy"
              className="mt-3 inline-block font-mono text-[10px] tracking-[0.12em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun"
            >
              {t("privacy")}
            </Link>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            {settingsOpen ? (
              <button
                type="button"
                onClick={() => decide(draftAnalytics)}
                className="btn btn-ink"
              >
                {t("save")}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => decide(true)}
                  className="btn btn-ink"
                >
                  {t("accept")}
                </button>
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="btn btn-outline"
                >
                  {t("reject")}
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="btn btn-ghost text-ink/70"
                >
                  {t("settings")}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                if (choice) setSettingsOpen(false);
              }}
              className={cn(
                "btn btn-ghost ml-auto text-ink/60",
                !choice && "hidden",
              )}
              aria-label={common("close")}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
