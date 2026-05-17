export default function TerminalPortfolio() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-mono)",
        padding: "80px 40px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            color: "var(--dim)",
            fontSize: 12,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          {"// theme · terminal"}
        </div>
        <h1
          style={{
            margin: 0,
            color: "var(--accent)",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: -0.5,
          }}
        >
          moin@portfolio: ~ — terminal theme placeholder
        </h1>
        <p
          style={{
            marginTop: 16,
            color: "var(--ink)",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Phase 1 foundation is live. The full terminal layout, ASCII MOIN, and
          interactive shell land in Phase 2.
        </p>
      </div>
    </div>
  );
}
