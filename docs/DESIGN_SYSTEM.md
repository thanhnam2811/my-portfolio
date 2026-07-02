# Design System

The single source of truth for how this portfolio looks and feels. Each section pairs a short **intent** note (what a
visitor should feel/understand) with the **exact tokens/recipes** engineers must use. When in doubt, follow this file
over ad-hoc styling.

> Tokens live in [`app/globals.css`](../app/globals.css). Never hardcode a hex/oklch value in a component when a token
> or documented recipe exists.

---

## 0. Core tension: technical look, recruiter-legible content

**This is the design brief.** The primary audience is **non-technical recruiters / HR**, with engineers as the secondary
audience. The site should _look_ like it was built by a serious engineer — precise, technical, high-craft — while the
**content stays instantly understandable to someone who has never written code.** The "tech" is in the _styling_, never
in the _comprehension cost_.

- **Tech in the form, plain in the words.** Mono labels, dark console palette, code-like eyebrows — yes. But headings,
  role summaries, and impact statements are plain outcome-language. Jargon lives in tags/badges.
- **A recruiter can answer 3 questions in ~10 seconds** from any screen: _Who is this? What can they do? Is it
  relevant?_ On the bento deck this is stronger: the whole answer is one viewport.
- **Decoration must never reduce legibility.** Contrast and scan-ability win over any flourish.
- **Progressive depth.** Surface = scannable card; detail lives one click down in the card's overlay.

---

## 1. Two surfaces

The site has exactly **two visual surfaces**. Don't mix their vocabularies.

| Surface                  | Where                     | Character                                                                  |
| ------------------------ | ------------------------- | -------------------------------------------------------------------------- |
| **Operator deck** (§2–6) | Homepage (`HomePage.tsx`) | Always-dark "command deck": bento grid, mono labels, cyan accent           |
| **Editorial** (§7)       | Blog list + articles      | Long-form reading: token-driven light/dark, `glass-*` panels, `blog-prose` |

The operator deck is **theme-independent** (always dark) by design — it is the brand moment. The editorial surface
follows the semantic light/dark tokens.

---

## 2. Operator deck — palette

**Intent:** a calm production console. One cyan accent carries "interactive/important", emerald means "healthy/positive
status", everything else is a quiet slate ladder on near-black blue.

### Surface tokens (CSS variables, `globals.css`)

| Token                                               | Role                                         |
| --------------------------------------------------- | -------------------------------------------- |
| `--operator-bg`                                     | page base (`#07111f`)                        |
| `--operator-grad-top/mid/bot`, `--operator-atm-1/2` | atmosphere gradients (`operator-atmosphere`) |
| `--operator-grid`, `--operator-grid-soft`           | background grid lines (`operator-grid`)      |
| `--operator-accent`, `--operator-accent-strong`     | cyan accent pair (`#67e8f9` / `#a5f3fc`)     |
| `--operator-border`, `--operator-border-soft`       | hairlines (`white/10`, `white/8`)            |
| `--operator-panel-top/bot`                          | card surface gradient stops                  |
| `--operator-overlay-top/bot`                        | overlay/dialog surface gradient stops        |
| `--operator-header-bg`                              | fixed header chrome                          |
| `--operator-node-fill/stroke/dot`                   | topology SVG node colors                     |

### Text ladder (Tailwind palette classes — canonical on this surface only)

| Class                       | Role                                                   |
| --------------------------- | ------------------------------------------------------ |
| `text-white`                | headings, card titles, key values                      |
| `text-slate-200/300`        | body copy                                              |
| `text-slate-400`            | supporting copy, captions                              |
| `text-slate-500`            | faint mono meta (indices, dates) — **never body copy** |
| `text-cyan-200/70…cyan-300` | accent labels, links, interactive highlights           |
| `text-emerald-200/300`      | status = good (availability badge, status dot)         |

Rules:

- **One accent.** Cyan is the only "look here" hue. Emerald is reserved for status semantics, never decoration.
- Borders/hairlines come from the utilities below — don't write `border-white/10` by hand in new code.
- Buttons on this surface: primary = `bg-cyan-300 text-slate-950 hover:bg-cyan-200`, secondary = `variant="outline"` +
  `border-white/15 bg-transparent text-white hover:bg-white/5`, always `rounded-none`.

---

## 3. Operator deck — typography & labels

