# 🚀 Portfolio Roadmap

## Phase 1: Foundation

- [x] Initialize Next.js project with TypeScript
- [x] Configure TailwindCSS, ESLint, Prettier, Husky
- [x] Build Hero Section
- [x] Build About Me Section
- [x] Build Skills Section
- [x] Build Experience Section
- [x] Build Projects Section
- [x] Build Contact Section
- [x] Create Navbar/Header component
- [x] Create Footer component

---

## Phase 2: Content & Data

- [x] Update personal information (`app/_data/personal.ts`)
- [x] Add profile picture and social links
- [x] Update skills list (`app/_data/skills.ts`)
- [x] Add work experience (`app/_data/experience.ts`)
- [ ] Add 3-5 featured projects (`app/_data/project.ts`) _(1/5 - pending side projects)_
- [ ] Add screenshots/demos for projects

---

## Phase 3: UI/UX Enhancements

- [x] Add Dark/Light mode toggle
- [x] Smooth scroll navigation
- [x] Loading animations
- [x] Page transitions with Framer Motion
- [x] Responsive design for mobile/tablet
- [x] Hover effects for interactive elements

---

## Phase 4: Advanced Features

- [x] Working contact form (integrate email service)
- [x] Toast notifications
- [x] Scroll animations (animate on scroll) _(done with Framer Motion whileInView)_
- [ ] Blog section with MDX _(reprioritized - now the next major product step)_
- [ ] Analytics integration _(optional - skipped)_

---

## Phase 5: Optimization & SEO

- [x] Optimize images with next/image
- [x] Lazy loading components _(Framer Motion whileInView)_
- [x] Add meta tags, Open Graph, Twitter Cards
- [x] Create sitemap.xml and robots.txt
- [ ] Check Lighthouse score _(manual verification)_
- [ ] Check accessibility _(manual verification)_

---

## Phase 6: Deployment

- [x] Setup hosting on Vercel
- [x] Configure custom domain: https://thanhnam2811.vercel.app/
- [x] Setup environment variables
- [ ] Setup monitoring (uptime, errors) _(optional)_

---

## Phase 7: Premium Design (Minimalist Glass)

- [x] Redesign all sections (Hero, Projects, Experience, Contact) for a unified "Minimalist Glass" aesthetic
- [x] Modernize `Input` and `Textarea` (remove neumorphism, use clean glass)
- [x] Standardize layout spacing and grid alignment for extra scannability

---

## Phase 8: Interactive Experience

- [x] Implement Custom Cursor with trailing Aura effect (synced with avatar)
- [x] Implement Magnetic Interaction for all clickable items & avatar
- [x] Integrate **Lenis** for smooth, inertial scrolling experience
- [x] Enhance Section Reveals & Layout Transitions

---

## Phase 9: Final Polish & Optimization

- [x] Accessibility & Typography sweep
- [x] Performance check (Framer Motion optimization)
- [x] Final visual audit for "World-class" quality

---

## Phase 10: Multi-language Support (i18n)

- [x] Setup `next-intl` and i18n middleware
- [x] Migrate `app/` to `app/[locale]/` structure
- [x] Extract UI strings to translation JSON files
- [x] Implement Language Switcher component
- [x] Localized SEO & Metadata optimization

---

## Phase 11: Editorial-Tech Refresh

- [x] Reposition homepage for recruiter-first scanning
- [x] Reorder sections to: Hero → Experience → Projects → Skills → About → Contact
- [x] Replace carousel-style showcase with editorial project case-study layout
- [x] Rewrite EN/VI copy for stronger hierarchy, clearer proof, and more natural tone
- [x] Simplify navbar/footer to match the new reading flow
- [x] Reduce decorative motion and fix Framer Motion hydration mismatch in dev

---

## Phase 12: Technical Blog Launch (Next Priority)

### Product Decision

- [x] Choose **blog over more animation-heavy polish** as the next major step
- [x] Lock direction: **editorial-tech premium**, recruiter-safe, SEO-friendly
- [x] Keep motion secondary to readability and credibility

### Blog Foundation

- [ ] Add blog routes: `/[locale]/blog` and `/[locale]/blog/[slug]`
- [ ] Use **local MDX content** as the v1 source of truth
- [ ] Create typed frontmatter contract:
  - `slug`
  - `title`
  - `description`
  - `publishedAt`
  - `tags`
  - `readingTime`
  - `featured`
  - `coverImage`
- [ ] Build content loader for static generation
- [ ] Add 404 handling for invalid blog slugs

### Blog UX & Design

- [ ] Build blog index with editorial list layout instead of dense card grid
- [ ] Add featured post treatment at the top of the blog landing page
- [ ] Build article page with strong typography, controlled line length, and clean code blocks
- [ ] Add article metadata UI: date, reading time, tags
- [ ] Add previous/next post navigation
- [ ] Add sticky TOC on desktop for long articles
- [ ] Add subtle reading progress indicator
- [ ] Keep motion minimal: reveal, hover, and progress only

### Content Strategy

- [ ] Launch with at least **3 cornerstone articles**
- [ ] Article 1: game server architecture / real-time tradeoffs
- [ ] Article 2: monitoring, logging, and observability in backend systems
- [ ] Article 3: performance tuning or query optimization case study
- [ ] Keep v1 blog content **English-first**
- [ ] Revisit Vietnamese blog localization only after publishing cadence is proven

### Portfolio Integration

- [ ] Add `Blog` to navbar and footer without weakening recruiter-first homepage flow
- [ ] Add a lightweight blog preview block to homepage
- [ ] Add CTA such as “Read technical notes” from a relevant section
- [ ] Ensure homepage stays a portfolio first, content hub second

### SEO & Validation

- [ ] Add metadata/OG for blog list and article pages
- [ ] Extend sitemap to include blog URLs
- [ ] Verify static generation, slug routing, and invalid-slug behavior
- [ ] Check mobile readability and code block overflow
- [ ] Run accessibility pass on article navigation, TOC, and reading progress

---

> ✏️ Updated: Jun 04, 2026 - **Editorial-tech homepage refresh completed. Next major focus: launch a technical blog with local MDX.**
