import {
  certifications,
  experience,
  profile,
  projects,
} from "@/lib/portfolio-data";
import { TerminalShell } from "./shell";

const mono = "var(--font-mono)";

const ASCII_MOIN = [
  "███╗   ███╗  ██████╗  ██╗ ███╗   ██╗",
  "████╗ ████║ ██╔═══██╗ ██║ ████╗  ██║",
  "██╔████╔██║ ██║   ██║ ██║ ██╔██╗ ██║",
  "██║╚██╔╝██║ ██║   ██║ ██║ ██║╚██╗██║",
  "██║ ╚═╝ ██║ ╚██████╔╝ ██║ ██║ ╚████║",
  "╚═╝     ╚═╝  ╚═════╝  ╚═╝ ╚═╝  ╚═══╝",
].join("\n");

function PromptLine({ children, prompt = "$" }: { children: React.ReactNode; prompt?: string }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.8, color: "var(--ink)" }}>
      <span style={{ color: "var(--accent)" }}>moin@portfolio</span>
      <span style={{ color: "var(--dim)" }}>:</span>
      <span style={{ color: "var(--cyan)" }}>~</span>
      <span style={{ color: "var(--dim)" }}> {prompt} </span>
      {children}
    </div>
  );
}

function SectionFrame({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "40px 40px",
        borderTop: "1px dashed var(--line)",
        position: "relative",
        zIndex: 3,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
        <span style={{ color: "var(--dim)", fontFamily: mono, fontSize: 12 }}>{"//"}</span>
        <span
          style={{
            color: "var(--accent)",
            fontFamily: mono,
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          [{id}]
        </span>
        <h2
          style={{
            margin: 0,
            color: "var(--ink)",
            fontFamily: mono,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "repeating-linear-gradient(90deg, var(--line) 0 4px, transparent 4px 8px)",
          }}
        />
      </div>
      {children}
    </section>
  );
}

function ProjectCard({ num, name, stack, desc, stars }: {
  num: number;
  name: string;
  stack: readonly string[];
  desc: string;
  stars: number;
}) {
  return (
    <article
      style={{
        border: "1px solid var(--line)",
        background: "var(--panel)",
        padding: 22,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "4px 10px",
          background: "var(--accent)",
          color: "#001008",
          fontFamily: mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {String(num).padStart(2, "0")}
      </div>
      <div style={{ color: "var(--dim)", fontFamily: mono, fontSize: 11, letterSpacing: 1 }}>
        ~/projects/{name.toLowerCase().replace(/\s/g, "-")}
      </div>
      <div style={{ color: "var(--ink)", fontFamily: mono, fontSize: 20, fontWeight: 600 }}>
        {name}
      </div>
      <div style={{ color: "var(--dim)", fontFamily: mono, fontSize: 13, lineHeight: 1.55 }}>
        {desc}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
        {stack.map((s) => (
          <span
            key={s}
            style={{
              border: "1px solid var(--line)",
              padding: "2px 8px",
              fontFamily: mono,
              fontSize: 10,
              color: "var(--cyan)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid var(--line)",
        }}
      >
        <span style={{ color: "var(--amber)", fontFamily: mono, fontSize: 12 }}>★ {stars}</span>
        <span style={{ color: "var(--accent)", fontFamily: mono, fontSize: 12 }}>
          → git clone
        </span>
      </div>
    </article>
  );
}

function ExperienceRow({
  when,
  location,
  role,
  company,
  bullets,
  current,
}: {
  when: string;
  location: string;
  role: string;
  company: string;
  bullets: readonly string[];
  current?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 32,
        padding: "24px 0",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 12, color: "var(--dim)", paddingTop: 4 }}>
        <div
          style={{
            color: current ? "var(--accent)" : "var(--dim)",
            letterSpacing: 1,
          }}
        >
          {when}
        </div>
        <div style={{ marginTop: 4 }}>{location}</div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: mono, fontSize: 18, color: "var(--ink)", fontWeight: 600 }}>
            {role}
          </span>
          <span style={{ color: "var(--dim)" }}>@</span>
          <span style={{ fontFamily: mono, fontSize: 18, color: "var(--amber)" }}>{company}</span>
          {current && (
            <span
              style={{
                marginLeft: 6,
                padding: "2px 8px",
                background: "rgba(122,255,156,0.13)",
                border: "1px solid rgba(122,255,156,0.33)",
                color: "var(--accent)",
                fontFamily: mono,
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              ● ACTIVE
            </span>
          )}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: mono,
                fontSize: 13,
                color: "var(--ink)",
                lineHeight: 1.6,
                paddingLeft: 18,
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>›</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillBlock({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: 18 }}>
      <div
        style={{
          color: "var(--dim)",
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        {"//"} {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "var(--ink)",
              padding: "4px 10px",
              border: "1px solid var(--line)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const SKILL_BUCKETS: readonly { label: string; items: readonly string[] }[] = [
  { label: "LANGUAGES", items: ["TypeScript", "JavaScript", "Java", "C++", "Python"] },
  { label: "FRONTEND", items: ["React", "Next.js", "HTML5", "CSS3"] },
  { label: "BACKEND", items: ["Node.js", "Spring Boot", "Microservices", "REST"] },
  { label: "DATA", items: ["MongoDB", "MySQL", "Firebase"] },
  { label: "INFRA", items: ["Docker", "AWS", "GCP", "Linux", "Git"] },
  { label: "THE FUN STUFF", items: ["LLMs", "Agents", "Shaders", "Vim"] },
];

export default function TerminalPortfolio() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: mono,
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          mixBlendMode: "overlay",
          opacity: 0.35,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1px solid var(--line)",
          background: "#0a0d12",
          color: "var(--dim)",
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: 0.3,
          position: "relative",
          zIndex: 3,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ff5f56" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ffbd2e" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#27c93f" }} aria-hidden />
        <span style={{ marginLeft: 14, color: "var(--ink)" }}>moin@portfolio: ~</span>
        <span style={{ marginLeft: "auto" }}>— zsh — 120×40</span>
      </div>

      <section
        style={{ padding: "36px 40px 48px", position: "relative", zIndex: 3 }}
      >
        <PromptLine>
          <span style={{ color: "var(--ink)" }}>whoami</span>
        </PromptLine>
        <div style={{ height: 10 }} />
        <PromptLine prompt=">">
          <span style={{ color: "var(--dim)" }}>→ rendering identity...</span>
        </PromptLine>
        <h1
          style={{
            margin: "24px 0 0",
            fontFamily: mono,
            color: "var(--accent)",
            fontSize: 15,
            lineHeight: 1.1,
            letterSpacing: 0,
            whiteSpace: "pre",
            textShadow: "0 0 8px rgba(122,255,156,0.35), 0 0 20px rgba(122,255,156,0.15)",
          }}
        >
          {ASCII_MOIN}
        </h1>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "var(--amber)", fontSize: 16 }}>[role]</span>
          <span style={{ color: "var(--ink)", fontSize: 16 }}>{profile.role}</span>
          <span style={{ color: "var(--dim)" }}>·</span>
          <span style={{ color: "var(--dim)", fontSize: 16 }}>{profile.educationShort}</span>
          <span style={{ color: "var(--dim)" }}>·</span>
          <span style={{ color: "var(--cyan)", fontSize: 16 }}>{profile.location}</span>
        </div>
        <div
          style={{
            marginTop: 32,
            padding: 20,
            border: "1px solid var(--line)",
            background: "var(--panel)",
            maxWidth: 760,
          }}
        >
          <div
            style={{
              color: "var(--dim)",
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            {"// TAGLINE.TXT"}
          </div>
          <p style={{ margin: 0, color: "var(--ink)", fontSize: 17, lineHeight: 1.6 }}>
            Full-stack developer turning <span style={{ color: "var(--accent)" }}>ideas</span> into{" "}
            <span style={{ color: "var(--accent)" }}>shipped code</span>. I build developer-facing
            tooling at BrowserStack and spend weekends poking at AI agents, CLI utilities, and the
            occasional drum kit.
          </p>
          <div style={{ marginTop: 14, color: "var(--mag)", fontSize: 13 }}>
            <span style={{ color: "var(--dim)" }}>cursor:</span>{" "}
            <span style={{ background: "var(--accent)", color: "var(--bg)", padding: "0 2px" }}>_</span>
          </div>
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={profile.cvPath}
            download
            style={{
              padding: "10px 16px",
              border: "1px solid var(--accent)",
              background: "rgba(122,255,156,0.08)",
              color: "var(--accent)",
              fontSize: 13,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            ./resume.pdf
          </a>
          <a
            href={`https://${profile.github}`}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              padding: "10px 16px",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: 13,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            ./github
          </a>
          <a
            href={`https://${profile.linkedin}`}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              padding: "10px 16px",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: 13,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            ./linkedin
          </a>
          <a
            href={`mailto:${profile.email}`}
            style={{
              padding: "10px 16px",
              border: "1px solid var(--line)",
              color: "var(--amber)",
              fontSize: 13,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            ./mail →
          </a>
        </div>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {(
            [
              ["UPTIME", "1y 4mo", "var(--accent)"],
              ["COMMITS", "2.3k", "var(--cyan)"],
              ["PROJECTS", "24", "var(--amber)"],
              ["COFFEE/DAY", "∞", "var(--mag)"],
            ] as const
          ).map(([k, v, c]) => (
            <div key={k} style={{ border: "1px solid var(--line)", padding: 14 }}>
              <div
                style={{
                  color: "var(--dim)",
                  fontSize: 10,
                  letterSpacing: 2,
                }}
              >
                {k}
              </div>
              <div style={{ color: c, fontSize: 22, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: "24px 0 0",
            color: "var(--dim)",
            fontSize: 11,
            letterSpacing: 2,
            fontFamily: mono,
          }}
        >
          {"// HINT · click the icon top-left or scroll down and type "}
          <span style={{ color: "var(--accent)" }}>theme executive</span>
          {" to swap looks."}
        </p>
      </section>

      <SectionFrame id="01" title="cat about.md">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <p style={{ fontFamily: mono, fontSize: 14, lineHeight: 1.75, color: "var(--ink)", margin: "0 0 14px" }}>
              I&apos;m a full-stack developer based in Pune. Currently I ship developer-facing tooling at{" "}
              <span style={{ color: "var(--amber)" }}>BrowserStack</span>, where the product is
              literally other developers&apos; happiness.
            </p>
            <p style={{ fontFamily: mono, fontSize: 14, lineHeight: 1.75, color: "var(--dim)", margin: "0 0 14px" }}>
              Before this I was an SDE at <span style={{ color: "var(--accent)" }}>SuperAGI</span> —
              converted from a 6-month internship into full-time, worked on open-source agent
              infrastructure, and came out convinced the interesting abstractions of the next
              decade live somewhere between the compiler and the model.
            </p>
            <p style={{ fontFamily: mono, fontSize: 14, lineHeight: 1.75, color: "var(--dim)", margin: 0 }}>
              I like small, sharp tools, a well-placed Dockerfile, and the particular satisfaction
              of deleting code that used to be load-bearing.
            </p>
          </div>
          <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: 18 }}>
            <div
              style={{
                color: "var(--dim)",
                fontSize: 11,
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              {"// now.json"}
            </div>
            {(
              [
                ["location", "\"Pune, IN\"", "var(--cyan)"],
                ["working_on", "\"dev tools @ BrowserStack\"", "var(--accent)"],
                ["learning", "\"rust, distributed systems\"", "var(--amber)"],
                ["listening", "\"lofi + anirudh\"", "var(--mag)"],
                ["status", "\"open to chat\"", "var(--accent)"],
              ] as const
            ).map(([k, v, c]) => (
              <div key={k} style={{ fontSize: 13, lineHeight: 2, display: "flex", gap: 12 }}>
                <span style={{ color: "var(--dim)", minWidth: 110 }}>&quot;{k}&quot;:</span>
                <span style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="02" title="git log --oneline --career">
        {experience.map((row) => (
          <ExperienceRow
            key={`${row.role}-${row.company}-${row.when}`}
            when={row.when}
            location={row.location}
            role={row.role}
            company={row.company}
            bullets={row.bullets}
            current={row.current}
          />
        ))}
      </SectionFrame>

      <SectionFrame id="03" title="ls -la ~/projects">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.name}
              num={p.num}
              name={p.name}
              stack={p.stack}
              desc={p.shortDesc}
              stars={p.stars}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 18,
            padding: 14,
            border: "1px dashed var(--line)",
            fontSize: 12,
            color: "var(--dim)",
          }}
        >
          <span style={{ color: "var(--accent)" }}>$</span> ls ~/projects | wc -l
          <span style={{ color: "var(--ink)", marginLeft: 14 }}>24</span>
          <span style={{ marginLeft: 30, color: "var(--dim)" }}>
            → showing 3 starred ·{" "}
            <a
              href={`https://${profile.github}`}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: "var(--cyan)", textDecoration: "none" }}
            >
              view all on github
            </a>
          </span>
        </div>
      </SectionFrame>

      <SectionFrame id="04" title="man moin.skills">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {SKILL_BUCKETS.map((b) => (
            <SkillBlock key={b.label} label={b.label} items={b.items} />
          ))}
        </div>
      </SectionFrame>

      <SectionFrame id="05" title="open shell — try it">
        <div style={{ marginBottom: 14, fontSize: 12, color: "var(--dim)", fontFamily: mono }}>
          {"// a real shell · type "}
          <span style={{ color: "var(--accent)" }}>help</span>
          {" to see commands · ↑/↓ for history"}
        </div>
        <TerminalShell />
      </SectionFrame>

      <SectionFrame id="06" title="ls ~/certs">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {certifications.map((c) => (
            <div
              key={c.title}
              style={{
                padding: "10px 14px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                fontSize: 12,
                color: "var(--ink)",
              }}
            >
              <span style={{ color: "var(--accent)", marginRight: 8 }}>✓</span>
              {c.title}
            </div>
          ))}
        </div>
      </SectionFrame>

      <SectionFrame id="07" title="curl -X POST /contact">
        <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: 30 }}>
          <PromptLine>
            <span style={{ color: "var(--ink)" }}>echo &quot;let&apos;s build something&quot;</span>
          </PromptLine>
          <div style={{ height: 10 }} />
          <PromptLine prompt=">">
            <span style={{ color: "var(--accent)", fontSize: 28, letterSpacing: -0.5 }}>
              let&apos;s build something.
            </span>
          </PromptLine>
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {(
              [
                ["mail", profile.email, "var(--amber)", `mailto:${profile.email}`],
                ["tel", profile.phone, "var(--cyan)", `tel:${profile.phone.replace(/\s+/g, "")}`],
                ["github", profile.github, "var(--ink)", `https://${profile.github}`],
                ["linkedin", profile.linkedin, "var(--ink)", `https://${profile.linkedin}`],
              ] as const
            ).map(([k, v, c, href]) => (
              <a
                key={k}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                style={{
                  padding: "12px 16px",
                  border: "1px solid var(--line)",
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span style={{ color: "var(--dim)" }}>{k}</span>
                <span style={{ color: c }}>{v}</span>
              </a>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 11,
            color: "var(--dim)",
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          [ END OF TRANSMISSION ] · crafted with vim + coffee · © 2026
        </div>
        <div style={{ height: 40 }} />
      </SectionFrame>
    </div>
  );
}
