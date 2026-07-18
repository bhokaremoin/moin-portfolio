"use client";

import { ReactNode } from "react";
import { profile, projects, skills } from "@/lib/portfolio-data";
import { Markdown } from "./markdown";
import { type FileId, getFile } from "./file-registry";

const mono = "var(--font-mono)";
const serif = "var(--font-serif)";
const sans = "var(--font-sans)";

// --- helpers ---

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// --- JSON preview ---

function JsonValue({ value }: { value: unknown }): ReactNode {
  if (value === null) return <span style={{ color: "var(--syntax-key)" }}>null</span>;
  if (typeof value === "boolean")
    return <span style={{ color: "var(--syntax-key)" }}>{String(value)}</span>;
  if (typeof value === "number")
    return <span style={{ color: "var(--syntax-fn)" }}>{value}</span>;
  if (typeof value === "string")
    return <span style={{ color: "var(--syntax-str)" }}>&ldquo;{value}&rdquo;</span>;
  if (Array.isArray(value)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {value.map((item, i) => (
          <div
            key={i}
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              padding: "12px 16px",
            }}
          >
            {typeof item === "object" && item !== null ? (
              <JsonObject obj={item as Record<string, unknown>} />
            ) : (
              <JsonValue value={item} />
            )}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return <JsonObject obj={value as Record<string, unknown>} />;
  }
  return <span>{String(value)}</span>;
}

function JsonObject({ obj }: { obj: Record<string, unknown> }): ReactNode {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "var(--syntax-num)",
              minWidth: 120,
              flexShrink: 0,
            }}
          >
            {k}
          </span>
          <span style={{ fontFamily: mono, fontSize: 12, color: "var(--syntax-com)" }}>:</span>
          <span style={{ fontFamily: mono, fontSize: 12 }}>
            {typeof v === "object" && v !== null ? (
              <JsonValue value={v} />
            ) : (
              <JsonValue value={v} />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function JsonPreview({ source }: { source: string }): ReactNode {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    return (
      <pre
        style={{
          fontFamily: mono,
          fontSize: 12,
          color: "var(--ink)",
          whiteSpace: "pre-wrap",
          padding: 0,
          margin: 0,
        }}
      >
        {source}
      </pre>
    );
  }

  return (
    <div style={{ fontFamily: mono, fontSize: 13 }}>
      <JsonValue value={parsed} />
    </div>
  );
}

// --- skills preview ---

const BUCKET_COLORS: Record<string, string> = {
  Languages: "var(--syntax-fn)",
  Frontend: "var(--syntax-num)",
  Backend: "var(--ok)",
  Infrastructure: "var(--amber)",
  Data: "var(--syntax-str)",
  Practice: "var(--syntax-key)",
};

function SkillsPreview(): ReactNode {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 32,
      }}
    >
      {skills.map((bucket) => {
        const color = BUCKET_COLORS[bucket.label] ?? "var(--syntax-com)";
        return (
          <div key={bucket.label}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 12,
                color,
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              {"// "}
              {bucket.label.toLowerCase()}
            </div>
            {bucket.description && (
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 11,
                  color: "var(--dim)",
                  marginBottom: 10,
                }}
              >
                {bucket.description}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bucket.items.map(({ name, level }) => (
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
                    {level != null && (
                      <span style={{ color: "var(--dim)" }}>{level}</span>
                    )}
                  </div>
                  {level != null && (
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={level}
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
                          width: `${level}%`,
                          height: "100%",
                          background: color,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- project preview ---

function ProjectPreview({ file }: { file: ReturnType<typeof getFile> }): ReactNode {
  const slug = (file.id as string).replace(/^projects\//, "").replace(/\.md$/, "");
  const project = projects.find((p) => toSlug(p.name) === slug);

  if (!project) {
    return <Markdown source={file.source} />;
  }

  return (
    <div>
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 11,
            color: "var(--syntax-com)",
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          {project.kind} · {project.year}
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: 48,
            fontWeight: 400,
            letterSpacing: -1.5,
            color: "var(--ink)",
            lineHeight: 1.05,
          }}
        >
          {project.name}
        </h2>
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
          {project.longDesc}
        </p>
      </header>

      {project.outcomes.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--syntax-com)",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            {"// outcomes"}
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 1.5em" }}>
            {project.outcomes.map((o, i) => (
              <li
                key={i}
                style={{ fontFamily: sans, fontSize: 14, color: "var(--dim)", marginBottom: 6 }}
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.stack.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--syntax-com)",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            {"// stack"}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.stack.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--syntax-str)",
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 3,
                  padding: "3px 10px",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- readme / hero preview ---

function ReadmePreview({ onOpen }: { onOpen: (id: FileId) => void }): ReactNode {
  const firstProjectSlug =
    projects.length > 0 ? toSlug(projects[0].name) : null;

  return (
    <div>
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
        <span style={{ color: "var(--syntax-num)" }}>portfolio</span>{" "}
        <span style={{ color: "var(--ink)" }}>=</span>{" "}
        <span style={{ color: "var(--syntax-str)" }}>await</span> read(
        <span style={{ color: "var(--syntax-str)" }}>{"'./README.md'"}</span>);
      </div>

      <h1
        style={{
          margin: 0,
          fontFamily: serif,
          fontSize: 96,
          fontWeight: 400,
          letterSpacing: -4,
          lineHeight: 0.95,
          color: "var(--ink)",
        }}
      >
        {profile.name.split(" ")[0]}
        <br />
        {profile.name.split(" ").slice(1).join(" ")}
        <span style={{ color: "var(--amber)" }}>.</span>
      </h1>

      <p
        style={{
          margin: "20px 0 0",
          fontFamily: sans,
          fontSize: 18,
          color: "var(--dim)",
          maxWidth: 600,
          lineHeight: 1.5,
        }}
      >
        {profile.tagline}
      </p>

      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {profile.cvPath && (
          <a
            href={profile.cvPath}
            download
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "var(--bg)",
              background: "var(--amber)",
              padding: "8px 18px",
              borderRadius: 4,
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ↓ Download CV
          </a>
        )}
        <button
          type="button"
          onClick={() => onOpen("about.md")}
          style={{
            fontFamily: mono,
            fontSize: 12,
            color: "var(--ink)",
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "8px 18px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          about.md →
        </button>
        {firstProjectSlug && (
          <button
            type="button"
            onClick={() => onOpen(`projects/${firstProjectSlug}.md`)}
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "var(--ink)",
              background: "var(--panel)",
              border: "1px solid var(--line)",
              padding: "8px 18px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {`projects/${firstProjectSlug}.md →`}
          </button>
        )}
      </div>
    </div>
  );
}

// --- main component ---

export function PreviewPane({
  file,
  onOpen,
}: {
  file: ReturnType<typeof getFile>;
  onOpen: (id: FileId) => void;
}): ReactNode {
  const inner = (() => {
    switch (file.preview) {
      case "markdown":
        return <Markdown source={file.source} />;
      case "json":
        return <JsonPreview source={file.source} />;
      case "skills":
        return <SkillsPreview />;
      case "project":
        return <ProjectPreview file={file} />;
      case "readme":
        return <ReadmePreview onOpen={onOpen} />;
    }
  })();

  return (
    <div
      style={{
        padding: "40px 48px",
        height: "100%",
        overflowY: "auto",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      {inner}
    </div>
  );
}
