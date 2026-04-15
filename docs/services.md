# Services Documentation

All services live under `lib/services/`. Each service is a collection of typed async functions that talk directly to Supabase (or Hashnode / OpenAI for their respective domains). API routes and server components call these — never raw Supabase queries scattered across the codebase.

All Supabase services accept an optional `supabase` client argument so they work in both server components (server client) and API routes (service role client) without duplication.

---

## Table of Contents

1. [analyticsService](#1-analyticsservice)
2. [projectsService](#2-projectsservice)
3. [experienceService](#3-experienceservice)
4. [experimentsService](#4-experimentsservice)
5. [awardsService](#5-awardsservice)
6. [boardService](#6-boardservice)
7. [activityService](#7-activityservice)
8. [chatsService](#8-chatsservice)
9. [systemContextService](#9-systemcontextservice)
10. [storageService](#10-storageservice)
11. [hashnodeService](#11-hashnodeservice)
12. [llmService](#12-llmservice)
13. [statsService](#13-statsservice)

---

## 1. `analyticsService`

**File:** `lib/services/analytics.ts`
**Used by:** `/api/analytics` (public write), `/api/admin/analytics` (admin read), dashboard, analytics page

---

### `logPageView(data)`

Inserts a row into `page_views`. Called client-side on every public page mount via `usePageView` hook.

```ts
input: {
  page: string          // e.g. '/', '/projects', '/blog/some-slug'
  referrer?: string     // document.referrer
  user_agent?: string   // navigator.userAgent
  country?: string      // resolved server-side from IP if possible
}

output: { error: null } | { error: string }
```

---

### `logProjectInteraction(data)`

Inserts a row into `project_interactions`. Called when a visitor views a project detail page or clicks a link on it.

```ts
input: {
  project_slug: string
  interaction_type: 'view' | 'link_click' | 'github_click' | 'live_click'
}

output: { error: null } | { error: string }
```

---

### `logBlogRead(data)`

Inserts a row into `blog_reads`. Called on mount of a blog post detail page.

```ts
input: {
  post_slug: string
  post_title: string
}

output: { error: null } | { error: string }
```

---

### `getTotalVisits()`

Returns total count of all rows in `page_views`. Used by stats bar on landing and admin dashboard stat card.

```ts
input: none

output: {
  count: number   // e.g. 12441
}
```

---

### `getRecentPageViews(limit)`

Returns the most recent N rows from `page_views`, ordered by `visited_at DESC`. Used by the admin dashboard "recent page views" table.

```ts
input: {
  limit: number   // e.g. 50
}

output: Array<{
  id: string
  page: string          // e.g. '/projects/monolith'
  referrer: string | null
  country: string | null
  user_agent: string | null
  visited_at: string    // ISO timestamp
}>
```

---

### `getPageViewsOverTime(range)`

Returns daily view counts bucketed by day for the given range. Used by the line chart on the analytics page.

```ts
input: {
  range: '7d' | '30d' | '90d'
}

output: Array<{
  date: string    // 'YYYY-MM-DD'
  count: number
}>
// e.g. [{ date: '2026-04-08', count: 142 }, { date: '2026-04-09', count: 198 }, ...]
```

---

### `getTopPages(range?)`

Returns pages grouped by URL with view count, sorted descending. Used by the "top pages" table on the analytics page.

```ts
input: {
  range?: '7d' | '30d' | '90d'   // omit for all-time
}

output: Array<{
  page: string
  count: number
}>
// e.g. [{ page: '/projects/monolith', count: 843 }, { page: '/', count: 612 }, ...]
```

---

### `getReferrerBreakdown(range?)`

Returns referrers grouped with count. Null/empty referrers are grouped as `'direct'`. Used by the referrer section on the analytics page.

```ts
input: {
  range?: '7d' | '30d' | '90d'
}

output: Array<{
  referrer: string    // 'google.com', 'twitter.com', 'direct', etc.
  count: number
}>
```

---

### `getProjectInteractionStats(range?)`

Returns interaction counts grouped by `project_slug` and `interaction_type`. Used by the project interactions table on the analytics page.

```ts
input: {
  range?: '7d' | '30d' | '90d'
}

output: Array<{
  project_slug: string
  views: number
  link_clicks: number
  github_clicks: number
  live_clicks: number
  total: number
}>
```

---

### `getTotalProjectInteractions()`

Returns total count of all `project_interactions` rows. Used by admin dashboard stat card and public stats bar.

```ts
input: none

output: {
  count: number
}
```

---

### `getBlogReadsByPost(range?)`

Returns blog read counts grouped by post slug and title. Used by the blog reads table on the analytics page.

```ts
input: {
  range?: '7d' | '30d' | '90d'
}

output: Array<{
  post_slug: string
  post_title: string
  count: number
}>
```

---

### `getTotalBlogReads()`

Returns total count of all `blog_reads` rows. Used by admin dashboard stat card and public stats bar.

```ts
input: none

output: {
  count: number
}
```

---

### `getDashboardStats()`

Convenience aggregator — fetches total visits, total blog reads, total project interactions in a single call. Used by admin dashboard stats cards.

```ts
input: none

output: {
  total_visits: number
  total_blog_reads: number
  total_project_interactions: number
  active_chats: number    // COUNT(*) FROM llm_conversations
}
```

---

## 2. `projectsService`

**File:** `lib/services/projects.ts`
**Used by:** `/api/admin/projects`, public projects page, project detail page, landing featured strip

---

### `getAllProjects()`

Returns all projects ordered by `position ASC`. Used by the admin projects list and public projects page.

```ts
input: none

output: Array<{
  id: string
  title: string
  slug: string
  description: string       // raw markdown
  status: 'active' | 'archived' | 'wip'
  stack: string[]
  cover_image: string | null
  links: {
    deployed?: string
    github?: string
    [key: string]: string | undefined
  }
  live_data: Array<{ label: string; value: string }> | null
  featured: boolean
  position: number
  created_at: string
  updated_at: string
}>
```

---

### `getProjectBySlug(slug)`

Returns a single project by slug. Used by the project detail page and `generateStaticParams`.

```ts
input: {
  slug: string
}

output: {
  id: string
  title: string
  slug: string
  description: string
  status: 'active' | 'archived' | 'wip'
  stack: string[]
  cover_image: string | null
  links: { deployed?: string; github?: string; [key: string]: string | undefined }
  live_data: Array<{ label: string; value: string }> | null
  featured: boolean
  position: number
  created_at: string
  updated_at: string
} | null
```

---

### `getProjectById(id)`

Returns a single project by UUID. Used by admin edit form to pre-fill.

```ts
input: {
  id: string
}

output: // same shape as getProjectBySlug | null
```

---

### `getFeaturedProjects()`

Returns projects where `featured = true`, ordered by position. Used by the landing page featured strip.

```ts
input: none

output: Array<{
  id: string
  title: string
  slug: string
  description: string
  status: 'active' | 'archived' | 'wip'
  stack: string[]
  cover_image: string | null
  links: { deployed?: string; github?: string; [key: string]: string | undefined }
  live_data: Array<{ label: string; value: string }> | null
  position: number
}>
```

---

### `createProject(data)`

Inserts a new project. Called by `POST /api/admin/projects`. Triggers `revalidatePath('/projects')` after insert.

```ts
input: {
  title: string
  slug: string
  description: string
  status: 'active' | 'archived' | 'wip'
  stack: string[]
  cover_image?: string | null
  links?: { deployed?: string; github?: string; [key: string]: string | undefined }
  live_data?: Array<{ label: string; value: string }> | null
  featured?: boolean
  position?: number
}

output: {
  id: string
  slug: string
} | { error: string }
```

---

### `updateProject(id, data)`

Updates an existing project by UUID. Called by `PUT /api/admin/projects/[id]`. Triggers `revalidatePath('/projects')` and `revalidatePath('/projects/[slug]')`.

```ts
input: {
  id: string
  data: Partial<{
    title: string
    slug: string
    description: string
    status: 'active' | 'archived' | 'wip'
    stack: string[]
    cover_image: string | null
    links: { [key: string]: string | undefined }
    live_data: Array<{ label: string; value: string }> | null
    featured: boolean
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteProject(id)`

Deletes a project by UUID. Called by `DELETE /api/admin/projects/[id]`. Triggers `revalidatePath('/projects')`.

```ts
input: {
  id: string
}

output: { error: null } | { error: string }
```

---

### `reorderProjects(items)`

Bulk updates `position` for an array of project IDs. Called after drag-to-reorder in admin list.

```ts
input: Array<{
  id: string
  position: number
}>

output: { error: null } | { error: string }
```

---

## 3. `experienceService`

**File:** `lib/services/experience.ts`
**Used by:** `/api/admin/experience`, public experience page

---

### `getAllExperience()`

Returns all experience entries ordered by `position ASC`. Used by public experience page and admin list.

```ts
input: none

output: Array<{
  id: string
  company: string
  role: string
  description: string         // raw markdown
  achievements: string        // raw markdown
  start_date: string          // 'YYYY-MM-DD'
  end_date: string | null     // null = current role
  location: string | null
  company_url: string | null
  logo_url: string | null
  position: number
  created_at: string
  updated_at: string
}>
```

---

### `getExperienceById(id)`

Returns a single experience entry. Used by admin edit form.

```ts
input: { id: string }

output: // same shape as single item in getAllExperience | null
```

---

### `createExperience(data)`

Inserts a new experience entry. Triggers `revalidatePath('/experience')`.

```ts
input: {
  company: string
  role: string
  description: string
  achievements: string
  start_date: string
  end_date?: string | null
  location?: string | null
  company_url?: string | null
  logo_url?: string | null
  position?: number
}

output: { id: string } | { error: string }
```

---

### `updateExperience(id, data)`

Updates an experience entry. Triggers `revalidatePath('/experience')`.

```ts
input: {
  id: string
  data: Partial<{
    company: string
    role: string
    description: string
    achievements: string
    start_date: string
    end_date: string | null
    location: string | null
    company_url: string | null
    logo_url: string | null
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteExperience(id)`

Deletes an experience entry. Triggers `revalidatePath('/experience')`.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

### `reorderExperience(items)`

Bulk updates `position` for experience entries.

```ts
input: Array<{ id: string; position: number }>
output: { error: null } | { error: string }
```

---

## 4. `experimentsService`

**File:** `lib/services/experiments.ts`
**Used by:** `/api/admin/experiments`, public experiments page, experiment detail page

---

### `getAllExperiments()`

Returns all experiments ordered by `position ASC`. Used by public experiments page and admin list.

```ts
input: none

output: Array<{
  id: string
  title: string
  slug: string
  description: string       // raw markdown
  status: 'live' | 'wip' | 'archived' | 'idea'
  stack: string[]
  links: { deployed?: string; github?: string; [key: string]: string | undefined }
  cover_image: string | null
  featured: boolean
  position: number
  created_at: string
  updated_at: string
}>
```

---

### `getExperimentBySlug(slug)`

Returns a single experiment by slug. Used by experiment detail page.

```ts
input: { slug: string }
output: // same shape as single item | null
```

---

### `getExperimentById(id)`

Returns a single experiment by UUID. Used by admin edit form.

```ts
input: { id: string }
output: // same shape as single item | null
```

---

### `createExperiment(data)`

Inserts a new experiment. Triggers `revalidatePath('/experiments')`.

```ts
input: {
  title: string
  slug: string
  description: string
  status: 'live' | 'wip' | 'archived' | 'idea'
  stack?: string[]
  links?: { deployed?: string; github?: string; [key: string]: string | undefined }
  cover_image?: string | null
  featured?: boolean
  position?: number
}

output: { id: string; slug: string } | { error: string }
```

---

### `updateExperiment(id, data)`

Updates an experiment. Triggers `revalidatePath('/experiments')` and `revalidatePath('/experiments/[slug]')`.

```ts
input: {
  id: string
  data: Partial<{
    title: string
    slug: string
    description: string
    status: 'live' | 'wip' | 'archived' | 'idea'
    stack: string[]
    links: { [key: string]: string | undefined }
    cover_image: string | null
    featured: boolean
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteExperiment(id)`

Deletes an experiment. Triggers `revalidatePath('/experiments')`.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

## 5. `awardsService`

**File:** `lib/services/awards.ts`
**Used by:** `/api/admin/awards`, public awards page

---

### `getAllAwards()`

Returns all awards ordered by `position ASC`. Used by public awards page and admin list.

```ts
input: none

output: Array<{
  id: string
  title: string
  issuer: string
  description: string | null   // raw markdown
  date: string                 // 'YYYY-MM-DD'
  url: string | null
  image_url: string | null
  position: number
  created_at: string
  updated_at: string
}>
```

---

### `getAwardById(id)`

Returns a single award by UUID. Used by admin edit form.

```ts
input: { id: string }
output: // same shape as single item | null
```

---

### `createAward(data)`

Inserts a new award. Triggers `revalidatePath('/awards')`.

```ts
input: {
  title: string
  issuer: string
  description?: string | null
  date: string
  url?: string | null
  image_url?: string | null
  position?: number
}

output: { id: string } | { error: string }
```

---

### `updateAward(id, data)`

Updates an award. Triggers `revalidatePath('/awards')`.

```ts
input: {
  id: string
  data: Partial<{
    title: string
    issuer: string
    description: string | null
    date: string
    url: string | null
    image_url: string | null
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteAward(id)`

Deletes an award. Triggers `revalidatePath('/awards')`.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

### `reorderAwards(items)`

Bulk updates `position` for awards.

```ts
input: Array<{ id: string; position: number }>
output: { error: null } | { error: string }
```

---

## 6. `boardService`

**File:** `lib/services/board.ts`
**Used by:** `/api/board` (public), `/api/admin/board` (admin), public board page, admin board page

---

### `getBoardItems(options?)`

Returns all board items grouped by status. Public call filters `is_private = false`. Admin call returns everything. Used by both public kanban and admin kanban.

```ts
input: {
  includePrivate?: boolean    // default false (public); true for admin
}

output: {
  backlog: BoardItem[]
  in_progress: BoardItem[]
  done: BoardItem[]
  on_hold: BoardItem[]
}

// BoardItem shape:
{
  id: string
  title: string
  description: string | null   // raw markdown
  status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
  category: 'goal' | 'project' | 'learning' | 'idea' | 'other'
  priority: 'low' | 'medium' | 'high' | null
  due_date: string | null
  is_private: boolean
  position: number
  created_at: string
  updated_at: string
  sub_items: SubItem[]    // nested — fetched in same call
}

// SubItem shape:
{
  id: string
  parent_id: string
  title: string
  description: string | null
  status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
  is_private: boolean
  position: number
  created_at: string
  updated_at: string
}
```

---

### `getBoardItemById(id)`

Returns a single board item with its sub-items. Used by admin edit form.

```ts
input: { id: string }
output: BoardItem | null   // same shape as above including sub_items
```

---

### `createBoardItem(data)`

Inserts a new board item.

```ts
input: {
  title: string
  description?: string | null
  status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
  category: 'goal' | 'project' | 'learning' | 'idea' | 'other'
  priority?: 'low' | 'medium' | 'high' | null
  due_date?: string | null
  is_private?: boolean
  position?: number
}

output: { id: string } | { error: string }
```

---

### `updateBoardItem(id, data)`

Updates a board item.

```ts
input: {
  id: string
  data: Partial<{
    title: string
    description: string | null
    status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
    category: 'goal' | 'project' | 'learning' | 'idea' | 'other'
    priority: 'low' | 'medium' | 'high' | null
    due_date: string | null
    is_private: boolean
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteBoardItem(id)`

Deletes a board item. Sub-items are cascade deleted via FK.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

### `reorderBoardItems(items)`

Bulk updates `position` for board items within a column.

```ts
input: Array<{ id: string; position: number }>
output: { error: null } | { error: string }
```

---

### `createSubItem(parentId, data)`

Inserts a sub-ticket under a board item.

```ts
input: {
  parentId: string
  data: {
    title: string
    description?: string | null
    status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
    is_private?: boolean
    position?: number
  }
}

output: { id: string } | { error: string }
```

---

### `updateSubItem(id, data)`

Updates a sub-ticket.

```ts
input: {
  id: string
  data: Partial<{
    title: string
    description: string | null
    status: 'backlog' | 'in_progress' | 'done' | 'on_hold'
    is_private: boolean
    position: number
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteSubItem(id)`

Deletes a sub-ticket.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

## 7. `activityService`

**File:** `lib/services/activity.ts`
**Used by:** `/api/activity` (public), `/api/admin/activity` (admin), `/api/webhooks/github`, liveworks widget, dashboard, public activity section

---

### `getActivityFeed(options?)`

Returns activity feed entries, newest first. Public. Filterable by type. Paginated. Used by public activity section and liveworks widget.

```ts
input: {
  limit?: number                                                              // default 20
  type?: 'commit' | 'blog_post' | 'project_update' | 'experiment' | 'note'  // filter by type
  cursor?: string                                                              // last item's created_at for pagination
}

output: {
  items: Array<{
    id: string
    type: 'commit' | 'blog_post' | 'project_update' | 'experiment' | 'note'
    title: string
    description: string | null
    url: string | null
    metadata: {
      // commit: { repo, branch, sha, message }
      // blog_post: { slug, hashnode_id }
      // project_update: { project_slug }
      // experiment: { experiment_slug }
      // note: {}
      [key: string]: unknown
    } | null
    created_at: string
  }>
  has_more: boolean
}
```

---

### `getRecentActivity(limit)`

Returns the N most recent activity entries. Used by admin dashboard activity feed panel and liveworks widget (with `type` filter).

```ts
input: {
  limit: number   // e.g. 10
}

output: Array<{
  id: string
  type: 'commit' | 'blog_post' | 'project_update' | 'experiment' | 'note'
  title: string
  description: string | null
  url: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}>
```

---

### `getLiveworks()`

Returns the 1–2 most recent `commit` or `project_update` entries. Used by the liveworks widget on the landing page.

```ts
input: none

output: Array<{
  id: string
  type: 'commit' | 'project_update'
  title: string
  description: string | null
  url: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}>
```

---

### `createActivityEntry(data)`

Inserts a manual activity entry. Called from admin activity form and from the GitHub webhook handler.

```ts
input: {
  type: 'commit' | 'blog_post' | 'project_update' | 'experiment' | 'note'
  title: string
  description?: string | null
  url?: string | null
  metadata?: Record<string, unknown> | null
}

output: { id: string } | { error: string }
```

---

### `deleteActivityEntry(id)`

Deletes an activity entry. Admin only.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

### `logGithubCommit(payload)`

Parses a GitHub push webhook payload and inserts a `commit` activity entry. Called from `/api/webhooks/github`.

```ts
input: {
  ref: string           // e.g. 'refs/heads/main'
  repository: { name: string; full_name: string }
  commits: Array<{
    id: string
    message: string
    author: { name: string }
  }>
}

output: { id: string } | { error: string }
// Inserts the first/latest commit as a single entry with:
// title = commit message (first line only)
// metadata = { repo, branch, sha, message }
```

---

## 8. `chatsService`

**File:** `lib/services/chats.ts`
**Used by:** `/api/llm`, `/api/admin/chats`, admin chats page and conversation detail

---

### `getAllConversations()`

Returns all conversations ordered by `last_message_at DESC`. Used by admin chats list page.

```ts
input: none

output: Array<{
  id: string
  session_id: string
  ip_hash: string | null
  started_at: string
  last_message_at: string
  message_count: number
}>
```

---

### `getConversationById(id)`

Returns a single conversation record. Used by admin conversation detail page.

```ts
input: { id: string }

output: {
  id: string
  session_id: string
  ip_hash: string | null
  started_at: string
  last_message_at: string
  message_count: number
} | null
```

---

### `getMessagesByConversationId(conversationId)`

Returns all messages for a conversation ordered by `created_at ASC`. Used by admin thread view.

```ts
input: { conversationId: string }

output: Array<{
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}>
```

---

### `getOrCreateConversation(sessionId, ipHash?)`

Finds an existing conversation by `session_id` or creates a new one. Called at the start of every LLM API request.

```ts
input: {
  sessionId: string       // from client sessionStorage
  ipHash?: string | null
}

output: {
  id: string
  session_id: string
  message_count: number
  is_new: boolean
}
```

---

### `appendMessage(conversationId, role, content)`

Inserts a message and increments `message_count` on the parent conversation. Called after each user message and after each assistant response.

```ts
input: {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
}

output: { id: string } | { error: string }
```

---

### `getConversationHistory(conversationId)`

Returns messages for a conversation formatted as OpenAI message objects. Called by `/api/llm` to build the messages array.

```ts
input: { conversationId: string }

output: Array<{
  role: 'user' | 'assistant'
  content: string
}>
```

---

## 9. `systemContextService`

**File:** `lib/services/system-context.ts`
**Used by:** `/api/llm`, `/api/admin/system-context`, admin system context page

---

### `getAllContextEntries()`

Returns all `system_convos` rows ordered by `position ASC`. Used by admin system context list.

```ts
input: none

output: Array<{
  id: string
  label: string
  content: string
  category: 'professional' | 'personal' | 'opinions' | 'instructions' | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}>
```

---

### `getContextEntryById(id)`

Returns a single row. Used by admin edit form.

```ts
input: { id: string }
output: // same shape as single item | null
```

---

### `getActiveContextEntries()`

Returns only `is_active = true` rows ordered by `position ASC`. Used by `getAssembledSystemPrompt()` and as a preview of what the LLM currently sees.

```ts
input: none

output: Array<{
  id: string
  label: string
  content: string
  category: string | null
  position: number
}>
```

---

### `getAssembledSystemPrompt()`

Fetches all active rows and concatenates their `content` fields into a single string. This is the actual system prompt sent to OpenAI on every LLM request. Called by `/api/llm` and by the "preview assembled prompt" feature in the admin.

```ts
input: none

output: {
  prompt: string       // all active content rows joined with '\n\n'
  entry_count: number  // how many rows contributed
}
```

---

### `createContextEntry(data)`

Inserts a new system context row.

```ts
input: {
  label: string
  content: string
  category?: 'professional' | 'personal' | 'opinions' | 'instructions' | null
  position?: number
  is_active?: boolean   // default true
}

output: { id: string } | { error: string }
```

---

### `updateContextEntry(id, data)`

Updates a system context row.

```ts
input: {
  id: string
  data: Partial<{
    label: string
    content: string
    category: 'professional' | 'personal' | 'opinions' | 'instructions' | null
    position: number
    is_active: boolean
  }>
}

output: { error: null } | { error: string }
```

---

### `deleteContextEntry(id)`

Deletes a system context row.

```ts
input: { id: string }
output: { error: null } | { error: string }
```

---

### `toggleActive(id, isActive)`

Convenience wrapper — sets `is_active` on a single row. Used by the toggle button in the admin list.

```ts
input: {
  id: string
  isActive: boolean
}

output: { error: null } | { error: string }
```

---

### `reorderContextEntries(items)`

Bulk updates `position` for context entries.

```ts
input: Array<{ id: string; position: number }>
output: { error: null } | { error: string }
```

---

## 10. `storageService`

**File:** `lib/services/storage.ts`
**Used by:** admin image upload component — called from client components during form submission

---

### `uploadProjectCover(file)`

Uploads a file to the `project-covers` bucket and returns the public URL.

```ts
input: {
  file: File
  fileName?: string   // defaults to uuid + file extension
}

output: {
  url: string         // public CDN URL
} | { error: string }
```

---

### `uploadExperimentCover(file)`

Uploads to `experiment-covers` bucket.

```ts
input: { file: File; fileName?: string }
output: { url: string } | { error: string }
```

---

### `uploadCompanyLogo(file)`

Uploads to `company-logos` bucket.

```ts
input: { file: File; fileName?: string }
output: { url: string } | { error: string }
```

---

### `uploadAwardImage(file)`

Uploads to `award-images` bucket.

```ts
input: { file: File; fileName?: string }
output: { url: string } | { error: string }
```

---

### `deleteFile(bucket, path)`

Removes a file from storage. Called when replacing an image or deleting a record that had an image.

```ts
input: {
  bucket: 'project-covers' | 'experiment-covers' | 'company-logos' | 'award-images'
  path: string    // file path within the bucket
}

output: { error: null } | { error: string }
```

---

## 11. `hashnodeService`

**File:** `lib/services/hashnode.ts`
**Used by:** public blog list page, blog post detail page (`generateStaticParams` + render)

---

### `getPosts(options?)`

Fetches post list from Hashnode GraphQL API. Used by blog list page (ISR, revalidate: 1800).

```ts
input: {
  first?: number       // default 20
  after?: string       // cursor for pagination
}

output: {
  posts: Array<{
    id: string
    title: string
    slug: string
    brief: string
    cover_image_url: string | null
    published_at: string     // ISO timestamp
    read_time_minutes: number
    tags: Array<{ name: string; slug: string }>
  }>
  page_info: {
    has_next_page: boolean
    end_cursor: string | null
  }
}
```

---

### `getPostBySlug(slug)`

Fetches a single full post from Hashnode. Used by blog post detail page.

```ts
input: { slug: string }

output: {
  id: string
  title: string
  slug: string
  brief: string
  published_at: string
  read_time_minutes: number
  cover_image_url: string | null
  content_html: string      // raw HTML from Hashnode — sanitize before rendering
  tags: Array<{ name: string; slug: string }>
} | null
```

---

### `getAllPostSlugs()`

Fetches all post slugs for `generateStaticParams`. Paginates through all posts automatically.

```ts
input: none

output: Array<{ slug: string }>
```

---

## 12. `llmService`

**File:** `lib/services/llm.ts`
**Used by:** `/api/llm`

---

### `streamChatResponse(messages, systemPrompt)`

Calls OpenAI with the assembled system prompt and the conversation history. Returns a `ReadableStream` suitable for streaming back to the client via `StreamingTextResponse` or `Response`.

```ts
input: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  systemPrompt: string
  model?: string    // default 'gpt-4o-mini'
}

output: ReadableStream<Uint8Array>
```

---

### `buildSystemPrompt()`

Convenience wrapper — calls `systemContextService.getAssembledSystemPrompt()` and returns the prompt string ready to pass to `streamChatResponse`.

```ts
input: none

output: {
  prompt: string
  entry_count: number
}
```

---

## 13. `statsService`

**File:** `lib/services/stats.ts`
**Used by:** `/api/stats` (public), landing page stats bar

This is a thin public-facing aggregator. It wraps the relevant analytics methods and returns only what the public stats bar needs — no raw table data.

---

### `getPublicStats()`

Returns the three headline numbers shown on the landing page stats bar. ISR-cached at the API route level (revalidate: 60s).

```ts
input: none

output: {
  total_visits: number            // COUNT(*) FROM page_views
  total_blog_reads: number        // COUNT(*) FROM blog_reads
  total_project_interactions: number   // COUNT(*) FROM project_interactions
}
```

---

## Summary Table

| Service | Methods | Primary consumers |
|---|---|---|
| `analyticsService` | logPageView, logProjectInteraction, logBlogRead, getTotalVisits, getRecentPageViews, getPageViewsOverTime, getTopPages, getReferrerBreakdown, getProjectInteractionStats, getTotalProjectInteractions, getBlogReadsByPost, getTotalBlogReads, getDashboardStats | analytics API, dashboard, analytics page, public hooks |
| `projectsService` | getAllProjects, getProjectBySlug, getProjectById, getFeaturedProjects, createProject, updateProject, deleteProject, reorderProjects | admin projects API, public projects page, landing |
| `experienceService` | getAllExperience, getExperienceById, createExperience, updateExperience, deleteExperience, reorderExperience | admin experience API, public experience page |
| `experimentsService` | getAllExperiments, getExperimentBySlug, getExperimentById, createExperiment, updateExperiment, deleteExperiment | admin experiments API, public experiments page |
| `awardsService` | getAllAwards, getAwardById, createAward, updateAward, deleteAward, reorderAwards | admin awards API, public awards page |
| `boardService` | getBoardItems, getBoardItemById, createBoardItem, updateBoardItem, deleteBoardItem, reorderBoardItems, createSubItem, updateSubItem, deleteSubItem | admin board API, public board API |
| `activityService` | getActivityFeed, getRecentActivity, getLiveworks, createActivityEntry, deleteActivityEntry, logGithubCommit | activity API, webhook, liveworks widget, dashboard |
| `chatsService` | getAllConversations, getConversationById, getMessagesByConversationId, getOrCreateConversation, appendMessage, getConversationHistory | LLM API, admin chats API |
| `systemContextService` | getAllContextEntries, getContextEntryById, getActiveContextEntries, getAssembledSystemPrompt, createContextEntry, updateContextEntry, deleteContextEntry, toggleActive, reorderContextEntries | LLM API, admin system context API |
| `storageService` | uploadProjectCover, uploadExperimentCover, uploadCompanyLogo, uploadAwardImage, deleteFile | admin image upload component |
| `hashnodeService` | getPosts, getPostBySlug, getAllPostSlugs | public blog pages |
| `llmService` | streamChatResponse, buildSystemPrompt | LLM API route |
| `statsService` | getPublicStats | /api/stats, landing stats bar |
