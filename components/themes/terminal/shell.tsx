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
import { RESUME_URL } from "@/lib/routes";
import {
  COLOR_VAR,
  TerminalLine,
  tbExecute,
} from "./commands";
import { CommandChips } from "./command-chips";
import { TerminalIntro } from "./intro";

interface HistoryItem {
  kind: "sys" | "cmd" | "out";
  input?: string;
  lines?: readonly TerminalLine[];
}

const MAX_SCROLLBACK = 200;
const MAX_HISTORY = 50;

function trim(items: HistoryItem[]): HistoryItem[] {
  if (items.length <= MAX_SCROLLBACK) return items;
  return items.slice(items.length - MAX_SCROLLBACK);
}

export function TerminalShell() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [introVisible, setIntroVisible] = useState(true);
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

  const handleThemeCommand = useCallback((target: string): HistoryItem => {
    if (target === "terminal") {
      return {
        kind: "out",
        lines: [{ color: "dim", text: "already in the terminal view." }],
      };
    }
    if (target === "executive" || target === "resume") {
      // Navigate to the résumé experience (guard for jsdom which lacks navigation).
      try {
        if (typeof window !== "undefined") window.location.assign(RESUME_URL);
      } catch {
        // restricted env — ignore
      }
      return {
        kind: "out",
        lines: [{ color: "accent", text: "→ opening résumé view…" }],
      };
    }
    return {
      kind: "out",
      lines: [
        { color: "mag", text: target ? `theme: unknown view '${target}'` : "theme: missing argument" },
        { color: "dim", text: "usage: theme <terminal | executive>" },
      ],
    };
  }, []);

  const clearTerminal = useCallback(() => {
    setHistory([]);
    setIntroVisible(false);
  }, []);

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
          clearTerminal();
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
    [handleThemeCommand, clearTerminal],
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(input);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    // Cmd+K (mac) / Ctrl+K — clear the terminal, like iTerm/Terminal.app
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      clearTerminal();
      return;
    }
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

  const promptLabel = (
    <>
      <span style={{ color: "var(--accent)" }}>moin@portfolio</span>
      <span style={{ color: "var(--dim)" }}>:</span>
      <span style={{ color: "var(--cyan)" }}>~</span>
      <span style={{ color: "var(--dim)", marginRight: 8 }}> $</span>
    </>
  );

  return (
    <section
      aria-label="Interactive shell"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg)",
      }}
    >
      {/* Hidden anchor for programmatic downloads */}
      <a ref={downloadRef} download aria-hidden style={{ display: "none" }} />

      {/* Terminal buffer: content is top-aligned; the prompt is the last line,
          exactly like a real shell — it starts near the top and flows down. */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "14px 18px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.7,
          cursor: "text",
        }}
      >
        <div role="log" aria-live="polite" aria-atomic="false" aria-label="Terminal output">
          {introVisible && <TerminalIntro />}
          {history.map((h, i) => {
            if (h.kind === "cmd") {
              return (
                <div
                  key={i}
                  style={{ color: "var(--ink)", marginTop: i === 0 ? 0 : 14 }}
                >
                  {promptLabel}
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

        {/* Live prompt — inline, as the last line of the buffer */}
        <form onSubmit={submit} style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor={labelId} className="sr-only">
            Terminal input — type a command and press Enter
          </label>
          {promptLabel}
          <input
            id={labelId}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoFocus
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

      {/* Quick-command helper bar (not part of the buffer) */}
      <CommandChips onRun={run} />
    </section>
  );
}
