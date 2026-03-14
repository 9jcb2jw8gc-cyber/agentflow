-- 002_rls_policies.sql
-- Row Level Security for all public tables

-- ============================================================
-- Enable RLS
-- ============================================================
alter table public.workspaces       enable row level security;
alter table public.workspace_members enable row level security;
alter table public.canvases          enable row level security;
alter table public.canvas_versions   enable row level security;
alter table public.agent_templates   enable row level security;

-- ============================================================
-- Helper: check if current user is a member of a workspace
-- ============================================================
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
  );
$$ language sql security definer stable;

-- Helper: check if current user is owner/admin of a workspace
create or replace function public.is_workspace_admin(ws_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$ language sql security definer stable;

-- ============================================================
-- WORKSPACES
-- ============================================================
create policy "Users can view workspaces they belong to"
  on public.workspaces for select
  using (public.is_workspace_member(id));

create policy "Admins can update their workspaces"
  on public.workspaces for update
  using (public.is_workspace_admin(id));

-- Insert is handled by the on-user-signup Edge Function (service role)
-- so we don't need an insert policy for regular users here.

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
create policy "Members can view other members in their workspace"
  on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

create policy "Admins can insert members"
  on public.workspace_members for insert
  with check (public.is_workspace_admin(workspace_id));

create policy "Admins can update members"
  on public.workspace_members for update
  using (public.is_workspace_admin(workspace_id));

create policy "Admins can delete members"
  on public.workspace_members for delete
  using (public.is_workspace_admin(workspace_id));

-- ============================================================
-- CANVASES
-- ============================================================
create policy "Members can view canvases in their workspace"
  on public.canvases for select
  using (public.is_workspace_member(workspace_id));

create policy "Members can create canvases in their workspace"
  on public.canvases for insert
  with check (public.is_workspace_member(workspace_id));

create policy "Members can update canvases in their workspace"
  on public.canvases for update
  using (public.is_workspace_member(workspace_id));

create policy "Admins can delete canvases"
  on public.canvases for delete
  using (public.is_workspace_admin(workspace_id));

-- ============================================================
-- CANVAS VERSIONS
-- ============================================================
create policy "Members can view canvas versions"
  on public.canvas_versions for select
  using (
    exists (
      select 1 from public.canvases c
      where c.id = canvas_versions.canvas_id
        and public.is_workspace_member(c.workspace_id)
    )
  );

create policy "Members can create canvas versions"
  on public.canvas_versions for insert
  with check (
    exists (
      select 1 from public.canvases c
      where c.id = canvas_versions.canvas_id
        and public.is_workspace_member(c.workspace_id)
    )
  );

-- ============================================================
-- AGENT TEMPLATES
-- ============================================================
create policy "Anyone can view public templates"
  on public.agent_templates for select
  using (is_public = true);

create policy "Users can view their own private templates"
  on public.agent_templates for select
  using (created_by = auth.uid());

create policy "Users can create templates"
  on public.agent_templates for insert
  with check (created_by = auth.uid());

create policy "Users can update their own templates"
  on public.agent_templates for update
  using (created_by = auth.uid());

create policy "Users can delete their own templates"
  on public.agent_templates for delete
  using (created_by = auth.uid());
