---
title: "feat: Moin Bhokare portfolio — three-theme developer site (Terminal / Executive / Code IDE)"
type: feat
status: active
date: 2026-05-17
---

# Moin Bhokare Portfolio — Three-Theme Developer Site

## Overview

A high-graphics personal portfolio for Moin Bhokare (SDE @ BrowserStack) built on the existing
fresh **Next.js 16 / React 19 / Tailwind 4** project at `moin-portflio/`. The site ships **one
public page** that hosts **three swappable themes** the visitor can toggle live from a single
glassmorphic icon in the top-left:

1. **Terminal Brutalist** — green phosphor on black, ASCII name, scanlines, and a **real
   interactive shell** with command parsing + history.
2. **Executive** — light editorial-magazine layout, serif display, rust accent, sticky exec
   nav, case-study cards, dark "Approach" band, testimonials, writing notes.
3. **Code IDE (Editorial)** — dark IDE chrome with a clickable **file explorer + tab strip**
   that swaps the main pane (`hero.tsx`, `about.md`, `experience.json`, `projects/`,
   `skills.yml`, `certifications.md`, `contact.ts`).

Content (bio, experience, projects, certs, contact) is identical across themes, sourced from a
single shared data module so updating a fact updates all three surfaces.

> **Source design:** Claude Design handoff bundle (`test-claude-personal-portfolio/`) — the
> primary file is `project/Portfolio.html`, which composes three variants
> (`variants/terminal.jsx`, `variants/executive.jsx`, `variants/editorial.jsx`) plus the shared
> `variants/theme-switcher.jsx` and the V1 shell `variants/terminal-shell.jsx`. The "Live"
> artboard in the prototype is the production target — the surrounding `DesignCanvas` /
> `DCSection` / `DCArtboard` chrome is **not** shipped.

---

## Deepen Plan — Research Insights & Corrections (2026-05-17)

> Synthesised from 12 parallel review/research agents (architecture, performance, frontend
> race-conditions, maintainability, simplicity, TypeScript, coherence, design, feasibility,
> scope, accessibility, Next 16/React 19/Tailwind 4 framework docs, and the
> `compound-engineering:frontend-design` skill). **The corrections below override the original
> plan body where they conflict.** Read this section first.

### Binding decisions (resolve before Phase 1)

These were ambiguous or contradicted in the original plan. They're now pinned:

| # | Decision | Rationale |
| --- | --- | --- |
| **D1** | **Default theme on cold load: `terminal`.** Moin may flip this to `executive` in Open Questions; the implementation must read from a single `DEFAULT_THEME` constant so the swap is one line. | Two sections asserted Terminal, Success Metrics & Open Questions left it open. Pinning it removes Phase-1-blocking ambiguity. |
| **D2** | **Hydration strategy: cookie-driven SSR of the active theme.** `app/page.tsx` reads `cookies().get('portfolio_theme')` (Server Component, `next/headers`), passes it down. `<html data-theme={cookieValue ?? DEFAULT_THEME} suppressHydrationWarning>`. The inline pre-paint script reconciles when cookie is missing but localStorage has a value (returning visitor on first request after a cookie wipe). On `setTheme()`, the client writes **both** `document.cookie = 'portfolio_theme=…; path=/; max-age=31536000; SameSite=Lax'` and `localStorage`. **No `null` placeholder, no FOUC, no blank first frame.** | Original plan picked two incompatible strategies. The cookie route SSR-renders the correct theme, satisfies LCP, and avoids the hydration warning. |
| **D3** | **Lazy-loading: render only the active theme.** The default theme is statically imported into `themed-portfolio.tsx` (so it SSRs). The non-active themes are `next/dynamic(() => import('./themes/X'), { ssr: false })`, fetched on first switch. Prefetch the remaining two on `requestIdleCallback` after first paint so subsequent toggles feel instant. **Drop the "mount all three lazily" wording entirely.** | Original plan contradicted itself in two sections. `next/dynamic({ ssr:false })` is only legal inside a Client Component — `themed-portfolio.tsx` is one, so the constraint is satisfied. |
| **D4** | **Cut the `window.dispatchEvent('portfolio:theme')` channel.** React Context + a `storage`-event listener for cross-tab sync are the only channels. | Nothing in the production app listens for the custom event; it's dead-code-on-arrival. |
| **D5** | **Fonts: trim to 3 families.** `JetBrains_Mono` (Terminal + IDE chrome + Executive eyebrows), `Source_Serif_4` (Executive display/body, Editorial file headers), `Inter` (Executive UI body, Editorial page body). **Drop `IBM_Plex_Mono` and `Space_Grotesk`.** Mount the **default theme's font variables only** on `<html>`; mount the other themes' `.variable` classes on their root element when they load. `preload: true` only on JetBrains Mono (default theme). `display: 'swap'`, `adjustFontFallback: true` on all. Source_Serif_4 and Inter are variable fonts — omit the `weight` array. | The original plan listed 5 families with eager `.variable` mounting; Next would preload all 6 woff2 buckets on every request, ~600–800 KB blocking LCP. |
| **D6** | **Scope cuts (final):** drop `app/opengraph-image.tsx` (use static `public/og.png` exported from the Executive hero), drop `sitemap.ts` and `not-found.tsx`, drop cross-tab `storage` event sync (`localStorage` write + reload is enough), keep `robots.txt` only if you want explicit allow rules — otherwise drop it too. | The "Future Considerations" section stays in the doc but is **non-binding** — no work item in any phase. |
| **D7** | **Revised phase estimates: ~6–7 days total.** Phase 1: 0.5–1d (1d if D2 surprises). Phase 2: 1.5d (shell + 8 sections + ASCII glow + scanlines). Phase 3: 1d. Phase 4: 2–2.5d (IDE has the highest complexity — tabs + sidebar + 7 pages + 2 syntax-highlighted code blocks + keyboard nav). Phase 5: 1–1.5d (responsive sweep × 3 themes × 4 breakpoints = 12 layouts to inspect + Lighthouse tuning). | Original 4.5d budget under-counted Phase 4 (1.5d → 2.5d) and Phase 5 (0.5d → 1.5d). |

### Architectural refinements

- **Split `<ClientGate>` from `<ThemedPortfolio>`.** `<ClientGate>` only handles hydration safety
  (renders children once mounted); `<ThemedPortfolio>` is a pure switch. With cookie SSR (D2),
  `<ClientGate>` may be unnecessary — keep it only if the codebase later needs Suspense
  boundaries.
- **Use `useSyncExternalStore` as the primary subscription primitive**, not the `useEffect +
  useState` fallback. Subscribe to the `storage` event in one callback; `getServerSnapshot`
  returns `DEFAULT_THEME`; `getSnapshot` reads `document.documentElement.dataset.theme` with a
  `typeof document` guard. Eliminates a class of tearing bugs.
- **Drop `ThemedPortfolio` as a named component** — inline its three-line switch directly into
  `app/page.tsx`'s client child. Or rename to `PortfolioRouter`. The current name lies (it's
  not "themed" — it routes).
- **Don't share `ui/section-frame.tsx` across themes.** Each theme's section chrome is
  visually unique (terminal `// [01]` rule, executive serif headline, editorial `§ id / kind`
  eyebrow). Premature shared primitives become the worst kind of coupling.
- **Co-locate `useTheme()` with `theme-provider.tsx`.** Don't introduce `lib/use-theme.ts` for
  one hook.

### TypeScript contracts to encode in the plan

