import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "@/components/blog/blog-card";

export async function HomeBlog({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const posts = getAllPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="border-b-2 border-ink bg-paper" data-reveal>
      <div className="wrap py-14 sm:py-18 lg:py-24">
        <SectionHeading
          eyebrow={t("blogEyebrow")}
          title={t("blogTitle")}
          intro={t("blogIntro")}
          action={
            <Link href="/blog" className="btn btn-outline">
              {common("viewAll")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              locale={locale}
              labels={{ read: common("readMore"), min: common("minutes") }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
