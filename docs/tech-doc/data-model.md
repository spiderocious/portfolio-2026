# Data Model

## Overview

All persistent data lives in Supabase (PostgreSQL). Concern areas: content (projects, experience, experiments, awards), board/workspace, analytics/stats, live activity, and LLM chat history.

Markdown is supported in all description and body fields — stored as raw markdown text, rendered client-side.

---

## Content Tables

### projects
Showcase projects — managed via admin panel.

```
projects
- id: uuid (PK, default gen_random_uuid())
- title: text
- slug: text (unique) — used in URLs
- description: text — markdown supported
- status: text ('active' | 'archived' | 'wip')
- stack: text[] — array of tech tags (e.g. ['Next.js', 'Supabase'])
- cover_image: text (nullable) — URL
- links: jsonb — { deployed?: string, github?: string, [key: string]: string }
- live_data: jsonb (nullable) — custom stats, e.g. [{ label: "Users", value: "500k" }, ...]
- featured: boolean (default false) — controls landing page highlight
- position: integer — manual ordering
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

**live_data shape:**
```json
[
  { "label": "Users", "value": "500k" },
  { "label": "Transactions processed", "value": "$2M+" },
  { "label": "Forms created", "value": "12,000" }
]
```

**links shape:**
```json
{
  "deployed": "https://myapp.com",
  "github": "https://github.com/user/repo",
  "producthunt": "https://producthunt.com/posts/...",
  "demo": "https://loom.com/..."
}
```

---

### experience
Work history entries — managed via admin panel.

```
experience
- id: uuid (PK)
- company: text
- role: text
- description: text — markdown supported (overview of role)
- achievements: text — markdown supported (bullet list of key achievements)
- start_date: date
- end_date: date (nullable — null means current)
- location: text (nullable)
- company_url: text (nullable)
- logo_url: text (nullable)
- position: integer — display ordering
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

---

### experiments
Side projects, tinkering, misc builds — managed via admin panel.

```
experiments
- id: uuid (PK)
- title: text
- slug: text (unique)
- description: text — markdown supported
- status: text ('live' | 'wip' | 'archived' | 'idea')
- stack: text[] — tech tags
- links: jsonb — { deployed?, github?, [key]: string }
- cover_image: text (nullable)
- featured: boolean (default false)
- position: integer
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

---

### awards
Recognition, honours, achievements — managed via admin panel.

```
awards
- id: uuid (PK)
- title: text
- issuer: text — org/body that gave the award
- description: text (nullable) — markdown supported
- date: date
- url: text (nullable) — link to announcement/certificate
- image_url: text (nullable)
- position: integer — display ordering
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

---

## Board / Vision / Workspace

### board_items
Top-level Jira-style tickets. Managed via admin panel.

```
board_items
- id: uuid (PK)
- title: text
- description: text (nullable) — markdown supported
- status: text ('backlog' | 'in_progress' | 'done' | 'on_hold')
- category: text ('goal' | 'project' | 'learning' | 'idea' | 'other')
- priority: text ('low' | 'medium' | 'high') (nullable)
- due_date: date (nullable)
- is_private: boolean (default false) — if true, hidden from public board view
- position: integer — ordering within status column
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

### board_sub_items
One level of sub-tickets per board item.

```
board_sub_items
- id: uuid (PK)
- parent_id: uuid (FK → board_items.id, ON DELETE CASCADE)
- title: text
- description: text (nullable) — markdown supported
- status: text ('backlog' | 'in_progress' | 'done' | 'on_hold')
- is_private: boolean (default false) — if true, hidden from public view
- position: integer — ordering within parent
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

---

## Analytics

### page_views
Every page visit.

```
page_views
- id: uuid (PK)
- page: text (e.g. '/', '/projects', '/blog')
- referrer: text (nullable)
- user_agent: text (nullable)
- country: text (nullable)
- visited_at: timestamptz (default now())
```

### project_interactions
Interactions on individual projects.

```
project_interactions
- id: uuid (PK)
- project_slug: text
- interaction_type: text ('view' | 'link_click' | 'github_click' | 'live_click')
- interacted_at: timestamptz (default now())
```

### blog_reads
Blog post read events.