```ts
// lib/portfolio-data.ts (sketch — replaces the original `as const` blob)
export const THEME_IDS = ['terminal', 'executive', 'editorial'] as const;
export type ThemeId = (typeof THEME_IDS)[number];
export const DEFAULT_THEME: ThemeId = 'terminal';
export const THEME_STORAGE_KEY = 'portfolio_theme' as const;

export interface Project { name: string; stack: readonly string[]; stars?: number;
  kind?: string; year?: string; outcomes?: readonly string[]; /* … */ }

export interface ThemePalette { bg: string; ink: string; dim: string; line: string;
  accent: string; /* + theme-specific extras as optional */ }
export const PALETTES: Record<ThemeId, ThemePalette> = { /* … */ };

// terminal command result — discriminated union with `kind`
type TerminalLine = { color: string; text: string };
export type CommandResult =
  | { kind: 'lines'; lines: readonly TerminalLine[] }
  | { kind: 'clear' };

// editorial files — derived key constraint
export const FILES = { 'hero.tsx': {…}, /* … */ } as const satisfies Record<FileId, FileMeta>;
export type FileId = keyof typeof FILES;
export const PAGES: Record<FileId, ComponentType> = { /* must include every FileId */ };

// theme validation helper used by the pre-paint script consumer + provider
export function readStoredTheme(): ThemeId | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_IDS.includes(v as ThemeId) ? (v as ThemeId) : null;
  } catch { return null; }
}

// useTheme() throws if context missing — return type is non-nullable
interface ThemeContextValue { theme: ThemeId; setTheme: (id: ThemeId) => void; }
export function useTheme(): ThemeContextValue { /* throw if !ctx */ }
```

Use the **`satisfies` operator** on every const-data export so per-theme projections stay
type-checked. Drop `forwardRef` entirely — React 19 lets `ref` be a regular prop.

### Tailwind 4 token wiring (correct pattern)

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* declare utilities that resolve through CSS vars set under [data-theme] */
  --color-bg:     var(--bg);
  --color-ink:    var(--ink);
  --color-accent: var(--accent);
  --font-mono:    var(--font-jetbrains);
  /* …etc */
}

[data-theme="terminal"]  { --bg:#05070a; --ink:#c7d2cc; --accent:#7aff9c; color-scheme: dark; }
[data-theme="executive"] { --bg:#fafaf7; --ink:#0c0d0f; --accent:#c84a1a; color-scheme: light; }
[data-theme="editorial"] { --bg:#0e1116; --ink:#e6edf3; --accent:#f0b429; color-scheme: dark; }
```

`@theme inline` is **required** — without `inline`, Tailwind resolves `var(--bg)` once at parse
time and the `[data-theme]` overrides stop working. Then write utilities (`bg-bg text-ink
border-accent`) in components instead of `bg-[var(--bg)]`. Use raw `style={{}}` only for the
prototype's one-off pixel-precise decoration (scanline overlay, ASCII glow).

### Race-condition fixes (Phase 4 + Phase 2)

- **IDE `close(id)` is broken in the prototype.** Setting state inside a state-updater
  triggers a one-frame ghost render of the empty tab strip before "restore hero.tsx" lands.
  Replace with two coordinated transitions:
  ```ts
  const close = (id: FileId) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter(t => t !== id);
      return next.length === 0 ? ['hero.tsx'] : next;
    });
    setActive((cur) => (cur === id ? neighborOf(id, openTabs) ?? 'hero.tsx' : cur));
  };
  ```
- **Terminal scrollback** must use `useLayoutEffect`, not `useEffect`, to write `scrollTop =
  scrollHeight` before paint. Otherwise React 19 batching can land the DOM mutation post-paint
  → visible jump.
- **`setTheme` must not synchronously dispatch DOM events** (D4 removes the dispatch entirely,
  but if it ever comes back, use `queueMicrotask`). Otherwise the previous-theme component
  receives the event during its own unmount and React 19 logs "Cannot update a component that
  is already unmounted."
- **StrictMode double-mount**: every `useEffect` that subscribes to `storage` must return a
  `removeEventListener` cleanup with stable identity (declare the listener inside the effect
  or via `useCallback`).
- **`useState` initializer** that reads `document.documentElement.dataset.theme` must be
  guarded: `useState(() => typeof document === 'undefined' ? DEFAULT_THEME : (…) as ThemeId)`.

### Performance budget (replaces the existing one)

| Metric | Target | Risk if not met |
| --- | --- | --- |
| Lighthouse Performance (desktop) | ≥ 92 | Achievable with D3 + D5; at-risk if 5 fonts ship eagerly |
| Lighthouse Accessibility | ≥ 95 | Requires the contrast bumps and the WCAG 2.2 SC 1.4.13 fixes below |
| LCP | < 1.8s | Requires cookie-SSR (D2) so the hero element exists in initial HTML |
| **CLS** | **< 0.05** | Needs `adjustFontFallback: true` (default) on every font |
| **INP during theme switch** | **< 200ms** | Needs D3 prefetch on idle |
| Initial JS | < 200 KB compressed | Needs D3 (only active theme in initial chunk) |

**Buffer caps (encode in Phase 2/4 exit criteria):** terminal scrollback ≤ **200 lines** (FIFO
drop); command history `past` ≤ **50** (already in prototype); IDE `openTabs` ≤ **8** (reject
new opens or evict the oldest non-active tab).

### Accessibility (WCAG 2.2) — concrete patterns

| Surface | Pattern |
| --- | --- |
| Terminal scrollback | `<section aria-label="Interactive shell">` wraps everything. Inside: `<div role="log" aria-live="polite" aria-atomic="false" aria-label="Terminal output">` for history; **input lives outside the log region** with a visually-hidden `<label for>`. Do not autofocus on mount. |
| IDE tab strip | `<div role="tablist" aria-label="Open files" aria-orientation="horizontal">`; tabs: `role="tab"`, `aria-selected`, `aria-controls="panel-<id>"`, **roving tabindex** (active=0, others=-1); keys: ←/→ move+activate, Home/End jump, Delete closes focused tab. |
| IDE main pane | `<section role="tabpanel" id="panel-<id>" aria-labelledby="tab-<id>" tabindex="0">`. |
| IDE sidebar | `<nav aria-label="Explorer">` containing `<ul>` of `<button>`s (simpler than `role="tree"` for a flat list). Roving tabindex with ↑/↓ to move, Enter/Space to open. **Don't reuse `role="tab"` on sidebar items.** |
| Theme switcher | `<button aria-haspopup="menu" aria-expanded={open} aria-controls="theme-menu">`. Open on click, Space, Enter, ArrowDown. **Escape closes + returns focus to trigger** (WCAG 2.2 SC 1.4.13 Dismissible). Outside-`pointerdown` closes. Menu: `role="menu"` with `role="menuitemradio" aria-checked={isActive}`. Disable `:focus-within`-only open via `@media (hover: hover)` — touch gets explicit click toggle. Trigger size: **bump from 38×38 to 44×44** to meet touch-target minimum. |
| Skip link | First focusable element in `<body>` (in `app/layout.tsx`), `href="#main"`; `<main id="main" tabindex="-1">` exists in every theme. |
| Reduced motion | Default-safe path: wrap any animation in `@media (prefers-reduced-motion: no-preference)` (inverse of the original plan). Scanlines static, ASCII glow static (no pulse), switcher rotation `transition: none`, cursor block static. |

**Contrast fixes (WCAG 1.4.3 AA = 4.5:1 for body):**
- Terminal `--dim` `#5a6b66` → **`#7a8b85`** for body copy contexts. Keep `#5a6b66` as
  `--dim-faint` for decorative labels & large text only.
- Editorial `--com` `#6a737d` → **`#8b949e`** for code-comment / body-meta contexts; keep the
  original for purely decorative comments.
