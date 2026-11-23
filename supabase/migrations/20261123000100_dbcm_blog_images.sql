begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dbcm-blog-images',
  'dbcm-blog-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);

create policy "DBCM editors upload blog images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'dbcm-blog-images'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp|gif|avif)$'
    and (select public.dbcm_is_editor())
  );

create function public.dbcm_article_photos_are_valid(articles jsonb)
returns boolean language plpgsql immutable set search_path = ''
as $$
declare
  valid_path constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp|gif|avif)$';
  article jsonb;
  photos jsonb;
  photo jsonb;
  object_path text;
  paths text[];
begin
  if jsonb_typeof(articles) <> 'array' then return false; end if;
  for article in select jsonb_array_elements(articles) loop
    if article ? 'coverPhoto' and (
      jsonb_typeof(article -> 'coverPhoto') is distinct from 'string'
      or article ->> 'coverPhoto' !~ valid_path
    ) then return false; end if;
    if not article ? 'photos' then continue; end if;
    photos := article -> 'photos';
    if jsonb_typeof(photos) <> 'array' then return false; end if;
    if jsonb_array_length(photos) > 12 then return false; end if;
    paths := array[]::text[];

    for photo in select jsonb_array_elements(photos) loop
      if jsonb_typeof(photo) <> 'object'
         or jsonb_typeof(photo -> 'path') is distinct from 'string'
         or jsonb_typeof(photo -> 'name') is distinct from 'string' then
        return false;
      end if;
      object_path := photo ->> 'path';
      if length(object_path) > 48
         or object_path !~ valid_path
         or object_path = any(paths)
         or length(photo ->> 'name') + length(regexp_replace(photo ->> 'name', '[^\U00010000-\U0010ffff]', '', 'g')) > 160
         or photo ->> 'name' !~ '[^[:space:]]'
         or photo - 'path' - 'name' <> '{}'::jsonb then
        return false;
      end if;
      paths := array_append(paths, object_path);
    end loop;
  end loop;
  return true;
end;
$$;
revoke all on function public.dbcm_article_photos_are_valid(jsonb) from public, anon, authenticated;

alter table public.dbcm_content
  add constraint dbcm_content_article_photos_check
  check (section <> 'articles' or public.dbcm_article_photos_are_valid(data));

commit;
