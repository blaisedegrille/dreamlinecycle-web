import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { readingMinutes } from "./format";
import type { Post, PostFrontmatter, PostMeta } from "./types";

const blogRoot = path.join(process.cwd(), "content", "blog");

function ensureDir(locale: Locale): string {
  return path.join(blogRoot, locale);
}

function listFiles(locale: Locale): string[] {
  const dir = ensureDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => path.join(dir, file));
}

function slugFromFile(file: string): string {
  return path.basename(file).replace(/\.mdx?$/, "");
}

function isPublished(data: PostFrontmatter): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return !data.draft;
}

function parseMeta(
  file: string,
  locale: Locale,
): { meta: PostMeta; content: string } | null {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as PostFrontmatter;

  if (!isPublished(data)) return null;

  const slug = data.slug || slugFromFile(file);
  const href = getPathname({
    locale,
    href: { pathname: "/blog/[slug]", params: { slug } },
  });

  return {
    meta: {
      ...data,
      locale,
      slug,
      href,
      date: data.date
        ? new Date(data.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      updated: data.updated
        ? new Date(data.updated).toISOString().slice(0, 10)
        : undefined,
      tags: data.tags ?? [],
      readingMinutes: readingMinutes(parsed.content),
    },
    content: parsed.content,
  };
}

export function getAllPosts(locale: Locale): PostMeta[] {
  return listFiles(locale)
    .map((file) => parseMeta(file, locale)?.meta)
    .filter((meta): meta is PostMeta => Boolean(meta))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(locale: Locale, slug: string): Post | null {
  const parsed = listFiles(locale)
    .map((file) => parseMeta(file, locale))
    .find((item) => item?.meta.slug === slug);

  if (!parsed) return null;

  const availableLocales = locales.filter((item) =>
    getAllPosts(item).some(
      (post) =>
        post.slug === slug ||
        (parsed.meta.translationKey &&
          post.translationKey === parsed.meta.translationKey),
    ),
  );

  return {
    ...parsed.meta,
    content: parsed.content,
    availableLocales,
  };
}

export function getPostParams(): { locale: Locale; slug: string }[] {
  return locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

export function getAllTags(locale: Locale): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags ?? []) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
