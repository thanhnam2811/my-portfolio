# Portfolio Upgrade Plan: Beyond CV + Scroll

> **Vision:** Transform the site from a single-scroll CV into an interactive **Systems Operations Console** — a control
> center that demonstrates backend engineering thinking through its very interface. Every panel, metric, and interaction
> reinforces the story of an engineer who builds reliable, observable, real-time systems.
>
> The portfolio should **show** how you think, not just **tell** what you've done.
>
> _"Recruiter không tuyển bạn vì bạn biết ThreeJS. Họ tuyển bạn vì bạn là Game Server Developer biết xây hệ thống
> realtime."_

---

## Why the current pattern isn't enough

The current site is well-built — clean typography, smooth reveals, a signature SVG topology, solid design system. But it
still follows the **standard portfolio template**: hero → about → work → experience → contact. A recruiter scrolls,
reads static content, and leaves. There's nothing that **demonstrates** backend engineering in action.

The gap isn't visual polish — it's **interactive depth** and **domain-specific storytelling**.

---

## Research: portfolio trends for backend engineers (2025-2026)

After studying top portfolios (Brittany Chiang, Josh Comeau, Lee Robinson, Rauno Freiberg, and others), the
differentiators that matter most for a backend engineer are:

| Pattern                                 | Why it works for a backend engineer                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Control Center/monitoring aesthetic** | Instantly signals "this person builds production systems." Grafana/Datadog-inspired layout feels native.                                |
| **Terminal/CLI interaction**            | The ultimate backend flex. A hidden in-browser terminal where visitors type `help`, `about`, `projects` — memorable and domain-perfect. |
| **Interactive architecture diagrams**   | Shows systems thinking. Click a node → see details. Proves you understand the stack beyond surface level.                               |
| **Scroll-driven storytelling**          | Reveals information in a narrative arc. Keeps recruiters engaged through the full journey.                                              |
| **Live metrics / animated counters**    | Builds credibility. "2+ years" becomes a counting animation. "20+ servers" becomes a real-time-ish counter.                             |
| **Case study depth**                    | Architecture diagrams, tradeoff discussions, before/after metrics — these close the deal with technical hires.                          |
| **Page transitions**                    | Makes multi-page feel native. Blog → Home feels like one app, not separate pages.                                                       |
| **Micro-interactions**                  | Every hover, click, and scroll feels deliberate. Shows attention to craft.                                                              |

---

## Validation & feedback

The plan was reviewed by two close friends (senior engineers). Their scoring:

### Round 1 (first review)

| Criterion          | Score | Notes                                        |
| ------------------ | ----- | -------------------------------------------- |
| 💡 Idea            | 10/10 | "Chưa ai làm kiểu này cho portfolio bao giờ" |
| 🎮 Game server fit | 10/10 | "Rất hợp với identity của backend engineer"  |
| 🎨 Impression      | 9/10  | Mạnh hơn 90% portfolio hiện tại              |
| 🔧 Practicality    | 9/10  | Làm được, maintain được                      |
| 📈 Scalability     | 9/10  | Có thể mở rộng dễ dàng sau này               |

**Overall: 9.5/10**

### Round 2 (second review — after applying round 1 feedback)

| Criterion                 | Score  | Notes                                                      |
| ------------------------- | ------ | ---------------------------------------------------------- |
| 🆔 Identity               | 10/10  | "Không thể nhầm lẫn với ai — bản sắc rất rõ"               |
| 🎨 Originality            | 10/10  | "Chưa thấy portfolio nào thiết kế theo hướng này"          |
| 🔧 Maintainability        | 9/10   | "Kiến trúc tốt, dễ mở rộng, dễ bảo trì"                    |
| 📖 Technical storytelling | 10/10  | "Incident History + ADR là những điểm sáng xuất sắc"       |
| ⚡ Wow factor             | 8.5/10 | "Còn thiếu một hero moment thực sự — cần packet simulator" |
| 🔮 Overall                | 9.7/10 | "Mạnh hơn 95% portfolio, gần đạt đẳng cấp thế giới"        |

**Overall: 9.7/10**

### Key feedback incorporated (round 1)

1. **Rename**: "Dashboard" → **"Control Center" / "Operations Console"** — feels more active and systems-native
2. **Add "Incident History"** — storytelling through production incidents you've resolved
3. **Add "System Metrics"** — CPU, Memory, Uptime, Connections as a metaphor for personal stats
4. **Add "Architecture Decision Records (ADR)"** — per-project tradeoff documentation
5. **Keep WebGL, but contain it** — ~10% subtle WebGL as atmosphere (particles, packet flow, node pulse)
6. **Restructure roadmap** into clearer phases, starting with the shell and layering depth

### Key feedback incorporated (round 2)

7. **Live Packet Simulator** (⭐ hero moment) — real-time animated packets flowing through the system topology, with
   hoverable nodes showing live metrics. This is the missing "wow" layer.
8. **Terminal personality** — added `ping`, `status`, `stack`, `history`, `coffee`, `skills graph` commands to make the
   terminal feel like a real production shell.
9. **PagerDuty incident format** — Incident History now uses Severity · Impact · Root Cause · Resolution · Lessons
   Learned format.
10. **Engineering Principles** — new "What I Believe" section that states your engineering philosophy as operational
    runbook entries.
11. **Multiplayer Simulation** — the Playground evolves from a simple WebSocket echo demo into a 1000-player simulation
    with live connection metrics.
