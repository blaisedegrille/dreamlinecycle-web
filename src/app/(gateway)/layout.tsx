import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/content/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dreamline Cycle — Pécs",
    template: "%s — Dreamline Cycle",
  },
  description:
    "Egyedi kerékpárok és teljeskörű szerviz Pécsen. · Custom bicycles and full-service care in Pécs. · Individuelle Fahrräder und kompletter Service in Pécs.",
  applicationName: site.name,
  alternates: {
    canonical: `${site.url}/`,
    languages: {
      hu: `${site.url}/hu/`,
      en: `${site.url}/en/`,
      de: `${site.url}/de/`,
      "x-default": `${site.url}/`,
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Dreamline Cycle — Pécs",
    description:
      "Custom bicycles and full-service care in Pécs, Hungary. Válassz nyelvet · Choose your language · Sprache wählen.",
    url: `${site.url}/`,
    images: [{ url: `${site.url}/generated/og/home-hu.png`, width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4ebdd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function GatewayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
