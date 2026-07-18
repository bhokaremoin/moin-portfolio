import { describe, it, expect } from "vitest";
import {
  aboutMarkdown, experienceJson, skillsYaml, certificationsMarkdown, contactJson, projectMarkdown,
} from "@/components/themes/editorial/serializers";

describe("serializers", () => {
  it("about is markdown with a heading", () => {
    expect(aboutMarkdown()).toMatch(/^# /m);
  });
  it("experience is valid JSON with company keys", () => {
    const parsed = JSON.parse(experienceJson());
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty("company");
  });
  it("skills yaml has a known bucket label", () => {
    expect(skillsYaml()).toMatch(/languages:/i);
  });
  it("contact is valid JSON with email", () => {
    expect(JSON.parse(contactJson())).toHaveProperty("email");
  });
  it("project markdown includes the project name", () => {
    expect(projectMarkdown("GPTForVideo")).toMatch(/GPTForVideo/);
  });
  it("certifications markdown has a heading and bold titles", () => {
    const md = certificationsMarkdown();
    expect(md).toMatch(/^# Certifications/m);
    expect(md).toMatch(/- \*\*/);
  });
});
