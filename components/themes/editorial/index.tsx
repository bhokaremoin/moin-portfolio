"use client";

import {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  certifications,
  experience,
  profile,
  projects,
} from "@/lib/portfolio-data";

const mono = "var(--font-mono)";
const serif = "var(--font-serif)";
const sans = "var(--font-sans)";

type FileId =
  | "hero.tsx"
  | "about.md"
  | "experience.json"
  | "projects"
  | "skills.yml"
  | "certifications.md"
  | "contact.ts";

interface FileMeta {
  label: string;
  color: string;
  icon: string;
}

const FILES: Record<FileId, FileMeta> = {
  "hero.tsx": { label: "hero.tsx", color: "#d2a8ff", icon: "◆" },
  "about.md": { label: "about.md", color: "#7ee787", icon: "M" },
  "experience.json": { label: "experience.json", color: "#79c0ff", icon: "{ }" },
  projects: { label: "projects/", color: "#f0b429", icon: "▸" },
  "skills.yml": { label: "skills.yml", color: "#a5d6ff", icon: "~" },
  "certifications.md": { label: "certifications.md", color: "#7ee787", icon: "M" },
  "contact.ts": { label: "contact.ts", color: "#a5d6ff", icon: "◆" },
};

const FILE_ORDER: readonly FileId[] = [
  "hero.tsx",
  "about.md",
  "experience.json",
  "projects",
  "skills.yml",
  "certifications.md",
  "contact.ts",
];

interface CodeToken {
  text: string;
  color?: string;
}

