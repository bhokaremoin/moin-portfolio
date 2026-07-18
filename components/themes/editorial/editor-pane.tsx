"use client";

import { ReactNode } from "react";

const mono = "var(--font-mono)";

// --- lightweight syntax tinting ---

interface Token {
  text: string;
  color?: string;
}

function tokenizeJson(line: string): Token[] {
  // Very simple JSON line tokeniser — handles the most common patterns:
  // "key": "value"  |  "key": 123/true/null  |  { } [ ] , :
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    // whitespace
    if (ch === " " || ch === "\t") {
      tokens.push({ text: ch });
      i++;
      continue;
    }

    // string
    if (ch === '"') {
      let j = i + 1;
      while (j < line.length && !(line[j] === '"' && line[j - 1] !== "\\")) {
        j++;
      }
      j++; // include closing quote
      const raw = line.slice(i, j);
      // Peek: is there a colon after optional whitespace? → key
      let peek = j;
      while (peek < line.length && line[peek] === " ") peek++;
      const isKey = line[peek] === ":";
      tokens.push({ text: raw, color: isKey ? "var(--syntax-num)" : "var(--syntax-str)" });
      i = j;
      continue;
    }

    // numbers
    if ((ch >= "0" && ch <= "9") || (ch === "-" && line[i + 1] >= "0" && line[i + 1] <= "9")) {
      let j = i;
      if (line[j] === "-") j++;
      while (j < line.length && ((line[j] >= "0" && line[j] <= "9") || line[j] === "." || line[j] === "e" || line[j] === "E")) {
        j++;
      }
      tokens.push({ text: line.slice(i, j), color: "var(--syntax-fn)" });
      i = j;
      continue;
    }

    // keywords: true, false, null
    if (line.startsWith("true", i)) {
      tokens.push({ text: "true", color: "var(--syntax-key)" });
      i += 4;
      continue;
    }
    if (line.startsWith("false", i)) {
      tokens.push({ text: "false", color: "var(--syntax-key)" });
      i += 5;
      continue;
    }
    if (line.startsWith("null", i)) {
      tokens.push({ text: "null", color: "var(--syntax-key)" });
      i += 4;
      continue;
    }

    // structural punctuation
    if ("{[]}:,".includes(ch)) {
      tokens.push({ text: ch, color: "var(--syntax-com)" });
      i++;
      continue;
    }

    // fallback: plain char
    tokens.push({ text: ch });
    i++;
  }

  return tokens;
}

function tokenizeMarkdownOrYaml(line: string): Token[] {
  // Dim structural punctuation: lines starting with #, -, :, or containing only ---
  const trimmed = line.trimStart();
  if (trimmed === "---" || trimmed === "...") {
    return [{ text: line, color: "var(--syntax-com)" }];
  }
  // heading line
  if (trimmed.startsWith("# ") || trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
    const hashEnd = trimmed.indexOf(" ");
    const indent = line.length - trimmed.length;
    return [
      { text: line.slice(0, indent) },
      { text: trimmed.slice(0, hashEnd + 1), color: "var(--syntax-com)" },
      { text: trimmed.slice(hashEnd + 1), color: "var(--syntax-str)" },
    ];
  }
  // yaml key: value  or  - list item
  if (trimmed.startsWith("- ")) {
    const indent = line.length - trimmed.length;
    return [
      { text: line.slice(0, indent) },
      { text: "- ", color: "var(--syntax-com)" },
      { text: trimmed.slice(2) },
    ];
  }
  // yaml key: (anything after the colon)
  const colonIdx = trimmed.indexOf(": ");
  if (colonIdx > 0) {
    const indent = line.length - trimmed.length;
    const key = trimmed.slice(0, colonIdx);
    const rest = trimmed.slice(colonIdx);
    return [
      { text: line.slice(0, indent) },
      { text: key, color: "var(--syntax-num)" },
      { text: ":", color: "var(--syntax-com)" },
      { text: rest.slice(1) },
    ];
  }
  return [{ text: line }];
}

function tokenizeLine(line: string, lang: "markdown" | "json" | "yaml"): Token[] {
  if (lang === "json") return tokenizeJson(line);
  return tokenizeMarkdownOrYaml(line);
}

// --- component ---

export function EditorPane({
  source,
  lang,
}: {
  source: string;
  lang: "markdown" | "json" | "yaml";
}): ReactNode {
  const lines = source.split("\n");

  return (
    <div
      style={{
        display: "flex",
        background: "var(--bg)",
        fontFamily: mono,
        fontSize: 13,
        lineHeight: 1.85,
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* gutter */}
      <div
        aria-hidden
        style={{
          padding: "14px 10px 14px 18px",
          color: "var(--syntax-com)",
          textAlign: "right",
          userSelect: "none",
          borderRight: "1px solid var(--line)",
          minWidth: 40,
          flexShrink: 0,
        }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* source */}
      <div style={{ padding: "14px 18px", flex: 1, overflowX: "auto" }}>
        {lines.map((line, i) => {
          const tokens = tokenizeLine(line, lang);
          return (
            <div key={i}>
              {tokens.map((tok, j) => (
                <span key={j} style={tok.color ? { color: tok.color } : undefined}>
                  {tok.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