- All other theme tokens validated at ≥ 4.5:1.

### Design intent to preserve (anti-AI-slop)

Implementer must pin these or the personality dies on contact with Tailwind defaults:

**Motion (durations + easings):**
- Switcher trigger rotates **45° in 0.4s ease** on parent hover. On `(pointer: coarse)`:
  no rotation.
- Switcher menu reveal: **`opacity .18s ease`** + **`transform .22s cubic-bezier(.2,.8,.2,1)`**,
  from `translateY(-6px) scale(.97)` to `translateY(0) scale(1)`.
- ASCII MOIN: `text-shadow: 0 0 8px #7aff9c55, 0 0 20px #7aff9c22` — **static, no pulse.**
- `● ACTIVE`, `● NOW`, `● VERIFIED` dots: **static, no animation.**
- Optional opt-in: `document.startViewTransition` cross-fade on theme swap, gated on
  `prefers-reduced-motion: no-preference` and feature detection.

**Type pairings (pinned per theme):**
- **Terminal:** JetBrains Mono only. ASCII MOIN at 15px line-height 1.1; body 13–14px;
  headings 26px font-weight 500 letter-spacing -0.5.
- **Executive:** Source Serif 4 carries display (88–132px), running body (17–22px), and
  project names. *Italic Source Serif 4 in rust (`#c84a1a`) is the signature move* —
  `"with *care*"`, `"*Let's talk.*"`, `"@ *SuperAGI*"`. Inter for UI body, button labels, tag
  pills. JetBrains Mono for eyebrows (`01 / SELECTED WORK`), status indicators, table EXP.
  column.
- **Editorial:** Source Serif 4 for big "Moin / Bhokare." (140px) and per-page file headers
  (56px). **Amber `.` after "Bhokare" (`#f0b429`) is the signature.** Inter for body in
  pages. JetBrains Mono for IDE chrome (tabs, sidebar, status bar) and code blocks.

**Color hierarchy (one accent per theme, supporting palette explicit):**
- Terminal — accent `#7aff9c` (phosphor green). Cyan/amber/magenta are utility highlights
  only; never use them at scale.
- Executive — accent `#c84a1a` (rust). Used **sparingly**: italic words + bullet strokes +
  testimonial quote mark. The page reads black on cream otherwise.
- Editorial — accent `#f0b429` (amber). File headers, active tab indicator, status bar fill.
  `#79c0ff`/`#7ee787`/`#d2a8ff` are syntax tokens only — never as decoration.

**Micro-interactions (each is a personality move; missing them = AI slop):**
- Terminal input `caretColor: #7aff9c`.
- IDE tab `×` button: opacity `0` resting, `0.6` on tab hover, `1` on `×` hover; background
  `transparent → rgba(255,255,255,0.1)` on `×` hover.
- IDE sidebar file icon swaps `○ → ●` when active; left-border becomes 2px amber.
- Executive bullets: **`8×1px` rust line at `top:9`**, not a disc. Same in Editorial: 10×1px
  amber.
- Terminal `~/projects/foo`, `[ END OF TRANSMISSION ]` footer, blinking cursor block (static
  on reduced-motion).
- Editorial status bar (amber strip at bottom) updates "Ln 42, Col 8" and the file label
  live.

**Responsive personality preservation (mobile ≠ stripped-down):**
- Terminal: scanlines remain but `opacity: .2` below 768px (legibility). ASCII MOIN gets a
  64px JetBrains Mono fallback below 480px (raw ASCII becomes noise narrower than that).
- Executive: 4-col meta grid → 2×2 below 1024px, 1×4 below 640px. Display hero `132 →
  88 → 56 → clamp(40px, 12vw, 88px)`. Sticky nav → top app bar + burger on `<768px`.
- Editorial: sidebar collapses to a left-edge drawer (slide-in on tap) below 1024px; on
  `<640px`, becomes a `<details>` summary at the top of the page listing all files. Status
  bar stays. Tab strip horizontally scrolls.
- Switcher: stays top-left on all sizes, but the dropdown becomes a **bottom-sheet** on
  `(pointer: coarse)` and `max-width: 640px` so it doesn't overflow the viewport.

**First-view affordance for the switcher (P0):**
A 38×38 corner icon doesn't telegraph "three themes live here." Add **one** of these — choose
in Phase 1 and stick with it:
1. **Inline hint in each theme's hero** ("press `T` to switch themes" in terminal-prompt
   form / `01 / THEMES` chip in executive / `// themes available: 3` comment in IDE
   hero). Cheap, on-brand, decays gracefully.
2. **First-visit pulse** on the switcher trigger (3s amber glow, dismissed on first hover or
   on `localStorage.setItem('portfolio_seen', '1')`).
3. **One-time tooltip** ("Three themes — click to swap") that auto-dismisses.

Recommendation: **option 1**, because it's the only one that fits all three aesthetics
natively.

### Empty / error states (P1)

- `/cv.pdf` 404: link is `download` + `target="_blank"`; if the browser can't fetch, the
  CTA falls back to mailto:bhokaremoin@gmail.com with subject "Send me your CV".
- localStorage disabled / quota full: pre-paint script try/catch already swallows; provider
  also try/catch on writes. Visible behaviour: theme defaults to D1; switch still works in
  the current session but doesn't survive reload.
