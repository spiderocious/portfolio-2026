# Portfolio v2 — All Pages

`devferanmi.xyz` · 22 total pages · public + admin

---

## Public Pages (01–10)

---

### 01 — Landing `/`

**Description**
First impression. Introduces Feranmi — who he is, what he does, and signals credibility instantly. Has a real-time feel through the liveworks widget and live stats.

**Visual Elements**
- **Hero block** — large serif name (DM Serif Display), title, short tagline, "open to work" status pill with green dot
- **CTA buttons** — "view work" → #03, "contact.ai" → LLM popup
- **Liveworks widget** — small card showing latest commit/project update with live indicator
- **Featured projects strip** — 2–3 compact project cards (featured = true)
- **Stats bar** — total visits, blog reads, project interactions as monospace counters
- **Quick nav links** — minimal text links to main sections
- **Floating theme toggle** — top-right corner
- **Floating LLM popup button** — bottom-right corner
- **Grain texture overlay** — subtle warm paper feel

**User Actions**
- Read the hero introduction
- Click CTA to view work or open LLM chat
- See live activity in liveworks widget
- Click featured project card
- Toggle dark/light mode
- Open LLM popup and ask questions

**Goes To**
- [03 Projects](#03--projects-projects)
- [05 Blog](#05--blog-list-blog)
- [04 Experience](#04--experience-experience)
- [08 Board](#08--board--vision-board)
- [10 LLM Popup](#10--llm-popup-global-widget)

**Design Agent Context**
Editorial-technical, warm cream base, DM Serif Display name large, mono labels. Confident but not loud. The liveworks widget should feel genuinely live — pulsing indicator dot. Stats in monospace with a subtle count-up animation on load.

---

### 02 — About `/about`

**Description**
Full picture of who Feranmi is — background, technical range, personal values, and the journey. Not a resume; a human story with technical depth.

**Visual Elements**
- **Bio block** — 2–3 paragraphs, personal and direct, no corporate tone
- **Skills grid** — grouped by category (Frontend / Backend / Infrastructure / Other), tags with subtle icons or just clean mono text
- **Personal timeline** — vertical line with milestone dots: first code, first job, key moments. Not work history (that's page 04)
- **Nav bar** — top, links to all main sections

**User Actions**
- Read bio and background
- Browse skill categories
- Scroll through personal timeline
- Navigate to other sections

**Goes To**
- [01 Landing](#01--landing-)
- [03 Projects](#03--projects-projects)
- [04 Experience](#04--experience-experience)

**Design Agent Context**
Two-column layout on desktop — bio left, timeline right. Skills grid uses tag pills grouped under section headings in mono. Timeline dots should have a subtle entrance animation on scroll. Keep the tone warm and personal, not a LinkedIn profile.

---

### 03 — Projects List `/projects`

**Description**
Full project showcase — everything built, ordered by position. DB-driven. Each card is a window into a project without needing to open it.

**Visual Elements**
- **Page heading** — "projects" in large serif, total count in mono
- **Stack filter bar** — horizontal scrollable tag pills to filter by tech
- **Project cards grid** — title, description excerpt, cover image (if any), stack tag row, status badge (active/wip/archived), links (deployed, GitHub)
- **Live data chips** — if project has live_data, show "500k users" style chips on card

**User Actions**
- Filter by stack tag
- Click project card → project detail page
- Click deployed/GitHub link directly from card

**Goes To**
- [03d Project Detail](#03d--project-detail-projectsslug)
- [01 Landing](#01--landing-)

**Design Agent Context**
Cards in a 2-column grid on desktop, 1-column mobile. Cover image as a subtle background or top strip — don't force it if missing. Status badge uses mono text with color dot. Filter tags should animate cards in/out on selection with a quick fade. Generous spacing between cards.

---

### 03d — Project Detail `/projects/[slug]`

**Description**
Deep-dive into a single project. Full markdown description, all links, live stats, and stack details. Should feel like a case study, not a README.

**Visual Elements**
- **Project header** — title (large serif), status badge, stack tags row
- **Cover image** — wide banner if available
- **Links row** — icon + label buttons for deployed, GitHub, and any custom links
- **Live data stats row** — "500k users · $2M processed · 12k forms" in prominent mono counters
- **Markdown body** — full description rendered with headings, lists, code blocks
- **Back link** — ← back to projects

**User Actions**
- Read full project description
- Click any link (deployed, GitHub, custom)
- See live data stats at a glance
- Navigate back to projects list

**Goes To**
- [03 Projects](#03--projects-list-projects)

**Design Agent Context**
Single column, max-width ~720px centered. Live data stats should be the most visually prominent section — large mono numbers with small labels. Links as compact pill buttons. Markdown body uses the same typography system as the rest of the site.

---

### 04 — Experience `/experience`

**Description**
Work history as a timeline — companies, roles, impact. DB-driven. Shows the career arc clearly with depth when expanded.

**Visual Elements**
- **Page heading** — "experience" in large serif
- **Vertical timeline** — left-aligned line with dot markers at each entry
- **Experience item** — company logo (if any), role title, company name, dates, location
- **Expandable body** — description (markdown) and achievements (markdown bullet list) revealed on click
- **"current" indicator** — highlighted dot/badge on active role

**User Actions**
- Scroll timeline from most recent to oldest
- Click/tap an entry to expand description and achievements
- Click company URL if available

**Goes To**
- [01 Landing](#01--landing-)
- [02 About](#02--about-about)
- [03 Projects](#03--projects-list-projects)

**Design Agent Context**
Timeline dot for current role should pulse subtly. Expand/collapse with smooth height animation. Logo shown as small square if available, otherwise a monogram. Date range in mono, smaller than role title. Achievements rendered as a clean bullet list inside the expanded panel.

---

### 05 — Blog List `/blog`

**Description**
Blog posts pulled from Hashnode via GraphQL API. Rendered inline on the portfolio for full SEO benefit. List view shows all posts newest first.

**Visual Elements**
- **Page heading** — "blog" in large serif, post count in mono
- **Post cards** — cover image, title, brief excerpt, date, read time, tag pills
- **Tag filter** — filter posts by Hashnode tag

**User Actions**
- Browse post list
- Filter by tag
- Click post → post detail

**Goes To**
- [05d Post Detail](#05d--blog-post-detail-blogslug)
- [01 Landing](#01--landing-)

**Design Agent Context**
2-column card grid on desktop. Cover image as a top strip on each card — use a warm placeholder if missing. Date and read time in mono below the title. Tags as small pill badges. Cards should have subtle hover lift.

---

### 05d — Blog Post Detail `/blog/[slug]`

**Description**
Full blog post rendered inline. HTML content from Hashnode, sanitized and styled to match the portfolio design system. Fully SEO-indexed under devferanmi.xyz.

**Visual Elements**
- **Post header** — title (large serif), date, read time, tag pills
- **Cover image** — full-width banner
- **Post body** — rendered HTML from Hashnode, styled (headings, code blocks, lists, blockquotes)
- **Back link** — ← back to blog

**User Actions**
- Read the post
- Navigate back to blog list

**Goes To**
- [05 Blog](#05--blog-list-blog)

**Design Agent Context**
Single column, max-width ~680px centered. Post body needs careful typography — code blocks with mono font and subtle background, blockquotes with left border accent, headings in the display font. Reading experience should feel premium.

---

### 06 — Experiments `/experiments`

**Description**
Side projects, tinkering, ideas — the playground. More informal than projects. Shows curiosity and range. DB-driven.

**Visual Elements**
- **Page heading** — "experiments" in large serif, count
- **Status filter** — live / wip / idea / archived tabs
- **Experiment cards** — title, description excerpt, status badge, stack tags, links

**User Actions**
- Filter by status
- Click card → experiment detail
- Click links directly from card

**Goes To**
- [06d Experiment Detail](#06d--experiment-detail-experimentsslug)
- [01 Landing](#01--landing-)

**Design Agent Context**
More casual, denser grid than projects (3-column desktop). Status badges should be colour-coded (live = green dot, wip = amber, idea = faint, archived = muted). Cards feel like sticky notes or lab entries — slightly less polished than projects, intentionally.

---

### 06d — Experiment Detail `/experiments/[slug]`

**Description**
Full detail for a single experiment. Markdown description, links, stack. Lighter than a project detail — more of a lab note.

**Visual Elements**
- **Header** — title, status badge, stack tags, links row
- **Cover image** — optional
- **Markdown body** — full description
- **Back link** — ← back to experiments

**User Actions**
- Read description
- Click links
- Navigate back

**Goes To**
- [06 Experiments](#06--experiments-experiments)

**Design Agent Context**
Same layout as project detail but slightly looser — this is a lab note, not a case study. No live data section. Keep it simple.

---

### 07 — Awards `/awards`

**Description**
Recognition, honours, and achievements. DB-driven. Should feel authoritative without being boastful — let the credentials speak.

**Visual Elements**
- **Page heading** — "awards" in large serif
- **Award items list** — title, issuer (with optional logo/image), date, brief description (markdown), optional link
- Items sorted by date, newest first

**User Actions**
- Read award details
- Click URL if present (certificate/announcement)

**Goes To**
- [01 Landing](#01--landing-)
- [04 Experience](#04--experience-experience)

**Design Agent Context**
Clean list layout — not a grid. Each item as a bordered row with the award title prominent. Issuer name in mono below. Date right-aligned. Optional image as a small square thumbnail. Understated design — the content is the flex.

---

### 08 — Board / Vision `/board`

**Description**
A live, read-only Jira-style board showing what Feranmi is working on, planning, and thinking about. Visitors get a transparent view into his current focus. Private items filtered out.

**Visual Elements**
- **Page heading** — "board" or "workspace" in large serif, last updated timestamp in mono
- **Kanban board** — 4 columns: Backlog · In Progress · Done · On Hold
- **Board cards** — title, category badge (goal/project/learning/idea), priority dot, optional due date
- **Expanded card** — description in markdown, list of sub-tickets each with their own status badge

**User Actions**
- Scroll/browse kanban columns
- Click/tap a card to expand — see description and sub-tickets
- Close expanded card

**Goes To**
- [01 Landing](#01--landing-)

**Design Agent Context**
Horizontal scroll on mobile for the columns. Cards compact by default — title + badges only. Expand shows a smooth height animation revealing description + sub-ticket rows. Category badges colour-coded with dot (goal = blue, project = green, learning = amber, idea = purple). This page should feel like a genuine working board, not decorative.

---

### 09 — 404 Not Found

**Route:** `/[any-unknown-route]`

**Description**
Custom 404 page. Should feel on-brand — not a generic error. Feranmi's personality should come through.

**Visual Elements**
- **"404"** in large display font, styled like an error in a terminal or code editor
- **Message** — brief, dry-humoured copy
- **Back home link**

**User Actions**
- Click back to home

**Goes To**
- [01 Landing](#01--landing-)

**Design Agent Context**
Keep it simple and on-brand. Something like "this page doesn't exist yet — or maybe it did and I deleted it." Mono terminal aesthetic. Dark background regardless of theme. Short and sharp.

---

### 10 — LLM Popup (Global Widget)

**Route:** floating — present on all pages

**Description**
A floating chat popup available on every page. Visitors ask questions about Feranmi — his work, experience, projects, opinions. Powered by OpenAI, grounded in the system_convos data. All conversations stored.

**Visual Elements**
- **Trigger button** — bottom-right corner, small circular button with chat icon
- **Popup panel** — slides up from bottom-right, ~360px wide, rounded corners
- **Header** — "Ask me anything" or "Talk to Feranmi.ai", close button
- **Message thread** — user bubbles (right), assistant bubbles (left), timestamps
- **Input bar** — text input + send button at bottom of popup
- **Typing indicator** — animated dots while streaming

**User Actions**
- Open/close popup
- Type and send a question
- Read streamed response
- Continue a conversation (session persists while on site)

**Goes To**
— stays on current page

**Design Agent Context**
Popup should feel like iMessage meets a terminal — assistant messages in the warm bg colour, user messages in ink. Streaming response should type out word by word. Subtle spring animation on open/close. Rate limit error should be friendly: "Slow down, come back in a bit."

---

## Admin Pages (11–22) — Protected

---

### 11 — Admin Login `/admin/login`

**Type:** auth

**Description**
Single-user login screen. Email + password, Supabase Auth. Redirects to admin dashboard on success. Already built (UI only).

**Visual Elements**
- **Heading** — "Welcome back, Feranmi." in serif
- **Email field** with mono label
- **Password field** with show/hide toggle
- **Submit button** — "enter →"
- **Back to site link**

**User Actions**
- Enter credentials and submit
- Toggle password visibility
- Return to public site

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin) — on success
- [01 Landing](#01--landing-)

**Design Agent Context**
Already built. Minimal, centered, same design language as public site. Dark-capable. No distractions.

---

### 12 — Admin Dashboard `/admin`

**Type:** admin

**Description**
Home base for the admin panel. At-a-glance view of site health, recent activity, and stats. Quick access to all content sections.

**Visual Elements**
- **Sidebar** — nav links to all admin sections, active state, collapse on mobile
- **Topbar** — current page title, logout button
- **Stats cards row** — total visits (7d/30d/all-time), blog reads, project interactions
- **Recent page views table** — last 50 rows: page, referrer, country, timestamp
- **Recent activity list** — last 10 activity_feed entries with type icon
- **Quick nav grid** — shortcut cards to each content section

**User Actions**
- Read stats at a glance
- Navigate to any section via sidebar or quick nav
- Logout

**Goes To**
- [13 Projects](#13--projects-management-adminprojects)
- [14 Experience](#14--experience-management-adminexperience)
- [15 Experiments](#15--experiments-management-adminexperiments)
- [16 Awards](#16--awards-management-adminawards)
- [17 Board](#17--board-management-adminboard)
- [18 Analytics](#18--analytics-adminanalytics)
- [19 Chats](#19--chat-history-adminchats)
- [20 System Context](#20--system-context-llm-knowledge-adminsystem-context)
- [21 Activity Feed](#21--activity-feed-management-adminactivity)

**Design Agent Context**
Admin shell is consistent across all admin pages — sidebar always visible on desktop, slide-in on mobile. Dark-first design (admin doesn't need to match public light mode). Stats cards use large mono numbers with small labels. Tables are dense but readable.

---

### 13 — Projects Management `/admin/projects`

**Routes:** `/admin/projects` · `/admin/projects/new` · `/admin/projects/[id]`

**Type:** admin

**Description**
Full CRUD for projects. List view shows all, create/edit forms handle all fields. Most complex content form — sets the pattern for the others.

**Visual Elements**
- **List** — table: title, status, featured toggle, stack tags, actions (edit/delete)
- **New/Edit form** — title, slug, status select, featured toggle, description (markdown editor with preview), stack tags input, cover image upload, links editor (key/value pairs), live data editor (label/value rows)
- **Confirm dialog** — on delete

**User Actions**
- View all projects in table
- Toggle featured on/off inline
- Create new project → full form
- Edit existing → pre-filled form
- Delete with confirmation

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Form pages are single-column, max-width ~720px. Markdown editor shows raw textarea on left, rendered preview on right (toggle on mobile). Links editor and live data editor are dynamic — add/remove rows with a + button. All labels in mono, inputs use the same token system as public site.

---

### 14 — Experience Management `/admin/experience`

**Routes:** `/admin/experience` · `/admin/experience/new` · `/admin/experience/[id]`

**Type:** admin

**Description**
CRUD for work history entries. Same form pattern as projects but with role/company/dates fields and two markdown editors (description + achievements).

**Visual Elements**
- **List** — table: role, company, dates, position order, actions
- **Form** — role, company, company URL, location, start/end date, logo upload, description (markdown), achievements (markdown)

**User Actions**
- Full CRUD — create, read, edit, delete

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Same form pattern as #13. Two markdown editors stacked: description first, then achievements. Date pickers for start/end with a "current" checkbox for end date.

---

### 15 — Experiments Management `/admin/experiments`

**Routes:** `/admin/experiments` · `/admin/experiments/new` · `/admin/experiments/[id]`

**Type:** admin

**Description**
CRUD for experiments. Similar to projects but simpler — no live data editor.

**Visual Elements**
- **List** — table: title, status, featured, stack, actions
- **Form** — title, slug, status (live/wip/archived/idea), featured, description (markdown), stack tags, cover image, links editor

**User Actions**
- Full CRUD

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Same pattern as #13. Status is a 4-option select not a 3-option one.

---

### 16 — Awards Management `/admin/awards`

**Routes:** `/admin/awards` · `/admin/awards/new` · `/admin/awards/[id]`

**Type:** admin

**Description**
CRUD for awards and recognition. Simplest content form — title, issuer, date, description, image, URL.

**Visual Elements**
- **List** — table: title, issuer, date, actions
- **Form** — title, issuer, date, URL, description (markdown), image upload

**User Actions**
- Full CRUD

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Simplest form in the set. No special components beyond markdown editor and image upload.

---

### 17 — Board Management `/admin/board`

**Type:** admin

**Description**
Editable kanban board. Admin sees all items including private ones. Create, edit, delete items and sub-tickets. Toggle private visibility. The public board (page 08) is the read-only version of this.

**Visual Elements**
- **Kanban** — 4 columns, all items shown (private items with lock icon/dim overlay)
- **Card actions** — edit pencil, delete bin, private toggle, drag handle
- **Item form** — title, description (markdown), status, category, priority, due date, is_private toggle
- **Sub-ticket section** inside expanded card — list of sub-tickets, add/edit/delete each
- **Sub-ticket form** — title, description (markdown), status, is_private

**User Actions**
- Create / edit / delete board items
- Create / edit / delete sub-tickets
- Toggle is_private on items and sub-tickets
- Drag to reorder within a column

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Most interactive admin page. Private items shown with a lock icon and slightly dimmed. Inline editing preferred over navigating to a separate page. Sub-tickets listed inside the expanded card view with their own compact form.

---

### 18 — Analytics `/admin/analytics`

**Type:** admin

**Description**
Site analytics — page views, project interactions, blog reads, referrers. Filterable by date range. Read-only.

**Visual Elements**
- **Range tabs** — 7d / 30d / 90d
- **Page views chart** — line chart over time
- **Top pages table** — page, view count, ranked
- **Project interactions table** — per project: views, link clicks, GitHub clicks
- **Blog reads table** — post title, read count
- **Referrer breakdown** — source, count

**User Actions**
- Switch date range
- Read the data

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Data-dense but clean. Use a minimal chart library (recharts or similar). Tables use monospace numbers for counts. Range tabs at the top affect all sections simultaneously.

---

### 19 — Chat History `/admin/chats`

**Routes:** `/admin/chats` · `/admin/chats/[id]`

**Type:** admin

**Description**
All stored LLM visitor conversations. Read-only. List of sessions, clickable into full thread view.

**Visual Elements**
- **Conversations list** — session ID (truncated), started at, message count, last active, view button
- **Thread view** — user/assistant message bubbles, timestamps, back link

**User Actions**
- Browse conversation list
- Open thread to read full conversation
- Navigate back to list

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Thread view: user messages right-aligned in a darker bubble, assistant messages left-aligned in a lighter bubble. Timestamps in mono below each message. Read-only — no delete or reply functionality.

---

### 20 — System Context (LLM Knowledge) `/admin/system-context`

**Routes:** `/admin/system-context` · `/admin/system-context/new` · `/admin/system-context/[id]`

**Type:** admin

**Description**
Manage what the LLM popup knows about Feranmi. Each row is a discrete piece of information assembled into the system prompt at runtime. Add, edit, reorder, toggle without redeploying.

**Visual Elements**
- **Entries list** — label, category badge, is_active toggle, position, edit/delete actions
- **"Preview assembled prompt" button** — opens modal showing full concatenated system prompt in order
- **Create/edit form** — label, category (professional/personal/opinions/instructions), position, is_active toggle, content (large textarea)

**User Actions**
- View all context entries
- Toggle active/inactive without deleting
- Reorder entries
- Create / edit / delete entries
- Preview full assembled system prompt

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Most "technical" admin page — the content textarea is large, full-width, mono font. Preview modal shows plain pre-formatted text of the full assembled prompt. Active toggle clearly visible on each row — this is a frequent action.

---

### 21 — Activity Feed Management `/admin/activity`

**Type:** admin

**Description**
Manual management of the live activity feed shown on the public site. Create new entries (blog posts, project updates, notes) and delete old ones. Commits come in via GitHub webhook automatically.

**Visual Elements**
- **Activity list** — type icon, title, description, date, delete button
- **Add entry form** (inline or panel) — type select, title, description, URL, metadata (JSON or key/value)

**User Actions**
- View all activity entries
- Add a manual entry
- Delete an entry

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
Simple list + inline add form. No edit — just add or delete. Type icons help distinguish commits from blog posts from notes at a glance. Form appears inline at the top of the list on "Add entry" click.

---

### 22 — Admin 404 / Catch-all `/admin/[unknown]`

**Type:** admin

**Description**
Fallback for unknown admin routes. Simple message, redirect back to dashboard.

**Visual Elements**
- Inline error message within admin shell
- Back to dashboard link

**User Actions**
- Click back to dashboard

**Goes To**
- [12 Dashboard](#12--admin-dashboard-admin)

**Design Agent Context**
No separate page needed — render within the admin layout with a simple "Page not found" message and back link.

---

*22 pages total · 10 public (01–10) · 12 admin (11–22) · portfolio-v2 · devferanmi.xyz*
