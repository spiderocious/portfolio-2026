# Admin Pages — All Remaining Design Prompts

Design system shared across ALL admin pages (reference this in every prompt):
- Background: #0f0f0f, diagonal grain overlay rgba(255,255,255,0.03)
- Sidebar: 220px, #111111, fixed left
- Topbar: 52px, #0f0f0f, fixed top, left: 220px
- Font everywhere: JetBrains Mono, monospace
- Dark only — no light mode ever
- No shadows, no gradients, no SaaS-style colored icon circles
- Borders: 1px solid #1e1e1e (default), #1a1a1a (subtle), #2a2a2a (hover)
- Text scale: #f0ece4 (primary) → #c8c0b8 → #888888 → #666666 → #555555 → #444444 → #333333
- Accent green: #4ade80 | Accent red: #f87171 | Blue: #60a5fa | Purple: #a78bfa | Orange: #fb923c

The sidebar and topbar are identical on every admin page (already fully specced in admin-dashboard.md). Each prompt below describes only the main content area — what changes per page.

---

---

# Prompt 3: Projects Management — /admin/projects

Context: The projects management section has three views: (1) list of all projects in a table, (2) create new project form, (3) edit existing project form. This prompt covers all three. The list view is the default. The form (create/edit) replaces the list view on the same content area — no modal, no drawer. The admin can manage the core portfolio projects here: title, slug, description (markdown), stack tags, links, live data stats, status, featured toggle, and position ordering. The form is the most complex in the entire admin — it sets the pattern for all other content forms.

---

## View 1: Projects List — /admin/projects

### Topbar (for this page):
- Breadcrumb: "admin / projects"
- Right side: button "new project +"
  - Height: 32px, padding: 0 14px
  - Background: #f0ece4, color: #0f0f0f
  - Font: JetBrains Mono, 11px, weight 500
  - Border-radius: 4px
  - Hover: background #ffffff
  - Transition: 150ms ease

### Content Area:

#### Section Label:
- Text: "all projects"
- Font: JetBrains Mono, 9px, uppercase, letter-spacing 0.18em, color #333333
- Margin-bottom: 12px, padding-bottom: 8px
- Border-bottom: 1px solid #1a1a1a

#### Projects Table Panel:
- Background: #141414
- Border: 1px solid #1e1e1e
- Border-radius: 6px
- Overflow: hidden

Table Header Row:
- Background: #111111
- Height: 36px
- Border-bottom: 1px solid #1a1a1a

Header cells (6 columns):
- Font: JetBrains Mono, 9px, weight 500, uppercase, letter-spacing 0.14em, color #444444
- Padding: 0 16px
- Columns: "title" (flex-grow) | "status" (100px) | "featured" (90px) | "stack" (200px) | "created" (120px) | "actions" (80px, right-aligned)

Table Body Rows:
- Height: 52px
- Border-bottom: 1px solid #191919
- Hover: background rgba(255,255,255,0.02), transition 100ms ease

"title" cell:
- Font: JetBrains Mono, 12px, color #c8c0b8, weight 500
- Padding: 0 16px

"status" cell:
- Badge pill: padding 2px 8px, border-radius 99px, border 1px solid
- "active": background #0e2a1a, border #1a5c30, color #4ade80
- "wip": background #1a1a0e, border #5c4a00, color #facc15
- "archived": background #1a1a1a, border #2a2a2a, color #555555
- Font: JetBrains Mono, 10px

"featured" cell:
- Toggle switch: 32px wide × 18px tall
- On: track #4ade80, thumb white
- Off: track #2a2a2a, thumb #555555
- Transition: 200ms ease

"stack" cell:
- Show first 3 tags as small pills: background #1a1a1a, border #222, color #888888
- Font: JetBrains Mono, 10px, padding 1px 6px, border-radius 3px
- If more than 3: "+N more" in color #444444
- Gap: 4px between pills, flex-wrap: nowrap, overflow hidden

"created" cell:
- Font: JetBrains Mono, 11px, color #555555
- Format: "12 Jan 2026"

"actions" cell:
- Two icon buttons: edit (pencil) and delete (trash)
- Each: 28px × 28px, background transparent, border none
- Edit icon color: #555555, hover: #888888
- Delete icon color: #555555, hover: #f87171
- Gap: 4px between

Empty state (no projects):
- Full-width row, height 120px
- Centered text: "no projects yet. add your first one."
- Font: JetBrains Mono, 11px, color #444444

---

## View 2 & 3: Create / Edit Project Form — /admin/projects/new | /admin/projects/[id]

### Topbar (for this page):
- Breadcrumb: "admin / projects / new" or "admin / projects / edit"
- Right: no extra button

### Content Layout:
- Single column, max-width: 720px
- No card wrapper — form fields directly on content area background

### Form Section Labels (used throughout all forms):
- Font: JetBrains Mono, 9px, uppercase, letter-spacing 0.18em, color #333333
- Margin-top: 32px, margin-bottom: 12px
- Padding-bottom: 8px
- Border-bottom: 1px solid #1a1a1a