function CodeBlock({ lines }: { lines: readonly (readonly CodeToken[])[] }) {
  return (
    <div
      style={{
        display: "flex",
        background: "var(--bg)",
        fontFamily: mono,
        fontSize: 13,
        lineHeight: 1.85,
      }}
    >
      <div
        aria-hidden
        style={{
          padding: "14px 10px 14px 18px",
          color: "var(--syntax-com)",
          textAlign: "right",
          userSelect: "none",
          borderRight: "1px solid var(--line)",
          minWidth: 40,
        }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div style={{ padding: "14px 18px", flex: 1, overflowX: "auto" }}>
        {lines.map((parts, i) => (
          <div key={i}>
            {parts.map((p, j) => (
              <span key={j} style={{ color: p.color ?? "var(--ink)" }}>
                {p.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FileHeader({
  id,
  kind,
  title,
  subtitle,
}: {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ marginBottom: 36 }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 11,
          color: "var(--syntax-com)",
          letterSpacing: 3,
          marginBottom: 12,
        }}
      >
        <span style={{ color: "var(--amber)" }}>§</span> {id} / {kind}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: serif,
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: -1.5,
          color: "var(--ink)",
          lineHeight: 1.05,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: sans,
            fontSize: 16,
            color: "var(--dim)",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

function HeroPage({ onOpen }: { onOpen: (id: FileId) => void }) {
  return (
    <section style={{ padding: "64px 56px 64px", position: "relative" }}>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.4,
        }}
      >
        <defs>
          <pattern id="ec-dot" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ec-dot)" />
      </svg>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 12,
            color: "var(--syntax-com)",
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          <span style={{ color: "var(--syntax-key)" }}>const</span>{" "}
          <span style={{ color: "var(--syntax-num)" }}>profile</span>{" "}
          <span style={{ color: "var(--ink)" }}>=</span>{" "}
          <span style={{ color: "var(--syntax-str)" }}>await</span> read(
          <span style={{ color: "var(--syntax-str)" }}>{"'./moin.json'"}</span>);
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: 140,
            fontWeight: 400,
            letterSpacing: -5,
            lineHeight: 0.95,
            color: "var(--ink)",
          }}
        >
          Moin
          <br />
          Bhokare<span style={{ color: "var(--amber)" }}>.</span>
        </h1>
        <p
          style={{
            margin: "22px 0 0",
            fontFamily: sans,
            fontSize: 20,
            color: "var(--dim)",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          Full-stack developer, currently an SDE at{" "}
          <span
            style={{
              color: "var(--ink)",
              background: "var(--panel)",
              padding: "1px 8px",
              borderRadius: 3,
              fontFamily: mono,
              fontSize: 15,
            }}
          >
            BrowserStack
          </span>{" "}
          — writing software that makes other people&apos;s software easier to ship.
        </p>

        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
          }}
        >
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 6,
              overflow: "hidden",
              background: "var(--panel)",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "8px 14px",
                background: "var(--panel-2)",
                borderBottom: "1px solid var(--line)",
                fontFamily: mono,
                fontSize: 11,
                color: "var(--dim)",
                gap: 10,
              }}
            >
              <span style={{ color: "var(--ok)" }}>●</span> profile.ts
              <span style={{ marginLeft: "auto", color: "var(--syntax-com)" }}>
                22 lines · saved
              </span>
            </div>
            <CodeBlock
              lines={[
                [
                  { text: "interface ", color: "var(--syntax-key)" },
                  { text: "Developer ", color: "var(--syntax-fn)" },
                  { text: "{", color: "var(--ink)" },
                ],
                [
                  { text: "  name", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  { text: '"Moin Bhokare"', color: "var(--syntax-str)" },
                  { text: ";", color: "var(--ink)" },
                ],
                [
                  { text: "  role", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  { text: '"SDE @ BrowserStack"', color: "var(--syntax-str)" },
                  { text: ";", color: "var(--ink)" },
                ],
                [
                  { text: "  based", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  { text: '"Pune, IN"', color: "var(--syntax-str)" },
                  { text: ";", color: "var(--ink)" },
                ],
                [
                  { text: "  stack", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  {
                    text: '["TS", "React", "Node", "Docker"]',
                    color: "var(--syntax-str)",
                  },
                  { text: ";", color: "var(--ink)" },
                ],
                [
                  { text: "  obsessions", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  {
                    text: '["dx", "agents", "infra"]',
                    color: "var(--syntax-str)",
                  },
                  { text: ";", color: "var(--ink)" },
                ],
                [
                  { text: "  shipping", color: "var(--syntax-num)" },
                  { text: ": ", color: "var(--ink)" },
                  { text: "true", color: "var(--syntax-key)" },
                  { text: ";", color: "var(--ink)" },
                ],
                [{ text: "}", color: "var(--ink)" }],
              ]}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(
              [
                ["Years shipping", "2+", "var(--syntax-num)"],
                ["Repositories", "24 public", "var(--syntax-fn)"],
                ["Currently at", "BrowserStack", "var(--ok)"],
                ["Open to", "collabs & chats", "var(--amber)"],
              ] as const
            ).map(([k, v, c]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 4,
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 12, color: "var(--dim)" }}>
                  {k}
                </span>
                <span style={{ fontFamily: mono, fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={profile.cvPath}
            download
            style={{
              padding: "12px 22px",
              background: "var(--amber)",
              color: "var(--bg)",
              fontFamily: mono,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            → Download CV
          </a>
          <button
            type="button"
            onClick={() => onOpen("about.md")}
            style={{
              padding: "12px 22px",
              background: "transparent",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              fontFamily: mono,
              fontSize: 13,
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Read the README
          </button>
        </div>

        <p
          style={{
            margin: "30px 0 0",
            fontFamily: mono,
            fontSize: 11,
            color: "var(--syntax-com)",
            letterSpacing: 2,
          }}
        >
          <span style={{ color: "var(--syntax-com)" }}>{"// hint · click any file in the sidebar (or "}</span>
          <span style={{ color: "var(--amber)" }}>theme terminal</span>
          <span style={{ color: "var(--syntax-com)" }}>{" in the terminal theme to swap)"}</span>
        </p>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader
        id="01"
        kind="about.md"
        title="Notes on how I work."
        subtitle="Two paragraphs of context before the receipts."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 1100 }}>
        <div>
          <p
            style={{
              margin: "0 0 18px",
              fontFamily: serif,
              fontSize: 22,
              lineHeight: 1.55,
              color: "var(--ink)",
            }}
          >
            I like software that respects the person reading it — whether that person is a
            teammate six months from now or a junior engineer Ctrl-clicking into your types at
            11pm.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--dim)",
            }}
          >
            Right now I&apos;m at BrowserStack building developer-facing surfaces. Before that,
            I shipped into an open-source AI agent framework at SuperAGI — the kind of codebase
            where your pull requests are read by strangers on the other side of the world. It
            shaped how I review code and name variables.
          </p>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 18px",
              fontFamily: sans,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--dim)",
            }}
          >
            The stack I reach for first is TypeScript + React + Node, with Docker underneath.
            I&apos;m fluent enough in Spring Boot and Java to hold my own when the backend
            asks for receipts. I got my B.Tech in CS from IIIT Pune in 2024.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--dim)",
            }}
          >
            I care about developer experience the way chefs care about knife work — it&apos;s
            not the point, but nothing else goes well without it.
          </p>
        </div>
      </div>
    </section>
  );
}

function ExperiencePage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader
        id="02"
        kind="experience.json"
        title="Where I've shipped."
        subtitle="Reverse-chronological. The current row is the loudest."
      />
      {experience.map((row) => (
        <div
          key={`${row.role}-${row.company}-${row.when}`}
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 36,
            padding: "28px 0",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 11, color: "var(--dim)", paddingTop: 6 }}>
            <div
              style={{
                color: row.current ? "var(--ok)" : "var(--dim)",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              {row.current && <span style={{ marginRight: 6 }}>●</span>}
              {row.when}
            </div>
            <div style={{ color: "var(--syntax-com)" }}>{row.range}</div>
            <div style={{ color: "var(--syntax-com)", marginTop: 4 }}>{row.location}</div>
          </div>
          <div>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 26,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: -0.5,
                }}
              >
                {row.role}
              </div>
              <div style={{ fontFamily: mono, fontSize: 13, color: "var(--syntax-fn)", marginTop: 2 }}>
                {row.company}
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {row.bullets.map((b, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: sans,
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.6,
                    paddingLeft: 22,
                    position: "relative",
                    opacity: 0.92,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 9,
                      width: 10,
                      height: 1,
                      background: "var(--amber)",
                    }}
                  />
                  {b}
                </li>
              ))}
            </ul>
            {row.tech && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                {row.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: "var(--dim)",
                      padding: "3px 9px",
                      border: "1px solid var(--line)",
                      borderRadius: 3,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

function ProjectsPage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader
        id="03"
        kind="./projects"
        title="Selected work."
        subtitle="Three picks — the rest live on GitHub."
      />
      {projects.map((p) => (
        <div
          key={p.name}
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            gap: 28,
            padding: "32px 0",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              fontFamily: serif,
              fontSize: 54,
              color: "var(--line)",
              fontWeight: 400,
              lineHeight: 1,
              paddingTop: 4,
            }}
          >
            0{p.num}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 6,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 32,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: -0.5,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: p.langColor,
                  }}
                />
                {p.lang}
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--syntax-com)",
                }}
              >
                {p.meta}
              </div>
            </div>
            <p
              style={{
                margin: "0 0 14px",
                fontFamily: sans,
                fontSize: 16,
                color: "var(--ink)",
                lineHeight: 1.6,
                opacity: 0.9,
                maxWidth: 720,
              }}
            >
              {p.longDesc}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.stack.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: "var(--ink)",
                      padding: "3px 9px",
                      background: "var(--panel)",
                      borderRadius: 3,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 18, fontFamily: mono, fontSize: 12 }}>
                <span style={{ color: "var(--syntax-str)" }}>→ README</span>
                <span style={{ color: "var(--syntax-fn)" }}>→ Repository ↗</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

