# Portfolio UI Revamp — Design

**Date:** 2026-07-13
**Status:** Approved (design), pending implementation plan
**Author:** Moin Bhokare (with Claude)

## Problem

The portfolio has three themes (`terminal`, `executive`, `editorial`/"Code IDE") and a
theme switcher, but each has UX problems:

1. **Theme switcher** — a 44×44 floating icon pinned `top-left` overlaps hero content and
   gives a first-time visitor no hint of what it does.
2. **Terminal theme** — presents as a terminal but is really a normal scrolling page of
   styled sections; the genuinely interactive shell is buried at the bottom (section 05).
3. **Code IDE theme** — has authentic VS Code chrome but each "file" renders formatted
   magazine prose, with no code and no preview pane. Doesn't match how VS Code actually
   works (editor shows source; markdown/preview lives in a side pane).
4. **Executive theme** — an editorial magazine layout that doesn't match the intended
   audience (recruiters/hiring managers).

**Goal:** revamp the full UI so the portfolio is impressive, cool, *and* sensible — each
theme committing fully to its metaphor.

## Decisions (from brainstorming)

| Question | Decision |
| --- | --- |
| Rollout | Revamp all four areas as one cohesive change. |
| Terminal | One live, full-screen terminal; all content reached by typing/clicking commands. |
| Code IDE | Split editor + live rendered preview (source left, preview right). |
| Executive | Recruiter/hiring **web résumé** (not a paper-sheet document). |
| Switcher | Labeled segmented control, top-right (`Terminal · Code · Executive`). |
| Terminal discovery | Clickable command chips **and** typing. |
| Content authenticity | Keep testimonials/writing/metrics sections as scaffolding; real data supplied later. |

## Guiding architecture

- **Keep** the theme provider (cookie + localStorage + pre-paint init script) and
  `lib/portfolio-data.ts` as the single content source. Every theme remains a pure *view*.
- **Refactor while revamping:** the three theme files are large monoliths
  (terminal ≈ 722 lines, editorial ≈ 1391, executive ≈ 1349). Split each into focused
  subcomponents (chrome, panels, renderers) inside its own folder. No behavior lost.
- **No heavy new dependencies.** Markdown/JSON/YAML rendering and syntax highlighting stay
  in-house, consistent with the existing `CodeBlock` tokenizer pattern.
- Preserve existing a11y: skip link, `prefers-reduced-motion`, ARIA roles.

## Component designs

### 1. Theme switcher (global)

- Replace the top-left floating icon with a **labeled segmented control pinned top-right**:
  `Terminal · Code · Executive`. Active segment is filled with the current theme accent.
- Per-theme skinning retained (adapts colors to the active theme).
- Semantics: `role="radiogroup"`, arrow-key navigation, `aria-checked` per segment.
- Responsive: collapses to compact labels on narrow viewports; respects safe-area insets.
- **Executive collision fix:** the executive sticky nav already has a "Download CV" button
  at top-right. Shift that nav's right-edge content left (add right padding / reflow) so the
  global switcher can sit above it with a higher `z-index` without overlap.

### 2. Terminal theme — one live terminal

- **Full viewport (100vh), no page scroll.** A single terminal window fills the screen;
  only the internal scrollback scrolls.
- **Chrome:** top bar with traffic-light dots + `moin@portfolio — zsh` title.
- **Boot sequence:** prints the ASCII `MOIN` banner, a one-line intro, and a hint, then
  shows a row of **clickable command chips** (`about`, `projects`, `experience`, `skills`,
  `contact`, `help`). Clicking runs the command; typing works identically.
- **All content is command-driven**, backed by `portfolio-data`:
  - `whoami`, `about`, `experience`, `skills`, `certs`, `contact`, `socials`
  - `projects` (list) and `open <project>` / `cat projects/<name>` (detail)
  - `resume` → triggers CV download
  - `theme <terminal|executive|editorial>` → switch theme
  - `clear`, `help`, plus existing easter eggs (`sudo`, `rm`, `vim`, `exit`, `neofetch`…)
  - Command output may include clickable links (email, GitHub, LinkedIn) styled as terminal text.
- **SEO / a11y:** because content lives behind commands, render the same content in a
  visually-hidden semantic region (`sr-only`) so crawlers and screen readers receive it all.
  The terminal log keeps `role="log"` + `aria-live="polite"`.
- **Mobile:** command chips make it usable without a keyboard; input auto-focuses on tap;
  font scales down.
- **Reuse:** extend the existing `shell.tsx`, `commands.ts`, `filesystem.ts` rather than
  rewriting. The terminal theme effectively *becomes* the shell full-screen.

### 3. Code (VS Code) theme — split editor + preview

- Keep VS Code chrome: title bar, tab strip, explorer sidebar, status bar.
- **Main area becomes a split view:** left = syntax-highlighted **source**, right = the
  **rendered preview** of the same file.
  - `about.md`, `certifications.md` → markdown source | rendered markdown
  - `experience.json`, `contact.json` → JSON source | rendered cards
  - `skills.yml` → YAML source | rendered proficiency bars
  - `projects/` → folder; each project is a file → source | rendered project card
  - A `README`/welcome tab serves as the landing view.
- **Preview toggle:** VS Code-style control to collapse to **code-only** or **preview-only**;
  default is split.
- **Source of truth:** raw source text is serialized from `portfolio-data` — one small
  serializer per file type (markdown, JSON, YAML).
- **Mobile:** explorer collapses to a toggle (hamburger/bottom control); the split becomes a
  `Code | Preview` tab switch.
- **Refactor:** break the 1391-line file into chrome (title/tabs/status), explorer, editor
  pane, preview renderers, and a file registry.

### 4. Executive theme — recruiter web résumé

- Recruiter-scannable **web résumé** (web-native layout, not a paper document). Sticky header
  with name/role/contact + Download CV.
- **Reordered for scanning:** header → summary → experience (tight, reverse-chron) → grouped
  skills → selected projects → education/certs → testimonials/writing → contact/footer.
- Tighten the magazine styling toward clarity and density; retain tasteful serif accents.
- **Testimonials / writing / metrics** remain as sections (scaffolding); placeholders marked
  subtly until real data is supplied.

## Cross-cutting concerns

- **Content parity:** all real content lives in `portfolio-data`; each theme presents a
  coherent subset. Invented sections stay as clearly-scaffolded placeholders.
- **Accessibility:** maintain skip link, reduced-motion handling, ARIA roles, keyboard nav
  across every theme.
- **Responsiveness:** each theme has an explicit mobile behavior (terminal chips; VS Code
  collapse-to-tabs; executive reflow).
- **No behavior regressions** in theme persistence (cookie/localStorage/pre-paint).

## Out of scope

- Real testimonial quotes, writing posts, and verified metrics (supplied later by the user).
- Backend/contact-form submission.
- Adding new themes beyond the existing three.

## Open items for the plan

- Exact command grammar and chip set for the terminal.
- Serializer format for each VS Code file type and the in-house markdown renderer scope.
- Résumé section order finalization and which executive sections stay above the fold.
- Subcomponent file breakdown per theme.