- Shell unknown command: handled by the prototype's `default:` branch (`command not
  found: …`).
- IDE `PAGES[id]` undefined: defensive fallback renders `<HeroPage />`. Add a one-line
  warning in dev only (`process.env.NODE_ENV === 'development'`).
- Reduced-motion: see the table above.

### Open Questions — updated

The original five questions remain, with these answers/refinements:
1. **Default theme:** pinned to `terminal` (D1). Moin can override pre-Phase-1 by changing
   `DEFAULT_THEME`.
2. **Testimonials / writing:** keep the `"placeholder · replace with real quote"` badge on
   both, exactly as the prototype renders it — it signals deliberate intent.
3. **Domain & hosting:** Vercel (`moin-portflio.vercel.app`) for v1; custom domain optional
   post-launch.
4. **GitHub stars on the three featured projects:** keep static values in `lib/portfolio-data.ts`;
   live API fetch is a future enhancement (not in scope).
5. **CV file:** Moin to drop `public/cv.pdf` before Phase 1 closes; placeholder PDF ships
   otherwise.

### Sources for this deepening

- `compound-engineering:review:architecture-strategist` — split ClientGate/Router, drop event
  channel, prefer useSyncExternalStore, cookie-SSR for LCP.
- `compound-engineering:review:performance-oracle` — font trim, cookie-SSR, buffer caps,
  Lighthouse risk analysis.
- `compound-engineering:review:julik-frontend-races-reviewer` — close()-bug,
  scrollIntoView-vs-useLayoutEffect, StrictMode listener cleanup, sync-dispatch unmount race.
- `compound-engineering:review:maintainability-reviewer` — drop tokens.ts, drop legacy event,
  collapse 30-file directory, fix data-asymmetry typing.
- `compound-engineering:review:code-simplicity-reviewer` — five concrete YAGNI cuts.
- `compound-engineering:review:kieran-typescript-reviewer` — `as const satisfies`, derived
  unions, discriminated tbExecute, PALETTES record, validated storage reads.
- `compound-engineering:document-review:coherence-reviewer` — default theme contradiction,
  lazy-loading contradiction, custom event ambiguity, Editorial/Code-IDE naming.
- `compound-engineering:document-review:design-lens-reviewer` — interaction-state gaps,
  mobile hand-waving, first-view affordance, AI-slop risk.
- `compound-engineering:document-review:feasibility-reviewer` — `ssr:false` client-only
  constraint, hydration contradiction, real phase budget.
- `compound-engineering:document-review:scope-guardian-reviewer` — final cut list.
- `compound-engineering:research:best-practices-researcher` — `@theme inline` pattern,
  next-themes script, View Transitions, hover-on-pointer-coarse trade-offs.
- `compound-engineering:research:framework-docs-researcher` — Next 16 metadata API,
  `next/font/google` options, `suppressHydrationWarning`, Tailwind 4 `@theme inline`.
- `compound-engineering:frontend-design` skill — motion specs, type pairings per theme,
  one-accent-per-theme hierarchy, micro-interaction inventory.
- WAI-ARIA APG (Tabs, Disclosure, Menu Button, Live Regions), WCAG 2.2 SC 1.4.13 / 1.4.3 /
  2.3.3 / 2.4.1.

---

## Problem Statement

Moin needs a public portfolio that:

- Functions as a credible artifact when shared with **recruiters, hiring committees, and VPs**
  (Executive theme), **fellow engineers and OSS readers** (Code IDE theme), and **for fun**
  (Terminal theme).
- Demonstrates **graphics intensity 9/10** with a "developer / coder" vibe — established in the
  brainstorm (chat1.md) and codified in the three variants.
- Showcases three specific projects (**GPTForVideo**, **DevUtility**, **Adaptive Traffic
  Signal**) and the BrowserStack / SuperAGI / IIIT Pune trajectory.
- Lets visitors actually **play** with the surface — the shell really executes commands; the
  IDE tabs really open and close.

Reality constraint: the design prototype is fixed-size (1400×2600) and uses `react@18.3` UMD
+ Babel-standalone with inline `style={{}}` everywhere. We need to recreate it pixel-faithfully
in a **production, responsive, accessible, SEO-ready** Next.js 16 build.

## Proposed Solution

A single `app/page.tsx` mounts a client-side `ThemedPortfolio` that selects one of three theme
components based on a React context. The active theme is persisted to localStorage and
rehydrated via a pre-paint inline script (next-themes pattern) to avoid FOUC and hydration
mismatch. The `ThemeSwitcher` lives **inside** each theme so it can pick up theme-specific
palette tokens.

Content is normalized into `lib/portfolio-data.ts` (single source of truth) and rendered by
each theme.

```
┌──────────────────────────────────────────────────────────────┐
│  app/layout.tsx — fonts, metadata, pre-paint theme script    │
│  app/page.tsx   — <ThemedPortfolio />                        │
│                                                              │
│     ┌──────────────────────────────────────────────────┐    │
│     │ ThemeProvider (Context + localStorage sync)      │    │
│     │   ↓                                              │    │
│     │ ThemedPortfolio                                  │    │
│     │   ├── <TerminalPortfolio />  (default)           │    │
│     │   ├── <ExecutivePortfolio />                     │    │
│     │   └── <EditorialPortfolio />                     │    │
│     │   Each theme renders its own <ThemeSwitcher />   │    │
│     └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Technical Approach

### Environment & Conventions

- **Next.js 16.2.6** App Router with React 19.2.4 + Tailwind 4 (PostCSS). Turbopack is the
  default in v16; no `--turbopack` flag needed in scripts. `middleware` → `proxy` rename is
  irrelevant (we ship no middleware). `experimental_ppr` not used.
- **TypeScript strict** (already enabled). All theme components and data modules typed.
- **Per AGENTS.md**: "This is NOT the Next.js you know." Implementer should consult
  `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` before adding any
  Next-specific feature (font loaders, `Image`, metadata API, etc.). No App Router
  routing-shape changes are needed (single-page site, optional `/cv` static asset).

### Architecture

#### 1. Directory layout (new files)

```
app/
  layout.tsx                  ← UPDATE: real metadata + fonts + pre-paint theme script
  page.tsx                    ← REWRITE: mounts <ThemedPortfolio />
  globals.css                 ← UPDATE: design tokens + global resets, drop boilerplate
  not-found.tsx               ← NEW (minimal, themed)
components/
  themed-portfolio.tsx        ← NEW: client; reads theme context → picks variant
  theme-provider.tsx          ← NEW: client; Context + localStorage sync + custom event
  theme-switcher.tsx          ← NEW: shared glassmorphic top-left switcher
  themes/
    terminal/
      index.tsx               ← NEW: <TerminalPortfolio />
      tokens.ts               ← NEW: TB palette + mono stack
      sections/
        hero.tsx
        about.tsx
        experience.tsx
        projects.tsx
        skills.tsx
        shell.tsx             ← NEW: <TerminalShell /> (interactive)
        certs.tsx
        contact.tsx
      shell/
        filesystem.ts         ← NEW: TB_FS map (about.md, skills.txt, projects.md, contact.json)
        commands.ts           ← NEW: tbExecute(input) → { lines | clear }
      ui/
        win-bar.tsx
        scanlines.tsx
        ascii-name.tsx
        prompt-line.tsx
        section-frame.tsx
    executive/
      index.tsx
      tokens.ts               ← EX palette + serif/sans/mono stacks
      sections/
        nav.tsx (sticky)
        hero.tsx
        metrics.tsx
        client-strip.tsx
        selected-work.tsx
        experience.tsx
        approach.tsx          ← dark band
        toolkit.tsx
        testimonials.tsx
        writing.tsx
        credentials.tsx
        contact.tsx (dark)
      ui/
        section-frame.tsx
        project-card.tsx
        experience-row.tsx
        writing-item.tsx
    editorial/
      index.tsx               ← IDE shell + tab state
      tokens.ts               ← EC palette + syntax colors
      file-registry.ts        ← FILES + PAGES map (single source of which pane is which)
      pages/
        hero.tsx
        about.tsx
        experience.tsx
        projects.tsx
        skills.tsx
        certs.tsx
        contact.tsx
      ui/
        ide-top-bar.tsx
        tab-strip.tsx
        sidebar.tsx
        status-bar.tsx
        code-block.tsx        ← syntax-highlighted snippet primitive
        file-header.tsx
lib/
  portfolio-data.ts           ← NEW: single source of truth (bio, experience, projects, skills, certs, contact)
  fonts.ts                    ← NEW: next/font/google instances (with subsets + variable bindings)
  use-theme.ts                ← NEW: typed Context hook
public/
  cv.pdf                      ← NEW: placeholder; user to provide real CV
  og.png                      ← NEW: open-graph card (generated via app/opengraph-image route)
  favicon.ico                 ← REPLACE
```

#### 2. Theme state machine

- Active theme is one of `'terminal' | 'executive' | 'editorial'`.
- **Persistence:** `localStorage['portfolio_theme']`. Cross-tab sync via `storage` event.
- **Pre-paint script** in `app/layout.tsx` (string `<script>` inside `<head>`) sets
  `document.documentElement.dataset.theme` from `localStorage` **before** hydration so the
  correct CSS variables are active on first paint:

  ```html
  <script dangerouslySetInnerHTML={{ __html: `
    try { var t = localStorage.getItem('portfolio_theme') || 'terminal';
          document.documentElement.dataset.theme = t; } catch (e) {}
  ` }} />
  ```

- The `ThemeProvider` (`'use client'`) uses `useSyncExternalStore` (primary, not fallback)
  with a `typeof document`-guarded `getSnapshot` that reads
  `document.documentElement.dataset.theme`; `getServerSnapshot` returns `DEFAULT_THEME`.
  See **D2** in *Deepen Plan* — the active theme is **cookie-driven and SSR'd**, not
  null-gated.
