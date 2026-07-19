"use client";

import { RESUME_URL } from "@/lib/routes";
import { TerminalShell } from "./shell";
import { SeoContent } from "./seo-content";

export default function TerminalPortfolio() {
  return (
    <div
      data-theme="terminal"
      style={{
        height: "100vh", overflow: "hidden", background: "var(--bg)",
        color: "var(--ink)", fontFamily: "var(--font-mono)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
          borderBottom: "1px solid var(--line)", background: "var(--panel)",
          color: "var(--dim)", fontSize: 12, flexShrink: 0,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ff5f56" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ffbd2e" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#27c93f" }} aria-hidden />
        <span style={{ marginLeft: 14, color: "var(--ink)" }}>moin@portfolio: ~ — zsh</span>
        <a
          href={RESUME_URL}
          style={{
            marginLeft: "auto",
            color: "var(--accent)",
            textDecoration: "none",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "3px 10px",
            fontFamily: "var(--font-mono)",
          }}
        >
          résumé view →
        </a>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TerminalShell />
      </div>
      <SeoContent />
    </div>
  );
}
