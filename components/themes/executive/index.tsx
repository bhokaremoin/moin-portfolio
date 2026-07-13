import {
  approachPrinciples,
  certifications,
  clientStrip,
  experience,
  metrics,
  profile,
  projects,
  testimonials,
  writing,
} from "@/lib/portfolio-data";

const serif = "var(--font-serif)";
const sans = "var(--font-sans)";
const mono = "var(--font-mono)";

const skillsTable: readonly { label: string; description: string }[] = [
  { label: "Languages", description: "TypeScript, JavaScript, Java, Python, C++" },
  { label: "Frontend", description: "React, Next.js, modern CSS, design systems" },
  { label: "Backend", description: "Node.js, Spring Boot, microservices, REST" },
  { label: "Data", description: "MongoDB, MySQL, Firebase" },
  { label: "Infrastructure", description: "Docker, GCP, AWS, Linux, CI/CD" },
  { label: "Practice", description: "Code review, RFCs, observability, mentorship" },
];

function SectionFrame({
  eyebrow,
  kicker,
  title,
  dark,
  children,
}: {
  eyebrow: string;
  kicker?: string;
  title: React.ReactNode;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "88px 64px",
        borderTop: dark ? "none" : "1px solid var(--line-soft)",
        background: dark ? "var(--ink)" : "transparent",
        color: dark ? "#f3f1ec" : "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: 3,
              color: dark ? "var(--dim-faint)" : "var(--dim)",
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: dark ? "#2a2b2e" : "var(--line)",
            }}
          />
          {kicker && (
            <span
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 2,
                color: dark ? "var(--dim-faint)" : "var(--dim)",
              }}
            >
              {kicker}
            </span>
          )}
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: -1.4,
            lineHeight: 1.05,
            maxWidth: 880,
            color: dark ? "#f3f1ec" : "var(--ink)",
          }}
        >
          {title}
        </h2>
        <div style={{ marginTop: 56 }}>{children}</div>
      </div>
    </section>
  );
}

function ExecutiveNav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "22px 210px 22px 64px",
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
            SDE · BROWSERSTACK
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
        {["Work", "Experience", "About", "Writing", "Contact"].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </nav>
      <a
        href={profile.cvPath}
        download
        style={{
          marginLeft: 32,
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

function ExecutiveHero() {
  return (
    <section
      style={{
        padding: "112px 64px 96px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern id="ex-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0v48" fill="none" stroke="var(--line)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ex-grid)" />
      </svg>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <span
            aria-hidden
            style={{ width: 8, height: 8, borderRadius: 4, background: "var(--ok)" }}
          />
          <span
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "var(--dim)",
              letterSpacing: 2,
            }}
          >
            {profile.availability}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: 132,
            fontWeight: 400,
            letterSpacing: -4,
            lineHeight: 1,
            color: "var(--ink)",
            maxWidth: 1100,
          }}
        >
          Software, built
          <br />
          with <em style={{ fontStyle: "italic", color: "var(--accent)" }}>care</em> and a
          <br />
          steady cadence.
        </h1>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 60,
            alignItems: "end",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: serif,
              fontSize: 22,
              lineHeight: 1.55,
              color: "var(--body)",
              maxWidth: 640,
            }}
          >
            I&apos;m Moin — a full-stack engineer at{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>BrowserStack</span>{" "}
            building developer-facing surfaces used across the testing platform. Previously
            shipped open-source agent infrastructure at{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>SuperAGI</em>. Based
            in Pune, India.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: sans }}>
            {(
              [
                ["BASED IN", "Pune, India"],
                ["ROLE", "SDE, Full-Stack"],
                ["FOCUS", "DX · Test Infra · LLMs"],
                ["EDUCATION", profile.education],
              ] as const
            ).map(([k, v], i, arr) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: i < arr.length - 1 ? 10 : 0,
                  borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    color: "var(--dim)",
                    letterSpacing: 2,
                  }}
                >
                  {k}
                </span>
                <span style={{ fontSize: 14, color: "var(--ink)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            style={{
              padding: "14px 28px",
              background: "var(--ink)",
              color: "#fff",
              border: "none",
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 999,
            }}
          >
            View selected work →
          </button>
          <a
            href={`mailto:${profile.email}`}
            style={{
              padding: "14px 28px",
              background: "transparent",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Get in touch
          </a>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim-faint)",
              letterSpacing: 2,
            }}
          >
            Last updated · April 2026
          </span>
        </div>
      </div>
    </section>
  );
}

