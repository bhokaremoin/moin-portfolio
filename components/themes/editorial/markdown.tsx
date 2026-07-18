import { ReactNode } from "react";

interface Props {
  source: string;
}

/** Split inline text on `**`, alternating segments become <strong>. */
function renderInline(text: string): ReactNode[] {
  return text
    .split("**")
    .map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: "var(--ink)" }}>{part}</strong>
        : part,
    )
    .filter((part) => part !== "");
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function parseBlocks(source: string): Block[] {
  const rawLines = source.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // blank line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // heading
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
      i++;
      continue;
    }

    // list — consume all consecutive "- " lines
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < rawLines.length && rawLines[i].startsWith("- ")) {
        items.push(rawLines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // paragraph
    blocks.push({ type: "p", text: line });
    i++;
  }

  return blocks;
}

export function Markdown({ source }: Props): ReactNode {
  const blocks = parseBlocks(source);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--ink)" }}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={idx}
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--ink)",
                  marginBottom: "0.5em",
                }}
              >
                {renderInline(block.text)}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={idx}
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--ink)",
                  marginBottom: "0.5em",
                }}
              >
                {renderInline(block.text)}
              </h2>
            );
          case "p":
            return (
              <p
                key={idx}
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--ink)",
                  marginBottom: "0.75em",
                }}
              >
                {renderInline(block.text)}
              </p>
            );
          case "ul":
            return (
              <ul
                key={idx}
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--dim)",
                  paddingLeft: "1.5em",
                  marginBottom: "0.75em",
                }}
              >
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
