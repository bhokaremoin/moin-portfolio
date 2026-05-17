export default function EditorialPortfolio() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-mono)",
        padding: "64px 56px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            color: "var(--dim)",
            fontSize: 12,
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#ff7b72" }}>const</span>{" "}
          <span style={{ color: "var(--cyan)" }}>profile</span> ={" "}
          <span style={{ color: "#a5d6ff" }}>await</span> read(
          <span style={{ color: "#a5d6ff" }}>{"'./moin.json'"}</span>);
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontSize: 120,
            fontWeight: 400,
            letterSpacing: -4,
            lineHeight: 0.95,
            color: "var(--ink)",
          }}
        >
          Moin
          <br />
          Bhokare<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            color: "var(--dim)",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          Phase 1 foundation is live. IDE chrome, file tabs, sidebar, and
          syntax-highlighted code blocks land in Phase 4.
        </p>
      </div>
    </div>
  );
}