Two fonts sitewide: **Geist Sans** (reading) and **Geist Mono** (labels/data), via `font-sans` / `font-mono`.

### Canonical recipes (use the utility, don't re-type the classes)

| Utility            | Definition                                                           | Use                             |
| ------------------ | -------------------------------------------------------------------- | ------------------------------- |
| `deck-label`       | `font-mono text-[10px] tracking-[0.24em] uppercase text-cyan-200/70` | card eyebrows, panel labels     |
| `deck-label-muted` | same, but `text-slate-500`                                           | secondary meta (hints, indices) |

**There is exactly one label size on the deck (10px / 0.24em).** If a label feels too small, the fix is hierarchy, not a
new size.

### Scale

| Element                       | Classes                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| Deck headline (identity card) | `text-2xl sm:text-3xl xl:text-4xl font-semibold tracking-[-0.045em]` |
| Overlay heading               | `text-3xl sm:text-4xl font-semibold tracking-[-0.04em]`              |
| Card title                    | `text-lg xl:text-xl font-semibold tracking-[-0.03em]`                |
| Card body                     | `text-xs xl:text-sm leading-6/7 text-slate-300` (+ `line-clamp-*`)   |
| Overlay body                  | `text-sm/base leading-7/8 text-slate-200/300`                        |
| Metric value                  | `text-lg xl:text-xl font-semibold tracking-[-0.03em] text-white`     |

---

## 4. Operator deck — layout (bento grid)

**Intent:** the whole CV in one glance on desktop; a clean stack on smaller screens. The grid is the design — cards
never overflow it.

- Header: fixed, `h-16`; main gets `pt-20`.
- Container: `max-w-[1600px]`, `px-3 sm:px-4`, `gap-3`.
- **Desktop (`lg` + viewport ≥ 720px tall — the `tall` variant):** `grid-cols-12 grid-rows-6`, `h-dvh`,
  `overflow-hidden` — a true single-viewport deck.

| Card                                | Placement               |
| ----------------------------------- | ----------------------- |
| identity                            | `col-span-5 row-span-3` |
| topology                            | `col-span-7 row-span-2` |
| proof                               | `col-span-7 row-span-1` |
| work × 3                            | `col-span-3 row-span-2` |
| experience                          | `col-span-3 row-span-2` |
| capabilities / principles / contact | `col-span-4 row-span-1` |

- **Short desktop (`lg` but < 720px tall):** same 12-col grid, but **no fixed height** — rows size to content and the
  page scrolls. Never squash text to force one viewport.
- **Tablet (`md`):** `grid-cols-2`; identity, topology and proof span both columns, everything else 1 column.
- **Mobile (< `md`):** single column stack, natural page scroll.
- Card interior: `p-5`, content pinned with flex column + `mt-auto` for footers; long text gets `line-clamp-*`.

---

## 5. Operator deck — surfaces & interaction

| Utility                                 | Definition (see `globals.css`)                                             | Use                     |
| --------------------------------------- | -------------------------------------------------------------------------- | ----------------------- |
| `operator-shell`                        | page base color                                                            | homepage root           |
| `operator-atmosphere` / `operator-grid` | ambient gradients + grid lines                                             | fixed decorative layers |
| `operator-header`                       | header chrome (`--operator-header-bg` + blur)                              | fixed header            |
| `deck-card`                             | card surface: hairline border + panel gradient + hover/focus accent border | every bento card        |
| `overlay-surface`                       | dialog surface: accent hairline + deeper gradient + heavy soft shadow      | card expand overlays    |

Interaction states (built into `deck-card`):

- Hover: border shifts to `cyan-300/40`; the "open" hint fades in.
- Focus: `focus-visible` ring in accent — every expandable card is a `<button>` and must show it.
- Overlay: backdrop `bg-[#040a14]/85` — **no `backdrop-blur`** (full-screen blur janks integrated GPUs); panel
  `max-w-3xl`, `max-h-full overflow-y-auto` and **must carry `data-lenis-prevent`** so wheel scrolling works inside it
  while Lenis owns the page.
- Scrollbars: global thin slate thumb (`8px`, `rgba(148,163,184,0.35)`) on transparent track, accent on hover — defined
  once in `globals.css` base layer, never per-component.

Corners on the operator surface are **square** (`rounded-none` buttons, unrounded cards) except the topology SVG's own
node rects. This is deliberate contrast with the editorial surface.

