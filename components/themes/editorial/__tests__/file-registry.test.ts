import { describe, it, expect } from "vitest";
import { FILE_ORDER, getFile } from "@/components/themes/editorial/file-registry";

describe("file-registry", () => {
  it("has a stable ordered set of files", () => {
    expect(FILE_ORDER).toContain("about.md");
    expect(FILE_ORDER).toContain("experience.json");
  });
  it("returns source text and metadata for a file", () => {
    const f = getFile("about.md");
    expect(f.lang).toBe("markdown");
    expect(f.source.length).toBeGreaterThan(0);
  });
});
