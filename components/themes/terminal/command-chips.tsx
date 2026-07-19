"use client";

const mono = "var(--font-mono)";

const CHIPS = ["about", "projects", "experience", "skills", "contact", "help"] as const;

export function CommandChips({ onRun }: { onRun: (cmd: string) => void }) {
  return (
    <div
      aria-label="Quick commands"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "10px 18px",
        borderTop: "1px solid var(--line)",
        background: "var(--panel)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 11,
          color: "var(--dim)",
          letterSpacing: 1.5,
          marginRight: 4,
        }}
      >
        run:
      </span>
      {CHIPS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onRun(c)}
          style={{
            fontFamily: mono,
            fontSize: 12,
            color: "var(--dim)",
            background: "transparent",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            transition: "color .15s, border-color .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--dim)";
            e.currentTarget.style.borderColor = "var(--line)";
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
