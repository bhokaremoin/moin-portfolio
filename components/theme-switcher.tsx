"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PALETTES, THEME_IDS, ThemeId } from "@/lib/portfolio-data";
import { useTheme } from "@/components/theme-provider";

interface SwitcherSkin {
  shell: string;
  border: string;
  text: string;
  textActive: string;
  btnActive: string;
}

const SKINS: Record<ThemeId, SwitcherSkin> = {
  terminal: {
    shell: "rgba(11, 15, 20, 0.85)",
    border: "rgba(122, 255, 156, 0.18)",
    text: "rgba(199, 210, 204, 0.62)",
    textActive: "#7aff9c",
    btnActive: "rgba(122, 255, 156, 0.12)",
  },
  executive: {
    shell: "rgba(255, 255, 255, 0.92)",
    border: "rgba(229, 227, 221, 1)",
    text: "rgba(60, 64, 70, 0.7)",
    textActive: "#0c0d0f",
    btnActive: "rgba(12, 13, 15, 0.08)",
  },
  editorial: {
    shell: "rgba(21, 26, 33, 0.92)",
    border: "rgba(240, 180, 41, 0.18)",
    text: "rgba(139, 148, 158, 0.85)",
    textActive: "#f0b429",
    btnActive: "rgba(240, 180, 41, 0.15)",
  },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const skin = SKINS[theme];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onPick = (id: ThemeId) => {
    setTheme(id);
    close();
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="ts-root"
      style={{
        position: "fixed",
        top: 14,
        left: 14,
        zIndex: 50,
        fontFamily: "var(--font-mono)",
      }}
      onMouseEnter={() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(hover: hover)").matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(hover: hover)").matches) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Switch theme"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKey}
        className="ts-trigger"
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: skin.shell,
          border: `1px solid ${skin.border}`,
          color: skin.textActive,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            transition: "transform 0.4s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <circle cx="9" cy="9" r="6.5" />
          <circle cx="6.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="11.4" cy="6.4" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12.4" cy="10.2" r="0.9" fill="currentColor" stroke="none" />
          <path d="M9 15.5c1.4 0 1.6-1.4 2.6-1.8 1-.4 2.4.2 2.7-1" />
        </svg>
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="Theme menu"
        hidden={!open}
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          minWidth: 240,
          padding: 6,
          borderRadius: 14,
          background: skin.shell,
          border: `1px solid ${skin.border}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 16px 44px rgba(0,0,0,0.28)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
          transformOrigin: "top left",
          transition:
            "opacity 0.18s ease, transform 0.22s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          style={{
            padding: "10px 12px 6px",
            letterSpacing: 2.5,
            fontSize: 10,
            fontWeight: 600,
            color: skin.text,
          }}
        >
          SELECT THEME
        </div>
        {THEME_IDS.map((id) => {
          const palette = PALETTES[id];
          const isActive = id === theme;
          return (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={isActive}
              onClick={() => onPick(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                padding: "9px 11px",
                borderRadius: 9,
                border: "none",
                background: isActive ? skin.btnActive : "transparent",
                color: isActive ? skin.textActive : skin.text,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s, color 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = skin.btnActive;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span style={{ flex: 1, background: palette.bg }} />
                <span style={{ flex: 1, background: palette.accent }} />
              </span>
              <span style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    fontSize: 11,
                  }}
                >
                  {palette.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.6,
                    letterSpacing: 0.3,
                    marginTop: 2,
                    textTransform: "none",
                  }}
                >
                  {palette.hint}
                </div>
              </span>
              {isActive && (
                <span
                  aria-hidden
                  style={{
                    marginLeft: "auto",
                    fontSize: 13,
                    lineHeight: 1,
                    color: skin.textActive,
                  }}
                >
                  ●
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
