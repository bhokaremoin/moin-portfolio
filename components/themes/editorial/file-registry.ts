import { projects } from "@/lib/portfolio-data";
import {
  aboutMarkdown,
  experienceJson,
  skillsYaml,
  certificationsMarkdown,
  contactJson,
  projectMarkdown,
} from "./serializers";

// --- types ---

type ProjectSlug = `projects/${string}.md`;

type FixedFileId =
  | "README.md"
  | "about.md"
  | "experience.json"
  | "skills.yml"
  | "certifications.md"
  | "contact.json";

export type FileId = FixedFileId | ProjectSlug;

// --- helpers ---

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// --- FILE_ORDER ---

const FIXED_ORDER: readonly FixedFileId[] = [
  "README.md",
  "about.md",
  "experience.json",
  "skills.yml",
  "certifications.md",
  "contact.json",
];

const PROJECT_IDS: readonly ProjectSlug[] = projects.map(
  (p) => `projects/${toSlug(p.name)}.md` as ProjectSlug
);

export const FILE_ORDER: readonly FileId[] = [...FIXED_ORDER, ...PROJECT_IDS];

// --- file metadata type ---

type FileMeta = {
  id: FileId;
  label: string;
  lang: "markdown" | "json" | "yaml";
  source: string;
  preview: "markdown" | "json" | "skills" | "project" | "readme";
};

// --- getFile ---

export function getFile(id: FileId): FileMeta {
  switch (id) {
    case "README.md":
      return {
        id,
        label: "README.md",
        lang: "markdown",
        source: `# moin-portfolio\n\nWelcome to my portfolio codebase. Browse the file tree to explore my background, experience, skills, and projects.\n`,
        preview: "readme",
      };

    case "about.md":
      return {
        id,
        label: "about.md",
        lang: "markdown",
        source: aboutMarkdown(),
        preview: "markdown",
      };

    case "experience.json":
      return {
        id,
        label: "experience.json",
        lang: "json",
        source: experienceJson(),
        preview: "json",
      };

    case "skills.yml":
      return {
        id,
        label: "skills.yml",
        lang: "yaml",
        source: skillsYaml(),
        preview: "skills",
      };

    case "certifications.md":
      return {
        id,
        label: "certifications.md",
        lang: "markdown",
        source: certificationsMarkdown(),
        preview: "markdown",
      };

    case "contact.json":
      return {
        id,
        label: "contact.json",
        lang: "json",
        source: contactJson(),
        preview: "json",
      };

    default: {
      // project file: `projects/<slug>.md`
      const slug = (id as string).replace(/^projects\//, "").replace(/\.md$/, "");
      const project = projects.find((p) => toSlug(p.name) === slug);
      const name = project?.name ?? slug;
      return {
        id,
        label: id as string,
        lang: "markdown",
        source: projectMarkdown(name),
        preview: "project",
      };
    }
  }
}