### Standard Field Pattern (used for all text inputs):

Label:
- Font: JetBrains Mono, 10px, weight 500, uppercase, letter-spacing 0.12em, color #555555
- Margin-bottom: 6px

Input:
- Width: 100%
- Height: 44px
- Background: #111111
- Border: 1px solid #222222
- Border-radius: 4px
- Padding: 0 14px
- Font: JetBrains Mono, 13px, color #d4d0c8
- Placeholder color: #333333
- Focus: border-color #3a3a3a, box-shadow 0 0 0 2px rgba(255,255,255,0.04)
- Transition: border-color 150ms ease

---

### Field: Title
- Label: "title"
- Standard input, placeholder: "My Project"

### Field: Slug
- Label: "slug"
- Standard input, placeholder: "my-project"
- Below input: helper text "used in URL: /projects/[slug]"
  - Font: JetBrains Mono, 10px, color #333333, margin-top: 4px
- Auto-generated from title (editable)

### Field: Status
- Label: "status"
- Custom select — same styling as input (height 44px, same border/bg)
- Options: "active", "wip", "archived"
- Selected value shows with matching badge color inline
- Dropdown: background #111111, border #222, border-radius 4px
- Option hover: background rgba(255,255,255,0.04)
- Font: JetBrains Mono, 13px, color #d4d0c8

### Field: Featured Toggle
- Label: "featured"
- Helper: "show on landing page"
  - Font: JetBrains Mono, 10px, color #333333, margin-top: 4px
- Toggle switch (same style as table): 32px × 18px, on: #4ade80, off: #2a2a2a
- Displayed inline next to label (flex row, gap 12px, align-items center)

---

### Section: "description" (Markdown Editor)

Label: "description"

Markdown Editor Component:
- Container: background #111111, border 1px solid #222222, border-radius 4px
- Height: 320px total

Tab Bar (top of editor):
- Height: 36px
- Background: #0f0f0f
- Border-bottom: 1px solid #1e1e1e
- Two tabs: "write" and "preview"
- Active tab: color #f0ece4, border-bottom 2px solid #f0ece4
- Inactive tab: color #444444, hover color #888888
- Font: JetBrains Mono, 11px, padding: 0 16px

Write Panel (textarea):
- Background: #111111
- Padding: 16px
- Font: JetBrains Mono, 13px, color #d4d0c8, line-height 1.6
- No border, no outline
- Resize: none (fixed height minus tab bar = ~284px)
- Placeholder: "write markdown here..."
- Placeholder color: #2a2a2a

Preview Panel (rendered markdown):
- Background: #111111
- Padding: 16px
- Same height as write panel
- Overflow-y: auto
- Rendered prose:
  - h1: 20px, weight 600, color #f0ece4, margin-bottom 12px
  - h2: 17px, weight 600, color #c8c0b8
  - h3: 14px, weight 600, color #aaa8a0
  - p: JetBrains Mono, 13px, color #888888, line-height 1.7
  - code inline: background #0f0f0f, color #4ade80, padding 1px 5px, border-radius 3px
  - code block: background #0f0f0f, border 1px solid #1e1e1e, padding 12px, border-radius 4px, color #c8c0b8
  - ul/ol: color #888888, padding-left 20px
  - strong: color #c8c0b8

---

### Section: "stack"

Tags Input Component:
- Container: min-height 44px, background #111111, border 1px solid #222222, border-radius 4px
- Padding: 8px 10px, display flex, flex-wrap wrap, gap 6px, align-items center
- Focus state: border-color #3a3a3a

Existing tags (chips):
- Background: #1a1a1a, border 1px solid #2a2a2a
- Color: #c8c0b8, font: JetBrains Mono, 11px
- Padding: 3px 8px, border-radius: 3px
- Remove button: "×" after tag, color #555555, hover #f87171

New tag input (inline):
- Background: transparent, border: none, outline: none
- Font: JetBrains Mono, 12px, color #d4d0c8
- Placeholder: "add tag, press enter"
- Width: auto, min-width 120px

---

### Section: "cover image"

Image Upload Component:
- Container: height 120px, background #111111, border 1px dashed #2a2a2a, border-radius 4px
- Centered content:
  - Icon: upload arrow, 20px, color #444444
  - Text: "drag & drop or click to upload"
  - Sub-text: "png, jpg, webp — max 2mb"
  - Both: JetBrains Mono, 11px and 10px respectively, color #444444 and #333333
