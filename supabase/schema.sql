-- ===========================================================================
-- TriageAI — Supabase schema
-- Run this in the Supabase SQL editor to enable the persistent backend.
-- The app works WITHOUT this (in-memory fallback); add it to go production.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- Tickets ---------------------------------------------------------------------
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  customer_name text default 'Anonymous',
  customer_email text default '',
  channel text default 'web',                 -- web | email | chat | phone
  status text default 'new',                  -- new | in_progress | auto_resolved | escalated | resolved | closed
  priority text default 'medium',             -- low | medium | high | urgent
  category text,
  sentiment text,                             -- positive | neutral | negative | frustrated
  confidence real default 0,
  summary text,
  triage_engine text,                         -- gemini | heuristic
  ai_reply text,
  resolution text,                            -- auto | human | null
  escalated boolean default false,
  escalation_reason text,
  assignee text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists tickets_status_idx on public.tickets (status);
create index if not exists tickets_created_idx on public.tickets (created_at desc);

-- Rules (single global config row) --------------------------------------------
create table if not exists public.rules (
  id text primary key default 'global',
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.rules (id, config)
values (
  'global',
  '{
    "confidenceThreshold": 0.75,
    "escalateOnFrustrated": true,
    "urgentAlwaysEscalate": true,
    "autoResolveCategories": ["Account", "Billing", "Feature Request", "General"],
    "autoReplyEnabled": true,
    "slaHours": 24
  }'::jsonb
)
on conflict (id) do nothing;

-- Row Level Security ----------------------------------------------------------
-- For the demo we keep it open via the service-role key (server-side only).
-- Tighten these policies before exposing the anon key to real users.
alter table public.tickets enable row level security;
alter table public.rules enable row level security;

create policy "service role full access tickets"
  on public.tickets for all
  using (true) with check (true);

create policy "service role full access rules"
  on public.rules for all
  using (true) with check (true);
