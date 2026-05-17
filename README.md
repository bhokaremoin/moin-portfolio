# moin-portfolio

Personal developer portfolio for **Moin Bhokare** (SDE @ BrowserStack). One page, three swappable themes the visitor can toggle live from the corner icon:

- **Terminal Brutalist** — phosphor on black, ASCII name, scanlines, and a real interactive shell.
- **Executive** — light editorial-magazine layout, serif display, rust accent, sticky exec nav, case-study cards.
- **Code IDE** — dark IDE chrome with a clickable file explorer + tab strip that swaps the main pane.

Active theme is persisted to a cookie (for SSR) **and** localStorage (for the pre-paint inline script), so first paint is FOUC-free.

Design source: Claude Design handoff bundle. Plan: [`docs/plans/2026-05-17-001-feat-portfolio-website-multi-theme-plan.md`](docs/plans/2026-05-17-001-feat-portfolio-website-multi-theme-plan.md).

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind 4 (`@theme inline` + `[data-theme]` palette blocks)
- TypeScript strict
- `next/font/google` (self-hosted JetBrains Mono, Source Serif 4, Inter)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Switch themes via the corner icon, or — in the Terminal theme — type `theme executive` / `theme editorial` into the shell.

```bash
npm run build   # production build
npm run lint    # ESLint
npx tsc --noEmit  # TypeScript check
```

## Architecture

```
app/
  layout.tsx              # Server Component. Reads cookie → initialTheme. Pre-paint script.
  page.tsx                # <ThemedPortfolio />
  globals.css             # Tailwind 4 @theme inline + [data-theme] palettes
components/
  theme-provider.tsx      # Context + useTheme(). setTheme writes cookie + localStorage + dataset.theme.
  theme-switcher.tsx      # 44×44 trigger, role=menu, Esc closes, outside-pointerdown closes.
  themed-portfolio.tsx    # Client. Switch-renders one of three themes.
  themes/
    terminal/             # ASCII MOIN, scanlines, sections, interactive shell
    executive/            # Editorial-magazine; italic-rust callouts
    editorial/            # IDE chrome; tab state machine; 7 file pages
lib/
  fonts.ts                # JetBrains Mono (preload), Source Serif 4, Inter
  portfolio-data.ts       # Single source of truth: profile, experience, projects, skills, certs, etc.
```

## Updating content

Edit `lib/portfolio-data.ts`. All three themes read from the same module — change a fact once, every theme picks it up.

## Drop in your real CV

Replace `public/cv.pdf` with your actual file. All three themes already wire the Download CV button to that path.

## Deployment

Push to `main` on Vercel — no config needed.