12. **Observability / Logs panel** — a production-style panel showing Metrics, Logs, Traces, and Alerts as a metaphor
    for your career monitoring.

### Round 3 (third review — HM + Tech Lead + Awwwards perspective)

| Criterion                 | Score      | Notes                                                                                 |
| ------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| 🆔 Identity               | 10/10      | "Portfolio đẹp thì nhiều. Portfolio có philosophy thì rất ít"                         |
| 🎨 Originality            | 10/10      | "Không còn là plan làm portfolio — là product spec"                                   |
| 📖 Technical storytelling | 10/10      | "Incident History mạnh hơn bullet point gấp 100 lần"                                  |
| 🏗️ Engineering depth      | 10/10      | "ADR communicate 'I understand tradeoffs', không phải 'I know Redis'"                 |
| 🔧 Maintainability        | 8.5/10     | "70% sẽ stale sau 1 năm nếu không kỷ luật"                                            |
| 🎯 Recruiter impact       | 9.5/10     | "5 feature đã đủ đánh bại 98% portfolio backend engineer"                             |
| 👨‍💻 Tech lead impact       | 10/10      | "Tech lead nhìn vào sẽ phân biệt được ngay level engineer"                            |
| ⚡ Wow factor             | 9.5/10     | "Packet Simulator là hero moment còn thiếu"                                           |
| 🔮 Overall                | **9.8/10** | "Một trong những portfolio Game Server Developer ấn tượng nhất ở thị trường Việt Nam" |

**Overall: 9.8/10**

**Key feedback incorporated (round 3):**

13. **Scope containment** — cut Guestbook and GitHub activity (low ROI, high maintenance). Multiplayer Simulation and
    WebGL moved to "stretch" zone — only build after everything else is solid.
14. **Honesty check** — added authenticity guardrail: every Incident and ADR must be grounded in real experience. Tech
    leads detect fake engineering in 30 seconds.
15. **Tier-based roadmap** — features regrouped by impact/effort (Tier 1 Must-Have → Tier 4 Danger Zone) so
    recruiter-first value is built before atmosphere.
16. **Observability panel pivot** — from fake rotating logs to real portfolio observability: tracks actual visitor
    behavior (section views, terminal commands, ADR opens).
17. **Recruiter 20-40s first scan** — hero section (topology + terminal + packet sim) must communicate everything in the
    first glance. Depth features (ADR, Incidents) are for those who stay.

---

## North star: "Systems Operations Console"

> The visitor lands on what looks like a **production operations console** — not a portfolio. Sections are "panels."
> Navigation is a "service bar." The content reads like an **engineering runbook** for the person behind the systems.
>
> It should feel closer to **Grafana + GitHub profile + PagerDuty incident log** than to **LinkedIn + résumé**.

**Core experience shift:**

| Before (CV + scroll)           | After (Systems Operations Console)                                            |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Linear scroll through sections | Control center panels with status indicators and live metrics                 |
| Static metrics                 | Animated counters that count up on scroll (CPU, Memory, Uptime, Connections)  |
| Plain contact form             | "Direct line" with system status + terminal interaction                       |
| Blog as separate page          | Blog as "changelog" / "runbook" with reading progress                         |
| Passive consumption            | Active exploration (click nodes, type commands, inspect systems, review ADRs) |
| One layout for all             | Context-aware panels that adapt to content type                               |
| No visual atmosphere           | Subtle WebGL layer: particles, packet flow, node pulse (gated, ~10% weight)   |

---

## Core transformation (Tier 1-2)

These changes fundamentally shift the experience with manageable effort. Build the shell, then the depth.

### 1. Interactive terminal Easter egg