---

## 6. Operator deck — motion

**Intent:** motion appears exactly twice — deck entry and card morph. Nothing loops except the topology packets.

- **Framer Motion only** on the homepage (GSAP/Lenis remain for page smooth-scroll via `SmoothScroll`).
- Entry: per-card fade + `y:14→0`, `0.4s`, `0.05s * index` stagger, ease `[0.22,1,0.36,1]`. Runs once.
- Expand: **state-driven FLIP morph** (`opening → open → closing → unmount`, see `MorphSurface`) — the clicked card
  hides (`visibility: hidden`, its slot stays), the overlay surface CSS-transitions from the card's rect to the dialog
  bounds (`450ms`, transform/opacity only), and closing morphs back to the card's current slot before unmounting.
  Content/backdrop fade via `deck-fade-in` keyframes. Do **not** use framer `layoutId`/AnimatePresence-exit for this:
  exit coordination is deadlock-prone and full-card layout projection re-measures every card (janks iGPUs).
- Close: Esc, backdrop click, or the ✕ button. Focus moves to the dialog on open.
- Topology packets: SVG **SMIL** (`<animateMotion>`) — zero per-frame JS. The only persistent motion on the page.
- `prefers-reduced-motion`: entry/morph collapse to duration 0; SMIL packets and pulses are not rendered.
- Animate `transform`/`opacity` only. No scroll-driven animation on the deck.

---

## 7. Editorial surface (blog)

Everything here follows the **semantic tokens** (`background`, `foreground`, `primary`, `card`, `border`,
`muted-foreground`… defined for light + `.dark` in OKLCH):

- Panels: `glass` / `glass-panel` / `glass-card` utilities (used by `components/ui/card.tsx`).
- Long-form: `.blog-prose` — `~1.05rem` size, `1.95` line-height, `max-width: 72ch`, headings `-0.03em`.
- Radius: base `--radius: 1rem` (sm/md/lg/xl derived). Shadows: the soft `--shadow-*` family only.
- Buttons/Badges: CVA variants in `components/ui/` — extend variants, never fork.
- `--header-offset` drives `scroll-padding-top` for in-article anchors.

Retired (removed from `globals.css`, do not reintroduce): `section-shell`, `section-label`, `premium-heading`,
`editorial-surface`, and the `data-snap` section-snapping CSS — these belonged to the old long-scroll homepage.

---

## 8. Accessibility (non-negotiable)

- Text contrast ≥ 4.5:1. On the deck: body text is `slate-300`+ on panel surfaces; `slate-500` is only for non-essential
  mono meta.
- Every expandable card is a real `<button>` with a visible `focus-visible` ring; the overlay is `role="dialog"`
  `aria-modal`, receives focus on open, closes on Esc.
- `prefers-reduced-motion` honored everywhere (entry, morph, SMIL, status pings use `motion-reduce:animate-none`).
- Meaningful `alt`; `next/image` with realistic `sizes`.
- **All UI copy lives in `messages/{en,vi}.json`** — never hardcode user-facing strings (especially Vietnamese, which
  loses diacritics when typed as ASCII) in components. Keep both locales in sync; `lang` set per-locale.

---

## 9. Do / Don't

| Do                                                                   | Don't                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| Use `deck-label`, `deck-card`, `overlay-surface`, `operator-header`  | Re-type mono-label/border/panel classes by hand               |
| Keep cyan as the only accent; emerald = status only                  | Introduce new hues or use emerald decoratively                |
| Keep the deck single-viewport **only when it fits** (`tall` variant) | Squash content to force one screen on short viewports         |
| Put depth in card overlays                                           | Add sections, floating widgets, or scroll systems to the deck |
| Use semantic tokens on the editorial surface                         | Leak operator classes (slate/cyan ladder) into blog UI        |
| Extend CVA variants in `components/ui/`                              | Fork components or inline one-off styles                      |

---

## 10. Extending the system

1. Add the raw value to `:root` in `globals.css` (operator tokens are theme-independent; editorial tokens need `.dark`
   too).
2. For editorial colors, expose via `@theme inline` so Tailwind generates utilities. For operator surfaces, prefer an
   `@utility` recipe.
3. Document it here (token + plain-language role).
4. Use the utility in components — never the raw variable.
