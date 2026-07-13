"use client";

import { TerminalShell } from "./shell";
import { SeoContent } from "./seo-content";

export default function TerminalPortfolio() {
  return (
    <div
      style={{
        height: "100vh", overflow: "hidden", background: "var(--bg)",
        color: "var(--ink)", fontFamily: "var(--font-mono)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
          borderBottom: "1px solid var(--line)", background: "#0a0d12",
          color: "var(--dim)", fontSize: 12, flexShrink: 0,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ff5f56" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ffbd2e" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#27c93f" }} aria-hidden />
        <span style={{ marginLeft: 14, color: "var(--ink)" }}>moin@portfolio: ~ — zsh</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TerminalShell />
      </div>
      <SeoContent />
    </div>
  );
}
