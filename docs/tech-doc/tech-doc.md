# Portfolio v2 — Technical Document

---

## 1. Introduction

This document outlines the technical design and implementation plan for portfolio v2. The portfolio goes beyond a static showcase — it's DB-driven, reflects real-time activity, supports an LLM-powered Q&A widget, and includes a private admin panel for managing all content and viewing analytics.

---

## 2. Problem Statement

The current portfolio is static and doesn't reflect how I actually work or what I'm currently doing. Content (projects, experience, experiments) is hardcoded and can't be updated without a deploy. There's no way for visitors to understand depth of work, follow along with active projects, or ask questions in a natural way. The new portfolio should feel alive and be easy to keep up to date.

---

## 3. Objectives and Scope

### Public Pages
- **Landing** — hero, liveworks widget, stats, quick links
- **About** — background, skills, values
- **Projects** — DB-driven project showcase
- **Experience** — DB-driven work history
- **Blog** — posts from Hashnode via API
- **Experiments** — DB-driven side projects
- **Awards** — DB-driven recognition and achievements

### Public Features
- **Board/Vision/Workspace** — live Jira-style board with sub-tickets (read-only for visitors)
- **LLM Popup** — floating chat widget (OpenAI), all conversations stored
- **Live Activity Feed** — real-time feed of commits, posts, updates
- **Liveworks Widget** — what I'm working on right now
- **Stats** — visits, blog reads, project interactions

### Admin Panel (private, `/admin`)
- **Dashboard** — analytics overview, recent activity, stats at a glance
- **Projects** — full CRUD, markdown descriptions, links, live data stats
- **Experience** — full CRUD, markdown descriptions and achievements
- **Experiments** — full CRUD, markdown descriptions
- **Awards** — full CRUD
- **Board** — CRUD for board items and sub-tickets
- **Analytics** — page views, project interactions, blog reads breakdowns
- **Chat history** — all stored LLM visitor conversations

---

## 4. Architecture

### 4.1 High-Level

```
Browser (Visitors)                   Browser (Me — Admin)
  └── Next.js Public App               └── Next.js Admin App (/admin/*)
        ├── Public pages                     ├── Dashboard
        ├── LLM popup widget                 ├── Content management
        └── Analytics hooks                  ├── Analytics views
                                             └── Chat history viewer
                  │                                    │
                  └──────────────┬─────────────────────┘
                                 │
                         Next.js API Routes (/api/*)
                                 │
                         ┌───────┴──────────┐
                      Supabase           OpenAI API
                   (PostgreSQL)       (chat completions)
                         │
                    Hashnode API
                  (blog, via server)
```

### 4.2 Rendering Strategy

| Page / Feature | Strategy | Reason |
|---|---|---|
| Landing, About | Static (SSG) | Rarely changes |
| Projects | ISR (revalidate: 3600) | DB-driven, infrequent updates |
| Experience | ISR (revalidate: 3600) | DB-driven, infrequent updates |
| Experiments | ISR (revalidate: 3600) | DB-driven, infrequent updates |
| Awards | ISR (revalidate: 3600) | DB-driven, infrequent updates |
| Blog list | ISR (revalidate: 1800) | Hashnode-driven |
| Blog post | ISR (revalidate: 3600) | Rarely changes |
| Board/Workspace | SSR | Always show current state |
| Stats | ISR (revalidate: 60) | Near real-time |
| Live activity feed | Client-side fetch | Fresh on every view |
| Liveworks widget | Client-side fetch | Real-time feel |
| LLM popup | Client-side | Streamed response |
| Admin pages | SSR (authenticated) | Always fresh data, protected |

### 4.3 On-Demand Revalidation

ISR pages have a time-based revalidation window, but waiting an hour to see your own updates live is not acceptable. Every admin API route that mutates content will call Next.js `revalidatePath()` immediately after writing to Supabase — so the public page is invalidated and fresh on the very next visit.

