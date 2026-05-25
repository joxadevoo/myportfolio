create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  page_type text not null default 'page',
  content_id text,
  visitor_id text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  parent_id uuid references public.blog_comments(id) on delete cascade,
  author_name text not null default 'Anonymous',
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.blog_comments
  add column if not exists parent_id uuid references public.blog_comments(id) on delete cascade;

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);
create index if not exists blog_comments_post_id_idx on public.blog_comments (post_id);
create index if not exists blog_comments_parent_id_idx on public.blog_comments (parent_id);
create index if not exists blog_comments_created_at_idx on public.blog_comments (created_at desc);

alter table public.admin_users enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.blog_posts enable row level security;
alter table if exists public.skills enable row level security;
alter table if exists public.certifications enable row level security;
alter table if exists public.messages enable row level security;
alter table if exists public.page_views enable row level security;
alter table if exists public.blog_comments enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.page_views to anon, authenticated;
grant select on public.page_views to authenticated;
grant select on public.admin_users to authenticated;
grant select, insert on public.blog_comments to anon, authenticated;
grant delete on public.blog_comments to authenticated;

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

drop policy if exists "Public can create page views" on public.page_views;
create policy "Public can create page views"
  on public.page_views
  for insert
  to anon, authenticated
  with check (
    char_length(path) between 1 and 240
    and char_length(visitor_id) between 12 and 120
    and page_type in ('home', 'page', 'blog_post')
  );

drop policy if exists "Admins can read page views" on public.page_views;
create policy "Admins can read page views"
  on public.page_views
  for select
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Public can read blog comments" on public.blog_comments;
create policy "Public can read blog comments"
  on public.blog_comments
  for select
  using (true);

drop policy if exists "Public can create blog comments" on public.blog_comments;
create policy "Public can create blog comments"
  on public.blog_comments
  for insert
  to public
  with check (
    char_length(trim(coalesce(post_id, ''))) between 1 and 120
    and char_length(trim(coalesce(author_name, 'Anonymous'))) between 1 and 80
    and char_length(trim(coalesce(comment, ''))) between 3 and 1200
  );

drop policy if exists "Admins can delete blog comments" on public.blog_comments;
create policy "Admins can delete blog comments"
  on public.blog_comments
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Replace this UUID with your Supabase Auth user id, then run it once:
-- insert into public.admin_users (user_id)
-- values ('00000000-0000-0000-0000-000000000000')
-- on conflict (user_id) do nothing;
