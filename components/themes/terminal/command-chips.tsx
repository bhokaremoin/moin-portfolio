"use client";

const CHIPS = ["about", "projects", "experience", "skills", "contact", "help"] as const;

export function CommandChips({ onRun }: { onRun: (cmd: string) => void }) {
  return (
    <div
      aria-label="Quick commands"
      style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "10px 18px" }}
    >
      {CHIPS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onRun(c)}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)",
            background: "rgba(122,255,156,0.06)", border: "1px solid var(--line)",
            borderRadius: 6, padding: "4px 10px", cursor: "pointer",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
