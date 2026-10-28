import { describe, expect, it } from "vitest";
import { parseConsent } from "@/lib/consent";

describe("parseConsent", () => {
  it("accepts a valid saved consent choice", () => {
    expect(parseConsent('{"analytics":true,"timestamp":"2026-10-28T00:00:00.000Z"}')).toEqual({
      analytics: true,
      timestamp: "2026-10-28T00:00:00.000Z",
    });
  });

  it("rejects missing, malformed and invalid consent data", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("not-json")).toBeNull();
    expect(parseConsent('{"analytics":"yes"}')).toBeNull();
  });
});
