-- 001_core_schema.sql
-- Core tables for AgentFlow

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- WORKSPACES
-- ============================================================
create table public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  plan        text not null default 'free' check (plan in ('free', 'pro', 'team', 'enterprise')),
  stripe_customer_id    text,
  stripe_subscription_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- WORKSPACE MEMBERS  (join table: user <-> workspace)
-- ============================================================
create table public.workspace_members (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at    timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- ============================================================
-- CANVASES
-- ============================================================
create table public.canvases (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  name          text not null default 'Untitled Canvas',
  description   text,
  state         jsonb not null default '{}'::jsonb,
  is_template   boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- CANVAS VERSIONS  (immutable snapshots for undo / history)
-- ============================================================
create table public.canvas_versions (
  id          uuid primary key default uuid_generate_v4(),
  canvas_id   uuid not null references public.canvases(id) on delete cascade,
  version     integer not null,
  state       jsonb not null,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (canvas_id, version)
);

-- ============================================================
-- AGENT TEMPLATES  (pre-built agent configs users can drag in)
-- ============================================================
create table public.agent_templates (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  category    text not null default 'general',
  config      jsonb not null default '{}'::jsonb,
  is_public   boolean not null default true,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_workspace_members_user    on public.workspace_members(user_id);
create index idx_workspace_members_ws      on public.workspace_members(workspace_id);
create index idx_canvases_workspace        on public.canvases(workspace_id);
create index idx_canvas_versions_canvas    on public.canvas_versions(canvas_id);
create index idx_agent_templates_public    on public.agent_templates(is_public) where is_public = true;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.handle_updated_at();

create trigger set_canvases_updated_at
  before update on public.canvases
  for each row execute function public.handle_updated_at();

create trigger set_agent_templates_updated_at
  before update on public.agent_templates
  for each row execute function public.handle_updated_at();
