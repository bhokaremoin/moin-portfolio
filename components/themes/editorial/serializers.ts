import {
  profile,
  experience,
  projects,
  skills,
  certifications,
} from "@/lib/portfolio-data";

export function aboutMarkdown(): string {
  const lines: string[] = [];
  lines.push(`# About`);
  lines.push("");
  lines.push(profile.tagline);
  lines.push("");
  lines.push(`## Now`);
  lines.push("");
  lines.push(`- **Role:** ${profile.role}`);
  lines.push(`- **Location:** ${profile.location}`);
  lines.push(`- **Education:** ${profile.education}`);
  lines.push(`- **Availability:** ${profile.availability}`);
  return lines.join("\n");
}

export function experienceJson(): string {
  return JSON.stringify(experience, null, 2);
}

export function skillsYaml(): string {
  const lines: string[] = [];
  for (const bucket of skills) {
    lines.push(`${bucket.label.toLowerCase()}:`);
    for (const item of bucket.items) {
      lines.push(`  - name: ${item.name}`);
    }
  }
  return lines.join("\n");
}

export function certificationsMarkdown(): string {
  const lines: string[] = [];
  lines.push(`# Certifications`);
  lines.push("");
  for (const cert of certifications) {
    lines.push(`- **${cert.title}** — ${cert.issuer} (${cert.year})`);
  }
  return lines.join("\n");
}

export function contactJson(): string {
  const { email, phone, github, linkedin, leetcode } = profile;
  return JSON.stringify({ email, phone, github, linkedin, leetcode }, null, 2);
}

export function projectMarkdown(name: string): string {
  const project = projects.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  if (!project) {
    return `# Not found`;
  }
  const lines: string[] = [];
  lines.push(`# ${project.name}`);
  lines.push("");
  lines.push(`${project.kind} · ${project.year}`);
  lines.push("");
  lines.push(project.longDesc);
  lines.push("");
  lines.push(`## Outcomes`);
  lines.push("");
  for (const outcome of project.outcomes) {
    lines.push(`- ${outcome}`);
  }
  lines.push("");
  lines.push(`## Stack`);
  lines.push("");
  for (const tech of project.stack) {
    lines.push(`- ${tech}`);
  }
  return lines.join("\n");
}
