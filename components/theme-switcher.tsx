"use client";

import { useRef } from "react";
import { PALETTES, ThemeId } from "@/lib/portfolio-data";
import { useTheme } from "@/components/theme-provider";

const ORDER: readonly ThemeId[] = ["terminal", "editorial", "executive"];
const LABELS: Record<ThemeId, string> = {
  terminal: "Terminal",
  editorial: "Code",
  executive: "Executive",
};

interface SwitcherSkin {
  shell: string; border: string; text: string; textActive: string; btnActive: string;
}
const SKINS: Record<ThemeId, SwitcherSkin> = {
  terminal: { shell: "rgba(11,15,20,0.85)", border: "rgba(122,255,156,0.18)", text: "rgba(199,210,204,0.62)", textActive: "#7aff9c", btnActive: "rgba(122,255,156,0.14)" },
  executive: { shell: "rgba(255,255,255,0.92)", border: "rgba(229,227,221,1)", text: "rgba(60,64,70,0.7)", textActive: "#0c0d0f", btnActive: "rgba(12,13,15,0.08)" },
  editorial: { shell: "rgba(21,26,33,0.92)", border: "rgba(240,180,41,0.18)", text: "rgba(139,148,158,0.85)", textActive: "#f0b429", btnActive: "rgba(240,180,41,0.15)" },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const skin = SKINS[theme];
  const refs = useRef<Map<ThemeId, HTMLButtonElement>>(new Map());

  const move = (dir: 1 | -1, from: ThemeId) => {
    const i = ORDER.indexOf(from);
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setTheme(next);
    refs.current.get(next)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{
        position: "fixed", top: 12, right: 12, zIndex: 50,
        display: "flex", gap: 2, padding: 3, borderRadius: 12,
        background: skin.shell, border: `1px solid ${skin.border}`,
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {ORDER.map((id) => {
        const active = id === theme;
        return (
          <button
            key={id}
            ref={(el) => { if (el) refs.current.set(id, el); else refs.current.delete(id); }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            aria-label={LABELS[id]}
            title={PALETTES[id].hint}
            onClick={() => setTheme(id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1, id); }
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1, id); }
            }}
            style={{
              padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer",
              background: active ? skin.btnActive : "transparent",
              color: active ? skin.textActive : skin.text,
              fontFamily: "inherit", fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
              fontWeight: active ? 600 : 500, transition: "background .15s, color .15s",
            }}
          >
            {LABELS[id]}
          </button>
        );
      })}
    </div>
  );
}