**What:** A hidden terminal that opens when the user presses the `` ` `` (backtick) key or clicks a subtle prompt in the
footer. Once open, visitors can type commands:

```
help          → List available commands
about         → Show bio
projects      → List featured work
skills        → Show capability map
contact       → Show contact info
blog          → Latest posts
cv / resume   → Download link
clear         → Clear terminal
theme         → Toggle dark/light
whoami        → Playful response
uptime        → "Systems Operations Console · Online since [date]"
metrics       → Show live-ish system stats (CPU/Memory/Uptime)
incidents     → List resolved incidents
ping          → Ping a service: `ping redis`, `ping db`, `ping gateway`
status        → Current system status / availability
stack         → Show full tech stack
history       → Show command history
coffee        → "☕ Caffeine level critical" (fun response)
skills graph  → Visual skill matrix in terminal
```

**Implementation:**

- New client component: `components/Terminal.tsx`
- Uses a Zustand-like store for command history and visibility state
- Styled like xterm.js / Windows Terminal — dark background, monospace green-on-black or cyan-on-dark
- Animates in/out with Framer Motion
- `prefers-reduced-motion` respected (instant toggle instead of slide)
- Mobile: accessible via a floating button instead of keyboard shortcut

**Files to create/modify:**

- `components/Terminal.tsx` (new)
- `components/TerminalSession.tsx` (command parser state machine, new)
- `app/[locale]/layout.tsx` (mount globally)
- `messages/en.json`, `messages/vi.json` (terminal copy)

**Cost:** Medium (~200 lines of TSX + state logic)

---

### 2. Interactive system topology

**What:** The existing `SystemVisualization` SVG becomes clickable. Each node (Player, Gateway, Game Server, Redis,
Database) expands on click/hover to show:

- A short description of what this component does
- Technologies used
- A real-world example from your experience

**Implementation:**

- Add `onClick`/`onMouseEnter` handlers to SVG `<g>` elements
- A tooltip/panel appears beside or below the topology
- Use Framer Motion `AnimatePresence` for smooth panel transitions
- Animate SVG node highlights (glow, pulse, border)
- Add latency labels on edges (e.g., "2ms", "0.1ms", "5ms") as optional detail layer
- Mobile: tap-to-expand, stacked vertical layout

**Files to create/modify:**

- `components/SystemVisualization.tsx` (add interactivity)
- `components/SystemNodePanel.tsx` (new — detail panel)
- `app/globals.css` (interactive node hover styles)

**Cost:** Medium (~150 lines added to existing component)

---

### 3. Animated metrics & live status indicators

**What:** Transform static proof items and metrics into animated counters and status indicators that feel like a
production operations console.

- **Hero metrics rail** counts up on scroll (0 → 2+ years, 0 → 20+ servers, etc.)
- **Status badges** with colored indicators:
    - 🟢 Available for work (green pulse)
    - 🟡 Limited capacity (yellow)
    - 🔴 Not available (red)
- **"System Health"** widget showing portfolio status (all systems nominal)
- Metrics use `useIntersectionObserver` + `gsap` or Framer Motion for the count-up

**Implementation:**

- Reusable `AnimatedCounter` component that animates from 0 to target
- `StatusDot` component with pulse animation
- Integrate into the proof section and hero dossier panel
- Use the existing `scroll-progress.ts` store to trigger animations when sections enter viewport

**Files to create/modify:**

- `components/ui/animated-counter.tsx` (new)
- `components/ui/status-dot.tsx` (new)
- `app/[locale]/_components/HomePage.tsx` (integrate into hero + proof)
- `messages/en.json`, `messages/vi.json` (add status copy)

**Cost:** Small (~80 lines total for both primitives)

---

### 4. Control Center shell layout

**What:** Add operations console framing elements that reinforce the "Control Center" concept without breaking the
existing design system.

- **Top bar** becomes a "service bar" — left: site name with status dot, center: section nav (already exists), right:
  "system time" (live clock) + theme toggle
- **Footer** becomes a "system footer" — shows "Last deployed", "System uptime", "Node status", terminal trigger
- **Section backgrounds** alternate between subtle grid lines and panel-style cards
- **Section labels** styled as "panel headers" (like Grafana panel titles)

**Implementation:**

- Modify the existing header to include a live clock
- Create a console-style footer component
- Add subtle grid patterns to section backgrounds
- Keep everything within the existing token system — no new visual break

**Files to create/modify:**

- `components/ConsoleFooter.tsx` (new)
- `app/[locale]/layout.tsx` (add footer)
- `app/[locale]/_components/HomePage.tsx` (header enhancements)
- `app/globals.css` (console panel styles)

**Cost:** Medium (~120 lines, mostly CSS + layout)

---

### 5. Case study architecture diagrams

**What:** Each project in the Work section gets a lightweight architecture diagram showing the system's data flow,
components, and tech stack. Not generic icons — actual system design sketches.

**Implementation option A (cheap):** Pure CSS/HTML node diagrams (boxes + arrows via borders/pseudo-elements).
**Implementation option B (medium):** SVG diagrams per project, inline in the component. **Implementation option C
(premium):** A single reusable `ArchitectureDiagram` component driven by a typed config object:

```ts
interface ArchDiagramNode {
	id: string;
	label: string;
	type: 'client' | 'server' | 'database' | 'cache' | 'external';
	sublabel?: string;
}

interface ArchDiagramEdge {
	from: string;
	to: string;
	label?: string;
	protocol?: string;
}
```

Start with option A for the first pass (CSS boxes + arrow connectors), then migrate to option C when the pattern proves
valuable.

**Files to create/modify:**

- `components/ArchitectureDiagram.tsx` (new — start with CSS-only)
- `app/[locale]/_data/content.ts` (add architecture data per project)
- `app/[locale]/_components/HomePage.tsx` (integrate into work cards)

**Cost:** Medium for option A (~100 lines component + data)

---

## Interactive depth (Tier 1-2)

These additions add significant depth and differentiation. Build on the core transformation.

### 6. Interactive experience timeline

**What:** The Experience section becomes a clickable, scrollable timeline. Each role expands on click to show:

- A summary of responsibilities
- Key achievements with metrics
- Technologies used (as tags)
- Context about the team/project size

**Implementation:**

- Use Framer Motion `AnimatePresence` for expand/collapse animations
- Vertical timeline line runs through the center (desktop) or left (mobile)
- Each entry is numbered + dated
- Active entry has a glowing dot on the timeline
- Keyboard accessible (Enter/Space to expand)

**Files to create/modify:**

- `components/ExperienceTimeline.tsx` (new — replaces the current list)
- `app/[locale]/_components/HomePage.tsx` (swap in new component)
- `app/[locale]/_data/content.ts` (expand experience data shape)

**Cost:** Medium (~150 lines)

---

### 7. Live "now running" status widget

**What:** A small widget (in the header or as a floating badge) showing what you're currently focused on:

```
▶ NOW RUNNING
  Focus: Real-time backend systems
  Stack: Node.js · WebSocket · Redis
  Status: Open to opportunities