- Hover: border-color #3a3a3a, background rgba(255,255,255,0.02)
- Uploaded state: shows image thumbnail (full-width, height 120px, object-fit cover), with "remove ×" button top-right (background rgba(0,0,0,0.6), color #f87171, 24px×24px)

---

### Section: "links"

Links Editor Component:
Each link row (horizontal flex):
- Key input: width 160px, standard input style height 40px
- Value input: flex-grow 1, standard input style height 40px
- Remove button: "×" 40px × 40px, background transparent, color #444444, hover #f87171
- Gap: 8px between elements
- Rows stacked vertically with 8px gap

Pre-populated keys: "deployed", "github" (shown by default, deletable)
Key placeholder: "label" | Value placeholder: "https://..."
Add button:
- Text: "+ add link"
- Font: JetBrains Mono, 11px, color #444444
- Hover: color #888888
- No background, no border
- Margin-top: 8px

---

### Section: "live data"

Live Data Editor Component (same structure as links editor):
Each row:
- Label input: width 200px, placeholder "Users"
- Value input: flex-grow 1, placeholder "500k"
- Remove button: same as links editor
Add button: "+ add stat"

Helper text above: "key numbers displayed on the project card (e.g. '500k users')"
Font: JetBrains Mono, 10px, color #333333, margin-bottom 12px

---

### Form Action Bar (bottom, sticky):
- Position: sticky bottom 0
- Background: #0f0f0f
- Border-top: 1px solid #1a1a1a
- Padding: 16px 32px (matches content padding)
- Display: flex, justify-content: space-between, align-items: center
- Margin-left: -32px, margin-right: -32px (full bleed)

Left side:
- "← back to projects" — JetBrains Mono, 11px, color #444444, hover #888888

Right side (flex row, gap 12px):
- "discard" button: height 36px, padding 0 16px, background transparent, border 1px solid #2a2a2a, color #666666, hover border #3a3a3a, hover color #888888, font JetBrains Mono 11px, border-radius 4px
- "save project" button: height 36px, padding 0 16px, background #f0ece4, color #0f0f0f, font JetBrains Mono 11px weight 500, border-radius 4px, hover background #ffffff
- Loading state on save: text "saving...", background #c8c4bc, cursor not-allowed

---

### Delete Confirmation Dialog (appears over list view):
- Overlay: rgba(0,0,0,0.7) full-screen
- Dialog box: background #141414, border 1px solid #2a2a2a, border-radius 6px
- Width: 380px, padding: 28px 28px 24px
- Centered in viewport

Title: "delete project?"
- Font: JetBrains Mono, 14px, weight 500, color #f0ece4, margin-bottom 8px

Body text: "this will permanently delete '[project title]'. this cannot be undone."
- Font: JetBrains Mono, 12px, color #888888, line-height 1.6

Buttons (flex row, gap 8px, margin-top 24px, justify-content flex-end):
- "cancel": height 36px, padding 0 16px, background transparent, border 1px solid #2a2a2a, color #666666, hover border #3a3a3a, font JetBrains Mono 11px, border-radius 4px
- "delete": height 36px, padding 0 16px, background #f87171, color #0f0f0f, font JetBrains Mono 11px weight 500, border-radius 4px, hover background #fca5a5

---

---

# Prompt 4: Experience Management — /admin/experience

Context: CRUD for work history. Same shell (sidebar + topbar). Same list/form pattern as projects. Simpler form — no live data editor, no links editor. Key differences: two markdown editors (description + achievements), date pickers for start/end, "currently here" checkbox for end date, logo image upload, company URL field.

---

## View 1: Experience List

### Topbar right: "new entry +" button (same style as projects)

### Table Columns:
- "role" (flex-grow): JetBrains Mono, 12px, color #c8c0b8
- "company" (160px): JetBrains Mono, 11px, color #888888
- "dates" (160px): "Jun 2023 — present" or "Jun 2022 — Dec 2023", font JetBrains Mono, 11px, color #555555
- "location" (120px): JetBrains Mono, 10px, color #444444
- "actions" (80px): edit + delete icons, same style as projects table

Row height: 52px, border-bottom 1px solid #191919, hover rgba(255,255,255,0.02)

---

## View 2/3: Create / Edit Experience Form

### Fields:

**role** — standard input, placeholder "Senior Frontend Engineer"
**company** — standard input, placeholder "Acme Corp"
**company URL** — standard input, placeholder "https://acme.com"
**location** — standard input, placeholder "Lagos, Nigeria · Remote"

**Date Row** (two inputs side by side, gap 12px):
- "start date" — date picker input, same styling as standard input, height 44px
- "end date" — date picker input OR "currently here" checkbox
  - Checkbox: 16px × 16px, border 1px solid #2a2a2a, background #111111
  - Checked: border #4ade80, background #0e2a1a, checkmark #4ade80
  - When checked: end date input dims to opacity 0.3, pointer-events none
  - Checkbox label: "currently here", JetBrains Mono, 12px, color #888888

**company logo** — image upload component (same as cover image in projects, but height 80px, square aspect ratio displayed as 80×80 thumbnail)

**description** — markdown editor component (same as projects, height 240px)

**achievements** — markdown editor component (same as projects, height 200px)
- Label: "achievements"
- Helper text below label: "key bullets of impact — each line becomes a list item"
- Font: JetBrains Mono, 10px, color #333333

### Form Action Bar: identical to projects

---

---

# Prompt 5: Experiments Management — /admin/experiments

Context: CRUD for side projects and tinkering. Visually identical pattern to projects. Key differences: status has 4 options (live/wip/idea/archived), no live data editor. Form is slightly simpler.

---

## View 1: Experiments List

### Table Columns:
- "title" (flex-grow): 12px, color #c8c0b8
- "status" (100px): badge pill — same color coding as projects PLUS "idea": background #0e0e1a, border #1a1a5c, color #93c5fd
- "featured" (90px): toggle same as projects
- "stack" (200px): tag pills same as projects
- "created" (120px): date, color #555555
- "actions" (80px): edit + delete

---

## View 2/3: Create / Edit Experiment Form

### Fields:
**title** — standard input
**slug** — standard input with helper "used in URL: /experiments/[slug]"
**status** — select with 4 options: "live", "wip", "idea", "archived"
- Each option shows with appropriate color when selected (same badge colors)
**featured** — toggle (same pattern as projects)
**description** — markdown editor, height 280px
**stack** — tags input (same as projects)
**cover image** — image upload (same as projects)
**links** — links editor (same as projects, pre-populated: "deployed", "github")

### Form Action Bar: identical to projects

---

---

# Prompt 6: Awards Management — /admin/awards

Context: Simplest content form. CRUD for recognition, honours, achievements. No markdown editor with preview tabs needed for description — just a plain textarea is fine since descriptions are short. No stack, no links editor, no live data. Just: title, issuer, date, URL, description, image.

---

## View 1: Awards List

### Table Columns:
- "title" (flex-grow): 12px, color #c8c0b8
- "issuer" (180px): JetBrains Mono, 11px, color #888888
- "date" (100px): JetBrains Mono, 11px, color #555555, format "Jan 2025"
- "actions" (80px): edit + delete

Row height: 48px

---

## View 2/3: Create / Edit Award Form

### Fields:
**title** — standard input, placeholder "Best Developer Award"
**issuer** — standard input, placeholder "IEEE / Google / etc."
**date** — date picker input (month + year sufficient), height 44px, same styling
**URL** — standard input, placeholder "https://..." — helper: "link to certificate or announcement"
**description** — plain textarea (NOT a tab-based markdown editor):
- Background: #111111, border 1px solid #222222, border-radius 4px
- Padding: 14px, font JetBrains Mono 13px, color #d4d0c8, line-height 1.6
- Height: 160px, resize: vertical
- Placeholder: "brief description of the award or recognition..."
- Focus: border-color #3a3a3a
**image** — image upload component (same as projects cover image)

### Form Action Bar: identical to projects

---

---

# Prompt 7: Board Management — /admin/board

Context: The most interactive admin page. An editable kanban board with 4 columns. Admin sees ALL items including private ones (marked visually). Each card can be expanded to show description and sub-tickets. Items and sub-tickets can be created, edited, deleted inline. Cards have drag handles for reordering within a column. Private items are dimmed with a lock icon. This is the admin version of the public read-only board.

---

## Layout:
- Content area: full width, full height minus topbar
- Overflow-x: auto (for horizontal scroll on smaller screens)
- Padding: 24px 32px

---

## Topbar (this page):
- Breadcrumb: "admin / board"
- Right: "new item +" button (same style as projects)

---

## Kanban Board:

### Board Container:
- Display: grid
- Grid-template-columns: repeat(4, minmax(280px, 1fr))
- Gap: 12px
- Align-items: start

### Each Column:

Column Header:
- Height: 40px, display flex, align-items center, justify-content space-between
- Column title: JetBrains Mono, 10px, uppercase, letter-spacing 0.14em, color #555555
- Item count badge: JetBrains Mono, 10px, color #333333, background #1a1a1a, border 1px solid #222, border-radius 99px, padding 1px 8px
- "+" add button: 24px × 24px, color #333333, hover color #888888, no background

Columns: "backlog" | "in progress" | "done" | "on hold"

Column Body:
- Background: rgba(255,255,255,0.01)
- Border: 1px solid #1a1a1a
- Border-radius: 6px
- Padding: 8px
- Min-height: 200px
- Display: flex, flex-direction: column, gap: 6px

---

### Board Card (collapsed — default state):

Card:
- Background: #141414
- Border: 1px solid #1e1e1e
- Border-radius: 4px
- Padding: 12px 14px
- Cursor: pointer

Private card overlay:
- Opacity: 0.55 on entire card
- Lock icon (10px, color #555555) appears top-right of card

Top row (horizontal flex, gap 8px, align-items flex-start):
- Drag handle: ⠿ symbol, 14px, color #333333, cursor grab, margin-right 4px, hover color #666666
- Category badge + priority dot

Category badge:
- Font: JetBrains Mono, 9px, padding 1px 6px, border-radius 3px, border 1px solid
- "goal": background #0e1a2a, border #1a3a5c, color #60a5fa
- "project": background #0e2a1a, border #1a5c30, color #4ade80
- "learning": background #1a1a0e, border #5c4a00, color #facc15
- "idea": background #1a0e1a, border #4a1a5c, color #c084fc
- "other": background #1a1a1a, border #2a2a2a, color #888888

Priority dot (right of category, or right-aligned):
- 6px circle
- high: #f87171 | medium: #fb923c | low: #555555
- No label — dot only

Card title:
- Font: JetBrains Mono, 12px, weight 500, color #c8c0b8
- Margin-top: 8px
- Max 2 lines, overflow ellipsis

Due date (if present):
- Font: JetBrains Mono, 10px, color #444444
- Margin-top: 6px
- Format: "due 20 Apr"

Sub-ticket count (bottom right, if any):
- Font: JetBrains Mono, 10px, color #444444
- Format: "3 sub-items"

Card hover:
- Border-color: #2a2a2a
- Background: #161616
- Transition: 150ms ease

---

### Board Card (expanded — on click):

Expanded card replaces collapsed card inline (height animates open):
- Additional padding-bottom: 12px
- Border-color: #2a2a2a

Description block (below title):
- Margin-top: 10px
- Padding-top: 10px
- Border-top: 1px solid #1a1a1a
- Rendered markdown (same prose styles as form preview — reduced size):
  - p: JetBrains Mono, 11px, color #888888, line-height 1.6
  - All other markdown elements scaled accordingly

Sub-tickets list:
- Margin-top: 12px
- Label: "sub-items" — JetBrains Mono, 9px, uppercase, letter-spacing 0.14em, color #333333, margin-bottom 6px

Each sub-ticket row:
- Height: 32px, display flex, align-items center, gap 8px
- Status dot: 6px circle using same column status colors
- Title: JetBrains Mono, 11px, color #888888
- Private: lock icon 10px, color #444444
- Edit icon: 12px, color #333333, hover #888888, cursor pointer
- Delete icon: 12px, color #333333, hover #f87171

"+ add sub-item" text button:
- JetBrains Mono, 10px, color #444444, hover #888888, margin-top 6px

Card action row (bottom of expanded card):
- Display flex, gap 8px, justify-content flex-end, margin-top 12px, padding-top 10px, border-top 1px solid #1a1a1a
- "edit" text button: JetBrains Mono, 10px, color #555555, hover #888888
- "delete" text button: JetBrains Mono, 10px, color #555555, hover #f87171
- "private" toggle: same toggle switch 28×16px style, label "private" JetBrains Mono 10px color #555555

---

### Item Form (inline panel or slide-in from right — appears on "new item +" or "edit"):

Panel:
- Width: 440px
- Background: #141414
- Border-left: 1px solid #1e1e1e
- Position: fixed right 0, top 52px, height calc(100vh - 52px)
- Padding: 28px 24px
- Overflow-y: auto
- Z-index: 60

Panel header:
- Text: "new item" or "edit item"
- Font: JetBrains Mono, 13px, weight 500, color #f0ece4
- Close button "×": top-right, 28px × 28px, color #444444, hover #888888

Fields in panel:
**title** — standard input
**description** — markdown editor, height 180px
**status** — select: "backlog" / "in progress" / "done" / "on hold"
**category** — select: "goal" / "project" / "learning" / "idea" / "other"
**priority** — select: "low" / "medium" / "high"
**due date** — date picker input
**is_private** — toggle with label "hide from public board"

Save button:
- Width: 100%, height 40px, background #f0ece4, color #0f0f0f, font JetBrains Mono 12px weight 500, border-radius 4px, margin-top 24px
- Loading: "saving...", background #c8c4bc

---

### Sub-Item Form (inline below sub-items list, expands on "+ add sub-item"):

Container:
- Background: #111111, border 1px solid #1e1e1e, border-radius 4px, padding 12px, margin-top 6px

Fields:
**title** — standard input (height 36px, smaller)
**description** — plain textarea, height 80px, same styling as awards description but smaller
**status** — compact select (height 36px)
**is_private** — toggle with label "private"

Action buttons (flex row, gap 6px, margin-top 10px):
- "add" button: height 32px, padding 0 14px, background #f0ece4, color #0f0f0f, font JetBrains Mono 11px, border-radius 3px
- "cancel" text: JetBrains Mono, 11px, color #444444, hover #888888

---

---

# Prompt 8: Analytics — /admin/analytics

Context: Read-only data view. Shows page views over time (line chart), top pages, project interaction breakdown, blog reads, referrer breakdown. Filterable by time range (7d / 30d / 90d). Dense, data-first. No charts with colorful gradients — use a minimal line chart with a single off-white line on a dark grid. Tables are the primary data display.

---

## Topbar (this page):
- Breadcrumb: "admin / analytics"
- Right: Range tabs — "7d" | "30d" | "90d"
  - Each tab: height 32px, padding 0 14px, border-radius 4px, font JetBrains Mono 11px
  - Inactive: background transparent, border 1px solid #222, color #555555
  - Active: background #f0ece4, color #0f0f0f, border transparent
  - Hover inactive: border-color #333, color #888888
  - Gap: 4px between tabs

---

## Content Layout:
- Single column, full width

---

### Summary Stats Row (top):
- Same 4-column stat cards grid as dashboard
- Cards: "total views", "unique pages", "project interactions", "blog reads" — within selected range
- Same flat card style: #141414, mono value 28px, label 10px uppercase, sub-label shows range "last 7 days"

---

### Page Views Chart Panel:

Panel:
- Background: #141414, border 1px solid #1e1e1e, border-radius 6px, padding 20px
- Margin-bottom: 12px

Panel title:
- Text: "page views over time"
- Font: JetBrains Mono, 10px, uppercase, letter-spacing 0.14em, color #555555
- Margin-bottom: 20px

Chart area:
- Height: 180px
- Line chart — single line
- Line color: #c8c0b8, stroke-width: 1.5px
- Area fill below line: rgba(200,192,184,0.05)
- Grid lines: horizontal only, 1px solid #1a1a1a, 4-5 lines
- X-axis labels: dates, JetBrains Mono, 9px, color #333333
- Y-axis labels: numbers, JetBrains Mono, 9px, color #333333
- No chart border/frame — just the grid lines
- Hover: vertical hairline #2a2a2a, tooltip: background #1a1a1a, border #2a2a2a, JetBrains Mono 10px, color #c8c0b8

---

### Two-Column Data Grid:

Container: display grid, grid-template-columns: 1fr 1fr, gap 12px, margin-bottom 12px

#### Left: Top Pages Table

Panel header: "top pages" + "page · views" column hint
Table columns: "page" (flex-grow), "views" (80px, right-aligned, mono, color #f0ece4, weight 700)
Row height: 40px, same row/cell styles as dashboard table
Top row gets subtle highlight: color #f0ece4 slightly brighter on "views"

#### Right: Project Interactions Table

Panel header: "project interactions"
Columns: "project" (flex-grow) | "views" (70px) | "link clicks" (90px) | "github" (70px)
All count values: JetBrains Mono, 11px, color #c8c0b8, right-aligned
Row height: 40px

---

### Two-Column Data Grid (second row):

Container: same grid, margin-bottom 12px

#### Left: Blog Reads Table
Panel header: "blog reads"
Columns: "post title" (flex-grow) | "reads" (80px, right-aligned, color #f0ece4, weight 700)
Row height: 40px

#### Right: Referrer Breakdown
Panel header: "referrers"
Columns: "source" (flex-grow) | "visits" (80px, right-aligned, color #f0ece4, weight 700)
"source" examples: "google.com", "twitter.com", "direct", "github.com"
Row height: 40px

---

---

# Prompt 9: Chat History — /admin/chats

Context: Read-only view of all LLM visitor conversations. Two views: (1) list of all sessions, (2) thread detail for a single session. No delete, no reply. Just browsing what visitors asked.

---

## View 1: Conversations List — /admin/chats

### Topbar: "admin / chats" breadcrumb, no right-side button

### Table Panel:

Table Columns:
- "session" (160px): truncated UUID, JetBrains Mono, 11px, color #555555, e.g. "a1b2c3d4..."
- "started" (140px): JetBrains Mono, 11px, color #666666, "12 Jan 2026, 14:32"
- "messages" (90px): JetBrains Mono, 11px, color #888888, right-aligned number
- "last active" (140px): JetBrains Mono, 11px, color #555555, "2h ago"
- "view" (60px): text link "view →", JetBrains Mono, 11px, color #444444, hover color #c8c0b8, cursor pointer

Row height: 48px, hover background rgba(255,255,255,0.02)

Empty state:
- Text: "no conversations yet."
- JetBrains Mono, 11px, color #444444, centered in panel, height 120px

---

## View 2: Thread Detail — /admin/chats/[id]

### Topbar:
- Breadcrumb: "admin / chats / [session-id truncated]"
- Left of breadcrumb: "← back" link, JetBrains Mono, 11px, color #444444, hover #888888

### Content:
- Max-width: 640px, centered in content area

Session meta bar (above thread):
- Background: #141414, border 1px solid #1e1e1e, border-radius 6px, padding 14px 16px
- Flex row, gap 24px
- Items: "session [uuid truncated]", "started [date]", "[N] messages"
- Font: JetBrains Mono, 10px, color #555555
- Values slightly brighter: color #888888

Thread (scrollable):
- Margin-top: 12px
- Display: flex, flex-direction: column, gap: 16px

Each message:

User message (right-aligned):
- Align-self: flex-end
- Max-width: 75%
- Background: #1a1a1a, border 1px solid #252525, border-radius: 8px 8px 0 8px
- Padding: 12px 16px
- Font: JetBrains Mono, 12px, color #c8c0b8, line-height 1.6
- Timestamp: JetBrains Mono, 10px, color #444444, margin-top 4px, text-align right

Assistant message (left-aligned):
- Align-self: flex-start
- Max-width: 75%
- Background: #141414, border 1px solid #1e1e1e, border-radius: 8px 8px 8px 0
- Padding: 12px 16px
- Font: JetBrains Mono, 12px, color #888888, line-height 1.6
- Timestamp: JetBrains Mono, 10px, color #333333, margin-top 4px

Role label above each bubble:
- User: "visitor" — JetBrains Mono, 9px, uppercase, color #444444, margin-bottom 4px, text-align right
- Assistant: "feranmi.ai" — JetBrains Mono, 9px, uppercase, color #4ade80, margin-bottom 4px

---

---

# Prompt 10: System Context (LLM Knowledge) — /admin/system-context

Context: Manage what the LLM popup knows about Feranmi. Each row is one discrete piece of information (professional background, personal details, opinions, response instructions). All active rows are fetched and concatenated into the system prompt at chat-time. Admin can add, edit, delete, reorder, and toggle active/inactive without redeploying. This is the most "technical" admin page.

---

## View 1: System Context List — /admin/system-context

### Topbar right side (two items):
- "preview prompt" button: height 32px, padding 0 14px, background transparent, border 1px solid #2a2a2a, color #888888, hover border #3a3a3a, color #c8c0b8, font JetBrains Mono 11px, border-radius 4px
- "new entry +" button: same primary button style as other pages

### Table Panel:

Table Columns:
- "pos" (48px): drag handle ⠿ + position number, JetBrains Mono, 11px, color #333333, cursor grab
- "label" (flex-grow): JetBrains Mono, 12px, color #c8c0b8 — e.g. "Professional Identity"
- "category" (120px): badge pill — same badge pattern, colors:
  - "professional": background #0e1a2a, border #1a3a5c, color #60a5fa
  - "personal": background #0e2a1a, border #1a5c30, color #4ade80
  - "opinions": background #1a0e1a, border #4a1a5c, color #c084fc
  - "instructions": background #1a1a0e, border #5c4a00, color #facc15
- "active" (80px): toggle switch (32px × 18px), centered in cell — same toggle style
  - Active: track #4ade80 | Inactive: track #2a2a2a
- "actions" (80px): edit + delete icons same as other tables

Row height: 48px
Inactive rows: entire row opacity 0.45 (dimmed but still visible)
Row hover: rgba(255,255,255,0.02)

---

## View 2/3: Create / Edit Entry Form — /admin/system-context/new | /[id]

### Topbar: "admin / system-context / new" or "/ edit"

### Fields:

**label** — standard input, placeholder "Professional Identity", helper "human-readable name for this entry"
**category** — select: "professional" / "personal" / "opinions" / "instructions"
**position** — number input (height 44px, same styling), placeholder "1", helper "lower = appears first in assembled prompt"
**is_active** — toggle with label "include in system prompt"

**content** — large textarea (NOT tabbed markdown editor — raw text only, as per spec):
- Label: "content"
- Helper: "written in first person — this text is sent directly to the LLM"
- Textarea: width 100%, height 360px, resize vertical
- Background: #0f0f0f (slightly darker than panels — terminal feel)
- Border: 1px solid #222222, border-radius 4px
- Padding: 16px
- Font: JetBrains Mono, 13px, color #d4d0c8, line-height 1.7
- Placeholder: "I am a software developer based in Lagos, Nigeria..."
- Placeholder color: #2a2a2a
- Focus: border-color #3a3a3a

### Form Action Bar: identical to projects

---

## "Preview Assembled Prompt" Modal:

Trigger: "preview prompt" button in topbar

Overlay: rgba(0,0,0,0.8) full-screen, backdrop-filter blur(2px)

Modal box:
- Width: 680px, max-height: 80vh
- Background: #111111, border 1px solid #2a2a2a, border-radius 6px
- Display: flex, flex-direction: column

Modal header:
- Height: 48px, padding 0 20px
- Display flex, align-items center, justify-content space-between
- Border-bottom 1px solid #1a1a1a
- Title: "assembled system prompt", JetBrains Mono, 12px, weight 500, color #888888
- Badge: "N entries · active only", JetBrains Mono, 10px, color #444444, background #1a1a1a, border #222, border-radius 4px, padding 2px 8px
- Close "×": 28px × 28px, color #444444, hover #888888

Modal body (scrollable):
- Flex-grow: 1, overflow-y: auto, padding: 20px

Prompt content:
- Pre-formatted text block
- Background: #0f0f0f, border 1px solid #1a1a1a, border-radius 4px, padding 16px
- Font: JetBrains Mono, 12px, color #888888, line-height 1.7
- White-space: pre-wrap

Entry dividers within the prompt text:
- Between each entry, show a faint separator: "— [label] —"
- Font: JetBrains Mono, 10px, color #333333, margin: 8px 0

---

---

# Prompt 11: Activity Feed Management — /admin/activity

Context: Manage the live activity feed shown on the public site. Commits come in automatically via GitHub webhook. This page lets the admin manually add entries (blog posts, project updates, notes) and delete any entry. No edit — just add or delete.

---

## Topbar: "admin / activity" breadcrumb, no right-side button (add form is inline)

---

## Content Layout:
Single column, full width

---

### Add Entry Form (top of page, always visible — collapsed by default):

Collapsed state:
- Background: #141414, border 1px solid #1e1e1e, border-radius 6px
- Padding: 14px 20px
- Display flex, align-items center, justify-content space-between
- Text: "add activity entry"
- Font: JetBrains Mono, 11px, color #555555
- Right: "+" icon button, 24px × 24px, color #555555, hover color #c8c0b8
- Hover entire bar: border-color #2a2a2a, background #161616

Expanded state (click to expand, smooth height animation):
- Background: #141414, border 1px solid #2a2a2a, border-radius 6px
- Padding: 20px 20px 16px

Fields (row layout on desktop — horizontal flex, gap 10px, align-items flex-start):

**type** — compact select, width 140px, height 40px
- Options: "commit" | "blog_post" | "project_update" | "experiment" | "note"
- Selected value shown with matching accent color dot on left

**title** — standard input, height 40px, flex-grow 1, placeholder "What happened?"

**description** — standard input (single line, NOT textarea), height 40px, width 260px, placeholder "Short description..."

**URL** — standard input, height 40px, width 220px, placeholder "https://..."

Action buttons (below row, right-aligned, margin-top 10px):
- "cancel" text: JetBrains Mono, 11px, color #444444, hover #888888
- "add entry" button: height 36px, padding 0 16px, background #f0ece4, color #0f0f0f, font JetBrains Mono 11px weight 500, border-radius 4px

---

### Activity List Panel:

Panel:
- Background: #141414, border 1px solid #1e1e1e, border-radius 6px, margin-top 12px
- Padding: 0

Panel Header:
- Height: 44px, padding 0 20px
- Border-bottom: 1px solid #1a1a1a
- Label: "all activity", JetBrains Mono, 10px, uppercase, letter-spacing 0.14em, color #555555
- Count badge: "N entries" same badge style

Activity Rows:
- Each row: padding 14px 20px, border-bottom 1px solid #191919 (except last)
- Display: flex, align-items flex-start, gap 14px

Type indicator dot/icon (left):
- Width: 32px, flex-shrink 0, padding-top 2px
- Icon or symbol, 14px
- Color by type: commit #4ade80, blog_post #60a5fa, project_update #a78bfa, experiment #fb923c, note #94a3b8
- Below icon: type label, JetBrains Mono, 9px, uppercase, same color, letter-spacing 0.1em

Content block (flex-grow):
- Title: JetBrains Mono, 12px, color #c8c0b8, margin-bottom 3px
- Description: JetBrains Mono, 11px, color #666666, margin-bottom 3px
- URL (if present): JetBrains Mono, 10px, color #444444, text-overflow ellipsis

Right side:
- Time: JetBrains Mono, 10px, color #333333, flex-shrink 0, padding-top 2px
- Delete button: "×" 24px × 24px, background transparent, color #333333, hover color #f87171, flex-shrink 0, margin-left 8px, cursor pointer

Row hover: background rgba(255,255,255,0.015)

Empty state:
- Text: "no activity yet. add an entry or push a commit."
- JetBrains Mono, 11px, color #444444, centered, height 120px

---

---

# Shared Design Notes (applies to ALL admin pages above):

## Design System Tokens (repeat for Stitch each time):
- Background: #0f0f0f
- Sidebar: #111111 (220px fixed left)
- Topbar: #0f0f0f (52px fixed top)
- Panel/card: #141414
- Raised surface: #161616
- Input background: #111111
- Border subtle: #1a1a1a | Border default: #1e1e1e | Border hover: #2a2a2a | Border active: #3a3a3a
- Text: #f0ece4 → #c8c0b8 → #888888 → #666666 → #555555 → #444444 → #333333
- Green: #4ade80 | Blue: #60a5fa | Purple: #a78bfa | Orange: #fb923c | Yellow: #facc15 | Red: #f87171 | Lavender: #c084fc

## Typography:
- Font: JetBrains Mono (monospace) everywhere, no exceptions in admin
- Sizes: 9px (section caps) / 10px (meta, badges) / 11px (body, links, table cells) / 12px (card titles, nav, topbar, thread messages) / 13px (form inputs, textarea) / 14px (modal titles) / 28px (stat values)
- Weights: 400 (body) / 500 (labels, nav, buttons) / 700 (stat values)

## Form Inputs (standard pattern for ALL forms):
- Height: 44px | Background: #111111 | Border: 1px solid #222222 | Border-radius: 4px | Padding: 0 14px
- Font: JetBrains Mono, 13px, color #d4d0c8 | Placeholder: #333333
- Focus: border-color #3a3a3a, box-shadow 0 0 0 2px rgba(255,255,255,0.04)
- Error: border-color #5c1a1a, background #120a0a

## Buttons:
- Primary: background #f0ece4, color #0f0f0f, hover #ffffff — height 36-40px, border-radius 4px, JetBrains Mono 11-12px weight 500
- Secondary: transparent background, border 1px solid #2a2a2a, color #666666, hover border #3a3a3a, color #888888
- Destructive: background #f87171, color #0f0f0f, hover #fca5a5
- Ghost/text: no background, no border, color #444444, hover #888888

## No shadows anywhere. No gradients. No colored icon backgrounds. Dark only.
