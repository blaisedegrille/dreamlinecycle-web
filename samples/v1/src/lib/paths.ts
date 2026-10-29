const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const basePath = configuredBasePath.replace(/\/$/, "");

/** Prefix a root-relative URL for a Next.js basePath deployment. */
export function withBasePath(path: string): string {
  if (!basePath || !path.startsWith("/") || path.startsWith(`${basePath}/`) || path === basePath) {
    return path;
  }
  return `${basePath}${path}`;
}

/** Prefix every URL in an image srcset while preserving its width descriptor. */
export function withBasePathSrcSet(srcSet: string): string {
  if (!basePath) return srcSet;
  return srcSet
    .split(",")
    .map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [withBasePath(url), ...descriptor].join(" ");
    })
    .join(", ");
}