**Revalidation map:**

| Admin action | Pages invalidated |
|---|---|
| Save / delete project | `/projects`, `/projects/[slug]` |
| Save / delete experience | `/experience` |
| Save / delete experiment | `/experiments`, `/experiments/[slug]` |
| Save / delete award | `/awards` |

**How it works:**
1. You save a new experience entry in the admin panel
2. `PUT /api/admin/experience/[id]` writes to Supabase
3. Same route calls `revalidatePath('/experience')`
4. Next visitor request to `/experience` triggers a fresh server render, pulls updated data from DB, caches the new HTML
5. Public page is live — no deploy, no waiting

Blog pages (Hashnode) are not in this map — they rely on time-based ISR since we don't control when Hashnode content changes. The 1800s window is fine for blog.

### 4.3 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Hosting | Netlify |
| Blog | Hashnode API (GraphQL) |
| LLM | OpenAI API (gpt-4o-mini) |
| Admin auth | Supabase Auth (email+password, single user) |
| Markdown rendering | react-markdown + remark-gfm |
| Markdown editing | Custom textarea with preview toggle (no heavy editor dep) |
| File storage | Supabase Storage (images for projects, experiments, awards, logos) |
| Language | TypeScript |

---

## 5. Feature Specifications

### 5.1 Landing Page

**Objective:** First impression. Communicates who I am, draws visitors into the work.

**Sections:**
- Hero — name, title, tagline, CTA (view work / contact)
- Liveworks widget — what I'm building right now
- Featured projects (2–3 cards, `featured = true`)
- Stats bar — visits, blog reads, project interactions
- Quick links to Blog, Experiments, Board

**Code impacts:**
- `app/page.tsx`
- `components/hero.tsx`
- `components/liveworks-widget.tsx`
- `components/stats-bar.tsx`
- `components/project-card.tsx` (reused, featured filter)

---

### 5.2 About Page

**Objective:** Full picture of who I am — background, skills, values.

**Sections:**
- Bio (static copy)
- Skills grouped by category (static data)
- Timeline of notable personal moments (static, not work history)

**Code impacts:**
- `app/about/page.tsx`
- `components/skill-grid.tsx`
- `components/timeline.tsx`
- `data/about.ts` — static bio, skills, timeline

---

### 5.3 Projects Page

**Objective:** Showcase of work, filterable, with rich project detail.

**Sections:**
- Project cards — title, description (markdown), stack tags, links, live data stats
- Filter by stack tag

**Data source:** `projects` table in Supabase (ISR).

**Code impacts:**
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx` — individual project detail page
- `components/project-card.tsx`
- `components/project-live-data.tsx` — renders live_data key/value stats
- `components/markdown-renderer.tsx` — shared markdown renderer
- `app/api/analytics/route.ts` — log project view on visit

---

### 5.4 Experience Page

**Objective:** Work history in a timeline format with descriptions and achievements.

**Data source:** `experience` table in Supabase (ISR).

**Sections:**
- Timeline entries — role, company, dates, description (markdown), achievements (markdown)

**Code impacts:**
- `app/experience/page.tsx`
- `components/experience-timeline.tsx`
- `components/experience-item.tsx`
- `components/markdown-renderer.tsx`

---

### 5.5 Blog Page

**Objective:** Surface Hashnode blog posts rendered inline on the portfolio — full SEO benefit, posts indexed under my domain.

**Data source:** Hashnode GraphQL API — `https://gql.hashnode.com` (POST only). No API key needed for public read queries.

**Sections:**
- Post list — title, date, cover image, brief, read time, tags
- Individual post — rendered inline (full HTML content from Hashnode, not a redirect)

**Hashnode GraphQL queries:**

