import { certifications, experience, profile, projects, skills } from "@/lib/portfolio-data";

export function SeoContent() {
  return (
    <section className="sr-only" aria-label="Portfolio content">
      <h1>{profile.name} — {profile.role}</h1>
      <p>{profile.tagline}</p>
      <h2>Experience</h2>
      <ul>
        {experience.map((e) => (
          <li key={`${e.role}-${e.company}-${e.when}`}>
            <strong>{e.role} @ {e.company}</strong> ({e.when}, {e.location})
            <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          </li>
        ))}
      </ul>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.name}><strong>{p.name}</strong>: {p.longDesc} [{p.stack.join(", ")}]</li>
        ))}
      </ul>
      <h2>Skills</h2>
      <ul>{skills.map((s) => <li key={s.label}>{s.label}: {s.description}</li>)}</ul>
      <h2>Certifications</h2>
      <ul>{certifications.map((c) => <li key={c.title}>{c.title} — {c.issuer} ({c.year})</li>)}</ul>
      <h2>Contact</h2>
      <ul>
        <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
        <li><a href={`https://${profile.github}`}>{profile.github}</a></li>
        <li><a href={`https://${profile.linkedin}`}>{profile.linkedin}</a></li>
      </ul>
    </section>
  );
}