- `ThemedPortfolio` (a `'use client'` component) **statically imports the default theme**
  and **lazy-imports the other two** via `next/dynamic(() => import(...), { ssr: false })`,
  fetched on first switch and prefetched via `requestIdleCallback` after first paint. See
  **D3**.
- ~~Legacy `window.dispatchEvent('portfolio:theme')`~~ — **cut** (see **D4**). React Context is
  the only channel.

> **Origin: chat1.md.** The user explicitly asked for the switcher to be "top-left, behind an
> icon, menu appears on hover" — preserve that interaction. Add keyboard equivalents (focus
> opens the menu via `:focus-within`, `Enter` activates).

#### 3. Shared portfolio data

`lib/portfolio-data.ts` exports typed const objects so each theme just imports what it needs:

```ts
// lib/portfolio-data.ts (sketch)
export const profile = {
  name: 'Moin Bhokare',
  role: 'SDE @ BrowserStack',
  location: 'Pune, IN',
  education: "B.Tech, IIIT Pune '24",
  email: 'bhokaremoin@gmail.com',
  phone: '+91 8007704944',
  github: 'github.com/bhokaremoin',
  linkedin: 'linkedin.com/in/moinbhokare',
  leetcode: 'leetcode.com/moinbhokare7',
  cvPath: '/cv.pdf',
} as const;

export const experience = [/* … */] as const;
export const projects   = [/* GPTForVideo, DevUtility, Adaptive Traffic Signal */] as const;
export const skills     = {/* languages, frontend, backend, data, infra, fun */} as const;
export const certs      = [/* AWS, DevOps, LLMs */] as const;
export const writing    = [/* placeholder essays — flagged as placeholder */] as const;
```

The exact copy lives in the design source (`variants/*.jsx`). The plan is to **port the
prototype copy verbatim** for the first cut so the user can see the design come alive, then
iterate on wording.

#### 4. Fonts

Use `next/font/google` (Geist is already wired; we extend, not replace):

```ts
// lib/fonts.ts
import { JetBrains_Mono, Inter, Source_Serif_4, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
export const jetbrains   = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono',         display: 'swap', weight: ['400','500','600','700'] });
export const inter       = Inter({         subsets: ['latin'], variable: '--font-sans',         display: 'swap', weight: ['400','500','600','700'] });
export const sourceSerif = Source_Serif_4({subsets: ['latin'], variable: '--font-serif',        display: 'swap' });
export const ibmPlex     = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono-alt',     display: 'swap', weight: ['400','500','600'] });
export const spaceGrotesk= Space_Grotesk({ subsets: ['latin'], variable: '--font-display',      display: 'swap', weight: ['400','500','600','700','800'] });
```

Mount the `.variable` classes on `<html>` so every theme can `var(--font-mono)` etc. Drop the
remote `<link>` to Google Fonts that the prototype uses.

#### 5. Styling strategy

- **Tailwind 4** for layout primitives, spacing, responsive breakpoints, and one-off classes.
- **Per-theme CSS variables** declared in `globals.css` under `[data-theme="terminal"]`,
  `[data-theme="executive"]`, `[data-theme="editorial"]` selectors:

  ```css
  [data-theme="terminal"] {
    --bg: #05070a; --panel: #0b0f14; --ink: #c7d2cc; --dim: #5a6b66;
    --line: #1a2028; --accent: #7aff9c; --amber: #ffb454;
    --mag: #ff5d8f; --cyan: #7adfff;
  }
  ```

- For decorative effects with no Tailwind equivalent (scanline gradient, ASCII glow,
  glassmorphic switcher backdrop blur, IDE syntax colors), use either Tailwind 4 arbitrary
  values, `style` props, or small CSS module files. **Match the prototype's exact pixel
  values** — the user has signed off on them.
- The prototype's `style={{}}` blocks port 1:1 in a first pass; we refactor only when a
  visual delta vs. the prototype is at risk.

#### 6. Interactive shell (Terminal V1)

Port `variants/terminal-shell.jsx` to `components/themes/terminal/shell.tsx` + sibling
`commands.ts` + `filesystem.ts`. Key behaviors to preserve **exactly**:

- Initial system message: `"moin-shell v1.0 — type 'help' to begin"` and the tip line.
- Commands: `help, whoami, ls [-l|-la], cat <file>, experience, projects, skills, contact,
  socials, echo, date, neofetch, sudo, rm, vim/nvim/emacs, exit/quit, clear/cls`.
- History via `ArrowUp`/`ArrowDown`, capped at 50 entries.
- Auto-scroll the scrollback container on each new line; focus the input when the box is
  clicked.
- Color tokens map to the terminal palette CSS vars (not hard-coded — so the shell stays
  consistent if we ever tweak the palette).
- Accessibility: the scrollback is a `role="log"` with `aria-live="polite"`; the input is a
  real `<input>` inside a `<form onSubmit>`; the whole box has a visible focus ring.

#### 7. Interactive IDE (Editorial V3)

Port `variants/editorial.jsx`. Behaviors to preserve:

- `useState('hero.tsx')` for active file, `useState(['hero.tsx'])` for openTabs.
- `open(id)` sets active + appends to tabs (if not already open).
- `close(id)` removes from tabs; if the closed tab was active, activate its left-neighbor;
  if tabs go empty, reopen `hero.tsx`.
- Sidebar click and tab click both route to `open(id)`.
- `main` element gets `key={active}` so scroll position resets on swap (prototype does
  `mainRef.current.scrollTop = 0`).
- Status bar at the bottom (amber strip) shows the active file's label.
- Accessibility: tabs are `role="tab"`, the tab strip `role="tablist"`, the main pane
  `role="tabpanel" id="panel-{active}"` and tabs reference it via `aria-controls`. Sidebar
  is a `<nav>` with a labeled list; arrow-key navigation moves focus between files.

#### 8. Theme switcher

