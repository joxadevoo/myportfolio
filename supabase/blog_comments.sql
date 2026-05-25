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

create index if not exists blog_comments_post_id_idx on public.blog_comments (post_id);
create index if not exists blog_comments_parent_id_idx on public.blog_comments (parent_id);
create index if not exists blog_comments_created_at_idx on public.blog_comments (created_at desc);

alter table public.blog_comments enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.blog_comments to anon, authenticated;
grant delete on public.blog_comments to authenticated;

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
