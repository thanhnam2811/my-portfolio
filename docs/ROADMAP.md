# Portfolio Roadmap

## Current State

- [x] Localized homepage under `app/[locale]`
- [x] Single canonical homepage implementation in `app/[locale]/_components/HomePage.tsx`
- [x] Structured homepage content in `app/[locale]/_data/content.ts`
- [x] Localized copy in `messages/en.json` and `messages/vi.json`
- [x] GSAP-based homepage motion and chapter navigation
- [x] Production build, sitemap, and robots setup

---

## Completed Milestones

- [x] Core portfolio foundation, content, SEO, and deployment
- [x] Multi-language support with `next-intl`
- [x] Editorial-tech homepage refresh and recruiter-first positioning
- [x] Homepage consolidation: legacy v1 removed, `/{locale}` is the canonical route

---

## Next Priority: Technical Blog

### Product Direction

- [x] Blog is the next major product step after homepage consolidation
- [x] Direction stays editorial-tech, recruiter-safe, and SEO-friendly
- [x] Motion should remain secondary to readability and credibility

### Foundation

- [ ] Add blog routes: `/[locale]/blog` and `/[locale]/blog/[slug]`
- [ ] Use local MDX content as the first source of truth
- [ ] Define typed frontmatter for slug, title, description, published date, tags, reading time, featured state, and
      cover image
- [ ] Build static content loading and invalid-slug handling

### UX and Content

- [ ] Build editorial blog index and article page layouts
- [ ] Add article metadata, previous/next navigation, and desktop TOC for long posts
- [ ] Launch with at least 3 cornerstone articles focused on backend systems, observability, and performance
- [ ] Keep first-pass blog publishing English-first; revisit Vietnamese localization after cadence is proven

### Integration and SEO

- [ ] Add blog entry points without weakening the homepage's portfolio-first flow
- [ ] Extend metadata and sitemap generation to cover blog pages
- [ ] Validate mobile readability, code block overflow, accessibility, and static generation behavior

---

## Near-Term Maintenance

- [ ] Refresh screenshots and supporting project media in `public/images/projects/`
- [ ] Review homepage copy for the next portfolio iteration
- [ ] Audit mobile spacing and chapter rhythm after future content edits
- [ ] Re-check Lighthouse and accessibility after meaningful UI changes

---

## Optional Additions

- [ ] Add monitoring or analytics if a concrete product need appears
- [ ] Expand project coverage when there are enough production-grade case studies

---

Updated: Jun 11, 2026
