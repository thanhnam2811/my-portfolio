# Portfolio Upgrade Plan (Lean-Tech)

> Direction: make the site feel **premium and unmistakably backend/game-server**, while being **fast and smooth on every
> device** — including integrated GPUs. The signature is not an abstract 3D object; it's an honest **visualization of a
> realtime system**.

## Why we pivoted away from full WebGL

An earlier iteration mounted a persistent full-viewport React-Three-Fiber scene (system core + particles + bloom) behind
the DOM. It looked good on paper but ran every frame with post-processing and **janked / stuttered scroll on integrated
GPUs** (Intel HD/UHD) — the wrong tradeoff for a backend portfolio where "feels smooth" beats "has 3D". All `three` /
`@react-three/*` deps and `components/webgl` were removed.

Reference archetypes: the respected dev portfolios split into **minimal/typography-first** (Brittany Chiang,
Linear/Vercel feel — instant, smooth) and **full-3D specialist** (Bruno Simon — only makes sense if 3D _is_ your
product). A backend engineer wins with the former, plus one meaningful domain visual.

## North star

- **DOM-first, GPU-cheap.** Animate transforms/opacity; no persistent WebGL.
- **One signature that tells the story:** the realtime system topology.
- **Legible + fast:** HR reads it in seconds; it stays smooth on a cheap laptop.
- Keep P0 foundations: Lenis smooth scroll, scroll-progress store, operator tokens.

## Building blocks

| Piece               | Tech                                               | Cost  |
| ------------------- | -------------------------------------------------- | ----- |
| Smooth scroll       | Lenis + GSAP ticker (P0)                           | cheap |
| Scroll storytelling | GSAP ScrollTrigger reveals (already in `HomePage`) | cheap |
| **System topology** | SVG + SMIL (`components/SystemVisualization.tsx`)  | ~free |
| Atmosphere          | Tokenized CSS gradients/grid (P0)                  | free  |
| Optional accents    | CSS/transform micro-interactions                   | cheap |

## Signature: realtime system topology

`Player → Gateway → Game Server → Redis → Database`, packets flowing along the edges, the Game Server highlighted with a
heartbeat. Pure SVG + SMIL — no per-frame JS, sharp labels, `prefers-reduced-motion` aware. Reads as real architecture
(tech lead) and as a clear story (recruiter).

## Status

- [x] Foundations — Lenis smooth scroll, scroll-progress store, operator tokens
- [x] Signature — realtime system topology (`SystemVisualization`)
- [ ] Polish topology — hover states, latency figures, mobile vertical layout
- [ ] Section depth — lightweight reveal/parallax pass tuned for smoothness
- [ ] Optional cheap animated backdrop (transform-only), reduced-motion aware
- [ ] Verify: desktop + mobile + both locales + reduced-motion + `pnpm build`

## Abandoned (removed from the codebase)

- Full-screen R3F canvas, System Core mesh, particle field, camera journey, post-processing, GPU tiering — see git
  history (`feat(webgl)…` then `refactor(webgl): remove…`).

## Guardrails

- No persistent full-screen WebGL. Any future 3D must be **contained + on-demand** and gated behind a capability +
  reduced-motion check.
- Maintain contrast ≥ 4.5:1 and keep copy recruiter-legible (see `docs/DESIGN_SYSTEM.md`).
