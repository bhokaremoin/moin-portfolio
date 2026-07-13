# Portfolio UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the theme switcher and all three portfolio themes so each fully commits to its metaphor — a top-right labeled switcher, a full-screen command-driven terminal, a VS Code split editor+preview, and a recruiter web résumé.

**Architecture:** Keep the existing theme provider (cookie + localStorage + pre-paint script) and `lib/portfolio-data.ts` as the single content source; every theme is a pure view. Logic-heavy units (terminal command engine, VS Code source serializers, in-house markdown renderer, switcher behavior) are built test-first with a new Vitest harness. Large visual components are specified precisely and verified via `next build`, `eslint`, and manual dev-server checks. Monolithic theme files are split into focused subcomponents as they are rewritten.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5, Tailwind v4, Vitest + React Testing Library + jsdom (added in Phase 0).

## Global Constraints

- Next.js version is `16.2.6`; React `19.2.4`. Do not upgrade.
- Per `AGENTS.md`: before writing component code, consult the local docs in `node_modules/next/dist/docs/` — this Next version may differ from training data. Heed deprecation notices.
- No heavy new runtime dependencies. Markdown/JSON/YAML rendering and syntax highlighting stay in-house. New dependencies are limited to dev-only test tooling (Vitest, RTL, jsdom).
- All displayed content comes from `lib/portfolio-data.ts`. Do not hardcode profile content in components.
- Preserve theme persistence behavior: `data-theme` attribute, `portfolio_theme` cookie, `portfolio_theme` localStorage key, and the pre-paint `themeInitScript`.
- Preserve accessibility: `.skip-link`, `prefers-reduced-motion` handling, ARIA roles, keyboard navigation.
- Theme ids remain `terminal | executive | editorial` (internal). Switcher labels display `Terminal · Code · Executive`.
- Every commit message ends with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## File Structure

**New (test infra):**
- `vitest.config.ts` — Vitest config (jsdom, React).
- `vitest.setup.ts` — RTL matchers + cleanup.

**Switcher:**
- Modify `components/theme-switcher.tsx` — replace dropdown with segmented control.
- Modify `components/themes/executive/index.tsx` — nav right-edge reflow (collision fix).

**Terminal (`components/themes/terminal/`):**
- Modify `commands.ts` — extend command engine (new commands, exact return contract).
- Modify `filesystem.ts` — add project files / about / certs content.
- Modify `shell.tsx` — becomes the full-screen terminal (boot sequence, command chips).
- Rewrite `index.tsx` — thin full-screen wrapper + `sr-only` SEO region.
- Create `command-chips.tsx` — clickable quick-command row.
- Create `seo-content.tsx` — visually-hidden semantic content for crawlers/SR.

**Code / VS Code (`components/themes/editorial/`):**
- Create `serializers.ts` — `portfolio-data` → raw markdown/json/yaml strings.
- Create `markdown.tsx` — in-house markdown renderer.
- Create `file-registry.ts` — file id → { label, lang, source, preview }.
- Create `chrome.tsx` — title bar, tab strip, status bar.
- Create `explorer.tsx` — sidebar file tree.
- Create `editor-pane.tsx` — syntax-highlighted source view.
- Create `preview-pane.tsx` — rendered preview switch by file type.
- Rewrite `index.tsx` — layout orchestration + split/toggle + mobile.

**Executive (`components/themes/executive/`):**
- Split `index.tsx` into `nav.tsx`, `hero.tsx`, `sections.tsx` (resume sections), keeping `index.tsx` as orchestrator.

---

## Phase 0 — Test Harness

### Task 0.1: Add Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/__tests__/portfolio-data.test.ts`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Produces: `npm test` (single run) and `npm run test:watch` commands usable by all later tasks.

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D vitest@^3 @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```
Expected: packages added under `devDependencies`, no runtime deps changed.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
```

- [ ] **Step 4: Add scripts to `package.json`**

Add to the `"scripts"` block:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a smoke test**

`lib/__tests__/portfolio-data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { THEME_IDS, isThemeId, profile } from "@/lib/portfolio-data";

describe("portfolio-data", () => {
  it("exposes exactly three theme ids", () => {
    expect(THEME_IDS).toEqual(["terminal", "executive", "editorial"]);
  });
  it("validates theme ids", () => {
    expect(isThemeId("terminal")).toBe(true);
    expect(isThemeId("nope")).toBe(false);
  });
  it("has a profile name", () => {
    expect(profile.name).toBe("Moin Bhokare");
  });
});
```

- [ ] **Step 6: Run tests, verify pass**

