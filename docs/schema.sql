-- ============================================================
-- STEP 1: Extensions + Enums
-- Run this first before anything else.
-- ============================================================

create extension if not exists "pgcrypto";

create type project_status    as enum ('active', 'archived', 'wip');
create type experiment_status as enum ('live', 'wip', 'archived', 'idea');
create type board_status      as enum ('backlog', 'in_progress', 'done', 'on_hold');
create type board_category    as enum ('goal', 'project', 'learning', 'idea', 'other');
create type board_priority    as enum ('low', 'medium', 'high');
create type activity_type     as enum ('commit', 'blog_post', 'project_update', 'experiment', 'note');
create type message_role      as enum ('user', 'assistant');
create type context_category  as enum ('professional', 'personal', 'opinions', 'instructions');
create type interaction_type  as enum ('view', 'link_click', 'github_click', 'live_click');


-- ============================================================
-- STEP 2: Tables + Indexes
-- Run after step 1.
-- ============================================================

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


create table experience (
  id           uuid primary key default gen_random_uuid(),
  company      text not null,
  role         text not null,
  description  text not null default '',
  achievements text not null default '',
  start_date   date not null,
  end_date     date,
  location     text,
  company_url  text,
  logo_url     text,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_experience_position on experience (position);


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


create table project_interactions (
  id               uuid primary key default gen_random_uuid(),
  project_slug     text not null,
  interaction_type interaction_type not null,
  interacted_at    timestamptz not null default now()
);

create index idx_project_interactions_slug          on project_interactions (project_slug);
create index idx_project_interactions_interacted_at on project_interactions (interacted_at desc);


create table blog_reads (
  id         uuid primary key default gen_random_uuid(),
  post_slug  text not null,
  post_title text not null,
  read_at    timestamptz not null default now()
);

create index idx_blog_reads_post_slug on blog_reads (post_slug);
create index idx_blog_reads_read_at   on blog_reads (read_at desc);


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


create table llm_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references llm_conversations (id) on delete cascade,
  role            message_role not null,
  content         text not null,
  created_at      timestamptz not null default now()
);

create index idx_llm_messages_conversation_id on llm_messages (conversation_id);
create index idx_llm_messages_created_at      on llm_messages (created_at asc);


-- ============================================================
-- STEP 3: RPC Function
-- Run after step 2.
-- ============================================================

create or replace function increment_message_count(convo_id uuid)
returns integer
language sql
security definer
as $$
  update llm_conversations
  set message_count = message_count + 1
  where id = convo_id
  returning message_count;
$$;


-- ============================================================
-- STEP 4: Storage Buckets
-- Run after step 2.
-- ============================================================

