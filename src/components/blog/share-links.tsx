"use client";

import { useState } from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import { FacebookIcon } from "@/components/ui/social-icons";

export function ShareLinks({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: { share: string; copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(labels.copy, url);
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The user dismissed the native share sheet; fall back to copying.
      }
    }
    await copy();
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const networks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon className="h-3.5 w-3.5" />,
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <span className="font-mono text-[11px] leading-none">𝕏</span>,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <span className="font-mono text-[10px] leading-none">in</span>,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <Mail aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[9px] tracking-[0.16em] uppercase text-ink/45">
        {labels.share}
      </span>

      <button
        type="button"
        onClick={share}
        className="flex h-9 items-center gap-2 border-2 border-ink bg-cream px-3 font-mono text-[9px] tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-paper"
      >
        <Share2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
        {labels.share}
      </button>

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? labels.copied : labels.copy}
        title={copied ? labels.copied : labels.copy}
        className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream transition-colors hover:bg-ink hover:text-paper"
      >
        {copied ? (
          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} />
        ) : (
          <Copy aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      {networks.map((network) => (
        <a
          key={network.name}
          href={network.href}
          target={network.name === "Email" ? undefined : "_blank"}
          rel={network.name === "Email" ? undefined : "noreferrer noopener"}
          aria-label={`${labels.share}: ${network.name}`}
          className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream transition-colors hover:bg-ink hover:text-paper"
        >
          {network.icon}
        </a>
      ))}
    </div>
  );
}
