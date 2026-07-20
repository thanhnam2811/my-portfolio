# CLAUDE.md

Guidance for Claude Code working in this repository.

The full working principles, architecture rules, styling/motion conventions, and verification checklist live in
**@AGENTS.md** — read them; they apply here in full. This file adds the concrete, project-specific facts worth having up
front.

## What this is

Localized single-page portfolio + MDX blog for a backend engineer. Next.js 15 App Router, React 19, TypeScript (strict),
Tailwind CSS v4, `next-intl`, GSAP, Radix UI. Package manager is **pnpm**. Deployed on Vercel
(`https://thanhnam2811.vercel.app`).

## Commands

```bash
pnpm dev            # dev server (Turbopack)
pnpm build          # production build — run before finishing non-trivial changes
pnpm start          # serve production build
pnpm lint           # oxlint .
pnpm lint:fix       # oxlint --fix .
pnpm format:check   # oxfmt --check .
pnpm format         # oxfmt .
```

Tooling is **oxlint** + **oxfmt** (not ESLint/Prettier). A Husky `pre-commit` hook runs `lint-staged`, which
auto-fixes/formats staged files. There is no test suite — verification is `pnpm build` plus manual UI checks (see
AGENTS.md).

## Layout & conventions

- Path alias: `@/*` → repo root (e.g. `@/i18n/routing`, `@/lib/utils`).
- Indentation is **tabs** (enforced by oxfmt).
- Locales: `en` (default) and `vi`, `localePrefix: 'always'`, auto-detection **off** so new visitors always land on
  `/en`. Config in `i18n/routing.ts`; `middleware.ts` only matches `/` and `/(vi|en)/:path*`.

### Where things live

| Path                                                 | Purpose                                                  |
| ---------------------------------------------------- | -------------------------------------------------------- |
| `app/[locale]/page.tsx` + `_components/HomePage.tsx` | canonical homepage (single implementation)               |
| `app/[locale]/_data/content.ts`                      | structured homepage content / data                       |
| `app/[locale]/blog/`                                 | blog list, `[slug]` article, `template.tsx` (transition) |
| `app/{robots.ts,sitemap.ts}`                         | SEO — sitemap pulls blog entries from `lib/blog.ts`      |
| `messages/en.json`, `messages/vi.json`               | UI copy — **keep both in sync, never edit one alone**    |
| `components/ui/`                                     | Radix + CVA primitives (button, card, carousel, input…)  |
| `components/`                                        | cross-section components (LocaleShell, Theme\*, `blog/`) |
| `lib/motion/`                                        | `home-gsap.ts` + `home-presets.ts` — homepage animation  |
| `lib/utils.ts`                                       | `cn()` (clsx + tailwind-merge)                           |
| `content/blog/<locale>/<slug>.mdx`                   | blog source (currently only `en/`)                       |
| `docs/`                                              | `DESIGN_SYSTEM.md`, `ROADMAP.md`, `GIT_CONVENTIONS.md`   |

## Design system

Tokens (color/typography/spacing/shadow) live in `app/globals.css`; the rules for using them are in
`docs/DESIGN_SYSTEM.md` — **follow it over ad-hoc styling**. Use semantic tokens (`bg-primary`,
`text-muted-foreground`), the shared utilities (`section-shell`, `section-label`, `premium-heading`, `glass-*`,
`editorial-surface`), and extend CVA variants rather than hardcoding colors or forking components.

## Blog system (`lib/blog.ts`)

- Posts are MDX files with gray-matter frontmatter: `title`, `description`, `publishedAt`, `tags` are **required**
  (build throws if missing); `featured`, `coverImage`, `readingTime` optional.
- **Locale fallback**: a slug missing in the requested locale falls back to `en` (`isFallback: true`). Slugs are the
  union across all locales.
- Reading time is auto-estimated (~220 wpm) when not set; headings (h2/h3) are extracted and slugified for the
  in-article TOC. Rendered via `next-mdx-remote` with `remark-gfm` + `rehype-slug` and
  `components/blog/MdxComponents.tsx`.

## AI card (CV chat + JD fit-check)

The homepage "AI" bento card (`app/[locale]/_components/ai/AiCard.tsx`) offers two features grounded in the CV content:
a Q&A chat and a job-description fit checker.

- `lib/ai/providers.ts` — the model chain, tried in order: Gemini (`google('gemini-2.5-flash')`), then two Groq models
  (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) as separate-quota fallbacks.
- `lib/ai/fallback.ts` — `runWithFallback()` walks the chain on any error. Deliberately **non-streaming**
  (`generateText`, not `streamText`): a failed provider mid-stream would already have leaked partial output to the
  client, so fallback only works cleanly with a full response per call.
- `lib/ai/context.ts` — `buildPortfolioContext(locale)` serializes the same `messages/{locale}.json` content the UI
  renders into the system-prompt context, so the model can't drift from what's actually on the page.
- `app/api/ai/{chat,jd-fit}/route.ts` — the two endpoints; both require `GOOGLE_GENERATIVE_AI_API_KEY` and
  `GROQ_API_KEY` (see `.env.example`) and return a `502` when every model in the chain fails.

## Conventions to follow

- Server Components by default; add `"use client"` only for state/effects/animation.
- Commits follow Conventional Commits (`type(scope): desc`) — see `docs/GIT_CONVENTIONS.md`. Branches: `feature/`,
  `fix/`, `refactor/`, `hotfix/`. Keep repo-instruction changes (this file, AGENTS.md) in their own commit.
- No drive-by refactors; smallest change that solves the task; keep TypeScript strict (avoid `any`). Preserve the
  "precise, technical, editorial" visual direction and the native-scroll-first / lightweight-motion performance
  strategy.
