import type { Locale } from "@/i18n/routing";

export const gatewayCopy: Record<
  Locale,
  {
    name: string;
    eyebrow: string;
    title: string;
    text: string;
    suggested: string;
    enter: string;
    note: string;
  }
> = {
  hu: {
    name: "Magyar",
    eyebrow: "Pécs · Magyarország",
    title: "Válassz nyelvet",
    text: "Egyedi kerékpárok és teljeskörű szerviz Pécsen.",
    suggested: "Ajánlott",
    enter: "Belépés",
    note: "A választásod megjegyezzük.",
  },
  en: {
    name: "English",
    eyebrow: "Pécs · Hungary",
    title: "Choose your language",
    text: "Custom bicycles and full-service care in Pécs.",
    suggested: "Suggested",
    enter: "Enter",
    note: "We'll remember your choice.",
  },
  de: {
    name: "Deutsch",
    eyebrow: "Pécs · Ungarn",
    title: "Sprache wählen",
    text: "Individuelle Fahrräder und kompletter Service in Pécs.",
    suggested: "Empfohlen",
    enter: "Eintreten",
    note: "Wir merken uns Ihre Wahl.",
  },
};