`components/theme-switcher.tsx` is a controlled component — it reads the active theme and
the per-theme `palette` from props (the **prototype passes palette per theme** so the
switcher visually integrates with each theme's chrome — preserve this). Behavior:

- 38×38 rounded-square trigger, top-left, `position: absolute` so it overlays each theme's
  hero — `top:14, left:14, z-index:50`.
- On hover **or** focus-within, the dropdown menu opens (preserves hover affordance but
  adds keyboard access).
- Each row: 18×18 swatch (split into two halves matching the theme's `[bg, accent]`),
  uppercase label, hint subtitle, optional `●` check on the active row.
- Click commits to localStorage + dispatches the legacy `portfolio:theme` event +
  updates context.

### Cross-theme content normalization (single source of truth)

The prototype duplicates copy across variants. We collapse it:

| Field            | Source in prototype                  | Notes                                              |
| ---------------- | ------------------------------------ | -------------------------------------------------- |
| Profile metadata | All three variants                   | Identical — extract once.                          |
| Experience rows  | terminal `TBExperienceRow`, executive `ExExperience`, editorial `ECExperience` | Identical 4 entries (BrowserStack / SuperAGI x2 / IIIT Pune); each theme renders the same data with its own component. |
| Projects         | All three                            | 3 projects: GPTForVideo, DevUtility, Adaptive Traffic Signal. Stars / kind / outcomes vary per theme — capture all fields on the data object; themes pick what they need. |
| Skills           | All three                            | Terminal uses 6 buckets; Editorial uses 4 with percentages; Executive uses 6 rows. Store the **superset** (categories + items + optional skill level) and let each theme project. |
| Certs            | All three                            | 3 certs (AWS, DevOps, LLMs). |
| Writing          | Executive only                       | 4 placeholder items — flag clearly as placeholder. |
| Testimonials     | Executive only                       | 2 placeholder quotes — flag clearly. |

### Responsive plan (the prototype is desktop-only)

The artboard is 1400px wide. The production build must work on:

- **≥1280px** — pixel-faithful to the prototype.
- **768–1279px** — collapse 3-col grids to 2-col, scale hero serif (132px → 88px), keep
  layout structure.
- **<768px (mobile)** — single-column everything, hide the executive sticky nav links into a
  burger, vertical exec metrics, IDE sidebar collapses to a top-of-screen file picker.

Breakpoints will use Tailwind's defaults (`sm:`, `md:`, `lg:`, `xl:`). Each section's
container width caps at `max-w-[1200px]` (executive) or `max-w-[1400px]` (terminal/editorial,
which use the full canvas).

### Implementation Phases

> **Revised phase budget (per *Deepen Plan* D7):** total ~6–7 days, not 4.5. Phase 1: 0.5–1d;
> Phase 2: 1.5d; Phase 3: 1d; Phase 4: 2–2.5d; Phase 5: 1–1.5d. The original per-phase
> estimates below are kept for reference but each section's exit criteria are the source of
> truth.

#### Phase 1 — Foundation (≈0.5–1 day)

- [ ] Replace boilerplate `app/page.tsx` and `app/layout.tsx`.
- [ ] Set real metadata: `title`, `description`, `openGraph`, `twitter`, canonical URL.
- [ ] Add fonts via `next/font/google` → `lib/fonts.ts`; mount `.variable` on `<html>`.
- [ ] Rewrite `app/globals.css`:
  - Tailwind 4 import
  - CSS reset (`html, body { margin: 0; padding: 0; }` from prototype)
  - `[data-theme="terminal" | "executive" | "editorial"]` token blocks
  - Drop the boilerplate `--background` / `--foreground` block from create-next-app
- [ ] Add the pre-paint theme script in `<head>`.
- [ ] Create `components/theme-provider.tsx` with `useTheme()` hook and storage sync.
- [ ] Create `components/theme-switcher.tsx` shared component (port of `theme-switcher.jsx`).
- [ ] Create `lib/portfolio-data.ts` with **all** content extracted from prototype variants.
- [ ] Create `components/themed-portfolio.tsx` skeleton (renders just a single theme stub for
      now).
- [ ] Verify `npm run dev` boots and the empty shell loads with correct fonts.

**Exit criteria:** Three theme buttons toggle a `data-theme` attribute on `<html>`, the
correct CSS variables resolve, `localStorage` persists across reloads, and there is no
hydration warning in dev console.

#### Phase 2 — Terminal Brutalist (V1) (≈1 day)

- [ ] `tokens.ts` palette + mono font binding.
- [ ] `ui/scanlines.tsx`, `ui/win-bar.tsx`, `ui/ascii-name.tsx`, `ui/prompt-line.tsx`,
      `ui/section-frame.tsx` (`TBSection` equivalent).
- [ ] Sections: `hero`, `about`, `experience` (4 rows), `projects` (3 cards), `skills`
      (6 blocks), `certs` (3 pills), `contact`.
- [ ] Status bar grid (uptime / commits / projects / coffee).
- [ ] `shell.tsx` + `shell/commands.ts` + `shell/filesystem.ts` — interactive shell with full
      command set + history + auto-scroll.
- [ ] Mount `<ThemeSwitcher active="terminal" palette={…} />` inside the page.
- [ ] Verify: scanlines render, ASCII MOIN block glows, shell accepts `help`, `cat about.md`,
      `clear` and persists history.

**Exit criteria:** Terminal theme matches `variants/terminal.jsx` + `variants/terminal-shell.jsx`
top-to-bottom at 1400px. Mobile fallback acceptable (sections stack).

#### Phase 3 — Executive (V2) (≈1 day)

- [ ] `tokens.ts` (rust accent #c84a1a + ink #0c0d0f).
- [ ] Sticky `nav.tsx` with brand mark, links, **Download CV** button.
- [ ] `hero.tsx` — 132px serif headline, "AVAILABLE FOR SELECT ENGAGEMENTS — Q2 2026" eyebrow,
      4-column meta grid, grid SVG pattern background.
- [ ] `metrics.tsx` — 4 metric tiles (years / repos / companies / OSS PRs).
- [ ] `client-strip.tsx` — institution wordmarks row.
- [ ] `selected-work.tsx` — 3 project case-study cards with typographic plate, OUTCOMES list,
      stack pills.
- [ ] `experience.tsx` — 4 rows w/ "● NOW" indicator.
- [ ] `approach.tsx` — dark band with 3 principle columns.
- [ ] `toolkit.tsx` — 6-row skills table.
- [ ] `testimonials.tsx` — 2 placeholder quote cards (flag in copy that they're placeholders
      per chat1.md instruction "placeholder · replace with real quote").
- [ ] `writing.tsx` — 4 writing items (placeholders per chat1.md "No, use realistic
      placeholders").
- [ ] `credentials.tsx` — 3 cert cards with "● VERIFIED" + year.
- [ ] `contact.tsx` — dark band, 88px headline "Have a problem worth shipping for? Let's
      talk.", contact rows, footer line `© 2026 MOIN BHOKARE · BUILT WITH CARE IN PUNE`.
- [ ] Mount `<ThemeSwitcher active="executive" palette={…} />`.

**Exit criteria:** Pixel-faithful to `variants/executive.jsx` at 1400px. **Apostrophe gotcha**
from chat1.md ("apostrophes inside single-quoted strings were swapped to double-quoted
strings") is moot in TSX — strings with apostrophes become `"Where I've shipped…"` template
literals or HTML entities; verify nothing breaks the build.

#### Phase 4 — Code IDE / Editorial (V3) (≈2–2.5 days)

- [ ] `tokens.ts` + GitHub-Dark-ish syntax color set (`key`, `str`, `fn`, `num`, `com`, `ok`,
      `amber`).
- [ ] `file-registry.ts` — `FILES` map (id → label/color/icon) and `PAGES` map (id →
      component).
- [ ] IDE chrome: `ide-top-bar.tsx` (traffic lights + `moin-bhokare — portfolio — <file>`),
      `tab-strip.tsx`, `sidebar.tsx` (explorer + timeline + status sections), `status-bar.tsx`
      (amber bottom strip).
- [ ] `ui/code-block.tsx` — line-numbered, multi-colored token renderer used in `hero.tsx`
      (profile.ts) and `contact.tsx` (contact.ts).
- [ ] Pages: `hero.tsx` (140px serif name + profile.ts code block + 4 stat tiles), `about.md`,
      `experience.json` (4 rows), `projects` (3 entries with language dot + meta), `skills.yml`
      (4 buckets w/ horizontal progress bars), `certifications.md`, `contact.ts` (code block).
- [ ] Tab/file state machine: `open(id)`, `close(id)` with neighbor-fallback logic; `main`
      uses `key={active}` to reset scroll.
- [ ] Keyboard navigation: arrow keys move focus across sidebar files, `Enter`/`Space` opens;
      `Ctrl+W` closes active tab.
- [ ] Mount `<ThemeSwitcher active="editorial" palette={…} />`.

**Exit criteria:** Pixel-faithful to `variants/editorial.jsx`. Clicking every sidebar file
swaps the main pane; clicking the × on every tab removes it; closing the last tab
auto-restores `hero.tsx`.

#### Phase 5 — Polish & Production (≈1–1.5 days)

- [ ] Responsive sweep at 1440 / 1024 / 768 / 390. Capture and fix the worst breaks.
- [ ] Accessibility pass:
  - all themes have a single `<h1>` (the hero name)
  - logical heading hierarchy
  - color contrast ≥ AA on every theme (terminal `#5a6b66` on `#05070a` is borderline; bump
    `dim` if needed for body copy only — leave it on labels)
  - keyboard reach: switcher dropdown, terminal input, IDE sidebar/tabs
  - reduced-motion: respect `prefers-reduced-motion: reduce` on switcher rotate and any
    pulsing dot
- [ ] SEO: `metadata` with title/description, `metadataBase`, OG image
      (`app/opengraph-image.tsx` route producing a dynamic OG with the executive hero), `robots.txt`,
      `sitemap.ts`.
- [ ] Performance:
  - Lazy-load the non-active themes via `next/dynamic({ ssr: false })`.
  - `font-display: swap` (already on `next/font`).
  - Audit Lighthouse; target ≥90 across the board.
- [ ] Real assets:
  - `public/cv.pdf` (user-supplied; ship placeholder PDF for now).
  - Favicon (replace boilerplate).
  - Optional: `public/og.png` fallback.
- [ ] Deploy to Vercel. Add custom domain if Moin has one.

## Alternative Approaches Considered

| Approach | Why rejected |
| --- | --- |
| **Three separate Next.js routes** (`/`, `/exec`, `/code`) for the three themes. | Loses the "swap live in one URL" delight the user explicitly designed for. Sharing a link should show whatever theme the visitor picks, not a different page. |
| **CSS-only theming** with three stylesheets toggled by `data-theme`. | The themes are not skins — they have **different DOM** (terminal has scanlines + ASCII; IDE has sidebar/tabs; executive has a sticky nav and serif typography). CSS-only would need maximum-common-divisor markup and lose the interactive shell + IDE behavior. |
| **Port the prototype JSX byte-for-byte** with `style={{}}` everywhere. | We do this for the first pass (Phases 2–4) — it's the fastest path to pixel parity. We **only** refactor when adding interaction, responsive breakpoints, or accessibility. |
| **next-themes library**. | Overkill — we control three discrete themes with bespoke chrome. Reusing its inline-script pattern is enough; the dep is not. |
| **Render all three theme bodies and hide via CSS.** | Bloats first paint and triples DOM. Single-theme render + lazy load on switch wins on performance. |

## System-Wide Impact

### Interaction graph

- Visitor clicks **theme switcher row** → `setTheme(id)` (Context) → triggers:
  1. `localStorage.setItem('portfolio_theme', id)`
  2. `document.cookie = 'portfolio_theme=…; path=/; max-age=31536000; SameSite=Lax'`
  3. `document.documentElement.dataset.theme = id` (so CSS-var tokens swap instantly even
     before React re-renders)
  4. React re-render: `<ThemedPortfolio>` swaps the active theme component (lazy-loaded on
     first switch per **D3**; subsequent switches are instant if `requestIdleCallback`
     prefetched the chunk)
  5. The previous theme component unmounts → effect cleanups remove `storage` listeners and
     cancel any pending `rAF` writes
  6. The newly-active theme mounts → its layout effects fire (shell scrollback to bottom,
     IDE main scroll to 0)
- Visitor types in terminal **shell** → `tbExecute(input)` returns either `{ clear: true }`
  (replaces history) or `{ lines: [...] }` (appends). After every commit, the scroll
  container's `scrollTop = scrollHeight` (existing pattern).
- Visitor clicks **sidebar file** in IDE → `open(id)` → `setActive(id)` + appends to
  `openTabs` if missing → `main` element re-keys, scroll resets to 0.

### Error & failure propagation

- **localStorage access disabled / private mode**: pre-paint script `try/catch` swallows;
  default theme is `terminal`. Provider also `try/catch`s the read.
- **Shell command not found**: returns `{ lines: [{ c: TB.mag, t: 'command not found: …' }] }`
  — already handled by `default:` branch.
- **IDE close-all-tabs**: handled by reopening `hero.tsx` (prototype behavior).
- **Hydration mismatch**: handled by cookie-driven SSR (**D2**). `app/page.tsx` (Server
  Component) reads `cookies().get('portfolio_theme')`, passes the value to the client root,
  which renders the matching theme. `<html data-theme={…} suppressHydrationWarning>` covers
  the rare cookie/localStorage drift where the pre-paint script corrects the attribute. No
  null placeholder, no FOUC.

### State lifecycle risks

- Theme persistence is the only persistent state. No partial-failure risk: the write is
  atomic and the read is wrapped in `try/catch`. No orphaned rows because there's no DB.
- The terminal shell holds `history`, `past`, `pi`, `input` state in component-local
  `useState`. **When the visitor switches themes mid-shell, the shell unmounts and history
  is lost** — explicit non-goal per scope.
- IDE tab state is similarly component-local. Switching themes drops it. If we want this to
  survive switches, hoist to a top-level store. Current scope: not needed.

### API surface parity

There is no public API. All "API surfaces" are user-facing affordances:

- ✅ Theme switcher: present in all three themes (with theme-tuned palette).
- ✅ Hero CTAs: present in all three (resume/CV download, view work, contact). Terminal uses
  `./resume.pdf` framing; Executive uses `Download CV ↓`; Editorial uses `→ Download CV`.
  All point to the same `/cv.pdf`.
- ✅ Contact info: same email/phone/github/linkedin in all three.
- ⚠️ Writing & testimonials: **only in Executive**. Document this asymmetry — the other
  themes intentionally don't include them per the prototype.

### Integration test scenarios (real-browser)

1. **Cold load → terminal default** → switch to executive → reload → executive still active.
2. **Cold load → switch to editorial** → click `experience.json` in sidebar → click × on
   `hero.tsx` tab → page swaps to `experience.json` and hero closes.
3. **Cold load → terminal** → click in shell → type `help` ↵ → `whoami` ↵ → `cat about.md` ↵
   → `clear` ↵ → scrollback wipes, prompt resets.
4. **Mobile viewport (390px)** → all three themes render without horizontal scroll; switcher
   menu doesn't overflow the viewport.
5. **`prefers-reduced-motion: reduce`** → switcher icon does not rotate on hover; scanline
   overlay is static.

## Acceptance Criteria

### Functional

- [ ] Single Next.js page at `/` renders the active theme; reload restores last choice.
- [ ] Theme switcher is anchored top-left across all themes; hover **or** keyboard focus
      reveals the menu; click selects.
- [ ] Terminal theme implements **every command** in the prototype (help / whoami / ls / cat /
      experience / projects / skills / contact / socials / echo / date / neofetch / sudo / rm /
      vim|nvim|emacs / exit|quit / clear|cls) with the prototype's exact strings and colors.
- [ ] Terminal shell supports `ArrowUp`/`ArrowDown` history (capped 50 entries).
- [ ] Executive theme renders all 7 sections in order: hero, metrics, client strip, selected
      work (3 projects), experience (4 rows), approach (dark band, 3 cols), toolkit (6-row
      table), testimonials (2), writing (4), credentials (3), contact (dark).
- [ ] Editorial theme renders the IDE chrome (top bar + tab strip + sidebar + status bar) and
      each of the 7 file pages is routable via sidebar **and** tab click.
- [ ] Closing all tabs auto-restores `hero.tsx`.
- [ ] All contact info / project details / experience facts are sourced from
      `lib/portfolio-data.ts` (not duplicated across themes).

### Non-functional

- [ ] Lighthouse desktop: Performance ≥ **92**, Accessibility ≥ 95, Best Practices ≥ 95,
      SEO ≥ 95.
- [ ] **LCP < 1.8s**, **CLS < 0.05**, **INP < 200ms** during theme switch.
- [ ] First Contentful Paint < 1.5s on 4G simulation.
- [ ] No hydration warnings in dev console on cold load **or** after switching themes.
- [ ] Body copy contrast ≥ WCAG 2.2 AA (4.5:1) on every theme — terminal `--dim` and
      editorial `--com` bumped per *Deepen Plan*.
- [ ] WCAG 2.2 SC 1.4.13 satisfied on the theme switcher (Dismissible by `Esc`, Hoverable,
      Persistent).
- [ ] Skip link present and reaches `<main id="main">` on every theme.
- [ ] Tab order is logical in every theme (skip-link → switcher → primary nav/CTA → main).
- [ ] Reduced-motion users see no switcher rotation, no pulsing dots, no scanline drift, no
      cursor blink.
- [ ] Terminal scrollback capped at 200 lines (FIFO drop); history `past` at 50; IDE
      `openTabs` at 8.

### Quality gates

- [ ] `npm run build` succeeds with zero TypeScript or ESLint errors.
- [ ] No `any` in the codebase (types for every theme prop, command output, data record).
- [ ] One pre-commit run of the production build passes locally.
- [ ] Manual smoke matrix passed on Chrome / Safari / Firefox, desktop + mobile.

## Success Metrics

This is a personal portfolio — the only KPIs that matter:

- **"Holy shit" reaction from the first 5 engineers who open it.** (Qualitative.)
- Lighthouse desktop **Performance ≥ 90**.
- Zero JavaScript errors in the console across all three themes, on cold load and after at
  least 3 theme switches.
- Recruiter/hiring-manager-friendly default: when a stranger hits `/` cold, they see the
  **terminal** theme (matches localStorage fallback). _Open question for Moin: should the
  default be Executive instead, since most cold visitors are recruiters?_ Resolve before
  Phase 1.

## Dependencies & Prerequisites

- **Already installed:** `next@16.2.6`, `react@19.2.4`, `react-dom@19.2.4`, `tailwindcss@4`,
  `@tailwindcss/postcss`, `typescript@5`, eslint stack.
- **To add:** none required for v1. Optional later: `clsx` for class composition (small, no
  runtime impact) — defer until we actually need it.
- **Assets needed from Moin:**
  - Real CV PDF (`public/cv.pdf`).
  - GitHub stars on each project (prototype has 42 / 38 / 67 — confirm or update).
  - Optional avatar / favicon source.
  - Sign-off on placeholder testimonials + writing items (or real replacements).
- **Tooling:** Node ≥ 20.9 (Next 16 minimum), TS ≥ 5.1.

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| **Hydration mismatch** from theme attribute read at runtime. | Med | Med | Pre-paint inline script sets `data-theme` before React hydrates; the `ThemedPortfolio` client gate ensures SSR HTML doesn't include theme-specific DOM. |
| **Apostrophes in copy** breaking JSX (per chat1.md gotcha). | Low | Low | Use double-quoted TSX strings or HTML entities (`&apos;`); CI catches if it slips. |
| **Fixed-width prototype** breaks below 1280px. | High | Med | Phase 5 responsive sweep with explicit breakpoint targets (1440/1024/768/390). |
| **Font flash** between fallback and JetBrains Mono / Source Serif. | Med | Low | `next/font` with `display: swap` and CSS `font-feature-settings`; mount variables on `<html>` so all themes share the same loaded set. |
| **Terminal shell input traps keyboard** (no exit affordance). | Low | Med | Pressing `Tab` should move focus out (don't `preventDefault` on Tab). Provide a visible "click outside to leave" hint or `Esc` to blur. |
| **IDE keyboard nav missing** — sidebar/tabs only respond to clicks. | High | Med | Phase 4 explicitly includes arrow-key + Enter handling for both sidebar list and tab strip. |
| **Placeholder testimonials look unfinished** to recruiters. | Med | High | Either render an explicit "placeholder · replace" badge (as the prototype does) **or** hide the testimonials section until real quotes arrive. Decision deferred to Moin before Phase 3. |
| **Theme switcher hover-only on touch devices.** | Med | Med | Tap-toggles open/close on touch (detect via `(pointer: coarse)` media query); keyboard focus still works. |
| **Long-running React state** in interactive shell leaks if the user spams commands. | Low | Low | History is `useState` only, capped at 50 commands in `past` (already implemented). Scrollback is unbounded — cap at e.g. 500 entries if it becomes a problem. |

## Open Questions for Moin

1. **Default theme on cold load:** Terminal (prototype default) or Executive (recruiter-safe)?
2. **Testimonials / writing**: ship as obvious placeholders, hide until real, or seed with
   real quotes/posts you'd send me?
3. **Domain & hosting**: Vercel default (`moin.vercel.app`) or do you have a custom domain to
   wire up?
4. **GitHub stars** on the three featured projects — keep the prototype's numbers (42/38/67)
   as approximations, or pull live via the GitHub API on the server?
5. **CV file**: drop the latest CV at `public/cv.pdf` before Phase 1 ends so the download
   button works end-to-end.

## Future Considerations

- **Blog / writing** as a real feature: today's "writing" entries are placeholders. Adding
  MDX-powered posts at `/writing/[slug]` (App Router file routes) is a natural follow-up;
  the Executive theme already has the visual slot.
- **Live GitHub stats**: pull the actual project star counts on the server, cache them with
  `next.fetch` revalidation. Adds reality to the project cards without per-deploy churn.
- **Analytics**: Vercel Analytics or Plausible — privacy-friendly, low-config.
- **Theme-specific OG images**: dynamically generate the OG card to match the active theme
  using `app/opengraph-image.tsx`. Stretch goal.

## Documentation Plan

- `README.md` (project root): replace the create-next-app boilerplate with:
  - One-paragraph "what this is" + screenshot grid (one per theme).
  - Local dev (`npm run dev`).
  - Architecture diagram (the ASCII tree from this plan).
  - "How to update content" (edit `lib/portfolio-data.ts`).
- `AGENTS.md`: leave the existing "This is NOT the Next.js you know" warning; add a section
  noting where each theme lives.
- Inline JSDoc only where intent is non-obvious (the theme persistence script, the
  command parser). Per repo guidance: no comments for things the code already names.

## Sources & References

### Internal references

- **Design source**: `/tmp/portfolio-design/test-claude-personal-portfolio/`
  - `README.md` — handoff bundle instructions
  - `chats/chat1.md` — full design conversation (8 user turns)
  - `project/Portfolio.html` — entry point composing the three variants + live shell
  - `project/variants/terminal.jsx` — V1 layout
  - `project/variants/terminal-shell.jsx` — V1 interactive shell
  - `project/variants/executive.jsx` — V2 layout
  - `project/variants/editorial.jsx` — V3 IDE layout + tab state machine
  - `project/variants/theme-switcher.jsx` — shared switcher

- **Project files inspected**:
  - `package.json` — `next@16.2.6`, `react@19.2.4`, Tailwind 4
  - `tsconfig.json` — strict, paths `@/*` rooted at repo
  - `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — current boilerplate to replace
  - `AGENTS.md` — "Read the relevant guide in `node_modules/next/dist/docs/`"

- **Next.js docs**:
  - `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — Turbopack default,
    Node ≥ 20.9, TS ≥ 5.1, `middleware` → `proxy`, `experimental_ppr` removed
  - `node_modules/next/dist/docs/01-app/02-guides/migrating/app-router-migration.md` — for
    reference if any pages-router patterns sneak in

### External references

- `next/font/google` font loaders (preinstalled with Next.js — no extra dep).
- Prototype tokens (palettes, fonts, spacing) are the **canonical source**; do not invent
  values.

### Related work

- N/A — fresh project.
