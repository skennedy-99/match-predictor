create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists public.fixtures (
  id text primary key,
  date timestamptz not null,
  status text not null,
  home_team text not null,
  away_team text not null,
  home_goals int,
  away_goals int,
  is_manchester_united_home boolean not null default false
);

create table if not exists public.predictions (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  fixture_id text not null references public.fixtures(id) on delete cascade,
  pred_home_goals int not null,
  pred_away_goals int not null,
  created_at timestamptz not null default now(),
  unique(user_id, fixture_id)
);

-- RLS
alter table public.predictions enable row level security;
drop policy if exists predictions_select_own on public.predictions;
drop policy if exists predictions_insert_own on public.predictions;
drop policy if exists predictions_update_own on public.predictions;

create policy predictions_select_own on public.predictions
  for select using (auth.uid() = user_id);
create policy predictions_insert_own on public.predictions
  for insert with check (auth.uid() = user_id);
create policy predictions_update_own on public.predictions
  for update using (auth.uid() = user_id);

-- Note: We are using service role key on serverless API, so policies are permissive.


