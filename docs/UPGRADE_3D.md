# Immersive WebGL Upgrade Plan

> Goal: turn the homepage from an "editorial dossier" into an **interactive visualization of a realtime distributed game
> system** — HR sees something premium, a tech lead sees a real backend/game-server story. Awwwards-style, wow-first,
> but never at the cost of SEO, accessibility, or the ability of a recruiter to read it.

## North star

**DOM = source of truth. WebGL = presentation layer.** The existing localized DOM keeps owning SEO, accessibility, i18n,
responsiveness, and maintainability. A fixed `<Canvas>` sits _behind_ the DOM and reacts to scroll. We never move
content into the canvas.

## Architecture

```
LocaleShell → SmoothScroll (Lenis + scroll-progress store)
  HomePage
    <BackgroundCanvas/>   fixed · z-0 · pointer-events-none · ssr:false · aria-hidden
        Scene: Realtime System Core + particles + fog + post-processing
    DOM content            z-10 · transparent/scrim surfaces · unchanged content
```

- All WebGL lives under `components/webgl/`. The DOM stays canonical and `aria-hidden` the canvas.
- Scroll progress (`0..1` whole-page + per-chapter) is pushed into a lightweight, mutation-based store
  (`lib/motion/scroll-progress.ts`) updated by Lenis, and consumed inside the R3F render loop (no React re-renders per
  frame).

## Tech

`three` · `@react-three/fiber` · `@react-three/drei` · `@react-three/postprocessing` + `postprocessing` · `maath` ·
`leva` (dev). `lenis` (already a dependency) drives smooth scroll. GPU tiering via `detect-gpu` + R3F
`<PerformanceMonitor>`.

## Signature ideas (what makes it _ours_)

### Realtime System Core (hero centerpiece)

Not a generic "particle network graph" (overused by every AI/web3/cloud site). Instead: a central **emissive core** with
orbiting satellite nodes and **packets** flowing along bezier edges. It animates the vocabulary of the role:

- packet flow · event propagation · replication ripples · load-balancing reroute · heartbeat pulse.

### Scroll = camera journey (not a slideshow)

Camera **orbits one living system** rather than cutting between per-section keyframes:

```
ch1 front  → ch2 orbit-left → ch3 zoom-to-core
→ ch4 pass-through-core → ch5 behind → ch6 pull-back (full topology)
```

Driven by a single GSAP timeline scrubbed by Lenis scroll along a CatmullRom path, always `lookAt(core)`. Feels like
exploring a system, not flipping slides.

### System Visualization (project sections)

A labeled, animated pipeline — `Player → Gateway → Game Server → Redis → Database` — with packet transfer, latency, and
replication/sync. Built with **SVG/Canvas2D + GSAP** (not WebGL) so labels stay razor-sharp and legible. HR reads the
flow; a tech lead recognizes the architecture.

## Post-processing (curated, not cheap-wow)

Keep: **Bloom · Vignette · film Noise · very subtle DoF.** Drop: chromatic aberration · glitch · RGB-split (hurt
legibility, read as "trailer", not "engineer").

## GPU tiers (from P0, not deferred)

| Tier | Budget                                                        |
| ---- | ------------------------------------------------------------- |
| HIGH | ~3000 particles · full post-FX · fog                          |
| MID  | ~800 particles · light bloom                                  |
| LOW  | static shader background (Intel UHD / HR laptops stay smooth) |

Initial tier from `detect-gpu` + heuristics; `<PerformanceMonitor>` adaptively lowers `dpr` and effects if FPS drops.
Also respects `prefers-reduced-motion` (→ LOW/static).

## Phases

| Phase  | Content                                                                                                       | Wow        |
| ------ | ------------------------------------------------------------------------------------------------------------- | ---------- |
| **P0** | Lenis smooth scroll + scroll-progress store + GPU-tier scaffold + tokenize homepage atmosphere. No WebGL yet. | ⭐         |
| **P1** | R3F `<BackgroundCanvas>` + **Realtime System Core** + curated post-FX.                                        | ⭐⭐⭐     |
| **P2** | **Scroll camera journey** (orbit the core, continuous, not per-section cuts).                                 | ⭐⭐⭐⭐⭐ |
| **P3** | Per-section depth + **System Visualization** pipeline.                                                        | ⭐⭐⭐⭐⭐ |
| **P4** | GPU tiers finalized + fallbacks + reduced-motion + `pnpm build` + cross-device/locale verify.                 | ⭐⭐⭐     |
| **P5** | **Idle cinematic mode** — after ~20s idle, slow ambient orbit + packet pulse; resume on scroll.               | ⭐⭐⭐⭐   |

Rough effort: ~7–10 focused days.

## Guardrails (kept even though we're wow-first)

- DOM canonical; canvas is decorative and `aria-hidden`.
- Adaptive scrim behind text; maintain contrast ≥ 4.5:1 (see `docs/DESIGN_SYSTEM.md` §0/§2).
- Static fallback for low-end devices and reduced-motion.
- All WebGL dynamically imported (`ssr:false`), lazy, paused when tab hidden / offscreen.

## Risks & mitigations

| Risk                        | Mitigation                                                               |
| --------------------------- | ------------------------------------------------------------------------ |
| `three` bundle weight       | dynamic import, code-split canvas, tree-shake drei (accepted: wow-first) |
| Perf on weak GPUs/mobile    | tier system + static fallback                                            |
| Text legibility over motion | scrims, blend modes, contrast floor                                      |
| SSR/hydration               | canvas `ssr:false`                                                       |
| Maintenance complexity      | isolate under `components/webgl/`, document here + design system         |

## Status

- [x] **P0** — smooth scroll, scroll store, GPU tier scaffold, atmosphere tokens
- [ ] P1 — canvas + System Core
- [ ] P2 — scroll camera journey
- [ ] P3 — section depth + system visualization
- [ ] P4 — GPU tiers + fallbacks + verification
- [ ] P5 — idle cinematic mode
