"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Clock, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { PostMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/format";
import { BlogCard } from "@/components/blog/blog-card";

export function BlogList({
  posts,
  locale,
}: {
  posts: PostMeta[];
  locale: Locale;
}) {
  const t = useTranslations("blog");
  const common = useTranslations("common");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) for (const item of post.tags ?? []) set.add(item);
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = tag === "all" || post.tags?.includes(tag);
      if (!matchesTag) return false;
      if (!q) return true;
      return [post.title, post.description, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [posts, query, tag]);

  const showFeatured = query.trim() === "" && tag === "all" && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  const labels = { read: common("readMore"), min: common("minutes") };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y-2 border-ink py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/45"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="field py-2.5 pr-10 pl-9"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("clearSearch")}
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center transition-colors hover:text-race"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden font-mono text-[9px] tracking-[0.14em] uppercase text-ink/40 sm:inline">
            {t("tags")}
          </span>
          <button
            type="button"
            onClick={() => setTag("all")}
            aria-pressed={tag === "all"}
            className={cn(
              "border-2 border-ink px-2.5 py-1.5 font-mono text-[9px] tracking-[0.12em] uppercase transition-colors",
              tag === "all" ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper",
            )}
          >
            {common("all")}
          </button>
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              aria-pressed={tag === item}
              className={cn(
                "border-2 border-ink px-2.5 py-1.5 font-mono text-[9px] tracking-[0.12em] uppercase transition-colors",
                tag === item ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {featured ? (
        <article className="group mt-10">
          <Link
            href={{ pathname: "/blog/[slug]", params: { slug: featured.slug } }}
            className="grid overflow-hidden border-2 border-ink bg-cream shadow-[8px_8px_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-paper-deep lg:aspect-auto lg:border-r-2 lg:border-b-0">
              {featured.cover ? (
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt || featured.title}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
              <span className="absolute top-4 left-4 border-2 border-ink bg-sun px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase">
                {t("featured")}
              </span>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] tracking-[0.12em] uppercase text-ink/50">
                  <span>{formatDate(featured.date, locale)}</span>
                  <span aria-hidden="true">/</span>
                  <span className="flex items-center gap-1">
                    <Clock aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                    {featured.readingMinutes} {common("minutes")}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[0.92] tracking-[-0.03em] uppercase">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/70">
                  {featured.description}
                </p>
              </div>
              <span className="mt-8 flex items-center justify-between border-t-2 border-ink/10 pt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
                {t("readPost")}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  strokeWidth={2.2}
                />
              </span>
            </div>
          </Link>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5", featured ? "mt-6" : "mt-10")}>
          {rest.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              locale={locale}
              labels={labels}
            />
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink/25 px-6 py-16 text-center">
          <p className="font-serif text-2xl italic text-ink/60">{t("noResults")}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag("all");
            }}
            className="btn btn-outline mt-6"
          >
            {common("all")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