```

**Implementation:**

- A small client component that reads from a config file
- Has a blinking green dot (CSS animation)
- Styled as a terminal bar
- Content is manually updated (not live API — keeps it simple and build-safe)

**Files to create/modify:**

- `components/NowRunning.tsx` (new)
- `app/[locale]/_components/HomePage.tsx` (add to header or hero)
- `lib/now-running.ts` (new — data source)

**Cost:** Small (~40 lines)

---

### 8. Blog reading progress & article enhancements

**What:** Article pages get:

- A **reading progress bar** at the top (like Medium, styled as a cyan gradient bar)
- **Estimated reading time** shown prominently
- **Article "stats"** footer: word count, reading time, topics
- **Code blocks** get a "copy" button + language label
- **Table of contents** sticky sidebar highlights current section

**Most of this is already in the blog system** — verify what exists and fill gaps.

**Files to modify:**

- `app/[locale]/blog/[slug]/page.tsx` (add progress bar, stats)
- `components/blog/` (enhance existing components)
- Create `components/blog/ReadingProgress.tsx` if not existing

**Cost:** Medium (~100 lines across multiple files)

---

### 9. Page transitions (home ↔ blog)

**What:** Smooth shared-element transitions between the homepage and blog pages, making the multi-page experience feel
like a single-page app.

**Implementation:**

- Already have `BlogTransition.tsx` with Framer Motion `AnimatePresence` — extend it
- Add a subtle page-level fade/slide transition for all route changes
- Keep it GPU-cheap: transform + opacity only
- Respect `prefers-reduced-motion`

**Files to modify:**

- `components/blog/BlogTransition.tsx` (extend to cover all pages)
- `app/[locale]/layout.tsx` or `template.tsx` (wrap with transition)

**Cost:** Small (~30 lines, mostly extending existing work)

---

### 10. Micro-interactions pass

**What:** Add subtle feedback to every interactive element:

- Buttons: scale on tap/click (already in Button component — verify)
- Cards: slight lift on hover (translateY -2px + shadow change)
- Links: subtle underline animation on hover
- Tags/badges: color pulse on hover
- System topology: node glow on hover
- Nav items: active indicator animation
- Theme toggle: smooth icon morph

**Implementation:** CSS `transition` for most cases, Framer Motion `whileHover`/`whileTap` for interactive components.
No new JS dependencies needed.

**Files to modify:** Throughout — but each change is 1-3 lines per element.

**Cost:** Medium (many small changes across files, but each is trivial)

---

## Systems depth & storytelling (Tier 1-2)

These additions add the storytelling and decision-making layers that make the portfolio unforgettable.

### 11. System Metrics (CPU / Memory / Uptime / Connections)

**What:** A dedicated panel that displays personal career stats through the metaphor of system resources. Instead of
boring bullet points, visitors see:

```
┌─ System Resources ──────────────────┐
│  CPU     ████████░░  82%  (2+ yrs)  │
│  Memory  ██████░░░░  64%  (senior)  │
│  Uptime  ⏸ 4 years operational      │
│  Connections ████████░ 78% (shipping)│
└──────────────────────────────────────┘
```

- **CPU** → Experience level / technical density (2+ years of backend engineering)
- **Memory** → Breadth of knowledge (Node.js, Redis, Docker, WebSocket, PostgreSQL, etc.)
- **Uptime** → Career span / reliability (4 years and counting)
- **Connections** → Number of shipped projects / active connections

**Implementation:**

- Animated SVG bar or CSS progress bars
- Count-up animation on scroll reveal (GSAP or Framer Motion)
- Styled as a terminal widget or Grafana-style panel
- Data driven from a typed config in `content.ts`

**Files to create/modify:**

- `components/SystemMetrics.tsx` (new)
- `components/ui/metrics-bar.tsx` (new — reusable primitive)
- `app/[locale]/_components/HomePage.tsx` (integrate into hero or proof section)
- `app/[locale]/_data/content.ts` (add metrics data)

**Cost:** Medium (~100 lines)

---

### 12. Incident History (PagerDuty format)

**What:** A timeline of "production incidents" — but instead of server outages, these are **career challenges** you've
resolved. Each incident follows the PagerDuty standard format:

```
INC-001  │ SEV-1  │ Game backend: monolith → microservices
         │────────────────────────────────────────────────────
         │ Impact:       Matchmaking latency increased 8× during peak (10k+ concurrent players)
         │ Root Cause:   Monolith couldn't scale read/write paths independently
         │ Detection:    PagerDuty alert — latency p99 breached 2s threshold
         │ Resolution:   Strangled monolith into 6 services over 4 months · Rolling deploy
         │ Lessons:      "Service boundaries should match domain aggregates, not team structure"
         │ Date:         2024-06
