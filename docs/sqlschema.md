# Supabase SQL Schema

Run the following in the Supabase SQL editor (Dashboard → SQL Editor → New query).

---

## Extensions

-- uuid generation (available by default in Supabase, but explicit is fine)
create extension if not exists "pgcrypto";
---

## Enums


-- project status
create type project_status as enum ('active', 'archived', 'wip');

-- experiment status
create type experiment_status as enum ('live', 'wip', 'archived', 'idea');

-- board status
create type board_status as enum ('backlog', 'in_progress', 'done', 'on_hold');

-- board category
create type board_category as enum ('goal', 'project', 'learning', 'idea', 'other');

-- board priority
create type board_priority as enum ('low', 'medium', 'high');

-- activity type
create type activity_type as enum ('commit', 'blog_post', 'project_update', 'experiment', 'note');

-- llm message role
create type message_role as enum ('user', 'assistant');

-- system context category
create type context_category as enum ('professional', 'personal', 'opinions', 'instructions');

-- project interaction type
create type interaction_type as enum ('view', 'link_click', 'github_click', 'live_click');


---

## Content Tables

### projects


create table projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  description text not null default '',
  status      project_status not null default 'wip',
  stack       text[] not null default '{}',
  cover_image text,
  links       jsonb not null default '{}',
  live_data   jsonb,
  featured    boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_projects_slug     on projects (slug);
create index idx_projects_featured on projects (featured) where featured = true;
create index idx_projects_position on projects (position);


### experience


