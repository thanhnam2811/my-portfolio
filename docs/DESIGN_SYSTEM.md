# Design System

The single source of truth for how this portfolio looks and feels. Each section pairs a short **intent** note (what a
visitor should feel/understand) with the **exact tokens** engineers must use. When in doubt, follow this file over
ad-hoc styling.

> Tokens live in [`app/globals.css`](../app/globals.css). Never hardcode a hex/oklch value in a component when a token
> exists — use the token so light/dark and future re-themes keep working.

---

## 0. Core tension: technical look, recruiter-legible content

**This is the design brief.** The primary audience is **non-technical recruiters / HR**, with engineers as the secondary
audience. The site should _look_ like it was built by a serious engineer — precise, technical, high-craft — while the
**content stays instantly understandable to someone who has never written code.** The "tech" is in the _styling_, never
in the _comprehension cost_.

What that means concretely:

- **Tech in the form, plain in the words.** Mono labels, OKLCH palette, code-like eyebrows, subtle grain — yes. But
  headings, role summaries, and impact statements are written in plain outcome-language ("built real-time game servers
  handling X players"), not raw jargon dumps. Jargon lives in tags/badges where it signals depth without blocking
  meaning.
- **A recruiter can answer 3 questions in ~10 seconds** from any screen: _Who is this? What can they do? Is it
  relevant?_ If a technical flourish gets in the way of those answers, the flourish loses.
- **Decoration must never reduce legibility.** Grain, glass, and motion stay subtle enough that text contrast and
  scan-ability are never compromised (see §2 contrast rules, §6 motion restraint).
- **Progressive depth.** Surface = plain and scannable; detail (metrics, stack, blog) is one level down for those who
  want it. Non-technical viewers are never forced through engineer-only detail to understand the story.

---

## 1. Personality

**Intent:** precise, calm, and technical — like a well-run production system — yet warm and readable. Confident
typography, generous space, restrained color, motion that only shows up when it adds meaning. Not flashy, not
corporate-generic. It should read as "an engineer who cares about craft" _and_ "a person a recruiter can quickly get."

Rules that override taste:

1. **Clarity beats decoration.** If an effect doesn't help the reader — technical or not — remove it.
2. **Legible to a non-engineer.** Every primary screen must make sense without a CS background. Jargon is a garnish, not
   the meal.
3. **One accent, used sparingly.** A single blue carries brand + action. Everything else is neutral.
4. **Native first.** Native scrolling, system fonts fallback, `prefers-reduced-motion` respected. Performance is part of
   the design.

---

## 2. Color

**In plain terms:** a near-white/near-black neutral canvas with **one** signal blue for anything interactive or
important. Dark mode is the same idea, inverted. Colors are stored in [OKLCH](https://oklch.com) — a format that keeps
brightness consistent across hues, so light and dark stay balanced.

### Semantic tokens (use these names, not raw colors)

| Token                            | Role — what it's for                                 | Light                                | Dark                               |
| -------------------------------- | ---------------------------------------------------- | ------------------------------------ | ---------------------------------- |
| `background` / `foreground`      | page canvas / default text                           | `0.985 0.004 240` / `0.2 0.02 255`   | `0.14 0.012 255` / `0.95 0.01 250` |
| `primary` / `primary-foreground` | **the** accent: links, primary buttons, active state | `0.51 0.16 248` / `0.99 0 0`         | `0.72 0.13 245` / `0.16 0.02 255`  |
| `secondary` / `-foreground`      | quiet secondary surfaces/buttons                     | `0.95 0.008 250` / `0.25 0.02 260`   | `0.2 0.012 255` / `0.96 0.01 250`  |
| `muted` / `muted-foreground`     | de-emphasized surfaces / low-priority text           | `0.955 0.005 245` / `0.48 0.018 255` | `0.2 0.01 255` / `0.72 0.012 245`  |
| `accent` / `-foreground`         | hover fills, subtle highlights                       | `0.93 0.015 240` / `0.25 0.02 260`   | `0.24 0.015 245` / `0.96 0.01 250` |
| `card` / `card-foreground`       | raised panels & cards                                | `0.995 0.002 240` / `0.145 0.02 260` | `0.18 0.015 255` / `0.96 0.01 250` |
| `popover` / `-foreground`        | overlays, menus                                      | near-`card`, higher opacity          | near-`card`, higher opacity        |
| `border` / `input`               | hairlines / form field fill                          | `0.88 0.008 250` / `0.93 0.006 250`  | `0.28 0.012 255` / `0.21 0.01 255` |
| `ring`                           | focus ring                                           | `primary / 0.35`                     | `primary / 0.35`                   |
| `destructive`                    | errors, delete                                       | `0.577 0.245 27.3`                   | `0.704 0.191 22.2`                 |
| `chart-1…5`                      | data-viz series (blue → cyan → teal → slate → warm)  | see `globals.css`                    | see `globals.css`                  |

**Usage rules**

- Interactive or "look here" → `primary`. Do not introduce a second accent hue.
- Body copy → `foreground`; supporting copy → `muted-foreground`. Aim for ≥ 4.5:1 contrast.
- Backgrounds of raised things → `card`; page → `background`.
- Access in Tailwind as `bg-primary`, `text-muted-foreground`, `border-border`, etc.
- Mesh/ambient background helpers (`--bg-mesh-1..3`) are for large decorative gradients only, never for text or UI
  surfaces.

---

## 3. Typography

**In plain terms:** two fonts. **Geist Sans** for everything you read; **Geist Mono** for anything that should feel like
code, data, or a label (timestamps, tags, section eyebrows). Headings are tight and bold; body is comfortable and airy.

- Sans: `--font-sans` (Geist) · Mono: `--font-mono` (Geist Mono). Loaded in `app/[locale]/layout.tsx`; use via
  `font-sans` / `font-mono`.
- **Headings** — use the `premium-heading` utility: `font-bold tracking-[-0.04em] leading-[0.98]`.
- **Section eyebrow / label** — use `section-label`: `11px, uppercase, tracking-[0.24em], font-black, text-primary/75`.
  This is the signature "technical" touch — reach for it instead of inventing new small-caps styles.
- **Long-form reading** (blog) — the `.blog-prose` block sets `~1.05rem` size, `1.95` line-height, `max-width: 72ch` for
  measure. Headings there get `-0.03em` tracking.

Rough scale (Tailwind): eyebrow `text-[11px]` · body `text-sm`/`text-base` · lead `text-lg`/`text-xl` · section titles
`clamp(1.8rem…2.5rem)` · hero uses `premium-heading` at large clamp sizes. Prefer `clamp()` for anything that must scale
from mobile to desktop.

---

## 4. Layout & spacing

**In plain terms:** one centered column, comfortable page margins, and a fixed header the content is aware of so nothing
hides behind it.

- **Container:** `section-shell` = `w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`. Use it for every top-level section;
  don't hand-roll widths.
- **Header offset:** `--header-offset: 5.5rem`. `scroll-padding-top` and section `scroll-margin-top` both derive from it
  — anchors land below the fixed header. If the header height changes, change this one variable.
- **Section snapping:** sections marked `data-snap='true'` get scroll margins; on large hover-capable screens with
  `data-section-snap='true'` they fill `100svh`. Snapping is a desktop-pointer enhancement, never forced on touch.
- Spacing uses the default Tailwind 4-based scale. Prefer vertical rhythm in multiples of `4` / `6` / `8` between
  blocks.

---

## 5. Radius, elevation & surfaces

**In plain terms:** soft rounded corners, gentle shadows (never harsh), and a light "frosted glass" treatment for panels
so they lift off the page without shouting.

**Radius** — base `--radius: 1rem`. Derived: `sm = -4px`, `md = -2px`, `lg = base`, `xl = +4px`. Editorial panels use
the larger `rounded-[2rem]`.

**Shadows** — one soft, low-opacity family. Do not add hard/black drop shadows.

| Token              | Use                                                    |
| ------------------ | ------------------------------------------------------ |
| `--shadow-sm`      | hairline lift (inputs, small chips)                    |
| `--shadow-neu`     | default button/interactive resting shadow              |
| `--shadow-md`      | `glass-card`                                           |
| `--shadow-lg`      | `glass-panel`, floating nav                            |
| `--shadow-xl`      | large modals / hero panels                             |
| `--shadow-premium` | signature deep-but-soft shadow for `editorial-surface` |

**Surface utilities** (compose, don't rebuild):

- `glass` — `bg-card/90 backdrop-blur-sm border shadow-sm` (light chrome, headers).
- `glass-panel` — `bg-card/95 … shadow-lg` (prominent floating panels).
- `glass-card` — `bg-card border shadow-md` (content cards).
- `editorial-surface` — `rounded-[2rem] border bg-card/95 shadow-premium` (feature blocks).

**Texture** — a fixed SVG grain overlay (`opacity ~1.5–2%`, `mix-blend-overlay`) sits above the page for tactility;
ambient radial/linear gradients tint the body. These are global and subtle — do not increase their opacity or add
competing full-screen effects.

---

## 6. Motion

**In plain terms:** motion is used to guide attention on first reveal and to acknowledge a tap — not for constant
movement. It should feel smooth and quick, and turn off for users who ask for reduced motion.

- **GSAP** drives homepage reveal + chapter navigation (`lib/motion/home-gsap.ts`, `home-presets.ts`). One controller
  per interaction path — don't stack scroll systems.
- **Framer Motion** handles micro-interactions (e.g. `Button` `whileTap={{ scale: 0.98 }}`) and blog page transitions
  (`components/blog/BlogTransition.tsx`).
- Animate **`transform` and `opacity`** only. Avoid animating layout/color en masse.
- Theme changes use a scoped `0.3s cubic-bezier(0.4,0,0.2,1)` transition on `background-color`/`border-color` — keep
  transitions scoped to avoid paint storms.
- Always honor `prefers-reduced-motion` and skip/deflate motion on touch when it competes with scrolling.

---

## 7. Components

Reusable primitives live in `components/ui/` and are built with **CVA** + `cn()`. Extend existing variants before
creating new components.

**Button** (`components/ui/button.tsx`)

- Variants: `default` (primary fill) · `secondary` · `outline` · `ghost` · `link` · `destructive`.
- Sizes: `sm` (h-9) · `default` (h-11) · `lg` (h-12) · `icon` (square 44px).
- Ships with tap feedback + accessible focus ring; use `asChild` to render as a link.

**Badge** (`components/ui/badge.tsx`) — variants `default` · `secondary` · `outline` · `destructive`. Use for
tags/status. Pair with `font-mono` for a technical read on labels.

**Card / Input / Textarea / Label / Carousel** — standard shadcn-style primitives; theme them through tokens, not inline
colors.

Rules:

- Every interactive element needs a visible focus state (`focus-visible:ring-ring/50`).
- Compose with `cn(...)`; never string-concat classes.
- If a variant is missing, **add it to the CVA config**, don't fork the component.

---

## 8. Accessibility (non-negotiable)

- Contrast ≥ 4.5:1 for text (use `foreground` / `muted-foreground`, not lighter greys).
- Keyboard: a "Skip to content" link exists in the layout; keep every control focusable with a visible ring.
- Respect `prefers-reduced-motion`.
- Meaningful `alt` text; `next/image` with realistic `sizes`.
- `lang` is set per-locale on `<html>`; keep both `en` and `vi` copy in sync.

---

## 9. Do / Don't

| Do                                                                       | Don't                                                       |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Use semantic tokens (`bg-primary`, `text-muted-foreground`)              | Hardcode hex/oklch/`slate-400` in components                |
| Keep one accent (blue)                                                   | Add a second brand color for emphasis                       |
| Reach for `section-shell`, `section-label`, `glass-*`, `premium-heading` | Re-invent container widths, small-caps, or panel styles     |
| Animate `transform`/`opacity`, one system per path                       | Stack scroll controllers or add global animated backgrounds |
| Add missing variants to CVA                                              | Fork a component or inline one-off overrides                |
| Change `--header-offset` / `--radius` once, centrally                    | Sprinkle magic numbers across files                         |

---

## 10. Extending the system

1. Add the raw value under `:root` **and** `.dark` in `globals.css`.
2. Expose it in the `@theme inline` block (`--color-x: var(--x)`) so Tailwind generates utilities.
3. Document it here (token + plain-language role).
4. Use the utility class; never the raw variable in a component.

New primitives: build with CVA + `cn()` in `components/ui/`, mirror the Button/Badge shape, and give every state a
token-driven style and a focus ring.
