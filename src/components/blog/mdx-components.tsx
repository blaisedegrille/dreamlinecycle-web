import type { ReactNode } from "react";
import { Info } from "lucide-react";

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="not-prose my-8 border-2 border-ink bg-sun/30 p-5 shadow-[5px_5px_0_var(--color-ink)]">
      <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/70">
        <Info aria-hidden="true" className="h-4 w-4 text-race" strokeWidth={2.2} />
        {title ?? "Note"}
      </p>
      <div className="mt-2 text-[0.95rem] leading-relaxed text-ink/80 [&_a]:underline [&_a]:decoration-race [&_a]:decoration-2 [&_a]:underline-offset-4">
        {children}
      </div>
    </aside>
  );
}

export const mdxComponents = { Callout };
