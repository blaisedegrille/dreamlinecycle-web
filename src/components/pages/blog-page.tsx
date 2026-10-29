import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Rss } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { withBasePath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { BlogList } from "@/components/blog/blog-list";

export async function blogMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    href: "/blog",
    title: t("blog.title"),
    description: t("blog.description"),
    image: `/generated/og/blog-${locale}.png`,
  });
}

export async function BlogPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale);

  return (
    <>
      <PageHero
        eyebrow={`${t("eyebrow")} · ${String(posts.length).padStart(2, "0")}`}
        title={t("title")}
        intro={t("intro")}
        meta={
          <a
            href={withBasePath(`/rss/${locale}.xml`)}
            type="application/rss+xml"
            className="group flex items-center gap-3 border-2 border-ink bg-cream px-4 py-3 font-mono text-[10px] tracking-[0.14em] uppercase shadow-[5px_5px_0_var(--color-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)]"
          >
            <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-sun">
              <Rss aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span>
              RSS
              <span className="mt-0.5 block text-[8px] tracking-[0.16em] text-ink/50">
                {locale.toUpperCase()} · XML
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="ml-2 h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-race"
              strokeWidth={2}
            />
          </a>
        }
      />

      <section className="bg-paper">
        <div className="wrap py-10 sm:py-14 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-ink/50">{t("allPosts")}</p>
              <p className="mt-1 font-serif text-lg italic text-ink/60">
                {posts.length} {t("posts")}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <BlogList posts={posts} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
