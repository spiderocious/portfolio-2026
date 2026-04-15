# Admin Panel — Build Checklist

Architecture: **Feature-Sliced Design (FSD)**
Each admin section is a self-contained feature under `features/admin/features/[section]/`
with its own `screen/`, `parts/`, `api/`, `providers/`, `guards/`, `widgets/` as needed.

Build order listed at the bottom.

---

## Shared / Infrastructure

- [ ] `app/admin/layout.tsx` — admin shell (sidebar + topbar, auth guard)
- [ ] `features/admin/shared/` — cross-feature admin utilities
  - [ ] `features/admin/shared/guards/admin-auth-guard.tsx` — session check, redirects to `/admin/login` if unauthenticated
  - [ ] `features/admin/shared/utils/use-admin-query.ts` — base query wrapper
  - [ ] `features/admin/shared/helpers/format-date.ts`, `slugify.ts` etc.
- [ ] `features/admin/ui/` — reusable admin UI components
  - [ ] `markdown-editor/` — textarea + live preview toggle
  - [ ] `links-editor/` — dynamic key/value pairs
  - [ ] `live-data-editor/` — dynamic label/value stat rows
  - [ ] `image-upload/` — upload to Supabase Storage, returns URL
  - [ ] `tags-input/` — freeform tag add/remove
  - [ ] `confirm-dialog/` — delete confirmation modal
  - [ ] `data-table/` — reusable sortable/paginated table
  - [ ] `sidebar/` — nav links, active state, mobile collapse
  - [ ] `topbar/` — page title, logout, breadcrumb

---

## 1. Dashboard

Route: `/admin`
Feature: `features/admin/features/dashboard/`

```
dashboard/
├── api/
│   └── use-admin-stats.ts
├── screen/
│   ├── parts/
│   │   ├── stats-cards.tsx
│   │   ├── recent-views-table.tsx
│   │   └── recent-activity-list.tsx
│   └── dashboard-screen.tsx
```

- [ ] Stats cards — total visits (7d / 30d / all-time), blog reads, project interactions
- [ ] Recent page views table — last 50 rows (page, referrer, country, timestamp)
- [ ] Recent activity list — last 10 `activity_feed` entries with type icon
- [ ] Quick nav grid — cards linking to each content section

API:
- [ ] `app/api/admin/analytics/route.ts` — GET stats aggregates (`?range=7d|30d|90d`)

---

## 2. Projects

Route: `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]`
Feature: `features/admin/features/projects/`

```
projects/
├── api/
│   ├── use-projects.ts
│   ├── use-project.ts
│   ├── use-create-project.ts
│   └── use-update-project.ts
├── screen/
│   ├── parts/
│   │   ├── project-form.tsx       — shared create/edit form
│   │   └── projects-table.tsx     — list table
│   └── projects-screen.tsx        — list view
├── features/
│   ├── create-project/
│   │   └── screen/
│   │       └── create-project-screen.tsx
│   └── edit-project/
│       └── screen/
│           └── edit-project-screen.tsx
```

Form fields:
- [ ] Title, slug (auto-gen, editable), status, featured toggle
- [ ] Description — markdown editor
- [ ] Stack — tags input
- [ ] Cover image — image upload
- [ ] Links — links editor (deployed, github + custom keys)
- [ ] Live data — live data editor (label/value stat rows)

List view:
- [ ] Table: title, status, featured toggle, stack, created date, edit/delete
- [ ] Position reorder

API:
- [ ] `app/api/admin/projects/route.ts` — GET, POST
- [ ] `app/api/admin/projects/[id]/route.ts` — GET, PUT, DELETE

---

## 3. Experience

Route: `/admin/experience`, `/admin/experience/new`, `/admin/experience/[id]`
Feature: `features/admin/features/experience/`

```
experience/
├── api/
│   ├── use-experience-list.ts
│   ├── use-create-experience.ts
│   └── use-update-experience.ts
├── screen/
│   ├── parts/
│   │   ├── experience-form.tsx
│   │   └── experience-table.tsx
│   └── experience-screen.tsx
├── features/
│   ├── create-experience/screen/
│   └── edit-experience/screen/
```

Form fields:
- [ ] Role, company, company URL, location
- [ ] Start date, end date (nullable = current)
- [ ] Company logo — image upload
- [ ] Description — markdown editor
- [ ] Achievements — markdown editor (separate field)

API:
- [ ] `app/api/admin/experience/route.ts` — GET, POST
- [ ] `app/api/admin/experience/[id]/route.ts` — GET, PUT, DELETE

---

## 4. Experiments

Route: `/admin/experiments`, `/admin/experiments/new`, `/admin/experiments/[id]`
Feature: `features/admin/features/experiments/`

```
experiments/
├── api/
├── screen/
│   ├── parts/
│   │   ├── experiment-form.tsx
│   │   └── experiments-table.tsx
│   └── experiments-screen.tsx
├── features/
│   ├── create-experiment/screen/
│   └── edit-experiment/screen/
```

Form fields:
- [ ] Title, slug, status (`live` / `wip` / `archived` / `idea`), featured toggle
- [ ] Description — markdown editor
- [ ] Stack — tags input
- [ ] Cover image — image upload
- [ ] Links — links editor

API:
- [ ] `app/api/admin/experiments/route.ts` — GET, POST
- [ ] `app/api/admin/experiments/[id]/route.ts` — GET, PUT, DELETE

---

## 5. Awards

Route: `/admin/awards`, `/admin/awards/new`, `/admin/awards/[id]`
Feature: `features/admin/features/awards/`

```
awards/
├── api/
├── screen/
│   ├── parts/
│   │   ├── award-form.tsx
│   │   └── awards-table.tsx
│   └── awards-screen.tsx
├── features/
│   ├── create-award/screen/
│   └── edit-award/screen/
```

