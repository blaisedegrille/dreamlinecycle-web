import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export type ServiceIcon =
  | "wrench"
  | "bike"
  | "wheel"
  | "sparkles"
  | "repeat"
  | "badge"
  | "package";

export type Service = {
  id: string;
  number: string;
  icon: ServiceIcon;
  title: Localized;
  description: Localized;
  points: Localized<string[]>;
};

export type Step = {
  number: string;
  title: Localized;
  text: Localized;
};

export type FaqItem = {
  question: Localized;
  answer: Localized;
};

export type GalleryImage = {
  id: string;
  album: string;
  width: number;
  height: number;
  aspect: number;
  alt: Localized;
  caption?: Localized;
  src: {
    avif: string;
    webp: string;
    jpg: string;
    avifSrcSet: string;
    webpSrcSet: string;
    jpgSrcSet: string;
  };
  blurDataURL: string;
  placeholder: boolean;
};

export type GalleryAlbum = {
  slug: string;
  title: Localized;
  description: Localized;
  cover: string;
  count: number;
  placeholder: boolean;
};

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  cover?: string;
  coverAlt?: string;
  tags?: string[];
  author?: string;
  translationKey?: string;
  slug?: string;
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  locale: Locale;
  slug: string;
  readingMinutes: number;
  href: string;
};

export type Post = PostMeta & {
  content: string;
  availableLocales: Locale[];
};

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type LegalSection = {
  heading: Localized;
  body: Localized<string[]>;
};
