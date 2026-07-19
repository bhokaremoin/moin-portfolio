import { ReactNode } from "react";
import { profile } from "@/lib/portfolio-data";
import { ASCII_MOIN } from "./ascii";

const mono = "var(--font-mono)";

function TermLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      style={{ color: "var(--cyan)", textDecoration: "underline", textUnderlineOffset: 2 }}
    >
      {label}
    </a>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <span style={{ color: "var(--amber)", width: 82, display: "inline-block" }}>{k}</span>
      <span style={{ color: "var(--dim)" }}>·</span>
      <span style={{ color: "var(--ink)" }}>{children}</span>
    </div>
  );
}

/**
 * Neofetch-style landing: ASCII banner on the left, an info panel on the right.
 * Printed as the top of the terminal buffer on load. Stacks on narrow screens.
 */
export function TerminalIntro() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
        <pre
          aria-hidden
          style={{
            margin: 0,
            color: "var(--accent)",
            fontFamily: mono,
            fontSize: 13,
            lineHeight: 1.15,
            whiteSpace: "pre",
            textShadow:
              "0 0 8px rgba(166,227,161,0.35), 0 0 20px rgba(166,227,161,0.15)",
          }}
        >
          {ASCII_MOIN}
        </pre>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontFamily: mono,
            fontSize: 13,
          }}
        >
          <div style={{ color: "var(--accent)" }}>moin@portfolio</div>
          <div style={{ color: "var(--dim)" }} aria-hidden>
            ───────────────
          </div>
          <Row k="role">{profile.role}</Row>
          <Row k="based">{profile.location}</Row>
          <Row k="stack">{profile.stackSummary}</Row>
          <Row k="education">{profile.educationShort}</Row>
          <Row k="links">
            <TermLink label="github" href={`https://${profile.github}`} />
            <span style={{ color: "var(--dim)" }}> · </span>
            <TermLink label="linkedin" href={`https://${profile.linkedin}`} />
            <span style={{ color: "var(--dim)" }}> · </span>
            <TermLink label="résumé" href={profile.cvPath} />
          </Row>
        </div>
      </div>

      <div style={{ marginTop: 14, color: "var(--dim)", fontFamily: mono, fontSize: 13 }}>
        type <span style={{ color: "var(--accent)" }}>help</span> — or run a command from the bar below
      </div>
    </div>
  );
}