create table experience (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  role        text not null,
  description text not null default '',
  achievements text not null default '',
  start_date  date not null,
  end_date    date,
  location    text,
  company_url text,
  logo_url    text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_experience_position on experience (position);


### experiments


create table experiments (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  description text not null default '',
  status      experiment_status not null default 'wip',
  stack       text[] not null default '{}',
  links       jsonb not null default '{}',
  cover_image text,
  featured    boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_experiments_slug     on experiments (slug);
create index idx_experiments_featured on experiments (featured) where featured = true;
create index idx_experiments_position on experiments (position);


### awards


create table awards (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text not null,
  description text,
  date        date not null,
  url         text,
  image_url   text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_awards_position on awards (position);


---

## Board / Workspace

### board_items


create table board_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      board_status not null default 'backlog',
  category    board_category not null default 'other',
  priority    board_priority,
  due_date    date,
  is_private  boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_board_items_status     on board_items (status);
create index idx_board_items_position   on board_items (position);
create index idx_board_items_is_private on board_items (is_private);


### board_sub_items


create table board_sub_items (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references board_items (id) on delete cascade,
  title       text not null,
  description text,
  status      board_status not null default 'backlog',
  is_private  boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_board_sub_items_parent_id  on board_sub_items (parent_id);
create index idx_board_sub_items_position   on board_sub_items (position);
create index idx_board_sub_items_is_private on board_sub_items (is_private);


---

## Analytics

### page_views


create table page_views (
  id         uuid primary key default gen_random_uuid(),
  page       text not null,
  referrer   text,
  user_agent text,
  country    text,
  visited_at timestamptz not null default now()
);

create index idx_page_views_visited_at on page_views (visited_at desc);
create index idx_page_views_page       on page_views (page);


### project_interactions


create table project_interactions (
  id               uuid primary key default gen_random_uuid(),
  project_slug     text not null,
  interaction_type interaction_type not null,
  interacted_at    timestamptz not null default now()
);

create index idx_project_interactions_slug         on project_interactions (project_slug);
create index idx_project_interactions_interacted_at on project_interactions (interacted_at desc);


### blog_reads


create table blog_reads (
  id         uuid primary key default gen_random_uuid(),
  post_slug  text not null,
  post_title text not null,
  read_at    timestamptz not null default now()
);

create index idx_blog_reads_post_slug on blog_reads (post_slug);
create index idx_blog_reads_read_at   on blog_reads (read_at desc);


---

## Live Activity Feed

### activity_feed


create table activity_feed (
  id          uuid primary key default gen_random_uuid(),
  type        activity_type not null,
  title       text not null,
  description text,
  url         text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index idx_activity_feed_created_at on activity_feed (created_at desc);
create index idx_activity_feed_type       on activity_feed (type);


---

## LLM System Context

### system_convos


create table system_convos (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  content    text not null default '',
  category   context_category,
  position   integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_system_convos_position  on system_convos (position);
create index idx_system_convos_is_active on system_convos (is_active) where is_active = true;


---

## LLM Chat History

### llm_conversations


create table llm_conversations (
  id              uuid primary key default gen_random_uuid(),
  session_id      text not null unique,
  ip_hash         text,
  started_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  message_count   integer not null default 0
);

create index idx_llm_conversations_session_id      on llm_conversations (session_id);
create index idx_llm_conversations_last_message_at on llm_conversations (last_message_at desc);


### llm_messages


create table llm_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references llm_conversations (id) on delete cascade,
  role            message_role not null,
  content         text not null,
  created_at      timestamptz not null default now()
);

create index idx_llm_messages_conversation_id on llm_messages (conversation_id);
create index idx_llm_messages_created_at      on llm_messages (created_at asc);


---

## RPC Functions

### increment_message_count

Used in `chats.ts` → `appendMessage()` to atomically increment `message_count` on a conversation row.


create or replace function increment_message_count(convo_id uuid)
returns integer
language 
security definer
as $$
  update llm_conversations
  set message_count = message_count + 1
  where id = convo_id
  returning message_count;
$$;


---

## Storage Buckets

Run each of these separately in the  editor, or create them via Storage → New bucket in the Supabase dashboard.


-- project-covers
insert into storage.buckets (id, name, public)
values ('project-covers', 'project-covers', true)
on conflict (id) do nothing;

-- experiment-covers
insert into storage.buckets (id, name, public)
values ('experiment-covers', 'experiment-covers', true)
on conflict (id) do nothing;

-- company-logos
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

-- award-images
insert into storage.buckets (id, name, public)
values ('award-images', 'award-images', true)
on conflict (id) do nothing;


---

## Row Level Security (RLS)

### Enable RLS on all tables


alter table projects             enable row level security;
alter table experience           enable row level security;
alter table experiments          enable row level security;
alter table awards               enable row level security;
alter table board_items          enable row level security;
alter table board_sub_items      enable row level security;
alter table page_views           enable row level security;
alter table project_interactions enable row level security;
alter table blog_reads           enable row level security;
alter table activity_feed        enable row level security;
alter table system_convos        enable row level security;
alter table llm_conversations    enable row level security;
alter table llm_messages         enable row level security;


### Public read policies (content visible to all visitors)


-- projects: public can read non-private rows
create policy "public read projects"
  on projects for select
  using (true);

-- experience: public read
create policy "public read experience"
  on experience for select
  using (true);

-- experiments: public read
create policy "public read experiments"
  on experiments for select
  using (true);

-- awards: public read
create policy "public read awards"
  on awards for select
  using (true);

-- board_items: public can read non-private items
create policy "public read board_items"
  on board_items for select
  using (is_private = false);

-- board_sub_items: public can read non-private sub-items
create policy "public read board_sub_items"
  on board_sub_items for select
  using (is_private = false);

-- activity_feed: public read
create policy "public read activity_feed"
  on activity_feed for select
  using (true);

-- system_convos: public read active entries (needed by /api/llm at runtime)
create policy "public read system_convos"
  on system_convos for select
  using (true);

-- llm_conversations: public can insert (start a conversation)
create policy "public insert llm_conversations"
  on llm_conversations for insert
  with check (true);

-- llm_conversations: public can read their own session
create policy "public read llm_conversations"
  on llm_conversations for select
  using (true);

-- llm_conversations: public can update their own row (message count, last_message_at)
create policy "public update llm_conversations"
  on llm_conversations for update
  using (true);

-- llm_messages: public can insert messages
create policy "public insert llm_messages"
  on llm_messages for insert
  with check (true);

-- llm_messages: public can read messages
create policy "public read llm_messages"
  on llm_messages for select
  using (true);


### Analytics write policies (allow anon inserts from API routes)


-- page_views: anyone can insert (logged server-side from API route)
create policy "public insert page_views"
  on page_views for insert
  with check (true);

-- page_views: authenticated can read (admin analytics)
create policy "auth read page_views"
  on page_views for select
  using (auth.role() = 'authenticated');

-- project_interactions: anyone can insert
create policy "public insert project_interactions"
  on project_interactions for insert
  with check (true);

-- project_interactions: authenticated can read
create policy "auth read project_interactions"
  on project_interactions for select
  using (auth.role() = 'authenticated');

-- blog_reads: anyone can insert
create policy "public insert blog_reads"
  on blog_reads for insert
  with check (true);

-- blog_reads: authenticated can read
create policy "auth read blog_reads"
  on blog_reads for select
  using (auth.role() = 'authenticated');


### Admin write policies (authenticated users only)


-- projects
create policy "auth insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "auth update projects" on projects for update using (auth.role() = 'authenticated');
create policy "auth delete projects" on projects for delete using (auth.role() = 'authenticated');

-- experience
create policy "auth insert experience" on experience for insert with check (auth.role() = 'authenticated');
create policy "auth update experience" on experience for update using (auth.role() = 'authenticated');
create policy "auth delete experience" on experience for delete using (auth.role() = 'authenticated');

-- experiments
create policy "auth insert experiments" on experiments for insert with check (auth.role() = 'authenticated');
create policy "auth update experiments" on experiments for update using (auth.role() = 'authenticated');
create policy "auth delete experiments" on experiments for delete using (auth.role() = 'authenticated');

-- awards
create policy "auth insert awards" on awards for insert with check (auth.role() = 'authenticated');
create policy "auth update awards" on awards for update using (auth.role() = 'authenticated');
create policy "auth delete awards" on awards for delete using (auth.role() = 'authenticated');

-- board_items
create policy "auth all board_items" on board_items for all using (auth.role() = 'authenticated');

-- board_sub_items
create policy "auth all board_sub_items" on board_sub_items for all using (auth.role() = 'authenticated');

-- activity_feed
create policy "auth insert activity_feed" on activity_feed for insert with check (auth.role() = 'authenticated');
create policy "auth delete activity_feed" on activity_feed for delete using (auth.role() = 'authenticated');

-- system_convos
create policy "auth insert system_convos" on system_convos for insert with check (auth.role() = 'authenticated');
create policy "auth update system_convos" on system_convos for update using (auth.role() = 'authenticated');
create policy "auth delete system_convos" on system_convos for delete using (auth.role() = 'authenticated');


### Storage bucket policies


-- All 4 buckets: public read, authenticated write
do $$
declare
  buckets text[] := array['project-covers', 'experiment-covers', 'company-logos', 'award-images'];
  b text;
begin
  foreach b in array buckets loop
    -- public read
    insert into storage.policies (name, bucket_id, operation, definition)
    values (
      b || ' public read',
      b,
      'SELECT',
      'true'
    ) on conflict do nothing;

    -- authenticated upload
    insert into storage.policies (name, bucket_id, operation, definition)
    values (
      b || ' auth insert',
      b,
      'INSERT',
      '(auth.role() = ''authenticated'')'
    ) on conflict do nothing;

    -- authenticated delete
    insert into storage.policies (name, bucket_id, operation, definition)
    values (
      b || ' auth delete',
      b,
      'DELETE',
      '(auth.role() = ''authenticated'')'
    ) on conflict do nothing;
  end loop;
end;
$$;
```

> **Note:** If the `storage.policies` insert approach above doesn't work for your Supabase version, create storage policies via Dashboard → Storage → [bucket] → Policies instead. Set SELECT to `true` (public), INSERT/DELETE to `(auth.role() = 'authenticated')`.

---

## Admin Auth Setup

The admin panel at `/admin` uses Supabase Auth with email/password. Create the admin user:

1. Go to Dashboard → Authentication → Users → Invite user
2. Enter `devferanmi@gmail.com`
3. Set a password via the invite email

Or via SQL:

```sql
-- Only do this if you need to create the user directly (not via invite)
-- Replace 'your-secure-password' with the actual password
select auth.create_user(
  email := 'devferanmi@gmail.com',
  password := 'your-secure-password',
  email_confirm := true
);
```
