import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, Clock } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { withBasePath } from "@/lib/paths";
import {
  getPost,
  getPostHeadings,
  getPostTranslations,
  getRelatedPosts,
} from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/page-hero";
import { BlogCard } from "@/components/blog/blog-card";
import { ShareLinks } from "@/components/blog/share-links";
import { mdxComponents } from "@/components/blog/mdx-components";
import { JsonLd } from "@/components/seo/json-ld";

export async function blogPostMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const post = getPost(locale, slug);
  if (!post) return {};

  const translations = getPostTranslations(post.translationKey);
  const languages: Record<string, string> = {};
  for (const [itemLocale, itemSlug] of Object.entries(translations)) {
    languages[itemLocale] = absoluteUrl(
      getPathname({
        locale: itemLocale as Locale,
        href: { pathname: "/blog/[slug]", params: { slug: itemSlug } },
      }),
    );
  }

  return buildMetadata({
    locale,
    href: { pathname: "/blog/[slug]", params: { slug } },
    title: post.title,
    description: post.description,
    image: post.cover,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    languages,
  });
}

export async function BlogPostPageContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const headings = getPostHeadings(post.content);
  const related = getRelatedPosts(locale, post, 2);
  const url = absoluteUrl(
    getPathname({ locale, href: { pathname: "/blog/[slug]", params: { slug } } }),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: locale,
        image: post.cover ? absoluteUrl(post.cover) : undefined,
        mainEntityOfPage: url,
        author: {
          "@type": "Organization",
          name: post.author ?? site.name,
          url: absoluteUrl("/"),
        },
        publisher: { "@id": absoluteUrl("/#business") },
        keywords: post.tags?.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: nav("home"),
            item: absoluteUrl(getPathname({ locale, href: "/" })),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("eyebrow"),
            item: absoluteUrl(getPathname({ locale, href: "/blog" })),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={`${t("eyebrow")} / ${formatDate(post.date, locale)}`}
        title={post.title}
        intro={post.description}
        accent="bg-mint"
        meta={
          <div className="flex flex-col gap-3 border-2 border-ink bg-cream p-4 shadow-[5px_5px_0_var(--color-ink)]">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-ink/55">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              {post.readingMinutes} {common("minutes")}
            </div>
            <div className="h-px w-full bg-ink/10" aria-hidden="true" />
            <p className="font-mono text-[9px] leading-relaxed tracking-[0.14em] uppercase text-ink/55">
              {post.author ?? site.name}
              <br />
              {formatDate(post.date, locale)}
            </p>
            {post.updated ? (
              <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-ink/35">
                {common("updated")}: {formatDate(post.updated, locale)}
              </p>
            ) : null}
          </div>
        }
      >
        <Link href="/blog" className="btn btn-outline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          {t("back")}
        </Link>
      </PageHero>

      {post.cover ? (
        <section className="border-b-2 border-ink bg-ink">
          <div className="wrap py-5 sm:py-8">
            <figure className="relative mx-auto max-w-5xl overflow-hidden border-2 border-paper/20">
              <Image
                src={withBasePath(post.cover)}
                alt={post.coverAlt || post.title}
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="max-h-[34rem] w-full object-cover"
                preload
              />
              {post.coverAlt ? (
                <figcaption className="border-t border-paper/15 px-4 py-2 font-mono text-[9px] tracking-[0.12em] uppercase text-paper/50">
                  {post.coverAlt}
                </figcaption>
              ) : null}
            </figure>
          </div>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <aside className="lg:order-first">
            <div className="border-t-2 border-ink pt-4 lg:sticky lg:top-28">
              <details className="group lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[10px] tracking-[0.16em] uppercase">
                  {t("toc")}
                  <span className="text-race transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <nav aria-label={t("toc")} className="mt-3">
                  <ol className="space-y-2 border-l-2 border-ink/10 pl-3">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className="block text-[0.82rem] leading-snug text-ink/65 hover:text-race"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>

              <div className="hidden lg:block">
                <p className="eyebrow text-ink/45">{t("toc")}</p>
                <nav aria-label={t("toc")} className="mt-3">
                  <ol className="space-y-2.5 border-l-2 border-ink/10">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={
                            heading.level === 3
                              ? "block pl-6 text-[0.78rem] leading-snug text-ink/55 transition-colors hover:text-race"
                              : "block pl-3 text-[0.84rem] leading-snug text-ink/75 transition-colors hover:text-race"
                          }
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className="mt-8">
                  <ShareLinks
                    url={url}
                    title={post.title}
                    labels={{
                      share: t("share"),
                      copy: t("copyLink"),
                      copied: t("linkCopied"),
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="prose-dreamline max-w-3xl">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>

            {post.tags?.length ? (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t-2 border-ink/10 pt-5">
                <span className="mr-1 font-mono text-[9px] tracking-[0.16em] uppercase text-ink/40">
                  {t("tags")}
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-2 border-ink px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 lg:hidden">
              <ShareLinks
                url={url}
                title={post.title}
                labels={{
                  share: t("share"),
                  copy: t("copyLink"),
                  copied: t("linkCopied"),
                }}
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t-2 border-ink pt-5">
              <Link href="/blog" className="btn btn-outline">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                {common("backToBlog")}
              </Link>
              <a href={site.phoneHref} className="btn btn-primary">
                {common("callToBook")}
              </a>
            </div>
          </article>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t-2 border-ink bg-paper-deep">
          <div className="wrap py-12 sm:py-16 lg:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-ink/50">{t("eyebrow")}</p>
                <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] leading-none uppercase">
                  {t("related")}
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden font-mono text-[10px] tracking-[0.14em] uppercase underline decoration-race decoration-2 underline-offset-4 hover:bg-sun sm:inline"
              >
                {t("allPosts")}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
              {related.map((item) => (
                <BlogCard
                  key={item.slug}
                  post={item}
                  locale={locale}
                  labels={{ read: common("readMore"), min: common("minutes") }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd locale={locale} data={jsonLd} />
    </>
  );
}