Post list:
```graphql
query GetPublicationPosts {
  publication(host: "yourblog.hashnode.dev") {
    posts(first: 20) {
      edges {
        node {
          id
          title
          slug
          brief
          coverImage { url }
          publishedAt
          readTimeInMinutes
          tags { name slug }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

Single post by slug:
```graphql
query GetPost($slug: String!) {
  publication(host: "yourblog.hashnode.dev") {
    post(slug: $slug) {
      id
      title
      slug
      brief
      publishedAt
      readTimeInMinutes
      coverImage { url }
      content { html markdown }
      tags { name slug }
    }
  }
}
```

**Post body rendering:** `content.html` rendered with `dangerouslySetInnerHTML`, sanitized via `isomorphic-dompurify`.

**Pagination:** Cursor-based via `pageInfo.endCursor` + `hasNextPage`.

**generateStaticParams:** All post slugs pre-rendered at build time. ISR (revalidate: 3600) keeps them fresh. Bots see fully rendered HTML.

**Code impacts:**
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx` — `generateStaticParams` + renders `content.html`
- `lib/hashnode.ts` — GraphQL client + typed query helpers
- `isomorphic-dompurify` — sanitize HTML before render

---

### 5.6 Experiments Page

**Objective:** Smaller builds, tinkering, side work — with full markdown descriptions.

**Data source:** `experiments` table in Supabase (ISR).

**Code impacts:**
- `app/experiments/page.tsx`
- `app/experiments/[slug]/page.tsx`
- `components/experiment-card.tsx`
- `components/markdown-renderer.tsx`

---

### 5.7 Awards Page

**Objective:** Surface recognition, honours, and achievements.

**Data source:** `awards` table in Supabase (ISR).

**Layout:** Card or list — title, issuer, date, description (markdown), optional link.

**Code impacts:**
- `app/awards/page.tsx`
- `components/award-item.tsx`
- `components/markdown-renderer.tsx`

---

### 5.8 Board / Vision / Workspace

**Objective:** A live, read-only Jira-style board showing current goals, active work, and vision. Visitors see tickets and their sub-tickets. One level deep only.

**Layout:** Kanban columns — Backlog, In Progress, Done, On Hold. Each card shows title, category, priority, optional due date. Clicking a card expands to show description (markdown) and sub-tickets.

**Privacy:** Items and sub-items with `is_private = true` are filtered out of the public query. Only the admin sees everything.

**Data source:** `board_items` + `board_sub_items` tables (SSR). Public query: `WHERE is_private = false`.

**Code impacts:**
- `app/board/page.tsx` (SSR)
- `components/board/kanban-board.tsx`
- `components/board/board-column.tsx`
- `components/board/board-card.tsx`
- `components/board/board-card-detail.tsx` — expanded view with description + sub-tickets
- `components/markdown-renderer.tsx`
- `app/api/board/route.ts` — GET board items + sub-items grouped by status

---

### 5.9 LLM Popup

**Objective:** Floating chat widget — visitors ask questions about my work, experience, projects. Grounded in a detailed system prompt about me. All conversations stored.

**How it works:**
1. Visitor clicks floating button
2. Types a question
3. API route fetches all active `system_convos` rows from DB, assembles them into the system prompt
4. Full message history for the session + assembled system prompt sent to OpenAI
5. Streamed response displayed in popup
6. Both messages persisted to `llm_conversations` + `llm_messages`

**System prompt — dynamic via `system_convos` table:**
No hardcoded prompt. No redeploys needed to update what the LLM knows about me.
- Each row in `system_convos` is one discrete piece of information (professional identity, work history, personal background, tone/response instructions, etc.)
- Rows fetched ordered by `position`, concatenated into the system message
- `is_active = false` rows excluded without deletion
- Pre-seeded from `/Users/feranmi/codebases/2025/yearnings/about-me/all-details-export.json` — each entry becomes one row
- Managed via admin panel (add, edit, delete, toggle active, reorder)

**Session handling:** Anonymous `session_id` (UUID) generated client-side, stored in `sessionStorage`. Sent with every request to group messages into one conversation.

