import { clsx, type ClassValue } from "clsx";
import type { Locale } from "@/i18n/routing";

export function cn(...classes: ClassValue[]): string {
  return clsx(classes);
}

const intlLocale: Record<Locale, string> = {
  hu: "hu-HU",
  en: "en-GB",
  de: "de-DE",
};

export function formatDate(date: string | Date, locale: Locale): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Budapest",
  }).format(value);
}

export function readingMinutes(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function hashString(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