insert into storage.buckets (id, name, public) values ('project-covers',    'project-covers',    true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('experiment-covers', 'experiment-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('company-logos',     'company-logos',     true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('award-images',      'award-images',      true) on conflict (id) do nothing;


-- ============================================================
-- STEP 5: Enable RLS
-- Run after step 2.
-- ============================================================

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


-- ============================================================
-- STEP 6: RLS Policies
-- Run after step 5.
-- ============================================================

create policy "public read projects"    on projects    for select using (true);
create policy "public read experience"  on experience  for select using (true);
create policy "public read experiments" on experiments for select using (true);
create policy "public read awards"      on awards      for select using (true);

create policy "public read board_items"     on board_items     for select using (is_private = false);
create policy "public read board_sub_items" on board_sub_items for select using (is_private = false);

create policy "public read activity_feed"  on activity_feed  for select using (true);
create policy "public read system_convos"  on system_convos  for select using (true);

create policy "public insert llm_conversations" on llm_conversations for insert with check (true);
create policy "public read llm_conversations"   on llm_conversations for select using (true);
create policy "public update llm_conversations" on llm_conversations for update using (true);
create policy "public insert llm_messages"      on llm_messages      for insert with check (true);
create policy "public read llm_messages"        on llm_messages      for select using (true);

create policy "public insert page_views"           on page_views           for insert with check (true);
create policy "public insert project_interactions" on project_interactions for insert with check (true);
create policy "public insert blog_reads"           on blog_reads           for insert with check (true);

create policy "auth read page_views"           on page_views           for select using (auth.role() = 'authenticated');
create policy "auth read project_interactions" on project_interactions for select using (auth.role() = 'authenticated');
create policy "auth read blog_reads"           on blog_reads           for select using (auth.role() = 'authenticated');

create policy "auth insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "auth update projects" on projects for update using (auth.role() = 'authenticated');
create policy "auth delete projects" on projects for delete using (auth.role() = 'authenticated');

create policy "auth insert experience" on experience for insert with check (auth.role() = 'authenticated');
create policy "auth update experience" on experience for update using (auth.role() = 'authenticated');
create policy "auth delete experience" on experience for delete using (auth.role() = 'authenticated');

create policy "auth insert experiments" on experiments for insert with check (auth.role() = 'authenticated');
create policy "auth update experiments" on experiments for update using (auth.role() = 'authenticated');
create policy "auth delete experiments" on experiments for delete using (auth.role() = 'authenticated');

create policy "auth insert awards" on awards for insert with check (auth.role() = 'authenticated');
create policy "auth update awards" on awards for update using (auth.role() = 'authenticated');
create policy "auth delete awards" on awards for delete using (auth.role() = 'authenticated');

create policy "auth all board_items"     on board_items     for all using (auth.role() = 'authenticated');
create policy "auth all board_sub_items" on board_sub_items for all using (auth.role() = 'authenticated');

create policy "auth insert activity_feed" on activity_feed for insert with check (auth.role() = 'authenticated');
create policy "auth delete activity_feed" on activity_feed for delete using (auth.role() = 'authenticated');

create policy "auth insert system_convos" on system_convos for insert with check (auth.role() = 'authenticated');
create policy "auth update system_convos" on system_convos for update using (auth.role() = 'authenticated');
create policy "auth delete system_convos" on system_convos for delete using (auth.role() = 'authenticated');


-- ============================================================
-- STEP 7: Storage Bucket Policies
-- Run after step 4.
-- Policies are RLS rules on storage.objects, not a separate table.
-- ============================================================

create policy "project-covers public read"
  on storage.objects for select
  using (bucket_id = 'project-covers');

create policy "project-covers auth insert"
  on storage.objects for insert
  with check (bucket_id = 'project-covers' and auth.role() = 'authenticated');

create policy "project-covers auth delete"
  on storage.objects for delete
  using (bucket_id = 'project-covers' and auth.role() = 'authenticated');


create policy "experiment-covers public read"
  on storage.objects for select
  using (bucket_id = 'experiment-covers');

create policy "experiment-covers auth insert"
  on storage.objects for insert
  with check (bucket_id = 'experiment-covers' and auth.role() = 'authenticated');

create policy "experiment-covers auth delete"
  on storage.objects for delete
  using (bucket_id = 'experiment-covers' and auth.role() = 'authenticated');


create policy "company-logos public read"
  on storage.objects for select
  using (bucket_id = 'company-logos');

create policy "company-logos auth insert"
  on storage.objects for insert
  with check (bucket_id = 'company-logos' and auth.role() = 'authenticated');

create policy "company-logos auth delete"
  on storage.objects for delete
  using (bucket_id = 'company-logos' and auth.role() = 'authenticated');


create policy "award-images public read"
  on storage.objects for select
  using (bucket_id = 'award-images');

create policy "award-images auth insert"
  on storage.objects for insert
  with check (bucket_id = 'award-images' and auth.role() = 'authenticated');

create policy "award-images auth delete"
  on storage.objects for delete
  using (bucket_id = 'award-images' and auth.role() = 'authenticated');
