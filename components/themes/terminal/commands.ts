import { TB_FS } from "./filesystem";
import { projects, profile } from "@/lib/portfolio-data";

export type TerminalColor = "ink" | "accent" | "amber" | "cyan" | "mag" | "dim";

export interface TerminalLine {
  color: TerminalColor;
  text: string;
  href?: string;
}

export type CommandResult =
  | { kind: "lines"; lines: readonly TerminalLine[] }
  | { kind: "clear" }
  | { kind: "download"; href: string; lines: readonly TerminalLine[] };

const lines = (...items: TerminalLine[]): CommandResult => ({
  kind: "lines",
  lines: items,
});

const ink = (text: string): TerminalLine => ({ color: "ink", text });
const accent = (text: string): TerminalLine => ({ color: "accent", text });
const amber = (text: string): TerminalLine => ({ color: "amber", text });
const cyan = (text: string): TerminalLine => ({ color: "cyan", text });
const mag = (text: string): TerminalLine => ({ color: "mag", text });
const dim = (text: string): TerminalLine => ({ color: "dim", text });
const link = (text: string, href: string, color: TerminalColor = "ink"): TerminalLine => ({
  color,
  text,
  href,
});

export function tbExecute(raw: string): CommandResult {
  const input = raw.trim();
  if (!input) return { kind: "lines", lines: [] };
  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "help":
      return lines(
        accent("available commands:"),
        ink("  help              — this menu"),
        ink("  whoami            — quick bio"),
        ink("  about             — full bio"),
        ink("  ls                — list files"),
        ink("  cat <file>        — print file (about.md, skills.txt, projects.md, contact.json, certs.txt)"),
        ink("  experience        — career timeline"),
        ink("  projects          — featured projects"),
        ink("  open <name>       — project details"),
        ink("  resume            — download resume/cv"),
        ink("  certs             — certifications"),
        ink("  skills            — tech stack"),
        ink("  contact           — how to reach me"),
        ink("  socials           — github, linkedin"),
        ink("  theme <id>        — switch theme (terminal | executive | editorial)"),
        ink("  echo <text>       — repeat text"),
        ink("  date              — current date/time"),
        ink("  neofetch          — system info"),
        ink("  sudo <anything>   — try it"),
        ink("  clear             — wipe terminal"),
      );

    case "whoami":
      return lines(
        accent("moin@portfolio"),
        ink("Full-stack dev · SDE @ BrowserStack · Pune, IN"),
      );

    case "about":
      return {
        kind: "lines",
        lines: TB_FS["about.md"].split("\n").map((t) => ink(t || " ")),
      };

    case "ls": {
      const long = args.includes("-la") || args.includes("-l");
      if (long) {
        return lines(
          ...Object.keys(TB_FS).map((f) =>
            ink(
              `-rw-r--r--  1 moin  staff  ${String(TB_FS[f].length).padStart(5)} Apr 26 ${f}`,
            ),
          ),
        );
      }
      return lines(cyan(Object.keys(TB_FS).join("   ")));
    }

    case "cat": {
      if (!arg) return lines(mag("cat: missing file operand"));
      const file = TB_FS[arg];
      if (!file) return lines(mag(`cat: ${arg}: No such file or directory`));
      return {
        kind: "lines",
        lines: file.split("\n").map((t) => ink(t || " ")),
      };
    }

    case "experience":
      return lines(
        accent("╭─ career.log ─────────────────────────╮"),
        ink("  Dec 2024 → now   BrowserStack · Full-Stack Dev"),
        ink("  Jul–Nov 2024     SuperAGI    · SDE (full-time)"),
        ink("  Jan–Jun 2024     SuperAGI    · SDE Intern"),
        ink("  2020 – 2024      IIIT Pune   · B.Tech, CS"),
        accent("╰──────────────────────────────────────╯"),
      );

    case "projects": {
      const projectLines: TerminalLine[] = [accent("featured projects:")];
      projects.forEach((p) => {
        const num = String(p.num).padStart(2, "0");
        projectLines.push(ink(`  ${num}  ${p.name} — ${p.kind}`));
      });
      projectLines.push(dim(""));
      projectLines.push(dim("  tip: open <name> for details"));
      return { kind: "lines", lines: projectLines };
    }

    case "open": {
      if (!arg) return lines(mag("open: missing project name"));
      const match = projects.find(
        (p) => p.name.toLowerCase() === arg.toLowerCase(),
      );
      if (!match) {
        return lines(mag(`open: no such project '${arg}'`));
      }
      const detail: TerminalLine[] = [
        accent(`[ ${match.name} ]`),
        ink(`kind      · ${match.kind}`),
        ink(`year      · ${match.year}`),
        ink(""),
        ink(match.longDesc),
        ink(""),
        accent("stack:"),
        ink(`  ${match.stack.join(" · ")}`),
        ink(""),
        accent("outcomes:"),
        ...match.outcomes.map((o) => ink(`  · ${o}`)),
      ];
      return { kind: "lines", lines: detail };
    }

    case "resume":
    case "cv":
      return {
        kind: "download",
        href: profile.cvPath,
        lines: [accent("→ downloading resume.pdf…")],
      };

    case "certs":
      return {
        kind: "lines",
        lines: TB_FS["certs.txt"].split("\n").map((t) => ink(t || " ")),
      };

    case "skills":
      return {
        kind: "lines",
        lines: TB_FS["skills.txt"].split("\n").map((t) => ink(t)),
      };

    case "contact":
      return lines(
        link(`mail     · ${profile.email}`, `mailto:${profile.email}`, "amber"),
        link(`github   · ${profile.github}`, `https://${profile.github}`, "cyan"),
        link(`linkedin · ${profile.linkedin}`, `https://${profile.linkedin}`, "cyan"),
        ink(`tel      · ${profile.phone}`),
      );

    case "socials":
      return lines(
        cyan(`→ ${profile.github}`),
        cyan(`→ ${profile.linkedin}`),
      );

    case "echo":
      return lines(ink(arg));

    case "date":
      return lines(ink(new Date().toString()));

    case "neofetch":
      return lines(
        accent("       moin@portfolio       "),
        dim("       ---------------       "),
        ink("  OS     · Portfolio v3.0"),
        ink("  Host   · localhost"),
        ink("  Shell  · zsh"),
        ink("  Editor · neovim"),
        ink("  Stack  · React · Node · Docker"),
        ink("  Coffee · ∞ cups/day"),
      );

    case "sudo":
      return lines(mag("permission denied: nice try."));

    case "rm":
      return lines(mag("rm: this is a portfolio. nothing to remove here."));

    case "vim":
    case "nvim":
    case "emacs":
      return lines(amber(`${cmd}: editor war detected. backing away slowly.`));

    case "exit":
    case "quit":
      return lines(dim("you cannot leave. you are the portfolio now."));

    case "clear":
    case "cls":
      return { kind: "clear" };

    default:
      return lines(
        mag(`command not found: ${cmd}`),
        dim("type 'help' for available commands."),
      );
  }
}

export const COLOR_VAR: Record<TerminalColor, string> = {
  ink: "var(--ink)",
  accent: "var(--accent)",
  amber: "var(--amber)",
  cyan: "var(--cyan)",
  mag: "var(--mag)",
  dim: "var(--dim)",
};
