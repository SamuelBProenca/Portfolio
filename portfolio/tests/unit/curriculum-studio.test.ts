import { describe, expect, it } from "vitest";
import { curriculumStudioRewrites } from "../../src/lib/curriculum-studio";

describe("Curriculum Studio proxy", () => {
  it("keeps the existing site unchanged before upstream configuration", () => {
    expect(curriculumStudioRewrites(undefined)).toEqual([]);
    expect(curriculumStudioRewrites(" ")).toEqual([]);
  });
  it("forwards both the editor and nested API and assets without duplicating the prefix", () => {
    expect(curriculumStudioRewrites("https://studio-example.vercel.app/")).toEqual([
      { source: "/curriculumstudio", destination: "https://studio-example.vercel.app/" },
      {
        source: "/curriculumstudio/:path*",
        destination: "https://studio-example.vercel.app/:path*",
      },
    ]);
  });
  it("rejects embedded secrets, paths and insecure production origins", () => {
    for (const value of [
      "http://example.com",
      "https://user:secret@example.com",
      "https://example.com/path",
      "https://example.com?token=secret",
      "invalid",
    ]) {
      expect(() => curriculumStudioRewrites(value)).toThrow("CURRICULUM_STUDIO_ORIGIN");
    }
  });
  it("allows HTTP loopback only when explicitly requested for development tests", () => {
    expect(curriculumStudioRewrites("http://127.0.0.1:8001", true)).toHaveLength(2);
    expect(() => curriculumStudioRewrites("http://127.0.0.1:8001")).toThrow();
  });
});
