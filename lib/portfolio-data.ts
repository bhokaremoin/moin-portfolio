export const THEME_IDS = ["terminal", "executive", "editorial"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: ThemeId = "terminal";
export const THEME_STORAGE_KEY = "portfolio_theme" as const;
export const THEME_COOKIE_KEY = "portfolio_theme" as const;
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export interface ThemePalette {
  bg: string;
  accent: string;
  label: string;
  hint: string;
}

export const PALETTES: Record<ThemeId, ThemePalette> = {
  terminal: {
    bg: "#05070a",
    accent: "#7aff9c",
    label: "Terminal",
    hint: "monospace · phosphor",
  },
  executive: {
    bg: "#fafaf7",
    accent: "#c84a1a",
    label: "Executive",
    hint: "editorial · stakeholder",
  },
  editorial: {
    bg: "#0e1116",
    accent: "#f0b429",
    label: "Code IDE",
    hint: "syntax · refined",
  },
};

export const profile = {
  name: "Moin Bhokare",
  initial: "M",
  role: "SDE @ BrowserStack",
  shortRole: "Full Stack Developer",
  location: "Pune, IN",
  education: "B.Tech, IIIT Pune '24",
  educationShort: "BTech, IIIT Pune '24",
  email: "bhokaremoin@gmail.com",
  phone: "+91 8007704944",
  github: "github.com/bhokaremoin",
  linkedin: "linkedin.com/in/moinbhokare",
  leetcode: "leetcode.com/moinbhokare7",
  cvPath: "/cv.pdf",
  tagline:
    "Full-stack developer turning ideas into shipped code. I build developer-facing tooling at BrowserStack and spend weekends poking at AI agents, CLI utilities, and the occasional drum kit.",
  availability: "AVAILABLE FOR SELECT ENGAGEMENTS — Q2 2026",
} as const;

export interface ExperienceRow {
  when: string;
  range: string;
  role: string;
  company: string;
  location: string;
  current?: boolean;
  summary: string;
  bullets: readonly string[];
  tech?: readonly string[];
}

export const experience: readonly ExperienceRow[] = [
  {
    when: "DEC 2024 — PRESENT",
    range: "1 yr 4 mo · Full-time",
    role: "Full Stack Developer",
    company: "BrowserStack",
    location: "Pune, IN",
    current: true,
    summary:
      "Building developer-facing surfaces across the test-observability and live-testing platforms used by engineering teams worldwide.",
    bullets: [
      "Shipping developer-facing features across the test-observability and live-testing surfaces.",
      "Owned multiple end-to-end flows in React + Node services behind Docker and GCP.",
      "Reduced recurring infra toil by migrating legacy cron jobs to event-driven workers.",
    ],
    tech: ["React", "Node", "Docker", "GCP", "MongoDB"],
  },
  {
    when: "JUL 2024 — NOV 2024",
    range: "5 mo · Full-time",
    role: "Software Engineer",
    company: "SuperAGI",
    location: "Bengaluru, IN",
    summary:
      "Converted from intern → full-time on the strength of agent-infrastructure contributions.",
    bullets: [
      "Converted from intern → full-time on the strength of agent-infra contributions.",
      "Built LLM-facing evaluation and tracing tooling for open-source agent workflows.",
      "Contributed to the public repo powering thousands of community-run agents.",
    ],
    tech: ["Python", "TypeScript", "LLMs"],
  },
  {
    when: "JAN 2024 — JUN 2024",
    range: "6 mo · Internship",
    role: "SDE Intern",
    company: "SuperAGI",
    location: "Bengaluru, IN",
    summary:
      "First production-grade codebase. Earned a return offer through agent-loop work.",
    bullets: [
      "First real production codebase — learned to read diff trees faster than I wrote them.",
      "Shipped features into the core agent loop; the intern badge became a return offer.",
    ],
    tech: ["Python", "React"],
  },
  {
    when: "2020 — 2024",
    range: "4 yrs",
    role: "B.Tech, Computer Science",
    company: "IIIT Pune",
    location: "Pune, IN",
    summary:
      "CS fundamentals with a systems + ML tilt. Capstone in applied computer vision.",
    bullets: [
      "DSA, OS, DBMS, Distributed Systems — the foundations that still pay rent.",
      "Shipped ML, embedded, and full-stack projects across four years of coursework.",
    ],
    tech: ["DSA", "OS", "DBMS", "ML"],
  },
];

export interface Project {
  num: number;
  name: string;
  year: string;
  kind: string;
  role: string;
  lang: string;
  langColor: string;
  meta: string;
  stars: number;
  shortDesc: string;
  longDesc: string;
  outcomes: readonly string[];
  stack: readonly string[];
}

export const projects: readonly Project[] = [
  {
    num: 1,
    name: "GPTForVideo",
    year: "2024",
    kind: "AI · TOOLING",
    role: "Solo · Design + Engineering",
    lang: "JavaScript",
    langColor: "#f0b429",
    meta: "stars · 42 · MIT",
    stars: 42,
    shortDesc:
      "GPT-powered tool that turns long-form video into searchable, summarized, chapter-indexed artifacts. Built on a streaming backend with progressive rendering.",
    longDesc:
      "A GPT-powered layer over long-form video. Takes a raw upload and returns a searchable, chaptered, summarized artifact — streamed progressively so the UI never blocks on the model.",
    outcomes: [
      "End-to-end pipeline: upload, transcription, semantic chunking, GPT-driven chaptering and summary.",
      "Sub-second UI feedback on minutes-long videos via progressive streaming + optimistic rendering.",
      "Open-sourced; adopted by a small group of indie creators for podcast post-production.",
    ],
    stack: ["JavaScript", "GPT-4", "FFmpeg", "Node"],
  },
  {
    num: 2,
    name: "DevUtility",
    year: "2023",
    kind: "DEVTOOL · WEB",
    role: "Solo · Engineering",
    lang: "TypeScript",
    langColor: "#79c0ff",
    meta: "stars · 38 · MIT",
    stars: 38,
    shortDesc:
      "A toolbox of the 30 devtools every engineer has opened a shady website to use. JSON lint, regex playground, JWT decode — offline, local, fast.",
    longDesc:
      "The 30 utilities every engineer keeps reaching for — JSON lint, regex, JWT decode, base64, diff — rebuilt as one coherent, local-first product. Offline by default, keyboard-first, no telemetry.",
    outcomes: [
      'Replaced 6 separate "shady" web tools in my own daily workflow with one auditable codebase.',
      "Strict offline-first contract: zero outbound requests after first load.",
      "Cited by peers as their go-to internal tools alternative.",
    ],
    stack: ["TypeScript", "React", "Vite"],
  },
  {
    num: 3,
    name: "Adaptive Traffic Signal",
    year: "2024",
    kind: "ML · COMPUTER VISION",
    role: "Capstone · Lead Engineer",
    lang: "Python",
    langColor: "#7ee787",
    meta: "capstone · IIIT Pune",
    stars: 67,
    shortDesc:
      "Final-year project — a signal controller that reads live traffic density from camera feeds and re-allocates green-time per lane in real time.",
    longDesc:
      "A signal controller that reads live density from junction cameras and re-allocates green-time per lane in real time, targeting throughput wins that fixed-cycle timers leave on the table.",
    outcomes: [
      "Designed and shipped the full perception + control loop on a Raspberry Pi.",
      "Demonstrated improved throughput on simulated junction footage versus a baseline timer.",
      "Selected for capstone showcase at IIIT Pune, 2024.",
    ],
    stack: ["Python", "OpenCV", "ML", "Raspberry Pi"],
  },
];

export interface SkillBucket {
  label: string;
  description: string;
  items: readonly { name: string; level?: number }[];
}

export const skills: readonly SkillBucket[] = [
  {
    label: "Languages",
    description: "TypeScript, JavaScript, Java, Python, C++",
    items: [
      { name: "TypeScript", level: 92 },
      { name: "JavaScript", level: 94 },
      { name: "Java", level: 78 },
      { name: "C++", level: 72 },
      { name: "Python", level: 74 },
    ],
  },
  {
    label: "Frontend",
    description: "React, Next.js, modern CSS, design systems",
    items: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 80 },
      { name: "CSS", level: 82 },
      { name: "HTML5" },
    ],
  },
  {
    label: "Backend",
    description: "Node.js, Spring Boot, microservices, REST",
    items: [
      { name: "Node.js", level: 88 },
      { name: "Spring Boot", level: 76 },
      { name: "Microservices", level: 72 },
      { name: "REST" },
    ],
  },
  {
    label: "Data",
    description: "MongoDB, MySQL, Firebase",
    items: [{ name: "MongoDB" }, { name: "MySQL" }, { name: "Firebase" }],
  },
  {
    label: "Infrastructure",
    description: "Docker, GCP, AWS, Linux, CI/CD",
    items: [
      { name: "Docker", level: 85 },
      { name: "GCP", level: 72 },
      { name: "AWS", level: 68 },
      { name: "Linux", level: 82 },
      { name: "Git" },
    ],
  },
  {
    label: "Practice",
    description: "Code review, RFCs, observability, mentorship",
    items: [
      { name: "LLMs" },
      { name: "Agents" },
      { name: "Shaders" },
      { name: "Vim" },
    ],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
}

