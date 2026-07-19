import {
  certifications,
  experience,
  profile,
  projects,
  skills,
  testimonials,
  writing,
} from "@/lib/portfolio-data";

const serif = "var(--font-serif)";
const sans = "var(--font-sans)";
const mono = "var(--font-mono)";

// ── Shared helpers ────────────────────────────────────────────────────────────

function SectionHeading({ label, eyebrow }: { label: string; eyebrow: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: 3,
          color: "var(--dim)",
        }}
      >
        {eyebrow}
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--line-soft)" }} />
      <h2
        style={{
          margin: 0,
          fontFamily: serif,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: 2,
          color: "var(--ink)",
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </h2>
    </div>
  );
}

function ResumeSection({
  eyebrow,
  label,
  children,
  dark,
}: {
  eyebrow: string;
  label: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      style={{
        padding: "40px 64px",
        borderTop: dark ? "none" : "1px solid var(--line-soft)",
        background: dark ? "var(--ink)" : "transparent",
        color: dark ? "#f3f1ec" : "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading label={label} eyebrow={eyebrow} />
        {children}
      </div>
    </section>
  );
}

// ── 1. Summary ────────────────────────────────────────────────────────────────

function Summary() {
  return (
    <ResumeSection eyebrow="01" label="Summary">
      <p
        style={{
          margin: 0,
          fontFamily: serif,
          fontSize: 19,
          lineHeight: 1.6,
          color: "var(--body)",
          maxWidth: 840,
        }}
      >
        {profile.tagline}
      </p>
    </ResumeSection>
  );
}

// ── 2. Experience ─────────────────────────────────────────────────────────────

function Experience() {
  return (
    <ResumeSection eyebrow="02" label="Experience">
      <div>
        {experience.map((row) => (
          <div
            key={`${row.role}-${row.company}-${row.when}`}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 32,
              padding: "24px 0",
              borderTop: "1px solid var(--line-soft)",
            }}
          >
            {/* Left: dates */}
            <div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim)",
                  letterSpacing: 1.5,
                  lineHeight: 1.5,
                }}
              >
                {row.current && (
                  <span style={{ color: "var(--ok)", marginRight: 6 }}>●</span>
                )}
                {row.when}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: mono,
                  fontSize: 10,
                  color: "var(--dim-faint)",
                  letterSpacing: 1,
                }}
              >
                {row.range} · {row.location}
              </div>
            </div>

            {/* Right: role details */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 8,
                  flexWrap: "wrap" as const,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: -0.4,
                  }}
                >
                  {row.role}
                </h3>
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "var(--accent)",
                  }}
                >
                  @ {row.company}
                </span>
              </div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontFamily: sans,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--body)",
                  maxWidth: 680,
                }}
              >
                {row.summary}
              </p>
              <ul
                style={{
                  margin: "0 0 10px",
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {row.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: sans,
                      fontSize: 13,
                      color: "var(--body)",
                      lineHeight: 1.55,
                      paddingLeft: 16,
                      position: "relative",
                      maxWidth: 680,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        width: 7,
                        height: 1,
                        background: "var(--ink)",
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
              {row.tech && row.tech.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {row.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        color: "var(--body)",
                        padding: "3px 8px",
                        background: "var(--line-soft)",
                        borderRadius: 999,
                        letterSpacing: 0.5,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}

// ── 3. Skills ─────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <ResumeSection eyebrow="03" label="Skills">
      <div style={{ borderTop: "1px solid var(--line-soft)" }}>
        {skills.map((bucket) => (
          <div
            key={bucket.label}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 24,
              padding: "16px 0",
              borderBottom: "1px solid var(--line-soft)",
              alignItems: "start",
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 15,
                fontWeight: 400,
                color: "var(--ink)",
              }}
            >
              {bucket.label}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {bucket.items.map((item) => (
                <span
                  key={item.name}
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    color: "var(--body)",
                    padding: "3px 9px",
                    background: "var(--panel)",
                    border: "1px solid var(--line)",
                    borderRadius: 999,
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}

// ── 4. Projects ───────────────────────────────────────────────────────────────

function Projects() {
  return (
    <ResumeSection eyebrow="04" label="Selected Projects">
      <div style={{ borderTop: "1px solid var(--line-soft)" }}>
        {projects.map((p) => (
          <div
            key={p.name}
            style={{
              padding: "24px 0",
              borderBottom: "1px solid var(--line-soft)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 8,
                flexWrap: "wrap" as const,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontSize: 20,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: -0.3,
                }}
              >
                {p.name}
              </h3>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: "var(--dim)",
                  letterSpacing: 1.5,
                }}
              >
                {p.kind} · {p.year}
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: "var(--dim-faint)",
                  letterSpacing: 1,
                }}
              >
                {p.role}
              </span>
            </div>
            <p
              style={{
                margin: "0 0 12px",
                fontFamily: sans,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--body)",
                maxWidth: 760,
              }}
            >
              {p.shortDesc}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap" as const,
              }}
            >
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  flex: 1,
                }}
              >
                {p.outcomes.map((o, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      color: "var(--body)",
                      paddingLeft: 14,
                      position: "relative",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 7,
                        width: 6,
                        height: 1,
                        background: "var(--accent)",
                      }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, flexShrink: 0 }}>
                {p.stack.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: "var(--body)",
                      padding: "3px 8px",
                      background: "var(--line-soft)",
                      borderRadius: 999,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}

// ── 5. Education & Certifications ─────────────────────────────────────────────

function EducationAndCerts() {
  // The education record lives as the final entry of the experience timeline.
  const edu = experience[experience.length - 1];
  return (
    <ResumeSection eyebrow="05" label="Education & Certifications">
      {/* Education row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 32,
          padding: "16px 0 24px",
          borderTop: "1px solid var(--line-soft)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim)",
              letterSpacing: 1.5,
            }}
          >
            {edu.when}
          </div>
          <div
            style={{
              marginTop: 3,
              fontFamily: mono,
              fontSize: 10,
              color: "var(--dim-faint)",
              letterSpacing: 1,
            }}
          >
            {edu.location}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 20,
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            {edu.role}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 14,
              color: "var(--body)",
            }}
          >
            {edu.company} — {profile.education}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div
        style={{
          borderTop: "1px solid var(--line-soft)",
          paddingTop: 16,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: "var(--dim)",
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          CERTIFICATIONS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {certifications.map((c) => (
            <div
              key={c.title}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 60px",
                gap: 16,
                alignItems: "baseline",
                padding: "10px 0",
                borderBottom: "1px solid var(--line-soft)",
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim)",
                  letterSpacing: 0.5,
                }}
              >
                {c.issuer}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: "var(--ok)",
                  letterSpacing: 1.5,
                  textAlign: "right" as const,
                }}
              >
                ● {c.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResumeSection>
  );
}

// ── 6. Testimonials ───────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <ResumeSection eyebrow="06" label="Testimonials">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {testimonials.map((t, i) => (
          <figure
            key={i}
            style={{
              margin: 0,
              padding: 24,
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: 6,
              position: "relative",
            }}
          >
            {t.placeholder && (
              <span
                aria-label="Sample testimonial"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  fontFamily: mono,
                  fontSize: 9,
                  color: "var(--dim-faint)",
                  letterSpacing: 1.5,
                  padding: "2px 6px",
                  border: "1px solid var(--line-soft)",
                  borderRadius: 999,
                }}
              >
                SAMPLE
              </span>
            )}
            <div
              aria-hidden
              style={{
                fontFamily: serif,
                fontSize: 32,
                color: "var(--accent)",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              &ldquo;
            </div>
            <blockquote
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: 16,
                lineHeight: 1.55,
                color: "var(--body)",
                fontStyle: "italic",
              }}
            >
              {t.quote}
            </blockquote>
            <figcaption
              style={{
                marginTop: 14,
                paddingTop: 10,
                borderTop: "1px solid var(--line-soft)",
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: "var(--ink)",
                  fontWeight: 500,
                }}
              >
                {t.who}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </ResumeSection>
  );
}

// ── 7. Writing ────────────────────────────────────────────────────────────────

function Writing() {
  return (
    <ResumeSection eyebrow="07" label="Writing">
      <div>
        {writing.map((w) => (
          <div
            key={w.title}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 100px",
              gap: 24,
              padding: "16px 0",
              borderTop: "1px solid var(--line-soft)",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 10,
                color: "var(--dim)",
                letterSpacing: 1.5,
              }}
            >
              {w.date}
            </div>
            <div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 16,
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginBottom: 3,
                }}
              >
                {w.title}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: "var(--body)",
                  lineHeight: 1.5,
                }}
              >
                {w.summary}
              </div>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: "var(--accent)",
                  letterSpacing: 1,
                  padding: "2px 7px",
                  border: "1px solid var(--accent)",
                  borderRadius: 999,
                }}
              >
                {w.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}

// ── 8. Contact (dark footer) ──────────────────────────────────────────────────

function Contact() {
  return (
    <section style={{ padding: "56px 64px", background: "var(--ink)", color: "#f3f1ec" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            color: "var(--dim-faint)",
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          08 / GET IN TOUCH
        </div>
        <h2
          style={{
            margin: "0 0 40px",
            fontFamily: serif,
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: -2,
            lineHeight: 1.05,
            color: "#f3f1ec",
            maxWidth: 800,
          }}
        >
          Have a problem worth shipping for?{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Let&apos;s talk.</em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#cfd0d4",
            }}
          >
            Currently full-time at BrowserStack and selectively open to weekend collaborations,
            advisory work, and conversations that might lead somewhere interesting. Fastest way to
            reach me is email.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(
              [
                ["EMAIL", profile.email, `mailto:${profile.email}`],
                ["PHONE", profile.phone, `tel:${profile.phone.replace(/\s+/g, "")}`],
                ["LINKEDIN", profile.linkedin, `https://${profile.linkedin}`],
                ["GITHUB", profile.github, `https://${profile.github}`],
              ] as const
            ).map(([k, v, href]) => (
              <a
                key={k}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 10,
                  borderBottom: "1px solid #2a2b2e",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "var(--dim-faint)",
                    letterSpacing: 2,
                  }}
                >
                  {k}
                </span>
                <span style={{ fontFamily: sans, fontSize: 14, color: "#f3f1ec" }}>{v}</span>
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: "1px solid #2a2b2e",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 10,
            color: "var(--dim-faint)",
            letterSpacing: 2,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span>© 2026 MOIN BHOKARE · ALL RIGHTS RESERVED</span>
          <span>BUILT WITH CARE IN PUNE, INDIA</span>
          <span>v3.0 · APRIL 2026</span>
        </div>
      </div>
    </section>
  );
}

// ── Composed sections export ──────────────────────────────────────────────────

export function ExecutiveSections() {
  return (
    <>
      <Summary />
      <Experience />
      <Skills />
      <Projects />
      <EducationAndCerts />
      <Testimonials />
      <Writing />
      <Contact />
    </>
  );
}
