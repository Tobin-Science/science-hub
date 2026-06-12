-- ============================================================
-- Tobin Science Hub — backend foundation
-- Teacher accounts, free trials, and per-subject subscriptions.
-- Safe to run once on a fresh Supabase project.
-- ============================================================

-- 1) PROFILES: one row per teacher login -------------------------------------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text,
  is_district        boolean not null default false,  -- Cherokee County = free forever
  trial_started      timestamptz,
  trial_ends         timestamptz,
  stripe_customer_id text,
  created_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A teacher can only READ their own profile. All writes (trial dates, district
-- flag, stripe customer id) happen server-side via the service role, so nobody
-- can grant themselves a trial or the district-free flag from the browser.
drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;  -- remove old editable policy if present
create policy "own profile read" on public.profiles for select using (auth.uid() = id);

-- 2) SUBSCRIPTIONS: one row per paid subject (or the bundle) ------------------
-- Written only by the server (Stripe webhook). Teachers may read their own.
create table if not exists public.subscriptions (
  id                 text primary key,            -- Stripe subscription id
  owner              uuid not null references auth.users(id) on delete cascade,
  subject            text not null,               -- 'physical' | 'earth' | 'life' | 'bundle'
  status             text not null,               -- 'active','trialing','canceled', ...
  current_period_end timestamptz,
  created_at         timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "own subs read" on public.subscriptions;
create policy "own subs read" on public.subscriptions for select using (auth.uid() = owner);

create index if not exists subscriptions_owner_idx on public.subscriptions(owner);

-- 3) AUTO-GREETER: make a profile when a teacher signs up --------------------
-- Also auto-flags district accounts by their email domain.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_district)
  values (
    new.id,
    new.email,
    coalesce(new.email, '') ilike '%@cherokeek12.net'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
