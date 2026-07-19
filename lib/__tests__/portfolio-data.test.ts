import { describe, it, expect } from "vitest";
import { profile } from "@/lib/portfolio-data";

describe("portfolio-data", () => {
  it("has a profile name", () => {
    expect(profile.name).toBe("Moin Bhokare");
  });
  it("exposes a stack summary for the terminal intro", () => {
    expect(profile.stackSummary).toMatch(/React/);
  });
});
