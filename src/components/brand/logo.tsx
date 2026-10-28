import { cn } from "@/lib/format";

export function Chainring({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("h-10 w-10", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <circle
        cx="24"
        cy="24"
        r="19"
        strokeWidth="3"
        strokeDasharray="5 4"
      />
      <circle cx="24" cy="24" r="10.5" strokeWidth="3" />
      <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
      <path
        d="M24 5v7M24 36v7M5 24h7M36 24h7M10.5 10.5l5 5M32.5 32.5l5 5M37.5 10.5l-5 5M15.5 32.5l-5 5"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Chainring className={cn("h-9 w-9 shrink-0 text-race", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[0.5rem] tracking-[0.28em] uppercase opacity-75">
          Dreamline
        </span>
        <span className="font-display text-[1.15rem] tracking-[-0.04em] uppercase">
          Cycle
        </span>
      </span>
    </span>
  );
}
