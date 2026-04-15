# Public Pages — Build Checklist

Architecture: **Feature-Sliced Design (FSD)**
Each public section is a feature under `features/public/features/[section]/`

---

## Shared / Infrastructure

- [ ] `features/public/shared/guards/` — none needed (all public)
- [ ] `features/public/shared/utils/use-page-view.ts` — fires analytics on mount
- [ ] `features/public/ui/` — reusable public UI
  - [ ] `nav/` — top navigation bar
  - [ ] `footer/` — site footer
  - [ ] `markdown-renderer/` — renders markdown content from DB
  - [ ] `tag-badge/` — stack/tech tag pill
  - [ ] `llm-popup/` — floating LLM chat widget (global, shown on all pages)
  - [ ] `theme-toggle/` — floating dark/light toggle (already built)

---

## Page 1 — Landing `/`

Feature: `features/public/features/landing/`

```
landing/
├── api/
│   ├── use-liveworks.ts
│   └── use-stats.ts
├── screen/
│   ├── parts/
│   │   ├── hero.tsx
│   │   ├── liveworks-widget.tsx
│   │   ├── featured-projects.tsx
│   │   └── stats-bar.tsx
│   └── landing-screen.tsx
```

- [ ] Hero — name (DM Serif Display), title, tagline, open-to-work pill, CTA buttons
- [ ] Liveworks widget — latest commit or project update, live feel
- [ ] Featured projects strip — 2–3 cards (featured = true), title + stack tags
- [ ] Stats bar — total visits, blog reads, project interactions
- [ ] Quick nav links — to /projects, /blog, /experience, /board

---

## Page 2 — About `/about`

Feature: `features/public/features/about/`

```
about/
├── screen/
│   ├── parts/
│   │   ├── bio.tsx
│   │   ├── skill-grid.tsx
│   │   └── personal-timeline.tsx
│   └── about-screen.tsx
```

- [ ] Bio block — who I am, background (static copy)
- [ ] Skills grid — grouped by category (Frontend / Backend / Infra / Other), each with tech tags
- [ ] Personal timeline — notable life/career moments (static, not work history)

---

## Page 3 — Projects `/projects`

Feature: `features/public/features/projects/`

```
projects/
├── api/
│   └── use-projects.ts
├── screen/
│   ├── parts/
│   │   ├── project-card.tsx
│   │   ├── project-filters.tsx
│   │   └── project-live-data.tsx
│   └── projects-screen.tsx
├── features/
│   └── project-detail/
│       ├── api/
│       │   └── use-project.ts
│       └── screen/
│           ├── parts/
│           │   ├── project-header.tsx
│           │   ├── project-links.tsx
│           │   ├── project-live-data.tsx
│           │   └── project-body.tsx
│           └── project-detail-screen.tsx
```

- [ ] Project cards — title, description excerpt, stack tags, cover image, links
- [ ] Filter by stack tag
- [ ] Individual project page `/projects/[slug]` — full description (markdown), all links, live data stats

---

## Page 4 — Experience `/experience`

Feature: `features/public/features/experience/`

```
experience/
├── api/
│   └── use-experience.ts
├── screen/
│   ├── parts/
│   │   ├── experience-timeline.tsx
│   │   └── experience-item.tsx
│   └── experience-screen.tsx
```

- [ ] Vertical timeline — role, company (with logo), dates, location
- [ ] Each item expandable — description (markdown) + achievements (markdown list)
- [ ] Current role visually highlighted

---

## Page 5 — Blog `/blog`

Feature: `features/public/features/blog/`

```
blog/
├── api/
│   └── use-posts.ts
├── screen/
│   ├── parts/
│   │   └── post-card.tsx
│   └── blog-screen.tsx
├── features/
│   └── post-detail/
│       ├── api/
│       │   └── use-post.ts
│       └── screen/
│           ├── parts/
│           │   └── post-body.tsx
│           └── post-detail-screen.tsx
```

- [ ] Post list — title, cover image, brief, date, read time, tags
- [ ] Individual post `/blog/[slug]` — full rendered HTML from Hashnode, cover, metadata

---

## Page 6 — Experiments `/experiments`

Feature: `features/public/features/experiments/`

```
experiments/
├── api/
│   └── use-experiments.ts
├── screen/
│   ├── parts/
│   │   └── experiment-card.tsx
│   └── experiments-screen.tsx
├── features/
│   └── experiment-detail/
│       └── screen/
│           └── experiment-detail-screen.tsx
```

- [ ] Cards — title, status badge, stack tags, description excerpt
- [ ] Filter by status (live / wip / idea)
- [ ] Detail page `/experiments/[slug]` — full markdown description, links

---

## Page 7 — Awards `/awards`

Feature: `features/public/features/awards/`

```
awards/
├── api/
│   └── use-awards.ts
├── screen/
│   ├── parts/
│   │   └── award-item.tsx
│   └── awards-screen.tsx
```

- [ ] List/grid — title, issuer, date, description (markdown), optional link, optional image

---

## Page 8 — Board `/board`

Feature: `features/public/features/board/`

```
board/
├── api/
│   └── use-board.ts
├── screen/
│   ├── parts/
│   │   ├── kanban-board.tsx
│   │   ├── board-column.tsx
│   │   ├── board-card.tsx
│   │   └── board-card-detail.tsx
│   └── board-screen.tsx
```

- [ ] Read-only kanban — 4 columns (Backlog / In Progress / Done / On Hold)
- [ ] Cards: title, category badge, priority, optional due date
- [ ] Expand card → description (markdown) + sub-tickets list
- [ ] `is_private = true` items filtered out completely

---

## Build Order

1. Shared public UI (nav, footer, markdown-renderer, tag-badge, llm-popup)
2. Landing
3. Projects (list + detail)
4. Experience
5. Blog (list + detail)
6. Experiments (list + detail)
7. Awards
8. About
9. Board
