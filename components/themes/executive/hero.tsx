import { profile } from "@/lib/portfolio-data";

const serif = "var(--font-serif)";
const sans = "var(--font-sans)";
const mono = "var(--font-mono)";

export function ExecutiveHero() {
  return (
    <section
      style={{
        padding: "56px 64px 48px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Availability badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span
            aria-hidden
            style={{ width: 7, height: 7, borderRadius: 4, background: "var(--ok)", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim)",
              letterSpacing: 2,
            }}
          >
            {profile.availability}
          </span>
        </div>

        {/* Name + role */}
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: serif,
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: -2.5,
            lineHeight: 1.0,
            color: "var(--ink)",
          }}
        >
          {profile.name}
        </h1>
        <div
          style={{
            fontFamily: sans,
            fontSize: 18,
            color: "var(--body)",
            marginBottom: 20,
            letterSpacing: 0.2,
          }}
        >
          {profile.role}
        </div>

        {/* One-line summary */}
        <p
          style={{
            margin: "0 0 28px",
            fontFamily: serif,
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--body)",
            maxWidth: 760,
          }}
        >
          {profile.tagline}
        </p>

        {/* Contact row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            fontFamily: mono,
            fontSize: 12,
            color: "var(--dim)",
            letterSpacing: 1,
          }}
        >
          <span>{profile.location}</span>
          <span aria-hidden style={{ color: "var(--line)" }}>·</span>
          <a
            href={`mailto:${profile.email}`}
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            {profile.email}
          </a>
          <span aria-hidden style={{ color: "var(--line)" }}>·</span>
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            {profile.phone}
          </a>
          <span aria-hidden style={{ color: "var(--line)" }}>·</span>
          <a
            href={`https://${profile.linkedin}`}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            {profile.linkedin}
          </a>
          <span aria-hidden style={{ color: "var(--line)" }}>·</span>
          <a
            href={`https://${profile.github}`}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            {profile.github}
          </a>
          <a
            href={profile.cvPath}
            download
            style={{
              marginLeft: "auto",
              padding: "7px 18px",
              background: "var(--ink)",
              color: "#fff",
              textDecoration: "none",
              fontFamily: sans,
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 999,
              letterSpacing: 0,
            }}
          >
            Download CV ↓
          </a>
        </div>
      </div>
    </section>
  );
}