```
blog_reads
- id: uuid (PK)
- post_slug: text
- post_title: text
- read_at: timestamptz (default now())
```

---

## Live Activity Feed

### activity_feed
All activity events — commits, blog posts, project updates, experiments, notes.

```
activity_feed
- id: uuid (PK)
- type: text ('commit' | 'blog_post' | 'project_update' | 'experiment' | 'note')
- title: text
- description: text (nullable)
- url: text (nullable)
- metadata: jsonb (nullable)
- created_at: timestamptz (default now())
```

**metadata shape by type:**
- `commit`: `{ repo, branch, sha, message }`
- `blog_post`: `{ slug, hashnode_id }`
- `project_update`: `{ project_slug }`
- `experiment`: `{ experiment_slug }`
- `note`: `{}`

---

## LLM System Context

### system_convos
Stores the LLM's knowledge base about me — each row is one discrete piece of information (background, skills, experience summary, etc.). Managed via admin panel. At chat time, all rows are fetched and assembled into the system prompt dynamically — no redeploy needed to update what the LLM knows.

```
system_convos
- id: uuid (PK)
- label: text — human-readable name (e.g. "Professional Identity", "Work Experience", "Personal Background")
- content: text — the actual information, written in first person. No markdown enforced but supported.
- category: text (nullable) — for grouping in admin UI (e.g. 'professional', 'personal', 'opinions', 'instructions')
- position: integer — controls assembly order in the system prompt
- is_active: boolean (default true) — inactive rows are excluded from the prompt without deleting
- created_at: timestamptz (default now())
- updated_at: timestamptz (default now())
```

**How it works at runtime:**
1. Visitor sends a message
2. `/api/llm` fetches all `system_convos WHERE is_active = true ORDER BY position`
3. Rows are assembled into a single system message: each row's `content` concatenated in order
4. Full message history for the session is included as context
5. Assembled prompt + history sent to OpenAI
6. Response streamed back, both messages persisted to `llm_messages`

**Pre-populated from:** `/Users/feranmi/codebases/2025/yearnings/about-me/all-details-export.json` — each object in that array becomes one row. The final `RESPONSE INSTRUCTIONS` entry becomes the last row (highest position) as it controls tone and persona.

---

## File Storage (Supabase Storage)

Images and other uploaded assets are stored in Supabase Storage, not in the database. The DB stores only the URL returned after upload.

**Buckets:**

| Bucket | Contents | Access |
|---|---|---|
| `project-covers` | Project cover images | Public |
| `experiment-covers` | Experiment cover images | Public |
| `company-logos` | Experience company logos | Public |
| `award-images` | Award images/certificates | Public |

**Upload flow (admin panel):**
1. User selects file in admin form
2. Client uploads directly to Supabase Storage via `@supabase/storage-js`
3. Public URL returned and stored in the relevant DB column (`cover_image`, `logo_url`, `image_url`)

---

## LLM Chat History

### llm_conversations
Each visitor chat session.

```
llm_conversations
- id: uuid (PK)
- session_id: text — anonymous client-generated ID (stored in localStorage)
- ip_hash: text (nullable) — hashed IP for rate limiting, not for identification
- started_at: timestamptz (default now())
- last_message_at: timestamptz
- message_count: integer (default 0)
```

### llm_messages
Individual messages within a conversation.

```
llm_messages
- id: uuid (PK)
- conversation_id: uuid (FK → llm_conversations.id, ON DELETE CASCADE)
- role: text ('user' | 'assistant')
- content: text
- created_at: timestamptz (default now())
```

---

## Computed Stats (not stored)

Derived at query time, cached via ISR:

| Stat | Source |
|---|---|
| Total visits | `COUNT(*) FROM page_views` |
| Page-level views | `COUNT(*) FROM page_views WHERE page = ?` |
| Blog post reads | `COUNT(*) FROM blog_reads WHERE post_slug = ?` |
| Project views | `COUNT(*) FROM project_interactions WHERE interaction_type = 'view'` |

---

## Relationships Summary

```
board_items ──< board_sub_items (parent_id)
llm_conversations ──< llm_messages (conversation_id)

projects, experience, experiments, awards — standalone, no FK dependencies
page_views, project_interactions, blog_reads, activity_feed — append-only event logs
```
