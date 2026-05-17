export default function ExecutivePortfolio() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans)",
        padding: "112px 64px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--dim)",
            fontSize: 12,
            letterSpacing: 3,
            marginBottom: 24,
          }}
        >
          00 / EXECUTIVE — PLACEHOLDER
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontSize: 88,
            fontWeight: 400,
            letterSpacing: -3,
            lineHeight: 1.02,
            color: "var(--ink)",
          }}
        >
          Software, built with{" "}
          <em style={{ color: "var(--accent)" }}>care</em>.
        </h1>
        <p
          style={{
            marginTop: 24,
            fontFamily: "var(--font-serif)",
            fontSize: 20,
            lineHeight: 1.55,
            color: "var(--dim)",
            maxWidth: 640,
          }}
        >
          Phase 1 foundation is live. Hero, metrics, case studies, and the dark
          Approach band land in Phase 3.
        </p>
      </div>
    </div>
  );
}
