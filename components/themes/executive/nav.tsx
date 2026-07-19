import { profile } from "@/lib/portfolio-data";
import { CLI_URL } from "@/lib/routes";

const serif = "var(--font-serif)";
const sans = "var(--font-sans)";
const mono = "var(--font-mono)";

export function ExecutiveNav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "22px 64px",
        borderBottom: "1px solid var(--line-soft)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            background: "var(--ink)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: serif,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {profile.initial}
        </div>
        <div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 16,
              fontWeight: 500,
              color: "var(--ink)",
              lineHeight: 1.1,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: "var(--dim)",
              letterSpacing: 1.5,
            }}
          >
            {profile.role.replace(" @ ", " · ").toUpperCase()}
          </div>
        </div>
      </div>
      <nav
        aria-label="Section navigation"
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 32,
          fontFamily: sans,
          fontSize: 14,
          color: "var(--body)",
        }}
      >
        {["Experience", "Skills", "Projects", "Writing", "Contact"].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </nav>
      <a
        href={CLI_URL}
        style={{
          marginLeft: 32,
          padding: "8px 16px",
          background: "transparent",
          color: "var(--ink)",
          border: "1px solid var(--line)",
          textDecoration: "none",
          fontFamily: mono,
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 999,
          letterSpacing: 0.5,
        }}
      >
        CLI view →
      </a>
      <a
        href={profile.cvPath}
        download
        style={{
          marginLeft: 12,
          padding: "8px 16px",
          background: "var(--ink)",
          color: "#fff",
          textDecoration: "none",
          fontFamily: sans,
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 999,
        }}
      >
        Download CV ↓
      </a>
    </header>
  );
}
