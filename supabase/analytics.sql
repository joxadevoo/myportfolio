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

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);

alter table public.page_views enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.page_views to anon, authenticated;
grant select on public.page_views to authenticated;
grant select on public.admin_users to authenticated;

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
