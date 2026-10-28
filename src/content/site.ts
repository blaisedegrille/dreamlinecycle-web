export const site = {
  name: "Dreamline Cycle",
  legalName: "Dreamline Cycle",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.dreamlinecycle.hu",
  phone: "+36 30 688 3723",
  phoneHref: "tel:+36306883723",
  email: "dreamlinecycle@gmail.com",
  emailHref: "mailto:dreamlinecycle@gmail.com",
  address: {
    street: "Hegyalja u. 20.",
    city: "Pécs",
    postalCode: "7625",
    country: "HU",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Dreamline+Cycle+P%C3%A9cs+Hegyalja+u.+20",
  mapsEmbed:
    "https://www.google.com/maps?q=Dreamline+Cycle,+Hegyalja+u.+20,+P%C3%A9cs,+7625&output=embed",
  socials: {
    facebook: "https://www.facebook.com/dreamlinecycle",
    instagram: "https://www.instagram.com/dreamline_cycle/",
    google:
      "https://www.google.com/search?q=dreamline+cycle+p%C3%A9cs",
  },
  analyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
} as const;

export const navItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/gallery", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;
