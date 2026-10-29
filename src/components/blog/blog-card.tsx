import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PostMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/format";
import { withBasePath } from "@/lib/paths";

export function BlogCard({
  post,
  locale,
  labels,
  className,
  featured = false,
}: {
  post: PostMeta;
  locale: Locale;
  labels: { read: string; min: string };
  className?: string;
  featured?: boolean;
}) {
  return (
    <article className={cn("group", className)}>
      <Link
        href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
        className="flex h-full flex-col"
      >
        <div
          className={cn(
            "relative overflow-hidden border-2 border-ink bg-paper-deep",
            featured ? "aspect-[16/9]" : "aspect-[3/2]",
          )}
        >
          {post.cover ? (
            <Image
              src={withBasePath(post.cover)}
              alt={post.coverAlt || post.title}
              width={1600}
              height={1000}
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, 50vw"}
              loading={featured ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <span className="grid-paper flex h-full w-full items-center justify-center font-display text-3xl text-ink/25 uppercase">
              Dreamline
            </span>
          )}
          <span className="absolute top-3 left-3 border-2 border-ink bg-paper px-2 py-1 font-mono text-[9px] tracking-[0.14em] uppercase shadow-[2px_2px_0_var(--color-ink)]">
            {formatDate(post.date, locale)}
          </span>
          {featured ? (
            <span className="absolute right-3 bottom-3 border-2 border-ink bg-sun px-2 py-1 font-mono text-[9px] tracking-[0.14em] uppercase">
              {post.readingMinutes} {labels.min}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col border-x-2 border-b-2 border-ink bg-cream p-5 transition-colors group-hover:bg-paper">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.12em] uppercase text-ink/50">
            <span className="flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
              {post.readingMinutes} {labels.min}
            </span>
            {post.tags?.[0] ? (
              <>
                <span aria-hidden="true">/</span>
                <span>{post.tags[0]}</span>
              </>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-3 font-display leading-[1.02] tracking-[-0.02em] uppercase",
              featured ? "text-[clamp(1.6rem,3vw,2.4rem)]" : "text-[1.25rem]",
            )}
          >
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 text-[0.88rem] leading-relaxed text-ink/65">
            {post.description}
          </p>

          <span className="mt-auto flex items-center justify-between border-t-2 border-ink/10 pt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
            <span className="transition-colors group-hover:text-race">{labels.read}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={2.2}
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
