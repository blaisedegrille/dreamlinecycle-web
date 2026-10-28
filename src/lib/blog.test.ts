import { describe, expect, it, vi } from "vitest";
import {
  getAllPosts,
  getPostHeadings,
  getPostTranslations,
} from "@/lib/blog";

vi.mock("@/i18n/navigation", () => ({ getPathname: () => "/" }));

describe("getPostHeadings", () => {
  it("extracts H2/H3 text, strips markdown and ignores fenced examples", () => {
    const headings = getPostHeadings([
      "# Ignored H1",
      "## **Hand-built** wheels",
      "### A [useful link](https://example.com)",
      "```md",
      "## Not a real heading",
      "```",
    ].join("\n"));

    expect(headings).toEqual([
      { id: "hand-built-wheels", text: "Hand-built wheels", level: 2 },
      { id: "a-useful-link", text: "A useful link", level: 3 },
    ]);
  });

  it("assigns unique slugs to duplicate headings", () => {
    expect(getPostHeadings("## Wheels\n## Wheels").map(({ id }) => id)).toEqual([
      "wheels",
      "wheels-1",
    ]);
  });
});

describe("blog content", () => {
  it("loads posts for every locale", () => {
    for (const locale of ["hu", "en", "de"] as const) {
      expect(getAllPosts(locale).length).toBeGreaterThan(0);
    }
  });

  it("returns localized slugs for translated stories", () => {
    expect(getPostTranslations("hand-built-wheels")).toEqual({
      hu: "kezzel-font-kerek",
      en: "hand-built-wheels",
      de: "handgebaute-laufraeder",
    });
  });
});
