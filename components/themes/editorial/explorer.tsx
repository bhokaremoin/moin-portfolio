"use client";

import { ReactNode } from "react";
import { type FileId, FILE_ORDER, getFile } from "./file-registry";

const mono = "var(--font-mono)";

export function Explorer({
  active,
  onOpen,
}: {
  active: FileId;
  onOpen: (id: FileId) => void;
}): ReactNode {
  return (
    <nav
      aria-label="Explorer"
      style={{
        background: "var(--panel)",
        borderRight: "1px solid var(--line)",
        padding: "16px 0",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* EXPLORER header */}
      <div
        style={{
          padding: "0 14px 8px",
          fontFamily: mono,
          fontSize: 10,
          color: "var(--syntax-com)",
          letterSpacing: 2,
          flexShrink: 0,
        }}
      >
        EXPLORER
      </div>

      {/* repo name */}
      <div
        style={{
          padding: "6px 12px",
          fontFamily: mono,
          fontSize: 12,
          color: "var(--dim)",
          flexShrink: 0,
        }}
      >
        <span
          style={{ color: "var(--syntax-com)", width: 12, display: "inline-block" }}
          aria-hidden
        >
          ▾
        </span>
        <span style={{ marginLeft: 10 }}>moin-bhokare</span>
      </div>

      {/* file list */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }} role="list">
        {FILE_ORDER.map((id) => {
          const meta = getFile(id);
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onOpen(id)}
                aria-current={isActive ? "true" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "6px 12px 6px 24px",
                  background: isActive ? "var(--panel-2)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid var(--amber)"
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
                    flexShrink: 0,
                  }}
                >
                  {isActive ? "●" : "○"}
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {meta.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
