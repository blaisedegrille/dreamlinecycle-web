import { cn } from "@/lib/format";

export function Marquee({
  items,
  className,
  itemClassName,
  separator = "✳",
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  return (
    <div className={cn("marquee border-y-2 border-ink bg-ink py-2.5 text-paper", className)}>
      {[0, 1].map((copyIndex) => (
        <div
          className="marquee-track"
          key={copyIndex}
          aria-hidden={copyIndex === 1 ? "true" : undefined}
        >
          {items.map((item) => (
            <span
              key={`${copyIndex}-${item}`}
              className={cn(
                "flex items-center gap-6 px-4 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap uppercase sm:text-[11px]",
                itemClassName,
              )}
            >
              {item}
              <span className="text-sun" aria-hidden="true">
                {separator}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
