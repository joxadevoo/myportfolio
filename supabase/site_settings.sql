create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admin users can read their own row" on public.admin_users;
create policy "Admin users can read their own row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  using (true);

drop policy if exists "Authenticated users can manage site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings
  for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into public.site_settings (key, value)
values (
  'home_profile',
  '{
    "stats": {
      "learningStartDate": "2024-11-27"
    },
    "about": {
      "location": "Uzbekistan",
      "status": "Open to Work",
      "focus": "Cybersecurity",
      "languages": "UZ / EN / TR",
      "competencies": [
        "Network Security & Monitoring",
        "Linux System Administration",
        "Python Scripting & Automation",
        "SQL & Database Management",
        "SIEM Tools (Splunk, ELK)",
        "Penetration Testing Basics",
        "Web Development (React, Supabase)",
        "Goal: SOC Analyst -> Security Engineer"
      ]
    }
  }'::jsonb
)
on conflict (key) do nothing;