Run: `npm test`
Expected: 3 passing tests.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts lib/__tests__/portfolio-data.test.ts
git commit -m "test: add vitest + react testing library harness

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase 1 — Theme Switcher

### Task 1.1: Segmented control switcher

**Files:**
- Modify: `components/theme-switcher.tsx` (full rewrite of the render + interaction)
- Test: `components/__tests__/theme-switcher.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` → `{ theme, setTheme }` from `components/theme-provider`; `PALETTES`, `THEME_IDS` from `lib/portfolio-data`.
- Produces: `<ThemeSwitcher />` rendering a `role="radiogroup"` with one `role="radio"` per theme, labeled `Terminal`, `Code`, `Executive`, pinned top-right.

- [ ] **Step 1: Write failing tests**

`components/__tests__/theme-switcher.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "@/components/theme-provider";

function renderSwitcher() {
  return render(
    <ThemeProvider initialTheme="terminal">
      <ThemeSwitcher />
    </ThemeProvider>,
  );
}

describe("ThemeSwitcher", () => {
  it("renders a radiogroup with three labeled segments", () => {
    renderSwitcher();
    const group = screen.getByRole("radiogroup", { name: /theme/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Terminal" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Code" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Executive" })).toBeInTheDocument();
  });

  it("marks the active theme as checked", () => {
    renderSwitcher();
    expect(screen.getByRole("radio", { name: "Terminal" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Code" })).not.toBeChecked();
  });

  it("switches theme on click and updates the DOM attribute", async () => {
    renderSwitcher();
    await userEvent.click(screen.getByRole("radio", { name: "Executive" }));
    expect(screen.getByRole("radio", { name: "Executive" })).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe("executive");
  });

  it("moves selection with arrow keys", async () => {
    renderSwitcher();
    const terminal = screen.getByRole("radio", { name: "Terminal" });
    terminal.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Code" })).toBeChecked();
  });
});
```

Note: `Code` label maps to theme id `editorial`; `Executive` → `executive`; `Terminal` → `terminal`. Use a display-label map, do not change `PALETTES` ids.

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test -- theme-switcher`
Expected: FAIL (radiogroup not found — current component renders a menu button).

- [ ] **Step 3: Rewrite `components/theme-switcher.tsx`**

Replace the entire component body with a segmented control. Requirements the tests pin:
- Wrapper `div` `role="radiogroup"` `aria-label="Theme"`, `position: fixed; top: 12px; right: 12px; z-index: 50`.
- Display-label map: `{ terminal: "Terminal", editorial: "Code", executive: "Executive" }`, iterate in the order `["terminal", "editorial", "executive"]`.
- Each segment: `<button role="radio" aria-checked={isActive} tabIndex={isActive ? 0 : -1}>`; click → `setTheme(id)`.
- Keyboard: `ArrowRight`/`ArrowDown` selects+focuses next id (wraps), `ArrowLeft`/`ArrowUp` previous (wraps). On selection call `setTheme`.
- Keep the existing per-theme `SKINS` colors; active segment background = `skin.btnActive`, active text = `skin.textActive`, container background = `skin.shell` with `1px solid skin.border`, `backdropFilter: blur(14px)`.
- Segment label font: `var(--font-mono)`, `fontSize: 12`, `letterSpacing: 1`, `textTransform: uppercase`, padding `7px 12px`.

Reference implementation:
```tsx
"use client";

import { useRef } from "react";
import { PALETTES, ThemeId } from "@/lib/portfolio-data";
import { useTheme } from "@/components/theme-provider";

const ORDER: readonly ThemeId[] = ["terminal", "editorial", "executive"];
const LABELS: Record<ThemeId, string> = {
  terminal: "Terminal",
  editorial: "Code",
  executive: "Executive",
};

