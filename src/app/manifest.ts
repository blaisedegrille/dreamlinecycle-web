import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Pécs`,
    short_name: site.name,
    description:
      "Custom bicycles and full-service care in Pécs. Egyedi kerékpárok és teljeskörű szerviz.",
    start_url: "/hu/",
    scope: "/",
    display: "standalone",
    background_color: "#f4ebdd",
    theme_color: "#f4ebdd",
    lang: "hu",
    dir: "ltr",
    categories: ["shopping", "sports", "lifestyle"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      { name: "Services", url: "/hu/szolgaltatasok/" },
      { name: "Gallery", url: "/hu/galeria/" },
      { name: "Contact", url: "/hu/kapcsolat/" },
    ],
  };
}