```

This is **storytelling through incident reports**. It frames problems as system events — natural for a backend engineer
and far more engaging than "I have strong problem-solving skills."

**Example entries:**

| ID      | Title                                       | Severity | Impact                                     |
| ------- | ------------------------------------------- | -------- | ------------------------------------------ |
| INC-001 | Game backend: monolith → microservices      | SEV-1    | 8× latency for 10k+ users                  |
| INC-002 | WebSocket latency optimization              | SEV-2    | 120ms p99 → 15ms p99 for real-time updates |
| INC-003 | Zero-downtime DB migration for 50GB dataset | SEV-2    | Risk of 30min write outage                 |
| INC-004 | Real-time analytics pipeline                | SEV-3    | 10k+ events/sec throughput ceiling         |

**Implementation:**

- A new section in the homepage (after Experience or as a standalone panel)
- Data defined in `content.ts` as typed incident records
- Styled as a PagerDuty / incident-management dashboard
- Each incident is expandable (Framer Motion `AnimatePresence`)

**Files to create/modify:**

- `components/IncidentHistory.tsx` (new)
- `app/[locale]/_components/HomePage.tsx` (add section)
- `app/[locale]/_data/content.ts` (add incident data)
- `messages/en.json`, `messages/vi.json` (section copy)

**Cost:** Medium (~120 lines)

---

### 13. Architecture Decision Records (ADR) per project

**What:** Each project card gets a set of ADRs — lightweight documents explaining key technical decisions and tradeoffs:

- **Onky**: Why Redis instead of Kafka for the matchmaking queue?
- **VMU**: Why WebSocket instead of HTTP polling for real-time metrics?
- **TinyLink**: Why stateful server instead of serverless redirect?

Each ADR is 3-5 sentences max. They live as expandable panels in the project card.

**ADR format:**

```markdown
## ADR-001: Redis over Kafka for matchmaking queue

**Context:** Onky needed a real-time queue for 10k+ concurrent matchmaking requests.

**Decision:** Chose Redis Lists + BRPOP over Kafka.

**Tradeoffs:**

- Zero infrastructure overhead (already running Redis)
- Sub-millisecond push/pop latency

* No built-in rebalancing for consumer groups
* Manual partitioning for multi-region

**Status:** Accepted · 2024-03
```

**Implementation:**

- ADR data as typed arrays in `content.ts`, attached to each project
- Expandable ADR panel in the Work section (Framer Motion `AnimatePresence`)
- Styled as engineering design docs (monospace headers, clean typography)
- Could eventually live as separate MDX files under `content/adrs/` for permalinking

**Files to create/modify:**

- `app/[locale]/_data/content.ts` (add ADR data per project)
- `components/AdrPanel.tsx` (new)
- `app/[locale]/_components/HomePage.tsx` (integrate into work cards)

**Cost:** Small–Medium (~80 lines component + data)

---

### 14. Engineering Principles ("What I Believe")

**What:** A dedicated section that states your engineering philosophy as operational runbook entries. Instead of a vague
"About Me" paragraph, visitors see concise, memorable principles that reveal how you think:

```
┌─ Engineering Runbook ─────────────────────────┐
│                                                │
│  PRINCIPLE 1: Measure first, tune second       │
│  ─────────────────────────────────────────────  │
│  "Every optimization starts with a baseline.   │
│  Without numbers, it's just an opinion."       │
│                                                │
│  PRINCIPLE 2: Simplicity scales                │
│  ─────────────────────────────────────────────  │
│  "The best system is the one you don't need    │
│  to build. The second best is the one you can  │
│  debug at 3 AM."                               │
│                                                │
│  PRINCIPLE 3: Reliability beats cleverness     │
│  ─────────────────────────────────────────────  │
│  "Predictable systems win marathons. Fancy     │
│  algorithms lose production."                  │
│                                                │
│  PRINCIPLE 4: Build observability first        │
│  ─────────────────────────────────────────────  │
│  "If you can't see it, you can't fix it.       │
│  Instrument before you ship."                  │
│                                                │
│  PRINCIPLE 5: Own the incident, learn the      │
│  lesson                                        │
│  ─────────────────────────────────────────────  │
│  "Blameless postmortems > blame. Every outage  │
│  is a chance to make the system stronger."     │
│                                                │
└────────────────────────────────────────────────┘
```

**Implementation:**

- A new section in the homepage (after Experience, or as a standalone panel in the Tier 1-2 area)
- Data defined in `content.ts` as typed principle records
- Styled as a terminal / runbook document (monospace, bordered, cyan accents)
- Each principle animates in on scroll (staggered fade-up)
- Hover reveals a short "evidence" line showing where you applied this principle

**Files to create/modify:**

- `components/EngineeringPrinciples.tsx` (new)
- `app/[locale]/_components/HomePage.tsx` (add section)
- `app/[locale]/_data/content.ts` (add principle data)
- `messages/en.json`, `messages/vi.json` (section copy)

**Cost:** Small (~60 lines)

---

### 15. Observability / Live Logs panel (portfolio observability)

**What:** A production-style observability panel that displays Metrics, Logs, Traces, and Alerts. Unlike the previous
plan (fake rotating logs), this panel tracks **real visitor behavior** — every section view, terminal command, and ADR
open emits a log entry. The panel becomes a live feed of actual portfolio activity:

```
┌─ Live Logs ──────────────────────────────────────┐
│ [INFO]  New visitor · SG · referrer: github.com   │
│ [INFO]  Entered section: Work                     │
│ [INFO]  Executed command: help                    │
│ [WARN]  Opened ADR-002 · Redis vs Kafka           │
│ [INFO]  Entered section: Incident History         │
│ [INFO]  Expanded INC-003                          │
│ [WARN]  Session duration > 5m · high engagement   │
│ [INFO]  Entered section: Contact                  │
│ [INFO]  Executed command: whoami                  │
│ [INFO]  Session ended · duration 00:07:34          │
└────────────────────────────────────────────────────┘
  ■ All systems nominal  ▲ 2 warnings  ● 0 alerts
