# Prompt: Admin Dashboard — /admin

Context: This is the home screen of the private admin panel for a developer portfolio site (devferanmi.xyz). The admin is always a single user — the site owner. The dashboard gives an at-a-glance overview: site stats, recent page views, recent activity feed, and quick navigation to all content sections. The design language is the same dark editorial-terminal aesthetic as the public site — very dark backgrounds, monospace labels, dashed/low-opacity borders, warm off-white text. NOT a standard SaaS dashboard with colored gradients and flashy cards. Think: a terminal-style ops view, dense but readable, no decorative fluff.

This screen has two persistent structural elements on every admin page:
1. A left sidebar (navigation)
2. A top bar (page title + logout)

---

## Overall Page Layout:

- Full viewport: 100vw × 100vh
- Background: #0f0f0f with diagonal crosshatch grain overlay (lines at 45°, spacing 12px, rgba(255,255,255,0.03))
- Layout: CSS Grid — `grid-template-columns: 220px 1fr`
- No horizontal scroll

---

## Section 1: Sidebar (Left, Fixed)

### Structure:
- Width: 220px
- Height: 100vh (full height, fixed position)
- Background: #111111
- Border-right: 1px solid #1e1e1e
- Padding: 24px 0
- Z-index: 50
- Overflow-y: auto (for long nav lists)

### Top Identity Block:
- Padding: 0 20px 24px 20px
- Border-bottom: 1px solid #1a1a1a
- Margin-bottom: 8px

Terminal label:
- Text: "feranmi@admin"
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #4ade80 (green — matches cursor color from login)
- Margin-bottom: 2px

Subtitle:
- Text: "admin panel"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #444444
- Letter-spacing: 0.1em
- Text-transform: uppercase

### Navigation Section Label:
- Text: "navigation"
- Font: JetBrains Mono, monospace
- Font size: 9px
- Color: #333333
- Letter-spacing: 0.18em
- Text-transform: uppercase
- Padding: 16px 20px 8px 20px

### Nav Items (vertical list):

Each nav item:
- Height: 36px
- Padding: 0 20px
- Display: flex, align-items: center, gap: 10px
- Cursor: pointer
- Border-left: 2px solid transparent (used for active state)

Icon:
- Size: 14px × 14px
- Color: #444444 (default), #888888 (hover), #f0ece4 (active)
- Monospace symbol or minimal line icon

Label:
- Font: JetBrains Mono, monospace
- Font size: 12px
- Color: #666666 (default)
- Hover: #aaaaaa
- Active: #f0ece4

States:
- Default: transparent background, border-left transparent
- Hover: background rgba(255,255,255,0.03), border-left 2px solid #333
- Active/Current: background rgba(255,255,255,0.05), border-left 2px solid #f0ece4, label color #f0ece4, icon color #f0ece4

Nav items (in order):
1. Icon: grid/dashboard — Label: "dashboard" — Route: /admin
2. Icon: folder — Label: "projects" — Route: /admin/projects
3. Icon: briefcase — Label: "experience" — Route: /admin/experience
4. Icon: flask/beaker — Label: "experiments" — Route: /admin/experiments
5. Icon: award — Label: "awards" — Route: /admin/awards
6. Icon: kanban/board — Label: "board" — Route: /admin/board
7. Icon: bar-chart — Label: "analytics" — Route: /admin/analytics
8. Icon: message-square — Label: "chats" — Route: /admin/chats
9. Icon: cpu/brain — Label: "system context" — Route: /admin/system-context
10. Icon: activity — Label: "activity feed" — Route: /admin/activity

Section divider between items 1 and 2:
- 1px solid #1a1a1a line
- Margin: 8px 20px

### Sidebar Bottom:
- Pinned to bottom of sidebar
- Border-top: 1px solid #1a1a1a
- Padding: 16px 20px
- Text: "← back to site"
- Font: JetBrains Mono, 11px, color #444444
- Hover: color #888888
- Cursor: pointer

---

## Section 2: Top Bar (Fixed, spans content area)

### Structure:
- Height: 52px
- Position: fixed top, left: 220px, right: 0
- Background: #0f0f0f
- Border-bottom: 1px solid #1a1a1a
- Padding: 0 32px
- Display: flex, align-items: center, justify-content: space-between
- Z-index: 40

### Left — Page Title:
- Text: "dashboard"
- Font: JetBrains Mono, monospace
- Font size: 12px
- Font weight: 500
- Color: #888888
- Letter-spacing: 0.08em

Breadcrumb prefix (optional, dimmer):
- Text: "admin / "
- Color: #333333
- Same font, same size

### Right — Logout:
- Text: "logout →"
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #444444
- Hover: color #f87171 (soft red — destructive signal)
- Cursor: pointer
- Transition: color 150ms ease
- No button border or background

