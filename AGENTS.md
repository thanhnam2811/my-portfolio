# AGENTS.md

Guidance for coding agents working in this repository.

## Working Principles

- Think before editing. Read the relevant files first, then change the smallest surface that solves the task.
- State assumptions when they affect architecture, UX, content, or data shape. Do not silently guess when a wrong guess
  could cause rework.
- Do not perform drive-by refactors. If you notice unrelated issues, mention them separately unless the task requires
  fixing them.
- Preserve user changes outside your scope. Never revert unrelated work to make your own patch cleaner.
- Prefer extending existing patterns over inventing new ones. This repo is small enough that consistency matters more
  than clever abstractions.
- If a task affects layout, animation, scrolling, or localization, verify the user-facing behavior instead of relying on
  code inspection alone.
- Keep explanations high signal. Summarize the real change, the real risk, and the real verification result.

## Project Snapshot

- Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, `next-intl`, Framer Motion, Radix UI.
- Package manager: `pnpm`
- App type: single-page portfolio with localized routes under `app/[locale]`

## Commands

Run all commands from the repository root.

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format:check
```

Before finishing a meaningful code change, run `pnpm build`. For formatting-only edits, `pnpm format:check` is enough.

## Agent Workflow

- Start with repository inspection, not assumptions.
- Prefer `rg` and `rg --files` for search.
- For small fixes, patch in place. For larger changes, keep the work scoped and staged mentally by concern.
- When changing copy, structure, or interaction patterns, inspect both the implementation and the locale/content sources
  that feed it.
- When introducing a dependency, justify why the existing stack is not enough and keep the added runtime cost visible.
- When working on motion, optimize for perceived smoothness and interaction latency, not animation quantity.

## Architecture

- Prefer Server Components by default. Add `"use client"` only when the component truly needs browser APIs, state,
  effects, or animation hooks.
- Keep page sections in `app/_sections/`.
- Keep reusable primitives in `components/ui/`.
- Put cross-section components in `components/`.
- Keep static content and structured portfolio data in `app/_data/`.
- Keep localized copy in both `messages/en.json` and `messages/vi.json`. Do not update one locale without the other.

## Styling And UI Rules

- Use Tailwind utilities directly in components.
- Use the `cn()` utility for conditional class composition.
- Use `class-variance-authority` for shared variant-heavy UI components.
- Use `lucide-react` for icons unless the file already establishes another icon source.
- Match the existing visual direction: precise, technical, slightly editorial. Avoid generic glassmorphism or heavy
  decorative effects unless the task explicitly calls for them.

## Motion And Performance

- Preserve the current performance strategy: native scrolling first, lightweight motion second.
- Prefer animating `transform` and `opacity`.
- Avoid reintroducing global continuous effects such as custom cursors, full-screen animated backgrounds, or scroll
  systems that compete with native scrolling unless there is a measured reason.
- Desktop-only section snap is intentional. Treat it as a soft assist, not a hard lock.
- Use `next/image` correctly with realistic `sizes`; prefer modern formats and avoid oversized source assets.
- Prefer one animation system per interaction path. Avoid stacking multiple scroll or timeline controllers on the same
  UI.
- Respect `prefers-reduced-motion` and mobile/touch constraints when adding new animation behavior.

## Editing Guidelines

- Make focused changes that fit the existing structure instead of adding new abstractions by default.
- Keep TypeScript strict. Avoid `any` unless there is a documented reason.
- Do not silently change copy tone across the site; keep it concise and technical.
- If you touch navigation, scrolling, or section layout, verify sticky-header offsets and anchor behavior.
- Keep client components lean. If logic can live in a server component or a plain data file, prefer that.
- Avoid broad file rewrites when a targeted patch is enough.

## Verification

- Required for non-trivial app changes: `pnpm build`
- Recommended for UI changes:
    - verify desktop layout
    - verify mobile layout
    - verify both locales if copy or structure changed
    - verify section snap, anchor navigation, and reduced-motion behavior when relevant
- If you changed navigation, hero, or section composition, verify that the page still feels coherent from top to bottom
  rather than checking only the edited block.
- If you added a dependency or animation runtime, call out the tradeoff explicitly in the final summary.

## Git Hygiene

- Do not revert unrelated user changes.
- Keep commits scoped by concern when possible.
- If a task only changes docs or instructions, avoid bundling app code changes into the same commit.
- Prefer a separate commit for repo-instruction changes like `AGENTS.md`.