interface SwitcherSkin {
  shell: string; border: string; text: string; textActive: string; btnActive: string;
}
const SKINS: Record<ThemeId, SwitcherSkin> = {
  terminal: { shell: "rgba(11,15,20,0.85)", border: "rgba(122,255,156,0.18)", text: "rgba(199,210,204,0.62)", textActive: "#7aff9c", btnActive: "rgba(122,255,156,0.14)" },
  executive: { shell: "rgba(255,255,255,0.92)", border: "rgba(229,227,221,1)", text: "rgba(60,64,70,0.7)", textActive: "#0c0d0f", btnActive: "rgba(12,13,15,0.08)" },
  editorial: { shell: "rgba(21,26,33,0.92)", border: "rgba(240,180,41,0.18)", text: "rgba(139,148,158,0.85)", textActive: "#f0b429", btnActive: "rgba(240,180,41,0.15)" },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const skin = SKINS[theme];
  const refs = useRef<Map<ThemeId, HTMLButtonElement>>(new Map());

  const move = (dir: 1 | -1, from: ThemeId) => {
    const i = ORDER.indexOf(from);
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setTheme(next);
    refs.current.get(next)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{
        position: "fixed", top: 12, right: 12, zIndex: 50,
        display: "flex", gap: 2, padding: 3, borderRadius: 12,
        background: skin.shell, border: `1px solid ${skin.border}`,
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {ORDER.map((id) => {
        const active = id === theme;
        return (
          <button
            key={id}
            ref={(el) => { if (el) refs.current.set(id, el); else refs.current.delete(id); }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            aria-label={LABELS[id]}
            title={PALETTES[id].hint}
            onClick={() => setTheme(id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1, id); }
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1, id); }
            }}
            style={{
              padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer",
              background: active ? skin.btnActive : "transparent",
              color: active ? skin.textActive : skin.text,
              fontFamily: "inherit", fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
              fontWeight: active ? 600 : 500, transition: "background .15s, color .15s",
            }}
          >
            {LABELS[id]}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- theme-switcher`
Expected: 4 passing tests.

- [ ] **Step 5: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/theme-switcher.tsx components/__tests__/theme-switcher.test.tsx
git commit -m "feat(switcher): labeled segmented control pinned top-right

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 1.2: Executive nav collision fix

**Files:**
- Modify: `components/themes/executive/index.tsx` (the `ExecutiveNav` header)

**Interfaces:**
- Consumes: none new. Produces: nav whose right edge does not sit under the fixed top-right switcher.

- [ ] **Step 1: Adjust nav layout**

In `ExecutiveNav`, add right padding to clear the switcher and prevent overlap. Change the header `padding` from `"22px 64px"` to `"22px 220px 22px 64px"` on viewports ≥ 900px (keep `22px 64px` below). Implement with a `@media`-free inline approach by wrapping the Download CV `<a>` group and giving the header `paddingRight: 200`. Simplest correct change: set header `style.paddingRight: 210` and keep left `64`.

Replace the header `padding` line:
```tsx
padding: "22px 64px",
```
with:
```tsx
padding: "22px 210px 22px 64px",
```

- [ ] **Step 2: Manual verify**

Run: `npm run dev`, open the executive theme, confirm the switcher (top-right) does not overlap the "Download CV" button at ≥ 1000px width and on a 375px mobile width the nav still reflows without clipping.
Expected: no overlap; nav readable.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/themes/executive/index.tsx
git commit -m "fix(executive): reserve nav right space for global switcher

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase 2 — Terminal: One Live Terminal

### Task 2.1: Extend the command engine

**Files:**
- Modify: `components/themes/terminal/filesystem.ts` (add `about.md`, `certs.txt`, per-project entries)
- Modify: `components/themes/terminal/commands.ts` (new commands + `open`, `resume`)
- Test: `components/themes/terminal/__tests__/commands.test.ts`

**Interfaces:**
- Consumes: `TB_FS` from `filesystem.ts`; `profile`, `experience`, `projects`, `certifications` from `lib/portfolio-data`.
- Produces: `tbExecute(raw: string): CommandResult` where
  `CommandResult = { kind: "lines"; lines: readonly TerminalLine[] } | { kind: "clear" } | { kind: "download"; href: string; lines: readonly TerminalLine[] }`.
  `TerminalLine = { color: TerminalColor; text: string; href?: string }` (add optional `href` for clickable output).

- [ ] **Step 1: Write failing tests**

`components/themes/terminal/__tests__/commands.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { tbExecute } from "@/components/themes/terminal/commands";

describe("tbExecute", () => {
  it("lists commands for help", () => {
    const r = tbExecute("help");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/projects/);
      expect(text).toMatch(/experience/);
      expect(text).toMatch(/theme/);
    }
  });

  it("returns a download result for resume", () => {
    const r = tbExecute("resume");
    expect(r.kind).toBe("download");
    if (r.kind === "download") expect(r.href).toBe("/cv.pdf");
  });

  it("lists projects with numbers", () => {
    const r = tbExecute("projects");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/GPTForVideo/);
    }
  });

  it("opens a project detail by name (case-insensitive)", () => {
    const r = tbExecute("open devutility");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      const text = r.lines.map((l) => l.text).join("\n");
      expect(text).toMatch(/DevUtility/);
      expect(text).toMatch(/TypeScript/);
    }
  });

  it("errors for unknown project", () => {
    const r = tbExecute("open nope");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      expect(r.lines[0].text).toMatch(/no such project/i);
    }
  });

  it("emits clickable contact links", () => {
    const r = tbExecute("contact");
    expect(r.kind).toBe("lines");
    if (r.kind === "lines") {
      expect(r.lines.some((l) => l.href?.startsWith("mailto:"))).toBe(true);
    }
  });

  it("clears", () => {
    expect(tbExecute("clear").kind).toBe("clear");
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test -- commands`
Expected: FAIL (`resume`/`open` unknown; no `href`; no `download` kind).

- [ ] **Step 3: Extend `filesystem.ts`**

Add `about.md` (2–3 lines from `profile.tagline` + role), `certs.txt` (one line per `certifications` title), and keep existing keys. Import `certifications`, `profile` from `@/lib/portfolio-data` and build strings. Keep the existing `projects.md`/`skills.txt`/`contact.json`/`about.md` shape. Example additions:
```ts
import { certifications, profile } from "@/lib/portfolio-data";
// ...existing TB_FS entries...
"certs.txt": certifications.map((c) => `✓ ${c.title} — ${c.issuer} (${c.year})`).join("\n"),
```
(If `about.md` already exists in `TB_FS`, leave it; otherwise add a short one derived from `profile`.)

- [ ] **Step 4: Extend `commands.ts`**

- Add `href?: string` to `TerminalLine`.
- Add the `download` variant to `CommandResult`.
- Add a `link(text, href, color)` helper returning a `TerminalLine` with `href`.
- Add cases:
  - `resume` / `cv` → `{ kind: "download", href: profile.cvPath, lines: [accent("→ downloading resume.pdf…")] }`.
  - `projects` → numbered list from `projects` (`01 GPTForVideo — AI · TOOLING`), plus hint `open <name>`.
  - `open <name>` → find `projects` by case-insensitive name match; print name, kind, longDesc (wrapped), stack, and outcomes; else `mag("open: no such project '<name>'")`.
  - `about` → print `TB_FS["about.md"]`.
  - `certs` → print `TB_FS["certs.txt"]`.
  - `contact` → use `link()` for `mailto:` and `https://` entries.
- Update the `help` text to include `about`, `certs`, `projects`, `open <name>`, `resume`.
- Import `projects`, `profile` from `@/lib/portfolio-data`.

- [ ] **Step 5: Run tests, verify pass**

Run: `npm test -- commands`
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add components/themes/terminal/commands.ts components/themes/terminal/filesystem.ts components/themes/terminal/__tests__/commands.test.ts
git commit -m "feat(terminal): extend command engine (open, resume, links, about, certs)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 2.2: Command chips component

**Files:**
- Create: `components/themes/terminal/command-chips.tsx`
- Test: `components/themes/terminal/__tests__/command-chips.test.tsx`

**Interfaces:**
- Produces: `<CommandChips onRun={(cmd: string) => void} />` rendering one button per quick command; click calls `onRun(command)`.

- [ ] **Step 1: Write failing test**

`components/themes/terminal/__tests__/command-chips.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandChips } from "@/components/themes/terminal/command-chips";

describe("CommandChips", () => {
  it("renders quick commands and fires onRun with the command", async () => {
    const onRun = vi.fn();
    render(<CommandChips onRun={onRun} />);
    await userEvent.click(screen.getByRole("button", { name: "projects" }));
    expect(onRun).toHaveBeenCalledWith("projects");
  });

  it("includes core quick commands", () => {
    render(<CommandChips onRun={() => {}} />);
    ["about", "projects", "experience", "skills", "contact", "help"].forEach((c) => {
      expect(screen.getByRole("button", { name: c })).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- command-chips`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `command-chips.tsx`**

```tsx
"use client";

const CHIPS = ["about", "projects", "experience", "skills", "contact", "help"] as const;

export function CommandChips({ onRun }: { onRun: (cmd: string) => void }) {
  return (
    <div
      aria-label="Quick commands"
      style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "10px 18px" }}
    >
      {CHIPS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onRun(c)}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)",
            background: "rgba(122,255,156,0.06)", border: "1px solid var(--line)",
            borderRadius: 6, padding: "4px 10px", cursor: "pointer",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- command-chips`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/themes/terminal/command-chips.tsx components/themes/terminal/__tests__/command-chips.test.tsx
git commit -m "feat(terminal): clickable command chips

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 2.3: Full-screen shell + boot sequence + wiring

**Files:**
- Modify: `components/themes/terminal/shell.tsx` (full-screen, boot banner, chips, download handling, run-from-chip)
- Test: `components/themes/terminal/__tests__/shell.test.tsx`

**Interfaces:**
- Consumes: `tbExecute`, `CommandResult`, `COLOR_VAR` from `commands.ts`; `CommandChips` from `command-chips.tsx`; `useTheme` for `theme <id>`.
- Produces: `<TerminalShell />` that fills its container, runs commands from both typed input and chips, renders clickable `href` lines as anchors, and triggers a download link on `download` results.

- [ ] **Step 1: Write failing test**

`components/themes/terminal/__tests__/shell.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalShell } from "@/components/themes/terminal/shell";
import { ThemeProvider } from "@/components/theme-provider";

function renderShell() {
  return render(
    <ThemeProvider initialTheme="terminal">
      <TerminalShell />
    </ThemeProvider>,
  );
}

describe("TerminalShell", () => {
  it("runs a command from a chip and shows output", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "projects" }));
    expect(await screen.findByText(/GPTForVideo/)).toBeInTheDocument();
  });

  it("runs a typed command", async () => {
    renderShell();
    const input = screen.getByLabelText(/type a command/i);
    await userEvent.type(input, "whoami{enter}");
    expect(await screen.findByText(/BrowserStack/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- shell`
Expected: FAIL (chips not present in current shell; `whoami` output assertion may pass only after wiring).

- [ ] **Step 3: Update `shell.tsx`**

Changes:
- Extract a `run(raw: string)` callback shared by the form submit and `CommandChips.onRun`. It appends the `cmd` echo line and handles the three `CommandResult` kinds: `lines` (append), `clear` (reset), `download` (append lines, then programmatically click a hidden `<a download href>` or `window.location.assign(href)`).
- Keep the existing `theme <id>` handling (via `useTheme().setTheme`).
- Render `href` lines as `<a href target rel>` styled as terminal text (cyan/amber), non-href lines as today.
- Boot `INTRO` becomes a multi-line banner: ASCII `MOIN` (import the `ASCII_MOIN` constant — move it from `index.tsx` into a shared `ascii.ts` or duplicate as a local const), one-line intro from `profile.role`, and the hint `type 'help' or tap a command below`.
- Render `<CommandChips onRun={run} />` directly beneath the input.
- Container fills height: root `style={{ display: "flex", flexDirection: "column", height: "100%" }}`; scrollback region `flex: 1; minHeight: 0; overflow: auto`.
- Keep history up/down arrow recall and `MAX_SCROLLBACK` trimming.

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- shell`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/themes/terminal/shell.tsx components/themes/terminal/__tests__/shell.test.tsx components/themes/terminal/ascii.ts
git commit -m "feat(terminal): full-screen shell with boot banner, chips, downloads

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 2.4: SEO/a11y hidden content + full-screen wrapper

**Files:**
- Create: `components/themes/terminal/seo-content.tsx`
- Rewrite: `components/themes/terminal/index.tsx`

**Interfaces:**
- Consumes: `TerminalShell`, `SeoContent`. Produces: `<TerminalPortfolio />` — a 100vh, non-scrolling terminal window wrapping the shell, plus an `sr-only` semantic content region.

- [ ] **Step 1: Implement `seo-content.tsx`**

A visually-hidden (`className="sr-only"`) `<section>` rendering real content from `portfolio-data` as semantic HTML: `<h1>` name/role, about paragraph, `<ul>` of experience (role @ company, dates, bullets), projects (name + longDesc + stack), skills, certifications, contact links. This is for crawlers/screen readers only. Pull everything from `profile`, `experience`, `projects`, `skills`, `certifications`.

```tsx
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
```

- [ ] **Step 2: Rewrite `index.tsx`**

```tsx
"use client";

import { TerminalShell } from "./shell";
import { SeoContent } from "./seo-content";

export default function TerminalPortfolio() {
  return (
    <div
      style={{
        height: "100vh", overflow: "hidden", background: "var(--bg)",
        color: "var(--ink)", fontFamily: "var(--font-mono)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
          borderBottom: "1px solid var(--line)", background: "#0a0d12",
          color: "var(--dim)", fontSize: 12, flexShrink: 0,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ff5f56" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ffbd2e" }} aria-hidden />
        <span style={{ width: 10, height: 10, borderRadius: 10, background: "#27c93f" }} aria-hidden />
        <span style={{ marginLeft: 14, color: "var(--ink)" }}>moin@portfolio: ~ — zsh</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TerminalShell />
      </div>
      <SeoContent />
    </div>
  );
}
```

- [ ] **Step 3: Manual verify**

Run `npm run dev`. Terminal theme fills the viewport, the page itself does not scroll (only the scrollback does), chips run commands, `resume` downloads `/cv.pdf`, `theme executive` switches. Inspect DOM: `.sr-only` section present with full content.
Expected: all behaviors work; no page scrollbar.

- [ ] **Step 4: Verify build + lint + tests**

Run: `npm run lint && npm test && npm run build`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add components/themes/terminal/index.tsx components/themes/terminal/seo-content.tsx
git commit -m "feat(terminal): full-screen terminal wrapper + SEO/a11y content region

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase 3 — Code (VS Code): Split Editor + Preview

### Task 3.1: Source serializers

**Files:**
- Create: `components/themes/editorial/serializers.ts`
- Test: `components/themes/editorial/__tests__/serializers.test.ts`

**Interfaces:**
- Consumes: `profile`, `experience`, `projects`, `skills`, `certifications` from `lib/portfolio-data`.
- Produces:
  - `aboutMarkdown(): string`
  - `experienceJson(): string`
  - `skillsYaml(): string`
  - `certificationsMarkdown(): string`
  - `contactJson(): string`
  - `projectMarkdown(name: string): string`

- [ ] **Step 1: Write failing tests**

`components/themes/editorial/__tests__/serializers.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  aboutMarkdown, experienceJson, skillsYaml, certificationsMarkdown, contactJson, projectMarkdown,
} from "@/components/themes/editorial/serializers";

describe("serializers", () => {
  it("about is markdown with a heading", () => {
    expect(aboutMarkdown()).toMatch(/^# /m);
  });
  it("experience is valid JSON with company keys", () => {
    const parsed = JSON.parse(experienceJson());
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty("company");
  });
  it("skills yaml has a known bucket label", () => {
    expect(skillsYaml()).toMatch(/languages:/i);
  });
  it("contact is valid JSON with email", () => {
    expect(JSON.parse(contactJson())).toHaveProperty("email");
  });
  it("project markdown includes the project name", () => {
    expect(projectMarkdown("GPTForVideo")).toMatch(/GPTForVideo/);
  });
});
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm test -- serializers`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `serializers.ts`**

Each function returns a string derived from `portfolio-data`. Requirements:
- `aboutMarkdown()`: `# About\n\n` + tagline + a paragraph per the about copy; use `##` subheadings for "Now" facts.
- `experienceJson()`: `JSON.stringify(experience, null, 2)`.
- `skillsYaml()`: emit `label:` blocks with `- name` items (lowercase labels).
- `certificationsMarkdown()`: `# Certifications` + `- **title** — issuer (year)` list.
- `contactJson()`: `JSON.stringify({ email, phone, github, linkedin, leetcode }, null, 2)` from `profile`.
- `projectMarkdown(name)`: `# <name>` + kind/year + longDesc + `## Outcomes` list + `## Stack` list; throw-safe (return `# Not found` if no match).

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- serializers`
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add components/themes/editorial/serializers.ts components/themes/editorial/__tests__/serializers.test.ts
git commit -m "feat(code): portfolio-data source serializers

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 3.2: In-house markdown renderer

**Files:**
- Create: `components/themes/editorial/markdown.tsx`
- Test: `components/themes/editorial/__tests__/markdown.test.tsx`

**Interfaces:**
- Produces: `<Markdown source={string} />` rendering `#`/`##` headings, paragraphs, `-` bullet lists, and `**bold**` inline.

- [ ] **Step 1: Write failing test**

`components/themes/editorial/__tests__/markdown.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "@/components/themes/editorial/markdown";

describe("Markdown", () => {
  it("renders headings and lists", () => {
    render(<Markdown source={"# Title\n\nHello world\n\n- one\n- two"} />);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("renders bold inline", () => {
    render(<Markdown source={"a **b** c"} />);
    expect(screen.getByText("b").tagName).toBe("STRONG");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- markdown`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `markdown.tsx`**

A minimal line-based renderer (no external lib): split on `\n`, group consecutive `- ` lines into `<ul><li>`, `# ` → `<h1>`, `## ` → `<h2>`, blank line separates paragraphs, everything else → `<p>`. Inline pass replaces `**x**` with `<strong>x</strong>` (split on `**`, alternate). Style with theme vars (`--ink`, `--dim`, serif headings, sans body). Keep it under ~80 lines.

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- markdown`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/themes/editorial/markdown.tsx components/themes/editorial/__tests__/markdown.test.tsx
git commit -m "feat(code): minimal in-house markdown renderer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 3.3: File registry

**Files:**
- Create: `components/themes/editorial/file-registry.ts`
- Test: `components/themes/editorial/__tests__/file-registry.test.ts`

**Interfaces:**
- Consumes: serializers from Task 3.1.
- Produces:
  - `type FileId` (string union)
  - `FILE_ORDER: readonly FileId[]`
  - `getFile(id: FileId): { id: FileId; label: string; lang: "markdown" | "json" | "yaml"; source: string; preview: "markdown" | "json" | "skills" | "project" | "readme" }`

- [ ] **Step 1: Write failing test**

`components/themes/editorial/__tests__/file-registry.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { FILE_ORDER, getFile } from "@/components/themes/editorial/file-registry";

describe("file-registry", () => {
  it("has a stable ordered set of files", () => {
    expect(FILE_ORDER).toContain("about.md");
    expect(FILE_ORDER).toContain("experience.json");
  });
  it("returns source text and metadata for a file", () => {
    const f = getFile("about.md");
    expect(f.lang).toBe("markdown");
    expect(f.source.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- file-registry`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `file-registry.ts`**

Define `FileId` = `"README.md" | "about.md" | "experience.json" | "skills.yml" | "certifications.md" | "contact.json"` plus one id per project (`projects/<slug>.md`). `FILE_ORDER` lists README first, then the fixed files, then project files. `getFile` maps each id to label/lang/source (via serializers)/preview kind. README preview kind = `readme` (a welcome view). Project ids resolve `projectMarkdown(name)`.

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- file-registry`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/themes/editorial/file-registry.ts components/themes/editorial/__tests__/file-registry.test.ts
git commit -m "feat(code): file registry mapping ids to source + preview kind

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 3.4: Editor pane, preview pane, chrome, explorer

**Files:**
- Create: `components/themes/editorial/editor-pane.tsx`
- Create: `components/themes/editorial/preview-pane.tsx`
- Create: `components/themes/editorial/chrome.tsx`
- Create: `components/themes/editorial/explorer.tsx`

**Interfaces:**
- `<EditorPane source={string} lang={string} />` — line-numbered, syntax-tinted source (reuse the existing `CodeBlock` tokenizing approach for JSON/TS coloring; markdown/yaml shown mono with comment-dim punctuation).
- `<PreviewPane file={ReturnType<typeof getFile>} onOpen={(id: FileId) => void} />` — switches on `file.preview`: `markdown`→`<Markdown>`, `json`→rendered card list, `skills`→proficiency bars (reuse existing `SkillsPage` visuals), `project`→project card, `readme`→welcome/hero with quick links.
- `<Chrome ... />` — title bar + tab strip + status bar (extract current JSX).
- `<Explorer ... />` — sidebar file tree (extract current JSX; iterate `FILE_ORDER`).

- [ ] **Step 1: Implement the four components**

Extract chrome/explorer JSX from the current `index.tsx` into `chrome.tsx` and `explorer.tsx` with props (`active`, `openTabs`, `onOpen`, `onClose`, `onSelect`, keyboard handlers). Build `editor-pane.tsx` reusing the current `CodeBlock` renderer for line numbers + tokens. Build `preview-pane.tsx` that renders per `file.preview` using `Markdown` (Task 3.2) and the existing page visuals (skills bars, project cards) adapted to take a single file.

- [ ] **Step 2: Manual verify (integration deferred to 3.5)**

Run: `npm run lint && npm run build`
Expected: compiles (components not yet wired into `index.tsx`).

- [ ] **Step 3: Commit**

```bash
git add components/themes/editorial/editor-pane.tsx components/themes/editorial/preview-pane.tsx components/themes/editorial/chrome.tsx components/themes/editorial/explorer.tsx
git commit -m "feat(code): editor pane, preview pane, chrome, explorer components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 3.5: Wire split layout + preview toggle + mobile

**Files:**
- Rewrite: `components/themes/editorial/index.tsx`

**Interfaces:**
- Consumes: `Chrome`, `Explorer`, `EditorPane`, `PreviewPane`, `getFile`, `FILE_ORDER`.
- Produces: `<EditorialPortfolio />` with a split (`Code | Preview`), a view toggle (`split | code | preview`), tab management, and mobile collapse.

- [ ] **Step 1: Rewrite `index.tsx`**

Layout: `Chrome` (top), then a row with `Explorer` (left, 220px) and a main area. Main area shows `EditorPane` and `PreviewPane` side-by-side when `view === "split"`, or one when `code`/`preview`. Add a toggle control in the chrome/tab strip area (three buttons or a segmented `⟨⟩ | ⊟ | ◱`). State: `active: FileId`, `openTabs: FileId[]`, `view: "split" | "code" | "preview"`. Reuse existing tab open/close/keyboard logic.

Mobile (`@media` via a `matchMedia` hook or CSS class): below 820px, explorer becomes a toggle drawer and `view` is forced to a `Code | Preview` tab switch (hide split).

- [ ] **Step 2: Manual verify**

Run `npm run dev`, open the Code theme:
- Sidebar lists README + files + projects; clicking opens a tab.
- Split shows source left, rendered preview right.
- Toggle collapses to code-only / preview-only.
- `about.md` preview renders markdown; `experience.json` shows JSON source + card preview.
- At 375px width: explorer collapses, Code/Preview tab switch works.
Expected: all behaviors correct; no console errors.

- [ ] **Step 3: Verify build + lint + tests**

Run: `npm run lint && npm test && npm run build`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add components/themes/editorial/index.tsx
git commit -m "feat(code): split editor+preview layout with toggle and mobile collapse

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase 4 — Executive: Recruiter Web Résumé

### Task 4.1: Restructure executive into résumé sections

**Files:**
- Create: `components/themes/executive/nav.tsx` (extract `ExecutiveNav`)
- Create: `components/themes/executive/hero.tsx` (résumé header block)
- Create: `components/themes/executive/sections.tsx` (summary, experience, skills, projects, education/certs, testimonials/writing, contact)
- Rewrite: `components/themes/executive/index.tsx` (orchestrator, new order)

**Interfaces:**
- Consumes: all `portfolio-data` exports. Produces: `<ExecutivePortfolio />` reordered for recruiter scanning.

- [ ] **Step 1: Extract nav + hero**

Move `ExecutiveNav` into `nav.tsx` (keep the Task 1.2 padding fix). Create `hero.tsx` as a tighter résumé header: name, role, one-line summary, location/contact inline, Download CV. Reduce the 132px display type to a scannable ~64–80px and surface email/phone/location near the top.

- [ ] **Step 2: Build résumé sections in order**

In `sections.tsx`, implement, in this order: `Summary` (2–3 lines), `Experience` (tight reverse-chron rows: role @ company, dates, bullets, tech tags), `Skills` (grouped from `skills`), `Selected Projects` (compact cards from `projects`), `Education & Certifications`, then keep `Testimonials` and `Writing` as clearly-scaffolded sections (subtle "sample" marker where `placeholder`), then `Contact`. Denser spacing than the current magazine layout; retain serif accents for headings only.

- [ ] **Step 3: Rewrite `index.tsx`**

Compose `<Nav /> <Hero /> <Sections />`. Remove the oversized hero grid, client strip grandiosity, and 88px section headers in favor of recruiter-scannable density. Keep the dark contact footer.

- [ ] **Step 4: Manual verify**

Run `npm run dev`, open Executive:
- Above the fold: name, role, summary, contact, Download CV — no overlap with switcher.
- Sections scan top-to-bottom as a résumé; placeholder testimonials/writing visibly marked.
- 375px width reflows cleanly.
Expected: reads like a recruiter résumé.

- [ ] **Step 5: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: green.

- [ ] **Step 6: Commit**

```bash
git add components/themes/executive/
git commit -m "feat(executive): restructure into recruiter web résumé

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase 5 — Final QA

### Task 5.1: Cross-theme verification

**Files:** none (verification only).

- [ ] **Step 1: Full check**

Run: `npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 2: Manual cross-theme QA**

Run `npm run dev` and verify:
- Switcher (top-right) toggles all three themes; active segment reflects state; arrow keys work.
- Refresh persists the last theme (cookie/localStorage); no flash of wrong theme (pre-paint script).
- Terminal: full-screen, no page scroll, chips + typing + `resume` download + `theme` command.
- Code: split editor+preview, toggle, mobile collapse.
- Executive: recruiter résumé, no switcher/CV overlap.
- Skip link works; `prefers-reduced-motion` respected.
Expected: all pass.

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: cross-theme QA fixes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

**Spec coverage:** switcher (T1.1/1.2), terminal one-live-terminal + chips + SEO (T2.1–2.4), VS Code split editor+preview + mobile (T3.1–3.5), executive recruiter résumé (T4.1), content-as-scaffolding preserved (T4.1 Step 2 placeholder markers), refactors folded into each rewrite. Cross-cutting a11y/persistence verified in T5.1.

**Deviation from strict TDD:** logic units (command engine, serializers, markdown renderer, file registry, switcher, chips, shell) are test-first with real assertions. Pure-visual components (editor/preview/chrome/explorer JSX, executive sections) are specified precisely and verified via build/lint/manual dev-server checks, because assertion-on-layout tests would be low-value placeholders. This is an intentional, called-out choice.

**Open items to resolve during execution:** exact markdown renderer scope (kept minimal — headings/paragraphs/lists/bold only); confirm `about.md` isn't already in `TB_FS` before adding.
