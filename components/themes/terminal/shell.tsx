"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "@/components/theme-provider";
import { isThemeId } from "@/lib/portfolio-data";
import {
  COLOR_VAR,
  TerminalLine,
  tbExecute,
} from "./commands";

interface HistoryItem {
  kind: "sys" | "cmd" | "out";
  input?: string;
  lines?: readonly TerminalLine[];
}

const MAX_SCROLLBACK = 200;
const MAX_HISTORY = 50;
const INTRO: HistoryItem = {
  kind: "sys",
  lines: [
    { color: "accent", text: "moin-shell v1.0 — type 'help' to begin" },
    { color: "dim", text: "try: whoami, ls, cat about.md, projects, neofetch" },
  ],
};

function trim(items: HistoryItem[]): HistoryItem[] {
  if (items.length <= MAX_SCROLLBACK) return items;
  return items.slice(items.length - MAX_SCROLLBACK);
}

export function TerminalShell() {
  const { setTheme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([INTRO]);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pi, setPi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleThemeCommand = useCallback(
    (target: string): HistoryItem => {
      if (!target) {
        return {
          kind: "out",
          lines: [
            { color: "mag", text: "theme: missing argument" },
            { color: "dim", text: "usage: theme <terminal | executive | editorial>" },
          ],
        };
      }
      if (!isThemeId(target)) {
        return {
          kind: "out",
          lines: [
            { color: "mag", text: `theme: unknown theme '${target}'` },
            { color: "dim", text: "available: terminal, executive, editorial" },
          ],
        };
      }
      setTheme(target);
      return {
        kind: "out",
        lines: [{ color: "accent", text: `→ switching to ${target}…` }],
      };
    },
    [setTheme],
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = input;
    const trimmed = raw.trim();

    if (trimmed.startsWith("theme")) {
      const target = trimmed.replace(/^theme\s*/, "").trim();
      const out = handleThemeCommand(target);
      setHistory((h) => trim([...h, { kind: "cmd", input: raw }, out]));
    } else {
      const out = tbExecute(raw);
      if (out.kind === "clear") {
        setHistory([]);
      } else {
        setHistory((h) =>
          trim([...h, { kind: "cmd", input: raw }, { kind: "out", lines: out.lines }]),
        );
      }
    }

    if (trimmed) {
      setPast((p) => [trimmed, ...p].slice(0, MAX_HISTORY));
    }
    setPi(-1);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(pi + 1, past.length - 1);
      if (past[next] !== undefined) {
        setPi(next);
        setInput(past[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = pi - 1;
      if (next < 0) {
        setPi(-1);
        setInput("");
      } else {
        setPi(next);
        setInput(past[next]);
      }
    }
  };

  return (
    <section aria-label="Interactive shell">
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          border: "1px solid var(--line)",
          background: "#03060a",
          cursor: "text",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderBottom: "1px solid var(--line)",
            fontSize: 11,
            color: "var(--dim)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#ff5f56" }} aria-hidden />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#ffbd2e" }} aria-hidden />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#27c93f" }} aria-hidden />
          <span style={{ marginLeft: 12 }}>moin-shell — interactive</span>
          <span style={{ marginLeft: "auto", color: "var(--accent)" }}>● live</span>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Terminal output"
          style={{
            height: 360,
            overflow: "auto",
            padding: "14px 18px 0",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {history.map((h, i) => {
            if (h.kind === "cmd") {
              return (
                <div key={i} style={{ color: "var(--ink)" }}>
                  <span style={{ color: "var(--accent)" }}>moin@portfolio</span>
                  <span style={{ color: "var(--dim)" }}>:</span>
                  <span style={{ color: "var(--cyan)" }}>~</span>
                  <span style={{ color: "var(--dim)" }}> $ </span>
                  <span>{h.input}</span>
                </div>
              );
            }
            return (h.lines ?? []).map((ln, j) => (
              <div
                key={`${i}-${j}`}
                style={{ color: COLOR_VAR[ln.color], whiteSpace: "pre" }}
              >
                {ln.text}
              </div>
            ));
          })}
        </div>

        <form
          onSubmit={submit}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 18px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <label htmlFor={labelId} className="sr-only">
            Terminal input — type a command and press Enter
          </label>
          <span style={{ color: "var(--accent)" }}>moin@portfolio</span>
          <span style={{ color: "var(--dim)" }}>:</span>
          <span style={{ color: "var(--cyan)" }}>~</span>
          <span style={{ color: "var(--dim)", marginRight: 8 }}> $</span>
          <input
            id={labelId}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--ink)",
              fontFamily: "inherit",
              fontSize: "inherit",
              caretColor: "var(--accent)",
            }}
          />
        </form>
      </div>
    </section>
  );
}
