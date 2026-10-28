import { afterEach, describe, expect, it, vi } from "vitest";

describe("base path helpers", () => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = original;
    vi.resetModules();
  });

  it("leaves root-relative paths alone without a configured prefix", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    vi.resetModules();
    const { withBasePath, withBasePathSrcSet } = await import("@/lib/paths");
    expect(withBasePath("/hu/galeria/")).toBe("/hu/galeria/");
    expect(withBasePathSrcSet("/bike-480.jpg 480w, /bike-960.jpg 960w")).toBe(
      "/bike-480.jpg 480w, /bike-960.jpg 960w",
    );
  });

  it("prefixes paths and srcset URLs once for a project deployment", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/dreamlinecycle-web/";
    vi.resetModules();
    const { withBasePath, withBasePathSrcSet } = await import("@/lib/paths");
    expect(withBasePath("/hu/galeria/")).toBe("/dreamlinecycle-web/hu/galeria/");
    expect(withBasePath("/dreamlinecycle-web/icon.png")).toBe(
      "/dreamlinecycle-web/icon.png",
    );
    expect(withBasePathSrcSet("/bike-480.jpg 480w, /bike-960.jpg 960w")).toBe(
      "/dreamlinecycle-web/bike-480.jpg 480w, /dreamlinecycle-web/bike-960.jpg 960w",
    );
    expect(withBasePath("https://example.com/photo.jpg")).toBe(
      "https://example.com/photo.jpg",
    );
  });
});