```

**What the panels mean:**

| Panel       | Career Metaphor                                                                          |
| ----------- | ---------------------------------------------------------------------------------------- |
| **Metrics** | Career stats: languages, years, projects shipped                                         |
| **Logs**    | Real visitor activity feed — section views, terminal commands, ADR/incident interactions |
| **Traces**  | Journey map: how a visitor moved through the portfolio (hero → work → blog → contact)    |
| **Alerts**  | Notifications of notable achievements (years of experience milestones, project launches) |

**Implementation:**

- Each section and interactive element emits events to a lightweight observable store (Zustand or React context)
- The panel subscribes to this store and renders log entries with timestamps
- Entries are ephemeral (live session only — no storage, no privacy concern)
- Three status indicators at the bottom: green (nominal), yellow (warnings), red (alerts)
- Styled like Grafana / Datadog log panels — monospace, dark background, colored severity levels
- Distinguished from fake logs by a small banner: "You · live session"

**Files to create/modify:**

- `components/ObservabilityPanel.tsx` (new)
- `lib/observability-store.ts` (new — event emitter/observable store)
- `app/[locale]/_components/HomePage.tsx` (add section + emit events on section enter)
- `components/Terminal.tsx` (emit events on command execution)
- `components/IncidentHistory.tsx` (emit events on incident expand)
- `components/AdrPanel.tsx` (emit events on ADR open)
- `messages/en.json`, `messages/vi.json` (section copy)

**Cost:** Medium (~120 lines)

---

## Hero moment & atmosphere (Tier 1, 3 & S)

### 16. Live Packet Simulator (⭐ Hero Moment)

**What:** The system topology comes alive. Real-time animated packets flow continuously through the Client → Gateway →
Game Server → Redis → Database pipeline. Hovering any node reveals live metrics in a tooltip:

```
┌─ Gateway ─────────────────────┐
│  ● Active                      │
│  Latency:      2ms             │
│  Connections:  842             │
│  Queue Depth:  12              │
│  Throughput:   1.4k req/s      │
└────────────────────────────────┘
```

Like a Datadog live trace, the packet animation shows data moving through the stack — proving you understand distributed
systems at a glance. This is the **visual centerpiece** of the portfolio and the first thing visitors see.

**Key interactions:**

- **Auto-play**: On load, packets flow continuously along the topology edges with slight randomization (varying speeds,
  colors for different protocols: WebSocket = cyan, HTTP = green, Redis = orange)
- **Hover node**: Shows real-time-ish metrics panel (latency, connections, throughput, queue depth)
- **Click node**: Opens the detail panel (same as interactive topology feature, but with metric context)
- **Hover edge**: Shows protocol label + average latency
- **Stats bar** below the topology: "843 connections · 2ms avg latency · 1.4k req/s · 99.97% uptime"

**Implementation:**

- Extends the existing `SystemVisualization.tsx` — adds CSS/JS packet dot elements that move along SVG paths
- Uses `requestAnimationFrame` for smooth animation (no new dependencies)
- Metrics data from a typed config in `content.ts`
- Tooltip: pure CSS/React state (no library needed)
- `prefers-reduced-motion` check: static topology with pulse indicators only
- Mobile: static topology with tap-to-view metrics (no auto-flow to save battery)

**Files to create/modify:**

- `components/SystemVisualization.tsx` (extend with packet animation + metrics)
- `components/PacketFlow.tsx` (new — animation controller)
- `components/NodeMetrics.tsx` (new — tooltip component)
- `app/[locale]/_data/content.ts` (add node metrics data)
- `lib/motion/` (extend with packet animation helpers)

**Cost:** Medium (~150 lines, mostly extending existing topology)

### 17. Radar chart / skill matrix

**What:** The Capabilities section becomes a **radar chart** or **heatmap matrix** showing proficiency across dimensions
(realtime, backend, data, observability, delivery, etc.). Each cell shows the technologies and a self-rated proficiency
bar.

**Implementation:**

- Use SVG for a radar chart or CSS Grid for a heatmap
- Animate on scroll reveal
- Each cell is clickable to show more detail
- Keep it lightweight — no charting library, draw with SVG/CSS

**Cost:** Medium

---

## Stretch zone (no ETA)

_These features are aspirational — high effort, high risk, or narrow ROI. Only build after Tier 1 and Tier 2 are shipped
and content is populated. See the Tier-based roadmap below for rationale._

### 18. Multiplayer Simulation playground

**What:** An interactive in-browser simulation that showcases your real-time systems expertise. Instead of a simple
WebSocket echo demo, visitors see a live multiplayer environment where they can spawn 1000 fake players and watch the
system react in real time:

```
┌─ Multiplayer Simulation ──────────────────────────┐
│                                                    │
│  🟢 Connected · ws://sim.portfolio.dev:8080        │
│                                                    │
│  Active Players: 1,047                              │
│  ┌─ Connection Log ──────────────────────────┐     │
│  │ [12:00:01] Player_942  connected  (SEA)   │     │
│  │ [12:00:02] Player_943  connected  (US-E)  │     │
│  │ [12:00:02] Player_944  connected  (EU-W)  │     │
│  │ [12:00:03] Packet sent  →  broadcast #4192│     │
│  │ [12:00:03] Player_127  disconnected       │     │
│  │ [12:00:04] Player_945  connected  (JP)    │     │
│  │ [12:00:04] Packet received ← Player_512   │     │
│  └────────────────────────────────────────────┘     │
│                                                    │
│  Metrics:  5ms avg latency · 0 dropped · 99.8% up  │
│                                                    │
│  [Spawn 100] [Spawn 1000] [Disconnect All]         │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Implementation:**