function MetricsRow() {
  return (
    <section style={{ padding: "0 64px", background: "var(--bg)" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: "1px solid var(--line-soft)",
          borderBottom: "1px solid var(--line-soft)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {metrics.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              padding: "36px 24px",
              borderRight: i < metrics.length - 1 ? "1px solid var(--line-soft)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: serif,
                fontSize: 56,
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: mono,
                fontSize: 11,
                color: "var(--dim)",
                letterSpacing: 2,
              }}
            >
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClientStrip() {
  return (
    <section
      style={{
        padding: "40px 64px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim)",
            letterSpacing: 2,
            whiteSpace: "nowrap",
          }}
        >
          TRUSTED COLLABORATORS &nbsp;/
        </span>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center" }}>
          {clientStrip.map((i) => (
            <span
              key={i}
              style={{
                fontFamily: serif,
                fontSize: 22,
                fontWeight: 500,
                color: "var(--dim-faint)",
                letterSpacing: 1,
              }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectArticle({
  n,
  year,
  kind,
  name,
  role,
  summary,
  outcomes,
  stack,
}: {
  n: number;
  year: string;
  kind: string;
  name: string;
  role: string;
  summary: string;
  outcomes: readonly string[];
  stack: readonly string[];
}) {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: 56,
        padding: "40px 0",
        borderTop: "1px solid var(--line-soft)",
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, transparent 60%, var(--brand-soft) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim)",
            letterSpacing: 2,
          }}
        >
          {kind}
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim)",
            letterSpacing: 2,
          }}
        >
          {year}
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 64,
              fontWeight: 400,
              color: "var(--ink)",
              letterSpacing: -2,
              lineHeight: 0.95,
            }}
          >
            {name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 3)}
          </div>
          <div style={{ marginTop: 8, height: 1, background: "var(--line)" }} />
          <div
            style={{
              marginTop: 10,
              fontFamily: mono,
              fontSize: 10,
              color: "var(--dim)",
              letterSpacing: 2,
            }}
          >
            CASE STUDY · {String(n).padStart(2, "0")}
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim-faint)",
              letterSpacing: 1,
              marginRight: 14,
            }}
          >
            {String(n).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim)",
              letterSpacing: 2,
            }}
          >
            {role}
          </span>
        </div>
        <h3
          style={{
            margin: "0 0 14px",
            fontFamily: serif,
            fontSize: 38,
            fontWeight: 400,
            color: "var(--ink)",
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          {name}
        </h3>
        <p
          style={{
            margin: "0 0 22px",
            fontFamily: serif,
            fontSize: 19,
            lineHeight: 1.55,
            color: "var(--body)",
          }}
        >
          {summary}
        </p>

        <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 20, marginBottom: 22 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: "var(--dim)",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            OUTCOMES
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {outcomes.map((b, i) => (
              <li
                key={i}
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: "var(--body)",
                  lineHeight: 1.6,
                  paddingLeft: 18,
                  position: "relative",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 9,
                    width: 8,
                    height: 1,
                    background: "var(--accent)",
                  }}
                />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {stack.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--body)",
                  padding: "4px 10px",
                  background: "var(--line-soft)",
                  borderRadius: 999,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <span style={{ fontFamily: sans, fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>
            Read case study →
          </span>
        </div>
      </div>
    </article>
  );
}

function ExperienceItem({
  when,
  range,
  role,
  company,
  location,
  summary,
  bullets,
  current,
}: {
  when: string;
  range: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  bullets: readonly string[];
  current?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 40,
        padding: "32px 0",
        borderTop: "1px solid var(--line-soft)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim)",
            letterSpacing: 2,
          }}
        >
          {current && <span style={{ color: "var(--ok)", marginRight: 6 }}>● NOW</span>}
          {when}
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: mono,
            fontSize: 11,
            color: "var(--dim-faint)",
            letterSpacing: 1,
          }}
        >
          {range} · {location}
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: serif,
              fontSize: 28,
              fontWeight: 400,
              color: "var(--ink)",
              letterSpacing: -0.6,
            }}
          >
            {role}
          </h3>
          <span
            style={{
              fontFamily: serif,
              fontSize: 22,
              fontStyle: "italic",
              color: "var(--accent)",
            }}
          >
            {company}
          </span>
        </div>
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: serif,
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--body)",
            maxWidth: 720,
          }}
        >
          {summary}
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: sans,
                fontSize: 14,
                color: "var(--body)",
                lineHeight: 1.6,
                paddingLeft: 18,
                position: "relative",
                maxWidth: 720,
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 9,
                  width: 8,
                  height: 1,
                  background: "var(--ink)",
                }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ExecutivePortfolio() {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: sans,
        position: "relative",
      }}
    >
      <ExecutiveNav />
      <ExecutiveHero />
      <MetricsRow />
      <ClientStrip />

      <SectionFrame
        eyebrow="01 / SELECTED WORK"
        kicker="3 of 24"
        title={
          <>
            Projects I&apos;d defend in a <em style={{ fontStyle: "italic", color: "var(--accent)" }}>review</em>.
          </>
        }
      >
        {projects.map((p) => (
          <ProjectArticle
            key={p.name}
            n={p.num}
            year={p.year}
            kind={p.kind}
            name={p.name}
            role={p.role}
            summary={p.longDesc}
            outcomes={p.outcomes}
            stack={p.stack}
          />
        ))}
      </SectionFrame>

      <SectionFrame
        eyebrow="02 / EXPERIENCE"
        kicker="2020 — Present"
        title={
          <>
            Where I&apos;ve shipped, who I&apos;ve <em style={{ fontStyle: "italic", color: "var(--accent)" }}>shipped with</em>.
          </>
        }
      >
        {experience.map((row) => (
          <ExperienceItem
            key={`${row.role}-${row.company}-${row.when}`}
            when={row.when}
            range={row.range}
            role={row.role}
            company={row.company}
            location={row.location}
            summary={row.summary}
            bullets={row.bullets}
            current={row.current}
          />
        ))}
      </SectionFrame>

      <SectionFrame
        dark
        eyebrow="03 / APPROACH"
        kicker="how I work"
        title={
          <>
            A few principles I keep <em style={{ fontStyle: "italic", color: "var(--accent)" }}>coming back to</em>.
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {approachPrinciples.map((p, i) => (
            <div key={p.title} style={{ paddingTop: 24, borderTop: "1px solid #2a2b2e" }}>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim-faint)",
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 26,
                  fontWeight: 400,
                  color: "#f3f1ec",
                  letterSpacing: -0.5,
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "#a8aab0",
                }}
              >
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </SectionFrame>

      <SectionFrame
        eyebrow="04 / TOOLKIT"
        kicker="updated apr 2026"
        title={
          <>
            What I reach for, and what I&apos;ll <em style={{ fontStyle: "italic", color: "var(--accent)" }}>defend</em>.
          </>
        }
      >
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {skillsTable.map((row) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr 80px",
                padding: "24px 0",
                borderBottom: "1px solid var(--line-soft)",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                {row.label}
              </div>
              <div style={{ fontFamily: sans, fontSize: 16, color: "var(--body)" }}>
                {row.description}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim-faint)",
                  letterSpacing: 2,
                }}
              >
                EXP.
              </div>
            </div>
          ))}
        </div>
      </SectionFrame>

      <SectionFrame
        eyebrow="05 / WHAT OTHERS SAY"
        kicker="references"
        title={
          <>
            Words from people I&apos;ve <em style={{ fontStyle: "italic", color: "var(--accent)" }}>shipped with</em>.
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <figure
              key={i}
              style={{
                margin: 0,
                padding: 32,
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 6,
              }}
            >
              <div
                aria-hidden
                style={{
                  fontFamily: serif,
                  fontSize: 42,
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                “
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontSize: 19,
                  lineHeight: 1.55,
                  color: "var(--body)",
                  fontStyle: "italic",
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: "1px solid var(--line-soft)",
                }}
              >
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 14,
                    color: "var(--ink)",
                    fontWeight: 500,
                  }}
                >
                  {t.who}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    color: "var(--dim)",
                    letterSpacing: 1,
                    marginTop: 2,
                  }}
                >
                  {t.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </SectionFrame>

      <SectionFrame
        eyebrow="06 / WRITING"
        kicker="latest"
        title={
          <>
            Notes from the <em style={{ fontStyle: "italic", color: "var(--accent)" }}>workbench</em>.
          </>
        }
      >
        <div>
          {writing.map((w) => (
            <div
              key={w.title}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 120px",
                gap: 32,
                padding: "22px 0",
                borderTop: "1px solid var(--line-soft)",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim)",
                  letterSpacing: 2,
                }}
              >
                {w.date}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {w.title}
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 14,
                    color: "var(--body)",
                    lineHeight: 1.55,
                  }}
                >
                  {w.summary}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    color: "var(--accent)",
                    letterSpacing: 1,
                    padding: "3px 9px",
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
      </SectionFrame>

      <SectionFrame
        eyebrow="07 / CREDENTIALS"
        kicker="external"
        title="Selected certifications."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {certifications.map((c) => (
            <div
              key={c.title}
              style={{
                padding: 24,
                border: "1px solid var(--line)",
                borderRadius: 6,
                background: "var(--panel)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "var(--ok)",
                    letterSpacing: 2,
                  }}
                >
                  ● VERIFIED
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: "var(--dim)",
                    letterSpacing: 2,
                  }}
                >
                  {c.year}
                </span>
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 19,
                  color: "var(--ink)",
                  lineHeight: 1.25,
                  marginBottom: 6,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  color: "var(--dim)",
                  letterSpacing: 1,
                }}
              >
                {c.issuer}
              </div>
            </div>
          ))}
        </div>
      </SectionFrame>

      <section style={{ padding: "88px 64px", background: "var(--ink)", color: "#f3f1ec" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim-faint)",
              letterSpacing: 3,
              marginBottom: 24,
            }}
          >
            08 / GET IN TOUCH
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: serif,
              fontSize: 88,
              fontWeight: 400,
              letterSpacing: -3,
              lineHeight: 1,
              color: "#f3f1ec",
              maxWidth: 1000,
            }}
          >
            Have a problem
            <br />
            worth shipping for?{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Let&apos;s talk.</em>
          </h2>
          <div
            style={{
              marginTop: 56,
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 60,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: 20,
                lineHeight: 1.55,
                color: "#cfd0d4",
              }}
            >
              I&apos;m currently full-time at BrowserStack and selectively open to weekend
              collaborations, advisory work, and conversations that might lead somewhere
              interesting. The fastest way to reach me is email.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                    paddingBottom: 12,
                    borderBottom: "1px solid #2a2b2e",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: "var(--dim-faint)",
                      letterSpacing: 2,
                    }}
                  >
                    {k}
                  </span>
                  <span style={{ fontFamily: sans, fontSize: 15, color: "#f3f1ec" }}>{v}</span>
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 64,
              paddingTop: 24,
              borderTop: "1px solid #2a2b2e",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: mono,
              fontSize: 11,
              color: "var(--dim-faint)",
              letterSpacing: 2,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span>© 2026 MOIN BHOKARE · ALL RIGHTS RESERVED</span>
            <span>BUILT WITH CARE IN PUNE, INDIA</span>
            <span>v3.0 · APRIL 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}