**Rate limiting:** IP-based — 10 requests per 10 minutes per IP (in-memory map or Upstash Redis).

**Code impacts:**
- `components/llm-popup/llm-popup.tsx` — floating shell
- `components/llm-popup/chat-view.tsx` — message thread
- `components/llm-popup/chat-input.tsx` — input + send
- `app/api/llm/route.ts` — POST, streams OpenAI, writes to DB
- `lib/openai.ts` — client + system prompt
- `hooks/use-llm-chat.ts` — chat state, session management, streaming

---

### 5.10 Live Activity Feed

**Objective:** Feed of recent activity — commits, blog posts, project updates, experiments, notes.

**Data source:** `activity_feed` table. Populated via:
- GitHub push webhooks → commit entries
- Admin panel → manual entries (blog posts, project updates, notes)

**Layout:** Vertical list, newest first. Type icon, title, description, timestamp.

**Code impacts:**
- `app/activity/page.tsx` (or section within landing)
- `components/activity-feed.tsx`
- `components/activity-item.tsx`
- `app/api/activity/route.ts` — GET (public) + POST (authenticated)
- `app/api/webhooks/github/route.ts` — receives push webhook, writes to `activity_feed`

---

### 5.11 Liveworks Widget

**Objective:** Small widget on landing and optionally nav — shows what I'm building right now.

**Data source:** Latest 1–2 entries from `activity_feed` where `type IN ('commit', 'project_update')`.

**Code impacts:**
- `components/liveworks-widget.tsx`
- Queries `/api/activity?limit=2&type=commit,project_update`

---

### 5.12 Stats

**Objective:** Aggregate stats — honest signal of reach and engagement.

**Displayed:** Total visits, blog reads, project interactions.

**Data source:** Aggregated queries against `page_views`, `blog_reads`, `project_interactions`. ISR, revalidate: 60s.

**Code impacts:**
- `components/stats-bar.tsx`
- `app/api/stats/route.ts` — GET aggregated counts

---

### 5.13 Analytics (Background)

**Objective:** Silent logging of page views and project interactions.

**Approach:**
- Page views: client-side `useEffect` → POST `/api/analytics` on mount
- Project interactions: logged on link click

**Code impacts:**
- `app/api/analytics/route.ts` — POST `{ type, page?, project_slug?, interaction_type? }`
- `hooks/use-page-view.ts`
- `lib/supabase.ts` — server + browser clients

---

## 6. Admin Panel

The admin panel lives at `/admin/*`. All routes are protected — only accessible when authenticated via Supabase Auth. A middleware check on the `/admin` path prefix redirects unauthenticated requests to `/admin/login`.

### 6.1 Auth

- **Provider:** Supabase Auth — email + password (single user, me)
- **Session:** Managed via Supabase SSR helpers (`@supabase/ssr`)
- **Middleware:** `middleware.ts` — checks session on `/admin/*`, redirects to `/admin/login` if unauthenticated
- **Login page:** `app/admin/login/page.tsx`

### 6.2 Admin Dashboard

**Objective:** At-a-glance view of everything — stats, recent activity, quick links to content sections.

**Sections:**
- Stats cards — total visits (7d, 30d, all-time), blog reads, project interactions
- Recent page views — table of last 50 visits with page, referrer, country, timestamp
- Recent activity feed — last 10 `activity_feed` entries
- Quick nav — links to each content management section

**Code impacts:**
- `app/admin/page.tsx`
- `components/admin/stats-cards.tsx`
- `components/admin/recent-views-table.tsx`
- `components/admin/recent-activity-list.tsx`

### 6.3 Projects Management

**Features:**
- List all projects (table with title, status, featured toggle, position reorder)
- Create new project
- Edit project — all fields including markdown description, links (dynamic key/value), live data (dynamic key/value), stack tags
- Delete project
- Toggle featured
- Reorder via position field

