create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.blog_posts enable row level security;
alter table if exists public.skills enable row level security;
alter table if exists public.certifications enable row level security;
alter table if exists public.messages enable row level security;

drop policy if exists "Authenticated users can manage blog posts" on public.blog_posts;
drop policy if exists "Authenticated users can manage projects" on public.projects;
drop policy if exists "Authenticated users can manage skills" on public.skills;
drop policy if exists "Authenticated users can manage certifications" on public.certifications;

drop policy if exists "Admin users can read their own row" on public.admin_users;
create policy "Admin users can read their own row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Public can read blog posts" on public.blog_posts;
create policy "Public can read blog posts"
  on public.blog_posts
  for select
  using (true);

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects
  for select
  using (true);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
  on public.projects
  for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
  on public.skills
  for select
  using (true);

drop policy if exists "Admins can manage skills" on public.skills;
create policy "Admins can manage skills"
  on public.skills
  for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Public can read certifications" on public.certifications;
create policy "Public can read certifications"
  on public.certifications
  for select
  using (true);

drop policy if exists "Admins can manage certifications" on public.certifications;
create policy "Admins can manage certifications"
  on public.certifications
  for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Public can create messages" on public.messages;
create policy "Public can create messages"
  on public.messages
  for insert
  with check (
    char_length(trim(name)) between 2 and 80
    and char_length(trim(email)) between 3 and 160
    and char_length(trim(message)) between 10 and 2000
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages"
  on public.messages
  for select
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Replace this UUID with your Supabase Auth user id, then run it once:
-- insert into public.admin_users (user_id)
-- values ('00000000-0000-0000-0000-000000000000')
-- on conflict (user_id) do nothing;