- A dedicated page: `/[locale]/playground`
- Client component that opens a WebSocket connection to a lightweight server (or simulates locally)
- Connection log with timestamps and player IDs
- Live metrics: active connections, avg latency, dropped packets, uptime
- Three action buttons: Spawn 100, Spawn 1000, Disconnect All
- Backend: a lightweight WebSocket server (separate deployment or serverless function) that simulates player traffic
- The most "backend-native" feature — proves you build realtime systems at scale

**Cost:** Large

---

### 19. Subtle WebGL layer

**What:** A lightweight, gated WebGL layer that adds atmospheric depth without distracting from content. ~10% of the
visual weight — enhancement, not centerpiece.

- **Background particles** — slow-moving, low-opacity particle field in the hero section
- **Packet flow animation** — data packets traveling along the system topology edges (already have SMIL animation in
  SVG; WebGL could enhance this with glow trails)
- **Node pulse** — subtle breathing pulse on topology nodes
- **Depth/parallax** — mouse-driven parallax on the topology or hero elements

**Guardrails:**

- Gated behind a capability check (`navigator.gpu` or similar) + `prefers-reduced-motion` check
- Max 10% of total page GPU/CPU budget — if it impacts LCP or INI, it gets cut
- Falls back gracefully to the static SVG topology
- Uses a lightweight approach (raw WebGL or a minimal lib like `PIXI.js` or `Three.js` with tree-shaking)
- Rendered in a single `<canvas>` overlay, not DOM
- Mobile: disabled by default (battery/performance), opt-in via toggle

**Files to create/modify:**

- `components/WebglLayer.tsx` (new)
- `hooks/useWebglCapability.ts` (new — capability detection)
- `app/[locale]/_components/HomePage.tsx` (mount in hero/topology section)

**Cost:** Medium–High (~150 lines for a minimal implementation)

### 20. Print-as-CV stylesheet

**What:** A print stylesheet that reformats the portfolio as a clean, ATS-friendly CV/Resume PDF.

**Implementation:**

- Add `@media print` CSS rules
- Hide interactive elements (nav, animations, topology)
- Linear layout: summary → experience → skills → projects → education → contact
- Works with the browser's Print to PDF

**Cost:** Small

---

## Polish, scale & stretch (Tier 3 & S)

### 21. Accessibility deep audit

- Full keyboard navigation test
- Screen reader testing (VoiceOver, NVDA)
- Focus management for modals/terminal
- Color contrast verification across all themes

### 22. Performance optimization

- Lighthouse audit target: 95+ across all categories
- Bundle analysis with `@next/bundle-analyzer`
- Image optimization pass
- Font loading optimization

### 23. Vietnamese blog parity

- Translate existing 3 blog posts to Vietnamese
- Establish a content creation cadence for both locales
- Add `content/blog/vi/` directory with localized posts

### 24. Analytics with privacy focus

- Optional: privacy-first analytics (Plausible, Umami, or similar)
- Track: section engagement, blog read rate, terminal usage
- No PII collection

---

## Implementation roadmap (Tier-based)

_Tiers are prioritised by impact. Tier 1 must ship before Tier 2 starts. Tier 3–S are stretch goals._

### Tier 1 — Must have (Sprint 1-6)

_"The minimum viable portfolio that redefines the category"_

These 8 features form the core experience. Alone, they already beat 98% of backend engineer portfolios.

- [x] Existing: Static topology SVG, Lenis smooth scroll, full design system
- [ ] **Control Center shell layout** (service bar, console footer, panel headers)
- [ ] **Interactive terminal** (`Terminal.tsx`) — with personality commands
- [ ] **Interactive system topology** (clickable SVG nodes + detail panel)
- [ ] **Case study architecture diagrams** (CSS boxes + connectors)
- [ ] **Incident History** — PagerDuty format (Severity, Impact, Root Cause, Resolution, Lessons)
- [ ] **Architecture Decision Records** per project (expandable ADR panels)
- [ ] **Engineering Principles** — "What I Believe" section
- [ ] **Live Packet Simulator** — real-time animated packets on topology + hover metrics

**Goal:** A recruiter lands and immediately sees a systems operations console. They can explore the topology, open the
terminal, read incidents and ADRs, and understand how you think — not just what you've done.

### Tier 2 — Nice to have (Sprint 7-10)

_"Depth and craft — layered on top of the solid foundation"_

- [ ] **Animated metrics** (`AnimatedCounter`, `StatusDot`) — quick visual win
- [ ] **Interactive experience timeline** (expandable, animated)
- [ ] **Observability / Live Logs panel** — real portfolio visitor tracking (Metrics, Logs, Traces, Alerts)
- [ ] **"Now running" status widget** (`NowRunning.tsx`)
- [ ] **Blog reading progress & article enhancements**
- [ ] **Page transitions** (extend `BlogTransition.tsx`)
- [ ] **Micro-interactions pass** (hover, tap, transition polish)
- [ ] **System Metrics panel** (CPU/Memory/Uptime/Connections metaphor)

**Goal:** Every section is polished and interactive. The observability panel proves you build systems that watch
themselves.

### Tier 3 — Optional (Future)

_"Worth doing if there's time and content is populated"_

- [ ] Radar chart / heatmap skill matrix
- [ ] Privacy-first analytics

