-- JEE Edgerunners Supabase schema
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role_label text default 'Dropper · 2026',
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.syllabus_progress (
  user_id uuid references auth.users(id) on delete cascade,
  topic_id text not null,
  completed boolean default false,
  confidence integer default 50 check (confidence between 0 and 100),
  updated_at timestamptz default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.planner_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_date date not null,
  hours numeric(4, 2) not null default 6,
  plan_summary jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, plan_date)
);

create table if not exists public.planner_tasks (
  user_id uuid references auth.users(id) on delete cascade,
  plan_date date not null,
  block_key text not null,
  task_text text default '',
  updated_at timestamptz default now(),
  primary key (user_id, plan_date, block_key)
);

create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text not null check (subject in ('Physics', 'Chemistry', 'Mathematics')),
  topic text not null,
  reason text not null,
  logged_on date not null default current_date,
  resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  taken_on date not null,
  physics integer not null default 0 check (physics between 0 and 100),
  chemistry integer not null default 0 check (chemistry between 0 and 100),
  math integer not null default 0 check (math between 0 and 100),
  total integer generated always as (physics + chemistry + math) stored,
  created_at timestamptz default now()
);

create table if not exists public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text,
  topic text,
  duration_minutes integer not null default 25,
  completed_at timestamptz not null default now()
);

create table if not exists public.scratchpad_notes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  body text default '',
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.syllabus_progress enable row level security;
alter table public.planner_days enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.error_logs enable row level security;
alter table public.mock_tests enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.scratchpad_notes enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users own syllabus progress" on public.syllabus_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own planner days" on public.planner_days for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own planner tasks" on public.planner_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own error logs" on public.error_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own mock tests" on public.mock_tests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own pomodoro sessions" on public.pomodoro_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own scratchpad" on public.scratchpad_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists syllabus_progress_user_idx on public.syllabus_progress(user_id);
create index if not exists planner_days_user_date_idx on public.planner_days(user_id, plan_date desc);
create index if not exists error_logs_user_date_idx on public.error_logs(user_id, logged_on desc);
create index if not exists mock_tests_user_date_idx on public.mock_tests(user_id, taken_on desc);
create index if not exists pomodoro_sessions_user_completed_idx on public.pomodoro_sessions(user_id, completed_at desc);