**Code impacts:**
- `app/admin/projects/page.tsx` — list
- `app/admin/projects/new/page.tsx`
- `app/admin/projects/[id]/page.tsx` — edit
- `components/admin/project-form.tsx` — shared form with markdown preview toggle
- `components/admin/markdown-editor.tsx` — textarea + live preview panel
- `components/admin/links-editor.tsx` — dynamic key/value link pairs
- `components/admin/live-data-editor.tsx` — dynamic label/value stat pairs
- `app/api/admin/projects/route.ts` — GET list, POST create
- `app/api/admin/projects/[id]/route.ts` — GET one, PUT update, DELETE

### 6.4 Experience Management

**Features:**
- List all experience entries (table with role, company, dates, position reorder)
- Create, edit, delete
- Markdown editor for description and achievements fields

**Code impacts:**
- `app/admin/experience/page.tsx`
- `app/admin/experience/new/page.tsx`
- `app/admin/experience/[id]/page.tsx`
- `components/admin/experience-form.tsx`
- `app/api/admin/experience/route.ts`
- `app/api/admin/experience/[id]/route.ts`

### 6.5 Experiments Management

**Features:**
- List, create, edit, delete
- Markdown description
- Links, stack tags, status toggle

**Code impacts:**
- `app/admin/experiments/page.tsx`
- `app/admin/experiments/new/page.tsx`
- `app/admin/experiments/[id]/page.tsx`
- `components/admin/experiment-form.tsx`
- `app/api/admin/experiments/route.ts`
- `app/api/admin/experiments/[id]/route.ts`

### 6.6 Awards Management

**Features:**
- List, create, edit, delete
- Markdown description

**Code impacts:**
- `app/admin/awards/page.tsx`
- `app/admin/awards/new/page.tsx`
- `app/admin/awards/[id]/page.tsx`
- `components/admin/award-form.tsx`
- `app/api/admin/awards/route.ts`
- `app/api/admin/awards/[id]/route.ts`

### 6.7 Board Management

**Features:**
- Kanban view of all board items (editable — admin sees all including private ones)
- Create, edit, delete board items
- Create, edit, delete sub-tickets per item (one level deep)
- Toggle `is_private` on items and sub-items
- Drag to reorder within columns (via position field)
- Markdown description on items and sub-items

**Code impacts:**
- `app/admin/board/page.tsx`
- `components/admin/board/admin-kanban.tsx`
- `components/admin/board/board-item-form.tsx`
- `components/admin/board/sub-item-form.tsx`
- `app/api/admin/board/route.ts` — GET, POST
- `app/api/admin/board/[id]/route.ts` — PUT, DELETE
- `app/api/admin/board/[id]/sub-items/route.ts` — GET, POST
- `app/api/admin/board/[id]/sub-items/[subId]/route.ts` — PUT, DELETE

### 6.8 Analytics Views

**Features:**
- Page views over time (last 7d, 30d, 90d)
- Top pages by view count
- Project interactions breakdown (views, link clicks, GitHub clicks per project)
- Blog reads by post
- Referrer breakdown

**Code impacts:**
- `app/admin/analytics/page.tsx`
- `components/admin/analytics/page-views-chart.tsx`
- `components/admin/analytics/top-pages-table.tsx`
- `components/admin/analytics/project-interactions-table.tsx`
- `components/admin/analytics/blog-reads-table.tsx`
- `app/api/admin/analytics/route.ts` — GET with query params for range/type

### 6.9 Chat History

**Features:**
- List all conversations (session ID, started at, message count, last active)
- Click into a conversation to read the full message thread

**Code impacts:**
- `app/admin/chats/page.tsx`
- `app/admin/chats/[id]/page.tsx`
- `components/admin/chat-thread.tsx`
- `app/api/admin/chats/route.ts` — GET conversation list
- `app/api/admin/chats/[id]/route.ts` — GET messages for a conversation

### 6.10 LLM System Context Management

**Objective:** Manage what the LLM knows about me — add, edit, delete, reorder, and toggle `system_convos` rows. No redeploy needed to update the LLM's knowledge.

