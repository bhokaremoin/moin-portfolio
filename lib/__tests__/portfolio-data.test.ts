import { describe, it, expect } from "vitest";
import { THEME_IDS, isThemeId, profile } from "@/lib/portfolio-data";

describe("portfolio-data", () => {
  it("exposes exactly two theme ids", () => {
    expect(THEME_IDS).toEqual(["terminal", "executive"]);
  });
  it("validates theme ids", () => {
    expect(isThemeId("terminal")).toBe(true);
    expect(isThemeId("nope")).toBe(false);
  });
  it("has a profile name", () => {
    expect(profile.name).toBe("Moin Bhokare");
  });
});
