import { describe, expect, it } from "vitest";
import { formatDate, hashString, readingMinutes } from "@/lib/format";

describe("readingMinutes", () => {
  it("returns at least one minute for empty content", () => {
    expect(readingMinutes("  ")).toBe(1);
  });

  it("counts words and ignores fenced code", () => {
    const content = `${Array(200).fill("wheel").join(" ")}\n\n\`\`\`js\n${Array(400).fill("code").join(" ")}\n\`\`\``;
    expect(readingMinutes(content)).toBe(1);
    expect(readingMinutes(`${content} extra`)).toBe(2);
  });
});

describe("format helpers", () => {
  it("formats dates for each supported locale", () => {
    expect(formatDate("2026-02-03", "hu")).toContain("2026");
    expect(formatDate("2026-02-03", "en")).toContain("2026");
    expect(formatDate("2026-02-03", "de")).toContain("2026");
  });

  it("hashes strings deterministically", () => {
    expect(hashString("dreamline")).toBe(hashString("dreamline"));
    expect(hashString("dreamline")).not.toBe(hashString("cycle"));
  });
});
