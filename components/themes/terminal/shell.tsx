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
import { isThemeId, profile } from "@/lib/portfolio-data";
import {
  COLOR_VAR,
  TerminalLine,
  tbExecute,
} from "./commands";
import { CommandChips } from "./command-chips";
import { ASCII_MOIN } from "./ascii";

interface HistoryItem {
  kind: "sys" | "cmd" | "out";
  input?: string;
  lines?: readonly TerminalLine[];
}

const MAX_SCROLLBACK = 200;
const MAX_HISTORY = 50;

function makeIntro(): HistoryItem[] {
  const bannerLines: TerminalLine[] = ASCII_MOIN.split("\n").map((t) => ({
    color: "accent" as const,
    text: t,
  }));
  return [
    {
      kind: "sys",
      lines: [
        ...bannerLines,
        { color: "dim", text: "" },
        { color: "ink", text: `${profile.shortRole} · ${profile.location}` },
        { color: "dim", text: "type 'help' or tap a command below" },
      ],
    },
  ];
}

function trim(items: HistoryItem[]): HistoryItem[] {
  if (items.length <= MAX_SCROLLBACK) return items;
  return items.slice(items.length - MAX_SCROLLBACK);
}

export function TerminalShell() {
  const { setTheme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>(makeIntro);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pi, setPi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
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

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const cmdItem: HistoryItem = { kind: "cmd", input: raw };

      if (trimmed.startsWith("theme")) {
        const target = trimmed.replace(/^theme\s*/, "").trim();
        const out = handleThemeCommand(target);
        setHistory((h) => trim([...h, cmdItem, out]));
      } else {
        const result = tbExecute(raw);
        if (result.kind === "clear") {
          setHistory([]);
        } else if (result.kind === "download") {
          setHistory((h) =>
            trim([...h, cmdItem, { kind: "out", lines: result.lines }]),
          );
          // Trigger download via hidden anchor (guard for jsdom which lacks navigation)
          try {
            if (downloadRef.current) {
              downloadRef.current.href = result.href;
              downloadRef.current.click();
            } else if (typeof window !== "undefined" && window.location) {
              window.location.assign(result.href);
            }
          } catch {
            // jsdom or restricted env — silently skip
          }
        } else {
          setHistory((h) =>
            trim([...h, cmdItem, { kind: "out", lines: result.lines }]),
          );
        }
      }

      if (trimmed) {
        setPast((p) => [trimmed, ...p].slice(0, MAX_HISTORY));
      }
      setPi(-1);
      setInput("");
    },
    [handleThemeCommand],
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(input);
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
    <section
      aria-label="Interactive shell"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Hidden anchor for programmatic downloads */}
      <a ref={downloadRef} download aria-hidden style={{ display: "none" }} />

      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          border: "1px solid var(--line)",
          background: "#03060a",
          cursor: "text",
        }}
      >
        {/* Title bar */}
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
            flexShrink: 0,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#ff5f56" }} aria-hidden />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#ffbd2e" }} aria-hidden />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#27c93f" }} aria-hidden />
          <span style={{ marginLeft: 12 }}>moin-shell — interactive</span>
          <span style={{ marginLeft: "auto", color: "var(--accent)" }}>● live</span>
        </div>

        {/* Scrollback */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Terminal output"
          style={{
            flex: 1,
            minHeight: 0,
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
            return (h.lines ?? []).map((ln, j) =>
              ln.href ? (
                <div
                  key={`${i}-${j}`}
                  style={{ color: COLOR_VAR[ln.color], whiteSpace: "pre" }}
                >
                  <a
                    href={ln.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      color: "inherit",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    {ln.text}
                  </a>
                </div>
              ) : (
                <div
                  key={`${i}-${j}`}
                  style={{ color: COLOR_VAR[ln.color], whiteSpace: "pre" }}
                >
                  {ln.text}
                </div>
              ),
            );
          })}
        </div>

        {/* Input row */}
        <form
          onSubmit={submit}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 18px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            flexShrink: 0,
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

        {/* Command chips */}
        <CommandChips onRun={run} />
      </div>
    </section>
  );
}
