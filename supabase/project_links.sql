alter table if exists public.projects
  add column if not exists link text;

notify pgrst, 'reload schema';