const SKILL_BUCKETS: readonly {
  label: string;
  items: readonly { name: string; pct: number }[];
  color: string;
}[] = [
  {
    label: "languages",
    color: "var(--syntax-fn)",
    items: [
      { name: "TypeScript", pct: 92 },
      { name: "JavaScript", pct: 94 },
      { name: "Java", pct: 78 },
      { name: "C++", pct: 72 },
      { name: "Python", pct: 74 },
    ],
  },
  {
    label: "frontend",
    color: "var(--syntax-num)",
    items: [
      { name: "React", pct: 90 },
      { name: "Next.js", pct: 80 },
      { name: "CSS", pct: 82 },
    ],
  },
  {
    label: "backend",
    color: "var(--ok)",
    items: [
      { name: "Node.js", pct: 88 },
      { name: "Spring Boot", pct: 76 },
      { name: "Microservices", pct: 72 },
    ],
  },
  {
    label: "infrastructure",
    color: "var(--amber)",
    items: [
      { name: "Docker", pct: 85 },
      { name: "GCP", pct: 72 },
      { name: "AWS", pct: 68 },
      { name: "Linux", pct: 82 },
    ],
  },
];

function SkillsPage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader
        id="04"
        kind="skills.yml"
        title="Current stack."
        subtitle="Things I'd defend in an interview — not a dump of everything I've touched."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 32,
          maxWidth: 1000,
        }}
      >
        {SKILL_BUCKETS.map((bucket) => (
          <div key={bucket.label}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: bucket.color,
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              {"// "}
              {bucket.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bucket.items.map(({ name, pct }) => (
                <div key={name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontFamily: mono,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--ink)" }}>{name}</span>
                    <span style={{ color: "var(--dim)" }}>{pct}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    aria-label={`${name} proficiency`}
                    style={{
                      height: 4,
                      background: "var(--panel)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: bucket.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CertsPage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader id="05" kind="certifications.md" title="Credentials." />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {certifications.map((c) => (
          <div
            key={c.title}
            style={{
              padding: "16px 20px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              borderRadius: 4,
              minWidth: 280,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 10,
                color: "var(--ok)",
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              ● VERIFIED
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 18,
                color: "var(--ink)",
                marginBottom: 2,
              }}
            >
              {c.title}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "var(--dim)" }}>
              {c.issuer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section style={{ padding: "60px 56px" }}>
      <FileHeader
        id="06"
        kind="contact.ts"
        title="Let's talk."
        subtitle="I read every email. If it has the word 'crypto' in it, I read it more slowly."
      />
      <div
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          overflow: "hidden",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "8px 14px",
            background: "var(--panel-2)",
            borderBottom: "1px solid var(--line)",
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim)",
            gap: 10,
          }}
        >
          <span style={{ color: "var(--ok)" }}>●</span> contact.ts
        </div>
        <CodeBlock
          lines={[
            [
              { text: "export const ", color: "var(--syntax-key)" },
              { text: "reach ", color: "var(--syntax-fn)" },
              { text: "= {", color: "var(--ink)" },
            ],
            [
              { text: "  email", color: "var(--syntax-num)" },
              { text: ":    ", color: "var(--ink)" },
              { text: `"${profile.email}"`, color: "var(--syntax-str)" },
              { text: ",", color: "var(--ink)" },
            ],
            [
              { text: "  phone", color: "var(--syntax-num)" },
              { text: ":    ", color: "var(--ink)" },
              { text: `"${profile.phone}"`, color: "var(--syntax-str)" },
              { text: ",", color: "var(--ink)" },
            ],
            [
              { text: "  github", color: "var(--syntax-num)" },
              { text: ":   ", color: "var(--ink)" },
              { text: `"${profile.github}"`, color: "var(--syntax-str)" },
              { text: ",", color: "var(--ink)" },
            ],
            [
              { text: "  linkedin", color: "var(--syntax-num)" },
              { text: ": ", color: "var(--ink)" },
              { text: `"${profile.linkedin}"`, color: "var(--syntax-str)" },
              { text: ",", color: "var(--ink)" },
            ],
            [
              { text: "  leetcode", color: "var(--syntax-num)" },
              { text: ": ", color: "var(--ink)" },
              { text: `"${profile.leetcode}"`, color: "var(--syntax-str)" },
              { text: ",", color: "var(--ink)" },
            ],
            [
              { text: "  status", color: "var(--syntax-num)" },
              { text: ":   ", color: "var(--ink)" },
              {
                text: '"open to interesting problems"',
                color: "var(--syntax-str)",
              },
              { text: ",", color: "var(--ink)" },
            ],
            [{ text: "};", color: "var(--ink)" }],
          ]}
        />
      </div>
      <footer
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: mono,
          fontSize: 11,
          color: "var(--syntax-com)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© 2026 Moin Bhokare · Built with care in Pune.</span>
        <span>
          <span style={{ color: "var(--ok)" }}>●</span> last deploy: just now ·{" "}
          <span style={{ color: "var(--syntax-num)" }}>main</span>
        </span>
      </footer>
    </section>
  );
}

function renderPage(id: FileId, onOpen: (id: FileId) => void): ReactNode {
  switch (id) {
    case "hero.tsx":
      return <HeroPage onOpen={onOpen} />;
    case "about.md":
      return <AboutPage />;
    case "experience.json":
      return <ExperiencePage />;
    case "projects":
      return <ProjectsPage />;
    case "skills.yml":
      return <SkillsPage />;
    case "certifications.md":
      return <CertsPage />;
    case "contact.ts":
      return <ContactPage />;
  }
}

function neighborOf(id: FileId, tabs: readonly FileId[]): FileId | undefined {
  const idx = tabs.indexOf(id);
  if (idx < 0) return undefined;
  return tabs[idx + 1] ?? tabs[idx - 1];
}

export default function EditorialPortfolio() {
  const [active, setActive] = useState<FileId>("hero.tsx");
  const [openTabs, setOpenTabs] = useState<FileId[]>(["hero.tsx"]);
  const mainRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Map<FileId, HTMLButtonElement>>(new Map());

  useLayoutEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [active]);

  const open = useCallback((id: FileId) => {
    if (!FILES[id]) return;
    setActive(id);
    setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
  }, []);

  const close = useCallback(
    (id: FileId) => {
      const neighbor = neighborOf(id, openTabs);
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== id);
        return next.length === 0 ? ["hero.tsx"] : next;
      });
      setActive((cur) => (cur === id ? neighbor ?? "hero.tsx" : cur));
    },
    [openTabs],
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, id: FileId) => {
    const idx = openTabs.indexOf(id);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = openTabs[idx + 1] ?? openTabs[0];
      setActive(next);
      tabRefs.current.get(next)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = openTabs[idx - 1] ?? openTabs[openTabs.length - 1];
      setActive(next);
      tabRefs.current.get(next)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = openTabs[0];
      setActive(first);
      tabRefs.current.get(first)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = openTabs[openTabs.length - 1];
      setActive(last);
      tabRefs.current.get(last)?.focus();
    } else if (e.key === "Delete") {
      e.preventDefault();
      close(id);
    }
  };

  const fileMeta = FILES[active];

  useEffect(() => {
    tabRefs.current.get(active)?.focus({ preventScroll: true });
    // intentionally only on tab strip key navigation; not on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: sans,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          background: "var(--panel)",
          borderBottom: "1px solid var(--line)",
          fontFamily: mono,
          fontSize: 12,
          color: "var(--dim)",
          flexShrink: 0,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f56" }} aria-hidden />
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ffbd2e" }} aria-hidden />
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#27c93f" }} aria-hidden />
        <span style={{ marginLeft: 16 }}>
          moin-bhokare — portfolio — {fileMeta.label}
        </span>
        <span style={{ marginLeft: "auto", color: "var(--syntax-com)" }}>
          main ● · UTF-8 · LF · TypeScript
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Open files"
        aria-orientation="horizontal"
        style={{
          display: "flex",
          background: "var(--panel)",
          borderBottom: "1px solid var(--line)",
          flexShrink: 0,
          overflowX: "auto",
        }}
      >
        {openTabs.map((id) => {
          const meta = FILES[id];
          const isActive = id === active;
          return (
            <button
              key={id}
              ref={(el) => {
                if (el) tabRefs.current.set(id, el);
                else tabRefs.current.delete(id);
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => onTabKey(e, id)}
              style={{
                padding: "8px 14px",
                borderRight: "1px solid var(--line)",
                background: isActive ? "var(--bg)" : "transparent",
                borderTop: isActive
                  ? `1px solid ${meta.color}`
                  : "1px solid transparent",
                borderBottom: "none",
                borderLeft: "none",
                fontFamily: mono,
                fontSize: 12,
                color: isActive ? "var(--ink)" : "var(--dim)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: meta.color,
                }}
              />
              {meta.label}
              <span
                role="button"
                aria-label={`Close ${meta.label}`}
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  close(id);
                }}
                style={{
                  marginLeft: 4,
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  opacity: isActive ? 0.6 : 0,
                  transition: "opacity 0.12s, background 0.12s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = isActive ? "0.6" : "0";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ×
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          flex: 1,
          minHeight: 0,
        }}
      >
        <nav
          aria-label="Explorer"
          style={{
            background: "var(--panel)",
            borderRight: "1px solid var(--line)",
            padding: "16px 0",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "0 14px 8px",
              fontFamily: mono,
              fontSize: 10,
              color: "var(--syntax-com)",
              letterSpacing: 2,
            }}
          >
            EXPLORER
          </div>
          <div
            style={{
              padding: "6px 12px",
              fontFamily: mono,
              fontSize: 12,
              color: "var(--dim)",
            }}
          >
            <span style={{ color: "var(--syntax-com)", width: 12, display: "inline-block" }}>▾</span>
            <span style={{ marginLeft: 10 }}>moin-bhokare</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {FILE_ORDER.map((id) => {
              const meta = FILES[id];
              const isActive = id === active;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => open(id)}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "6px 12px 6px 24px",
                      background: isActive ? "var(--panel-2)" : "transparent",
                      borderLeft: isActive
                        ? `2px solid var(--amber)`
                        : "2px solid transparent",
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      fontFamily: mono,
                      fontSize: 12,
                      color: isActive ? "var(--ink)" : "var(--dim)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        color: isActive ? "var(--amber)" : "var(--syntax-com)",
                        width: 12,
                        display: "inline-block",
                      }}
                    >
                      {isActive ? "●" : "○"}
                    </span>
                    <span style={{ flex: 1 }}>{meta.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              padding: "24px 14px 8px",
              fontFamily: mono,
              fontSize: 10,
              color: "var(--syntax-com)",
              letterSpacing: 2,
            }}
          >
            TIMELINE
          </div>
          <div style={{ padding: "4px 14px", fontFamily: mono, fontSize: 11, color: "var(--dim)", lineHeight: 2 }}>
            <div>
              <span style={{ color: "var(--ok)" }}>+</span> shipped cert strip
            </div>
            <div>
              <span style={{ color: "var(--ok)" }}>+</span> refactor timeline
            </div>
            <div>
              <span style={{ color: "var(--amber)" }}>~</span> update projects
            </div>
            <div>
              <span style={{ color: "var(--syntax-com)" }}>·</span> rewrite about
            </div>
          </div>

          <div
            style={{
              padding: "24px 14px 8px",
              fontFamily: mono,
              fontSize: 10,
              color: "var(--syntax-com)",
              letterSpacing: 2,
            }}
          >
            STATUS
          </div>
          <div style={{ padding: "4px 14px", fontFamily: mono, fontSize: 11, color: "var(--ink)", lineHeight: 1.9 }}>
            <div>
              <span style={{ color: "var(--ok)" }}>●</span> online
            </div>
            <div>
              <span style={{ color: "var(--syntax-num)" }}>⎇</span> main
            </div>
            <div>
              <span style={{ color: "var(--amber)" }}>◉</span> pune, in
            </div>
          </div>
        </nav>

        <main
          ref={mainRef}
          key={active}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          style={{ overflowY: "auto" }}
        >
          {renderPage(active, open)}
        </main>
      </div>

      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
          padding: "6px 16px",
          background: "var(--amber)",
          color: "var(--bg)",
          fontFamily: mono,
          fontSize: 11,
        }}
      >
        <span>⎇ main</span>
        <span>● 0</span>
        <span>⚠ 0</span>
        <span style={{ marginLeft: "auto" }}>Ln 42, Col 8</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>{fileMeta.label}</span>
      </div>
    </div>
  );
}