export const certifications: readonly Certification[] = [
  {
    title: "AWS Essential Training for Developers",
    issuer: "Amazon Web Services",
    year: "2024",
  },
  {
    title: "Introduction to DevOps",
    issuer: "Great Learning",
    year: "2023",
  },
  {
    title: "Introduction to Large Language Models",
    issuer: "Cert Program",
    year: "2024",
  },
];

export interface ApproachPrinciple {
  title: string;
  body: string;
}

export const approachPrinciples: readonly ApproachPrinciple[] = [
  {
    title: "Ship the smallest correct thing.",
    body: "Cadence beats cleverness. I'd rather ship a thin slice end-to-end than a beautifully half-built monolith.",
  },
  {
    title: "Code is read more than written.",
    body: "I optimize for the engineer Ctrl-clicking into a function at 11pm — clear names, readable shapes, useful errors.",
  },
  {
    title: "DX is a stakeholder.",
    body: "The developer experience is a first-class deliverable, not the leftover budget at the end of a sprint.",
  },
];

export interface Testimonial {
  quote: string;
  who: string;
  role: string;
  placeholder: boolean;
}

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "Moin has the rare combination of moving quickly and writing code I trust to read six months later. He's the engineer you give the ambiguous problem to.",
    who: "Engineering Manager · BrowserStack",
    role: "placeholder · replace with real quote",
    placeholder: true,
  },
  {
    quote:
      "Picked up our agent codebase faster than anyone we'd onboarded. His PRs raised the bar for the whole open-source repo.",
    who: "Tech Lead · SuperAGI",
    role: "placeholder · replace with real quote",
    placeholder: true,
  },
];

