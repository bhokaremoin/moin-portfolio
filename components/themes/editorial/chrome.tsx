"use client";

import { KeyboardEvent, ReactNode, useRef } from "react";
import { type FileId, getFile } from "./file-registry";

const mono = "var(--font-mono)";

// --- ViewMode ---

export type ViewMode = "split" | "code" | "preview";

// --- TitleBar ---

export function TitleBar({ label }: { label: string }): ReactNode {
  return (
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
      {/* macOS traffic-light dots */}
      <span
        aria-hidden
        style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f56", display: "inline-block" }}
      />
      <span
        aria-hidden
        style={{ width: 12, height: 12, borderRadius: 6, background: "#ffbd2e", display: "inline-block" }}
      />
      <span
        aria-hidden
        style={{ width: 12, height: 12, borderRadius: 6, background: "#27c93f", display: "inline-block" }}
      />
      <span style={{ marginLeft: 16 }}>moin-bhokare — portfolio — {label}</span>
      <span style={{ marginLeft: "auto", color: "var(--syntax-com)" }}>
        main ● · UTF-8 · TypeScript
      </span>
    </div>
  );
}

// --- TabStrip ---

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: "split", label: "⊟" },
  { value: "code", label: "</>" },
  { value: "preview", label: "⊡" },
];

export function TabStrip({
  tabs,
  active,
  onSelect,
  onClose,
  view,
  onView,
}: {
  tabs: FileId[];
  active: FileId;
  onSelect: (id: FileId) => void;
  onClose: (id: FileId) => void;
  view: ViewMode;
  onView: (v: ViewMode) => void;
}): ReactNode {
  const tabRefs = useRef<Map<FileId, HTMLButtonElement>>(new Map());

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, id: FileId) => {
    const idx = tabs.indexOf(id);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = tabs[idx + 1] ?? tabs[0];
      onSelect(next);
      tabRefs.current.get(next)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = tabs[idx - 1] ?? tabs[tabs.length - 1];
      onSelect(next);
      tabRefs.current.get(next)?.focus();
    } else if (e.key === "Delete") {
      e.preventDefault();
      onClose(id);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        background: "var(--panel)",
        borderBottom: "1px solid var(--line)",
        flexShrink: 0,
        overflowX: "auto",
      }}
    >
      {/* tab list */}
      <div
        role="tablist"
        aria-label="Open files"
        aria-orientation="horizontal"
        style={{ display: "flex", flex: 1, overflowX: "auto" }}
      >
        {tabs.map((id) => {
          const meta = getFile(id);
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
              onClick={() => onSelect(id)}
              onKeyDown={(e) => onTabKey(e, id)}
              style={{
                padding: "8px 14px",
                borderRight: "1px solid var(--line)",
                background: isActive ? "var(--bg)" : "transparent",
                borderTop: isActive
                  ? "1px solid var(--amber)"
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
                flexShrink: 0,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: "var(--amber)",
                  display: "inline-block",
                }}
              />
              {meta.label}
              <span
                role="button"
                aria-label={`Close ${meta.label}`}
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(id);
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

      {/* view-mode segmented control */}
      <div
        aria-label="View mode"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "6px 12px",
          borderLeft: "1px solid var(--line)",
          flexShrink: 0,
        }}
      >
        {VIEW_MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={view === value}
            aria-label={`View: ${value}`}
            onClick={() => onView(value)}
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: view === value ? "var(--ink)" : "var(--dim)",
              background: view === value ? "var(--panel-2)" : "transparent",
              border: view === value ? "1px solid var(--line)" : "1px solid transparent",
              borderRadius: 3,
              padding: "3px 8px",
              cursor: "pointer",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- StatusBar ---

export function StatusBar({ label }: { label: string }): ReactNode {
  return (
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
      <span>{label}</span>
    </div>
  );
}