---

## Section 3: Main Content Area

### Structure:
- Position: margin-left 220px, margin-top 52px
- Padding: 32px
- Width: calc(100% - 220px)
- Min-height: calc(100vh - 52px)
- Overflow-y: auto

---

### 3a. Stats Cards Row

#### Container:
- Display: grid
- Grid-template-columns: repeat(4, 1fr)
- Gap: 12px
- Margin-bottom: 32px

#### Each Stat Card:
- Background: #141414
- Border: 1px solid #1e1e1e
- Border-radius: 6px
- Padding: 20px 20px 16px
- Cursor: default

Top row (label):
- Text examples: "total visits", "blog reads", "project interactions", "active chats"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Font weight: 500
- Color: #555555
- Letter-spacing: 0.14em
- Text-transform: uppercase
- Margin-bottom: 12px

Value:
- Text examples: "12,441", "3,820", "6,104", "77"
- Font: JetBrains Mono, monospace
- Font size: 28px
- Font weight: 700
- Color: #f0ece4
- Line-height: 1
- Margin-bottom: 8px

Sub-label (timeframe):
- Text examples: "all time", "all time", "all time", "stored"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #333333

Hover state:
- Border-color: #2a2a2a
- Transition: border-color 150ms ease

---

### 3b. Two-Column Grid (Recent Views + Recent Activity)

#### Container:
- Display: grid
- Grid-template-columns: 1fr 380px
- Gap: 12px
- Margin-bottom: 32px

---

#### Left Panel — Recent Page Views Table

Panel:
- Background: #141414
- Border: 1px solid #1e1e1e
- Border-radius: 6px
- Padding: 0 (table handles its own padding)

Panel Header:
- Height: 44px
- Padding: 0 20px
- Display: flex, align-items: center, justify-content: space-between
- Border-bottom: 1px solid #1a1a1a

Header label:
- Text: "recent page views"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #555555
- Letter-spacing: 0.14em
- Text-transform: uppercase

Header count badge:
- Text: "last 50"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #333333
- Background: #1a1a1a
- Border: 1px solid #252525
- Border-radius: 4px
- Padding: 2px 8px

Table:
- Width: 100%
- Border-collapse: collapse

Table Header Row:
- Background: #111111
- Height: 32px

Table Header Cells:
- Font: JetBrains Mono, monospace
- Font size: 9px
- Font weight: 500
- Color: #444444
- Letter-spacing: 0.14em
- Text-transform: uppercase
- Padding: 0 16px
- Text-align: left
- Columns: "page", "referrer", "country", "time"

Table Body Rows:
- Height: 40px
- Border-bottom: 1px solid #191919

Cell content:
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #888888
- Padding: 0 16px

"page" cell:
- Color: #c8c0b8 (slightly brighter — most important column)
- Text example: "/projects/slug"

"referrer" cell:
- Color: #666666
- Text example: "google.com" or "—" if direct

"country" cell:
- Color: #555555
- Text example: "NG", "US", "GB" (2-letter code)

"time" cell:
- Color: #444444
- Text example: "2m ago", "14m ago"

Row hover:
- Background: rgba(255,255,255,0.02)
- Transition: background 100ms ease

---

#### Right Panel — Recent Activity Feed

Panel:
- Background: #141414
- Border: 1px solid #1e1e1e
- Border-radius: 6px
- Padding: 0

Panel Header:
- Height: 44px
- Padding: 0 20px
- Display: flex, align-items: center, justify-content: space-between
- Border-bottom: 1px solid #1a1a1a

Header label:
- Text: "recent activity"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #555555
- Letter-spacing: 0.14em
- Text-transform: uppercase

Header badge:
- Text: "last 10"
- Same style as page views badge

Activity List:
- Each item: padding 14px 20px
- Border-bottom: 1px solid #191919 (except last item)

Each Activity Item layout (horizontal):
- Left: Type icon (16px × 16px, monospace symbol or minimal icon)
- Right: Text stack (title + meta)
- Gap between icon and text: 12px

Type icon colors by type:
- commit: #4ade80 (green)
- blog_post: #60a5fa (blue)
- project_update: #a78bfa (purple)
- experiment: #fb923c (orange)
- note: #94a3b8 (gray)

Item title:
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #c8c0b8
- Margin-bottom: 2px
- Max 1 line, overflow ellipsis

Item meta (type + time):
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #444444
- Format: "commit · 5m ago"

Row hover:
- Background: rgba(255,255,255,0.02)

---

### 3c. Quick Nav Grid

#### Section Label:
- Text: "quick nav"
- Font: JetBrains Mono, monospace
- Font size: 9px
- Color: #333333
- Letter-spacing: 0.18em
- Text-transform: uppercase
- Margin-bottom: 12px
- Padding-bottom: 8px
- Border-bottom: 1px solid #1a1a1a

