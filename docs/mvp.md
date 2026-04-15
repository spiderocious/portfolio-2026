# MVP Features

All features are in scope for MVP.

## Pages (Public)

- **Landing** — hero/intro section
- **About** — background, skills, who I am
- **Projects** — showcase of work (DB-driven)
- **Experience** — work history/timeline (DB-driven)
- **Blog** — posts pulled from Hashnode via API
- **Experiments** — side projects, tinkering, misc builds (DB-driven)
- **Awards** — recognition, honours, achievements (DB-driven)

## Features (Public)

- **Board/Vision/Workspace** — Jira-style board showing current goals, active work, and vision. Tickets support one level of sub-tickets.
- **LLM Popup** — floating widget for visitors to ask questions about my work, projects, and experience (OpenAI). All conversations are stored.
- **Live Activity Feed** — real-time feed of activity (commits, posts, updates)
- **Liveworks Widget** — live widget showing what I'm currently working on
- **Stats** — visit count, views, blog reads, project interactions

## Admin Panel (Private)

A password-protected dashboard at `/admin` for managing all content and viewing data.

- **Dashboard** — overview of analytics, recent activity, stats at a glance
- **Projects management** — add, edit, delete projects. Each project has: title, description (markdown), stack tags, links (deployed, GitHub, others), live data (custom key/value stats like "500k users", "2M transactions")
- **Experience management** — add, edit, delete experience entries with description (markdown) and achievements (markdown list)
- **Experiments management** — add, edit, delete experiments with markdown descriptions
- **Awards management** — add, edit, delete awards/recognition entries
- **Board management** — add, edit, delete board items and sub-tickets (one level deep)
- **Analytics views** — page views breakdown, project interaction breakdown, blog read stats
- **LLM chat history** — view all stored visitor conversations

## Stack

- **Frontend:** Next.js + Tailwind CSS + Framer Motion
- **Backend:** Next.js API routes
- **Hosting:** Netlify
- **Blog:** Hashnode API
- **LLM:** OpenAI API
- **Database:** Supabase (all persistent data — content, analytics, activity, chats)
- **Admin auth:** NextAuth or Supabase Auth (single user — me)
- **Markdown rendering:** react-markdown + remark-gfm