Form fields:
- [ ] Title, issuer, date, URL
- [ ] Description — markdown editor
- [ ] Image — image upload

API:
- [ ] `app/api/admin/awards/route.ts` — GET, POST
- [ ] `app/api/admin/awards/[id]/route.ts` — GET, PUT, DELETE

---

## 6. Board

Route: `/admin/board`
Feature: `features/admin/features/board/`

```
board/
├── api/
│   ├── use-board-items.ts
│   ├── use-create-board-item.ts
│   ├── use-update-board-item.ts
│   ├── use-sub-items.ts
│   └── use-create-sub-item.ts
├── providers/
│   └── board-provider.tsx         — holds selected item, open form state
├── screen/
│   ├── parts/
│   │   ├── board-kanban.tsx        — 4-column kanban
│   │   ├── board-card.tsx          — card with expand, edit, delete
│   │   ├── board-card-detail.tsx   — expanded: description + sub-items list
│   │   ├── board-item-form.tsx     — create/edit item modal/inline
│   │   └── sub-item-form.tsx       — create/edit sub-item
│   └── board-screen.tsx
```

- [ ] Kanban: 4 columns (Backlog / In Progress / Done / On Hold)
- [ ] Admin sees all items including `is_private = true` (visually marked)
- [ ] Expand card → description (markdown) + sub-tickets
- [ ] Create / edit / delete board items
- [ ] Create / edit / delete sub-tickets (one level deep)
- [ ] Toggle `is_private` on items and sub-items
- [ ] Position reorder within columns

API:
- [ ] `app/api/admin/board/route.ts` — GET, POST
- [ ] `app/api/admin/board/[id]/route.ts` — PUT, DELETE
- [ ] `app/api/admin/board/[id]/sub-items/route.ts` — GET, POST
- [ ] `app/api/admin/board/[id]/sub-items/[subId]/route.ts` — PUT, DELETE

---

## 7. Analytics

Route: `/admin/analytics`
Feature: `features/admin/features/analytics/`

```
analytics/
├── api/
│   └── use-analytics.ts
├── screen/
│   ├── parts/
│   │   ├── page-views-chart.tsx
│   │   ├── top-pages-table.tsx
│   │   ├── project-interactions-table.tsx
│   │   └── blog-reads-table.tsx
│   └── analytics-screen.tsx
```

- [ ] Range tabs — 7d / 30d / 90d
- [ ] Page views over time — line chart
- [ ] Top pages ranked table
- [ ] Project interactions per project (views, link clicks, GitHub clicks)
- [ ] Blog reads by post
- [ ] Referrer breakdown

API:
- [ ] `app/api/admin/analytics/route.ts` — GET `?range=7d|30d|90d&type=...`

---

## 8. Chat History

Route: `/admin/chats`, `/admin/chats/[id]`
Feature: `features/admin/features/chats/`

```
chats/
├── api/
│   ├── use-conversations.ts
│   └── use-conversation-messages.ts
├── screen/
│   ├── parts/
│   │   └── conversations-table.tsx
│   └── chats-screen.tsx
├── features/
│   └── conversation-detail/
│       └── screen/
│           ├── parts/
│           │   └── message-thread.tsx
│           └── conversation-detail-screen.tsx
```

- [ ] List: session ID, started at, message count, last active
- [ ] Thread view: user/assistant bubbles, timestamps

API:
- [ ] `app/api/admin/chats/route.ts` — GET list
- [ ] `app/api/admin/chats/[id]/route.ts` — GET messages

---

## 9. System Context (LLM Knowledge)

Route: `/admin/system-context`, `/admin/system-context/new`, `/admin/system-context/[id]`
Feature: `features/admin/features/system-context/`

```
system-context/
├── api/
│   ├── use-system-context.ts
│   ├── use-create-context-entry.ts
│   └── use-update-context-entry.ts
├── screen/
│   ├── parts/
│   │   ├── context-entries-table.tsx
│   │   └── assembled-prompt-preview.tsx  — full concatenated prompt modal
│   └── system-context-screen.tsx
├── features/
│   ├── create-entry/screen/
│   └── edit-entry/screen/
```

- [ ] Table: label, category, active toggle, position
- [ ] Reorder rows
- [ ] Preview assembled system prompt (full concatenated output modal)
- [ ] Create / edit / delete entries
- [ ] Toggle `is_active` without deleting

API:
- [ ] `app/api/admin/system-context/route.ts` — GET, POST
- [ ] `app/api/admin/system-context/[id]/route.ts` — PUT, DELETE

---

## 10. Activity Feed

Route: `/admin/activity`
Feature: `features/admin/features/activity/`

```
activity/
├── api/
│   ├── use-activity-feed.ts
│   └── use-create-activity.ts
├── screen/
│   ├── parts/
│   │   ├── activity-list.tsx
│   │   └── activity-form.tsx
│   └── activity-screen.tsx
```

- [ ] List all entries — type icon, title, description, date
- [ ] Add entry form — type, title, description, URL, metadata
- [ ] Delete entry

API:
- [ ] `app/api/admin/activity/route.ts` — GET, POST
- [ ] `app/api/admin/activity/[id]/route.ts` — DELETE

---

## Build Order

1. Shared admin UI components + guards (auth guard, sidebar, topbar, markdown-editor, image-upload, tags-input, etc.)
2. Admin layout (`app/admin/layout.tsx`)
3. Dashboard
4. Projects — most complex form, nail the pattern here
5. Experience
6. Experiments
7. Awards
8. Board
9. Activity feed
10. Analytics
11. Chat history
12. System context