#### Grid:
- Display: grid
- Grid-template-columns: repeat(5, 1fr)
- Gap: 8px

#### Each Quick Nav Card:
- Background: #111111
- Border: 1px solid #1e1e1e
- Border-radius: 6px
- Padding: 16px
- Cursor: pointer
- Transition: border-color 150ms ease, background 150ms ease

Icon:
- Size: 16px × 16px
- Color: #444444
- Margin-bottom: 10px

Label:
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #666666
- Margin-bottom: 4px

Sub-label (description):
- Font: JetBrains Mono, monospace
- Font size: 10px
- Color: #333333
- Example: "5 projects", "3 entries", "12 items"

Hover state:
- Background: #161616
- Border-color: #2a2a2a
- Icon color: #888888
- Label color: #aaaaaa

Quick nav cards (9 total):
1. Label: "projects" — Sub: "N projects"
2. Label: "experience" — Sub: "N entries"
3. Label: "experiments" — Sub: "N items"
4. Label: "awards" — Sub: "N awards"
5. Label: "board" — Sub: "N items"
6. Label: "analytics" — Sub: "page views"
7. Label: "chats" — Sub: "N sessions"
8. Label: "system context" — Sub: "N entries"
9. Label: "activity" — Sub: "N events"

---

## Visual Design System:

### Colors:
- Page background: #0f0f0f
- Sidebar background: #111111
- Card/panel background: #141414
- Surface raised: #161616
- Border subtle: #1a1a1a
- Border default: #1e1e1e
- Border hover: #2a2a2a
- Text primary: #f0ece4
- Text secondary: #c8c0b8
- Text muted: #888888
- Text dim: #666666
- Text very dim: #444444 / #555555
- Labels/caps: #555555
- Green accent: #4ade80 (commits, online, identity)
- Blue accent: #60a5fa (blog)
- Purple accent: #a78bfa (projects)
- Orange accent: #fb923c (experiments)
- Red (logout/danger): #f87171
- Grain overlay: rgba(255,255,255,0.03)

### Typography:
- All text: JetBrains Mono, Courier New, monospace
- Exception — any large serif label if desired: DM Serif Display (not used in admin)
- Sizes: 9px (caps labels), 10px (meta, subtext), 11px (body, table cells), 12px (nav, topbar), 13px (inputs), 28px (stat values)
- Weights: 400 (body), 500 (labels, nav), 700 (stat values)

### Spacing:
- Sidebar width: 220px
- Topbar height: 52px
- Content padding: 32px
- Card padding: 20px
- Table cell padding: 0 16px
- Grid gaps: 12px (main grids), 8px (quick nav)

### Border Radius:
- Cards / panels: 6px
- Badges: 4px
- Table: 0 (flat inside panels)

### Shadows:
- None — flat dark design, no elevation shadows

### Animations:
- Hover transitions: all 150ms ease
- Nav active border: instant, no animation
- Row hover: background 100ms ease

---

## Responsive Behavior:

### Desktop (1200px+):
- Sidebar visible at 220px
- Stats: 4 columns
- Middle: 2 columns (table + feed)
- Quick nav: 5 columns

### Tablet (768px–1199px):
- Sidebar collapses to icon-only (48px wide, icons only, no labels)
- Stats: 2×2 grid
- Middle: stacked (table full width, feed full width below)
- Quick nav: 3 columns

### Mobile (<768px):
- Sidebar hidden, accessible via hamburger icon in topbar
- Topbar: hamburger left, "admin" center, logout right
- Stats: 2×2 grid, smaller values (22px)
- Middle: single column stack
- Quick nav: 2 columns

---

## States:

### Loading (initial page load):
- Stat card values replaced with gray monospace placeholder "——" animating opacity 0.3 → 0.6 → 0.3, 1.5s infinite
- Table rows show gray rectangles (same height as rows) with same pulse
- Activity items show flat gray bars

### Empty States:
- Page views table: center message "no visits recorded yet." in mono 11px #444444
- Activity feed: center message "no activity yet." in mono 11px #444444
- Quick nav cards: counts show "0" without hiding the card

---

## Notes:
- Entire admin panel is dark-only. No light mode.
- Sidebar "dashboard" item has active state (border-left #f0ece4, brighter label) since this is the dashboard page
- The grain texture applies to the page background behind the content, not the cards
- Tables should not have visible column borders — only row separators (horizontal lines)
- Monospace everywhere — no sans-serif in the admin
- The stat cards must NOT have colorful icon backgrounds (no teal/blue circles) — that's a SaaS pattern. Keep them flat: just the number, a label, and a timeframe. Raw data, not decorated metrics.
