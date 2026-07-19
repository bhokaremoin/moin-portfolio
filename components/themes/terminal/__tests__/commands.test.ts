import { describe, it, expect } from "vitest";
import { tbExecute } from "@/components/themes/terminal/commands";

describe("tbExecute", () => {
  it("lists commands for help", () => {
    const r = tbExecute("help");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/projects/);
      expect(text).toMatch(/experience/);
      expect(text).toMatch(/theme/);
    }
  });

  it("returns a download result for resume", () => {
    const r = tbExecute("resume");
    expect(r.kind).toBe("download");
    if (r.kind === "download") expect(r.href).toBe("/cv.pdf");
  });

  it("lists projects with numbers", () => {
    const r = tbExecute("projects");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/GPTForVideo/);
    }
  });

  it("opens a project detail by name (case-insensitive)", () => {
    const r = tbExecute("open devutility");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/DevUtility/);
      expect(text).toMatch(/TypeScript/);
    }
  });

  it("errors for unknown project", () => {
    const r = tbExecute("open nope");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      expect(r.lines[0].text).toMatch(/no such project/i);
    }
  });

  it("emits clickable contact links", () => {
    const r = tbExecute("contact");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      expect(r.lines.some((l) => l.href?.startsWith("mailto:"))).toBe(true);
    }
  });

  it("clears", () => {
    expect(tbExecute("clear").kind).toBe("clear");
  });
});
