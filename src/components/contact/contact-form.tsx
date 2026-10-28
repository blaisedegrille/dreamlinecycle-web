"use client";

import { useCallback, useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { services } from "@/content/site-content";
import type { Locale } from "@/i18n/routing";
import { Turnstile } from "@/components/contact/turnstile";

type Status = "idle" | "sending" | "success" | "error" | "mailto" | "turnstile";
type FieldErrors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations("contact");
  const legal = useTranslations("legal");
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);

  const schema = z.object({
    name: z.string().trim().min(2, t("required")),
    email: z
      .string()
      .trim()
      .min(1, t("required"))
      .pipe(z.email(t("invalidEmail"))),
    phone: z.string().trim().optional(),
    service: z.string().optional(),
    message: z.string().trim().min(5, t("messageShort")),
    consent: z.boolean().refine((value) => value, t("consentRequired")),
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Bots fill hidden fields; humans never see this one.
    if (String(data.get("website") ?? "").trim() !== "") {
      setStatus("success");
      form.reset();
      return;
    }

    const parsed = schema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "name" ||
          key === "email" ||
          key === "message" ||
          key === "consent"
        ) {
          next[key] = issue.message;
        }
      }
      setErrors(next);
      setStatus("idle");
      return;
    }

    if (site.turnstileSiteKey && !turnstileToken) {
      setErrors({});
      setStatus("turnstile");
      return;
    }

    setErrors({});
    setStatus("sending");

    const payload = {
      ...parsed.data,
      locale,
      turnstileToken: turnstileToken || undefined,
      page: window.location.href,
    };

    if (!site.formEndpoint) {
      const subject = `${t("subject")} — ${parsed.data.name}`;
      const body = [
        `${t("name")}: ${parsed.data.name}`,
        `${t("email")}: ${parsed.data.email}`,
        parsed.data.phone ? `${t("phone")}: ${parsed.data.phone}` : "",
        parsed.data.service ? `${t("service")}: ${parsed.data.service}` : "",
        "",
        parsed.data.message,
      ]
        .filter(Boolean)
        .join("\n");

      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);

      setStatus("success");
      setTurnstileToken("");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (field: keyof FieldErrors) =>
    errors[field] ? (
      <p id={`${formId}-${field}-error`} className="mt-1.5 font-mono text-[10px] leading-snug text-race">
        {errors[field]}
      </p>
    ) : null;

  const describedBy = (field: keyof FieldErrors) =>
    errors[field] ? `${formId}-${field}-error` : undefined;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative border-2 border-ink bg-cream p-5 shadow-[8px_8px_0_var(--color-ink)] sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-none uppercase">
            {t("formTitle")}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
            {t("formIntro")}
          </p>
        </div>
        <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
          {t("requiredHint")}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            {t("name")} <span className="text-race">*</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className="field mt-1.5"
            onChange={() => errors.name && setErrors((prev) => ({ ...prev, name: undefined }))}
          />
          {fieldError("name")}
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            {t("email")} <span className="text-race">*</span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className="field mt-1.5"
            onChange={() => errors.email && setErrors((prev) => ({ ...prev, email: undefined }))}
          />
          {fieldError("email")}
        </div>

        <div>
          <label
            htmlFor={`${formId}-phone`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            {t("phone")}
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            className="field mt-1.5"
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-service`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            {t("service")}
          </label>
          <select
            id={`${formId}-service`}
            name="service"
            defaultValue=""
            className="field mt-1.5"
          >
            <option value="">{t("servicePlaceholder")}</option>
            {services.map((service) => (
              <option key={service.id} value={service.title[locale]}>
                {service.title[locale]}
              </option>
            ))}
            <option value={t("otherService")}>{t("otherService")}</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${formId}-message`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
          >
            {t("message")} <span className="text-race">*</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={6}
            required
            placeholder={t("messagePlaceholder")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            className="field mt-1.5 resize-y"
            onChange={() =>
              errors.message && setErrors((prev) => ({ ...prev, message: undefined }))
            }
          />
          {fieldError("message")}
        </div>
      </div>

      <div className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {site.turnstileSiteKey ? (
        <div className="mt-5">
          <Turnstile
            siteKey={site.turnstileSiteKey}
            locale={locale}
            onToken={handleToken}
          />
          {status === "turnstile" ? (
            <p className="mt-1.5 font-mono text-[10px] text-race">
              {t("turnstileRequired")}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="mt-5 flex cursor-pointer items-start gap-3 border-t-2 border-ink/10 pt-4 text-[0.82rem] leading-relaxed text-ink/75">
        <input
          type="checkbox"
          name="consent"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-mint)]"
          onChange={() =>
            errors.consent && setErrors((prev) => ({ ...prev, consent: undefined }))
          }
        />
        <span>
          {t("consent")} <span className="text-race">*</span>
        </span>
      </label>
      {fieldError("consent")}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          ) : (
            <Send aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          )}
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
          {t("responseTime")}
        </p>
      </div>

      <div aria-live="polite" className="mt-4">
        {status === "success" ? (
          <p className="flex items-start gap-2 border-2 border-ink bg-mint/15 px-3 py-2.5 text-sm text-ink">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mint" strokeWidth={2.2} />
            {t("success")}
          </p>
        ) : null}
        {status === "mailto" ? (
          <p className="flex items-start gap-2 border-2 border-ink bg-sun/25 px-3 py-2.5 text-sm text-ink">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            {t("fallback")}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="flex items-start gap-2 border-2 border-race bg-race/10 px-3 py-2.5 text-sm text-ink">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-race" strokeWidth={2.2} />
            <span>
              {t("error")}
              <span className="mt-1 block">
                <a href={site.emailHref} className="underline decoration-race decoration-2 underline-offset-2">
                  {site.email}
                </a>
                {" · "}
                <a href={site.phoneHref} className="underline decoration-race decoration-2 underline-offset-2">
                  {site.phone}
                </a>
              </span>
            </span>
          </p>
        ) : null}
      </div>

      <p className="mt-4 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/35">
        <Link
          href="/privacy"
          className="underline decoration-race decoration-2 underline-offset-4 hover:bg-sun"
        >
          {legal("privacyTitle")}
        </Link>
      </p>
    </form>
  );
}