### Stretch zone — Danger (No ETA)

_"High effort, high risk, or narrow ROI. Only after everything else is solid."_

- [ ] Multiplayer Simulation playground (spawn fake players, live metrics)
- [ ] Subtle WebGL layer (particles, packet flow trails, node pulse)
- [ ] Print-as-CV stylesheet
- [ ] Accessibility deep audit
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Vietnamese blog parity

---

## Effort summary

| Feature                       | Effort    | Impact                              | Tier |
| ----------------------------- | --------- | ----------------------------------- | ---- |
| Control Center shell          | Medium    | 🔥🔥🔥🔥 (frames everything)        | 1    |
| Interactive terminal          | Medium    | 🔥🔥🔥🔥🔥 (signature feature)      | 1    |
| Interactive topology          | Medium    | 🔥🔥🔥🔥 (deepens existing asset)   | 1    |
| Case study diagrams           | Medium    | 🔥🔥🔥🔥 (closes deals)             | 1    |
| Incident History              | Medium    | 🔥🔥🔥🔥🔥 (signature storytelling) | 1    |
| Architecture Decision Records | Small–Med | 🔥🔥🔥🔥 (engineering depth)        | 1    |
| Engineering Principles        | Small     | 🔥🔥🔥🔥 (philosophy)               | 1    |
| Live Packet Simulator         | Medium    | 🔥🔥🔥🔥🔥 (hero moment)            | 1    |
| Animated metrics              | Small     | 🔥🔥🔥 (quick win)                  | 2    |
| Interactive timeline          | Medium    | 🔥🔥🔥 (better storytelling)        | 2    |
| Observability / Logs panel    | Medium    | 🔥🔥🔥🔥 (production identity)      | 2    |
| "Now running" widget          | Small     | 🔥🔥 (charm)                        | 2    |
| Blog reading progress         | Medium    | 🔥🔥🔥 (UX polish)                  | 2    |
| Page transitions              | Small     | 🔥🔥🔥 (cohesion)                   | 2    |
| Micro-interactions            | Medium    | 🔥🔥🔥 (craft perception)           | 2    |
| System Metrics panel          | Medium    | 🔥🔥🔥 (clever metaphor)            | 2    |
| Radar chart / skill matrix    | Medium    | 🔥🔥🔥 (visual depth)               | 3    |
| Analytics                     | Small     | 🔥🔥 (insight)                      | 3    |
| Multiplayer Simulation        | Large     | 🔥🔥🔥🔥🔥 (ultimate flex)          | S    |
| Subtle WebGL layer            | Med–High  | 🔥🔥🔥🔥 (premium atmosphere)       | S    |

## Guardrails

- **WebGL: contained, gated, ~10% visual weight.** Any 3D must be atmospheric enhancement, not centerpiece. Gated behind
  `navigator.gpu` + `prefers-reduced-motion` check. If it impacts LCP or INI, it gets cut. Falls back gracefully to
  static SVG. Mobile-disabled by default.
- **Honesty check: every Incident and ADR must be grounded in real experience.** Tech leads detect fake engineering in
  30 seconds. If a claim can't be backed by actual work, cut it or frame it as "what I learned from studying X."
  Authenticity beats polish.
- **Maintain contrast ≥ 4.5:1** and keep copy recruiter-legible (see `docs/DESIGN_SYSTEM.md`).
- **DOM-first, GPU-cheap first.** Animate transforms/opacity. WebGL is a contained enhancement, not a dependency.
- **Keep TypeScript strict.** Avoid `any` unless there is a documented reason.
- **Prefer Server Components by default.** Terminal, interactive elements, and WebGL will need `"use client"` — keep
  them isolated in small client wrappers.
- **Do not add new runtime dependencies** unless the existing stack (GSAP, Framer Motion, Radix) cannot do the job.
  WebGL layer is the only exception and should use the leanest viable approach.

## Status

### Tier 1 — Must have

- [ ] Control Center shell layout (service bar, console footer, panel headers)
- [ ] Interactive terminal (`Terminal.tsx`) — with personality commands
- [ ] Interactive system topology (clickable SVG nodes + detail panel)
- [ ] Case study architecture diagrams (CSS boxes + connectors)
- [ ] Incident History — PagerDuty format (Severity, Impact, Root Cause, Resolution, Lessons)
- [ ] Architecture Decision Records per project (expandable ADR panels)
- [ ] Engineering Principles / "What I Believe"
- [ ] Live Packet Simulator — hero topology with animated packets + hover metrics

### Tier 2 — Nice to have

- [ ] Animated metrics & status indicators (`AnimatedCounter`, `StatusDot`)
- [ ] Interactive experience timeline (expandable, animated)
- [ ] Observability / Live Logs panel (real portfolio visitor tracking)
- [ ] "Now running" status widget
- [ ] Blog reading progress & article enhancements
- [ ] Page transitions (home ↔ blog)
- [ ] Micro-interactions pass
- [ ] System Metrics panel (CPU/Memory/Uptime/Connections metaphor)

### Tier 3 — Optional

- [ ] Radar chart / skill matrix
- [ ] Privacy-first analytics

### Stretch zone — Danger (No ETA)

- [ ] Multiplayer Simulation playground (spawn fake players, live metrics)
- [ ] Subtle WebGL layer (particles, packet flow trails, node pulse)
- [ ] Print-as-CV stylesheet
- [ ] Accessibility deep audit
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Vietnamese blog parity