export interface WritingItem {
  date: string;
  title: string;
  summary: string;
  tag: string;
}

export const writing: readonly WritingItem[] = [
  {
    date: "MAR 2026",
    tag: "ESSAY",
    title: "Designing developer-facing surfaces that don't lie.",
    summary:
      "When the user is also an engineer, every UI affordance becomes a contract. A short essay on observability, error states, and trust.",
  },
  {
    date: "FEB 2026",
    tag: "DEEP DIVE",
    title: "The cost of cron: migrating to event-driven workers.",
    summary:
      "A real-world walkthrough of replacing legacy schedulers with an event-driven worker pool — what we kept, what we rewrote, what surprised us.",
  },
  {
    date: "DEC 2025",
    tag: "NOTES",
    title: "Reading the source: lessons from open-source agent frameworks.",
    summary:
      "Five patterns I picked up from contributing to a public OSS agent codebase, and what I took back into product engineering.",
  },
  {
    date: "OCT 2025",
    tag: "TALK",
    title: "From intern to full-time: a CS-grad's first 18 months in production.",
    summary:
      "A talk for IIIT juniors on the gap between coursework and your first production codebase, and how to close it deliberately.",
  },
];

export const metrics = [
  { label: "Years engineering", value: "2+" },
  { label: "Repositories shipped", value: "24" },
  { label: "Companies", value: "2" },
  { label: "Open-source PRs", value: "60+" },
] as const;

export const clientStrip = [
  "BROWSERSTACK",
  "SUPERAGI",
  "IIIT PUNE",
  "AWS",
  "OPEN SOURCE",
] as const;