**Features:**
- List all rows (label, category, active toggle, position)
- Create new entry (label, content, category, position)
- Edit existing entry
- Delete entry
- Toggle `is_active` without deleting
- Reorder via position
- Preview assembled system prompt (shows full concatenated output in order)

**Code impacts:**
- `app/admin/system-context/page.tsx`
- `app/admin/system-context/new/page.tsx`
- `app/admin/system-context/[id]/page.tsx`
- `components/admin/system-context-form.tsx`
- `components/admin/system-prompt-preview.tsx` — shows full assembled prompt
- `app/api/admin/system-context/route.ts` — GET list, POST create
- `app/api/admin/system-context/[id]/route.ts` — PUT update, DELETE

---

## 7. API Routes

### Public

| Route | Method | Purpose |
|---|---|---|
| `/api/analytics` | POST | Log page view or project interaction |
| `/api/stats` | GET | Return aggregated stats |
| `/api/activity` | GET | List activity feed items (paginated) |
| `/api/board` | GET | Board items + sub-items grouped by status (filters `is_private = false`) |
| `/api/llm` | POST | Stream OpenAI response (assembles system prompt from `system_convos`), store conversation |
| `/api/webhooks/github` | POST | Receive GitHub push webhook (HMAC verified) |

### Admin (authenticated — all require valid Supabase session)

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/projects` | GET, POST | List + create projects |
| `/api/admin/projects/[id]` | GET, PUT, DELETE | Single project |
| `/api/admin/experience` | GET, POST | List + create experience |
| `/api/admin/experience/[id]` | GET, PUT, DELETE | Single entry |
| `/api/admin/experiments` | GET, POST | List + create experiments |
| `/api/admin/experiments/[id]` | GET, PUT, DELETE | Single entry |
| `/api/admin/awards` | GET, POST | List + create awards |
| `/api/admin/awards/[id]` | GET, PUT, DELETE | Single entry |
| `/api/admin/board` | GET, POST | Board items |
| `/api/admin/board/[id]` | PUT, DELETE | Board item |
| `/api/admin/board/[id]/sub-items` | GET, POST | Sub-tickets for an item |
| `/api/admin/board/[id]/sub-items/[subId]` | PUT, DELETE | Single sub-ticket |
| `/api/admin/analytics` | GET | Analytics queries |
| `/api/admin/chats` | GET | Conversation list |
| `/api/admin/chats/[id]` | GET | Messages for a conversation |
| `/api/admin/activity` | POST | Add activity feed entry manually |
| `/api/admin/system-context` | GET, POST | List + create system_convos rows |
| `/api/admin/system-context/[id]` | PUT, DELETE | Update or delete a row |

---

## 8. Folder Structure

Code is organized using **Feature-Sliced Design (FSD)**. Admin sections are features under `features/admin/features/[section]/`, each self-contained with its own `screen/`, `parts/`, `api/`, `providers/`, `guards/`, `widgets/`.

```
portfolio-v2/
├── app/                                  # Next.js App Router (routing only — thin wrappers)
│   ├── page.tsx                          # → renders public landing feature
│   ├── about/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── experience/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── experiments/page.tsx
│   ├── experiments/[slug]/page.tsx
│   ├── awards/page.tsx
│   ├── board/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                    # Admin shell (sidebar + topbar)
│   │   ├── login/page.tsx
│   │   ├── page.tsx                      # → DashboardScreen
│   │   ├── projects/page.tsx             # → ProjectsScreen
│   │   ├── projects/new/page.tsx         # → CreateProjectScreen
│   │   ├── projects/[id]/page.tsx        # → EditProjectScreen
│   │   ├── experience/page.tsx
│   │   ├── experience/new/page.tsx
│   │   ├── experience/[id]/page.tsx
│   │   ├── experiments/page.tsx
│   │   ├── experiments/new/page.tsx
│   │   ├── experiments/[id]/page.tsx
│   │   ├── awards/page.tsx
│   │   ├── awards/new/page.tsx
│   │   ├── awards/[id]/page.tsx
│   │   ├── board/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── chats/page.tsx
│   │   ├── chats/[id]/page.tsx
│   │   ├── system-context/page.tsx
│   │   ├── system-context/new/page.tsx
│   │   └── system-context/[id]/page.tsx
│   └── api/
│       ├── analytics/route.ts
│       ├── stats/route.ts
│       ├── activity/route.ts
│       ├── board/route.ts
│       ├── llm/route.ts
│       ├── blog/route.ts
│       ├── webhooks/github/route.ts
│       └── admin/
│           ├── projects/route.ts
│           ├── projects/[id]/route.ts
│           ├── experience/route.ts
│           ├── experience/[id]/route.ts
│           ├── experiments/route.ts
│           ├── experiments/[id]/route.ts
│           ├── awards/route.ts
│           ├── awards/[id]/route.ts
│           ├── board/route.ts
│           ├── board/[id]/route.ts
│           ├── board/[id]/sub-items/route.ts
│           ├── board/[id]/sub-items/[subId]/route.ts
│           ├── analytics/route.ts
│           ├── chats/route.ts
│           ├── chats/[id]/route.ts
│           ├── activity/route.ts
│           ├── system-context/route.ts
│           └── system-context/[id]/route.ts
│
├── features/                             # FSD — all business logic lives here
│   ├── admin/
│   │   ├── shared/                       # Cross-feature admin utilities
│   │   │   ├── guards/
│   │   │   │   └── admin-auth-guard.tsx
│   │   │   ├── utils/
│   │   │   │   └── use-admin-query.ts
│   │   │   └── helpers/
│   │   │       ├── format-date.ts
│   │   │       └── slugify.ts
│   │   ├── ui/                           # Reusable admin UI components
│   │   │   ├── sidebar/
│   │   │   ├── topbar/
│   │   │   ├── markdown-editor/
│   │   │   ├── links-editor/
│   │   │   ├── live-data-editor/
│   │   │   ├── image-upload/
│   │   │   ├── tags-input/
│   │   │   ├── confirm-dialog/
│   │   │   └── data-table/
│   │   └── features/
│   │       ├── dashboard/
│   │       │   ├── api/
│   │       │   │   └── use-admin-stats.ts
│   │       │   └── screen/
│   │       │       ├── parts/
│   │       │       │   ├── stats-cards.tsx
│   │       │       │   ├── recent-views-table.tsx
│   │       │       │   └── recent-activity-list.tsx
│   │       │       └── dashboard-screen.tsx
│   │       ├── projects/
│   │       │   ├── api/
│   │       │   │   ├── use-projects.ts
│   │       │   │   ├── use-project.ts
│   │       │   │   ├── use-create-project.ts
│   │       │   │   └── use-update-project.ts
│   │       │   ├── screen/
│   │       │   │   ├── parts/
│   │       │   │   │   ├── projects-table.tsx
│   │       │   │   │   └── project-form.tsx
│   │       │   │   └── projects-screen.tsx
│   │       │   └── features/
│   │       │       ├── create-project/screen/create-project-screen.tsx
│   │       │       └── edit-project/screen/edit-project-screen.tsx
│   │       ├── experience/   # same pattern
│   │       ├── experiments/  # same pattern
│   │       ├── awards/       # same pattern
│   │       ├── board/
│   │       │   ├── api/
│   │       │   ├── providers/
│   │       │   │   └── board-provider.tsx
│   │       │   └── screen/
│   │       │       ├── parts/
│   │       │       │   ├── board-kanban.tsx
│   │       │       │   ├── board-card.tsx
│   │       │       │   ├── board-card-detail.tsx
│   │       │       │   ├── board-item-form.tsx
│   │       │       │   └── sub-item-form.tsx
│   │       │       └── board-screen.tsx
│   │       ├── analytics/
│   │       │   ├── api/
│   │       │   └── screen/
│   │       │       ├── parts/
│   │       │       │   ├── page-views-chart.tsx
│   │       │       │   ├── top-pages-table.tsx
│   │       │       │   ├── project-interactions-table.tsx
│   │       │       │   └── blog-reads-table.tsx
│   │       │       └── analytics-screen.tsx
│   │       ├── chats/
│   │       │   ├── api/
│   │       │   ├── screen/
│   │       │   │   ├── parts/conversations-table.tsx
│   │       │   │   └── chats-screen.tsx
│   │       │   └── features/
│   │       │       └── conversation-detail/
│   │       │           └── screen/
│   │       │               ├── parts/message-thread.tsx
│   │       │               └── conversation-detail-screen.tsx
│   │       ├── system-context/
│   │       │   ├── api/
│   │       │   ├── screen/
│   │       │   │   ├── parts/
│   │       │   │   │   ├── context-entries-table.tsx
│   │       │   │   │   └── assembled-prompt-preview.tsx
│   │       │   │   └── system-context-screen.tsx
│   │       │   └── features/
│   │       │       ├── create-entry/screen/
│   │       │       └── edit-entry/screen/
│   │       └── activity/
│   │           ├── api/
│   │           └── screen/
│   │               ├── parts/
│   │               │   ├── activity-list.tsx
│   │               │   └── activity-form.tsx
│   │               └── activity-screen.tsx
│   └── public/                           # Public site features (same FSD pattern)
│       ├── landing/
│       ├── projects/
│       ├── experience/
│       ├── blog/
│       ├── experiments/
│       ├── awards/
│       ├── board/
│       └── llm-popup/
│
├── shared/                               # Cross-feature, cross-concern
│   ├── constants/
│   │   └── routes.ts
│   ├── utils/
│   │   └── use-page-view.ts
│   └── helpers/
│
├── ui/                                   # Pure UI components (no business logic)
│   ├── markdown-renderer/
│   ├── theme-toggle/
│   └── icons/
│
├── lib/
│   ├── supabase.ts                       # Supabase client (server + browser)
│   ├── supabase-storage.ts               # Storage upload helpers (images → buckets)
│   ├── hashnode.ts                       # Hashnode GraphQL client + typed queries
│   └── openai.ts                         # OpenAI client (prompt assembled from DB at runtime)
│
├── middleware.ts                          # Auth guard for /admin/*
├── data/
│   └── about.ts                          # Static bio, skills, personal timeline
└── docs/
    ├── rough-idea.md
    ├── idea.md
    ├── how-i-build.md
    ├── mvp.md
    ├── tech-doc/
    │   ├── tech-doc.md
    │   └── data-model.md
    └── todos/
        └── admin-pages.md
```

---

## 9. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server-only, admin writes + storage uploads
OPENAI_API_KEY=                    # server-only
HASHNODE_PUBLICATION_HOST=         # e.g. yourblog.hashnode.dev — used in GraphQL queries
GITHUB_WEBHOOK_SECRET=             # server-only, HMAC verification of push webhook
```

> No `HASHNODE_ACCESS_TOKEN` needed — public blog reads require no authentication.

---

## 10. Deployment

- **Host:** Netlify
- **Build command:** `next build`
- **Framework preset:** Next.js
- **Environment variables:** set in Netlify dashboard
- **GitHub webhook endpoint:** `/api/webhooks/github` — must be publicly reachable
- **Admin route:** `/admin/*` protected at middleware level, no special Netlify config needed

---

## 11. Resources

- Data model: `tech-doc/data-model.md`
- MVP features: `docs/mvp.md`
- Supabase docs: https://supabase.com/docs
- Hashnode API: https://apidocs.hashnode.com
- OpenAI API: https://platform.openai.com/docs
- Next.js App Router: https://nextjs.org/docs/app
