begin;

create table public.dbcm_retired_blog_images (
  path text primary key
);
alter table public.dbcm_retired_blog_images enable row level security;
revoke all on public.dbcm_retired_blog_images from public, anon, authenticated;

-- Match upload filenames in photo fields, Markdown and copied URLs across all sections.
create function public.dbcm_blog_image_paths(content jsonb)
returns table (path text)
language sql immutable set search_path = ''
as $$
  select distinct parts[1]
  from regexp_matches(
    content::text,
    '(?:^|[^[:alnum:]_-])([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](?:jpg|png|webp|gif|avif))(?=$|[^[:alnum:]_.~%/-])',
    'g'
  ) as matches(parts);
$$;
revoke all on function public.dbcm_blog_image_paths(jsonb) from public, anon, authenticated;

create or replace function public.dbcm_publish_section(section_name text, expected_revision integer, new_data jsonb)
returns integer language plpgsql security definer set search_path = ''
as $$
declare
  published_revision integer;
  previous_data jsonb;
  removed_paths text[];
begin
  if not public.dbcm_is_editor() then
    raise exception 'DBCM editor access required' using errcode = '42501';
  end if;
  if expected_revision is null or expected_revision < 0 or expected_revision >= 2147483647
     or not public.dbcm_content_is_valid(section_name, new_data) then
    raise exception 'Invalid DBCM content or revision' using errcode = '22023';
  end if;

  -- Serialize publishes so a path cannot be reused while another section retires it.
  perform pg_advisory_xact_lock(hashtextextended('dbcm.content.publish', 0));
  select data into previous_data from public.dbcm_content where section = section_name;

  if expected_revision = 0 then
    insert into public.dbcm_content (section, revision, data, updated_by)
    values (section_name, 1, new_data, auth.uid())
    on conflict (section) do nothing
    returning revision into published_revision;
  else
    update public.dbcm_content
    set revision = expected_revision + 1, data = new_data, updated_at = now(), updated_by = auth.uid()
    where section = section_name and revision = expected_revision
    returning revision into published_revision;
  end if;

  if published_revision is null then return null; end if;

  if exists (
    select 1 from public.dbcm_retired_blog_images
    join public.dbcm_blog_image_paths(new_data) using (path)
  ) then
    raise exception 'A removed photo must be uploaded again before publishing' using errcode = 'PT422';
  end if;

  removed_paths := array(
    select path from public.dbcm_blog_image_paths(previous_data)
    except
    select path from public.dbcm_blog_image_paths(new_data)
  );
  if cardinality(removed_paths) > 0 then
    insert into public.dbcm_retired_blog_images (path)
    select object.name from storage.objects as object
    where object.bucket_id = 'dbcm-blog-images' and object.name = any(removed_paths)
      and not exists (
        select 1 from public.dbcm_content as published
        cross join lateral public.dbcm_blog_image_paths(published.data) as used
        where used.path = object.name
      )
    on conflict (path) do nothing;
  end if;

  return published_revision;
end;
$$;

-- Keep retired paths reserved so in-flight Storage deletes cannot race with a new publish.
create function public.dbcm_pending_blog_image_deletions()
returns text[] language sql stable security definer set search_path = ''
as $$
  select array(
    select retired.path
    from public.dbcm_retired_blog_images as retired
    join storage.objects as object on object.name = retired.path and object.bucket_id = 'dbcm-blog-images'
    where (select public.dbcm_is_editor())
    order by retired.path
    limit 1000
  );
$$;
revoke all on function public.dbcm_pending_blog_image_deletions() from public, anon, authenticated;
grant execute on function public.dbcm_pending_blog_image_deletions() to authenticated;

create function public.dbcm_can_delete_blog_image(object_path text)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select public.dbcm_is_editor())
    and exists (select 1 from public.dbcm_retired_blog_images where path = object_path);
$$;
revoke all on function public.dbcm_can_delete_blog_image(text) from public, anon, authenticated;
grant execute on function public.dbcm_can_delete_blog_image(text) to authenticated;

create policy "DBCM editors read retired blog images" on storage.objects
  for select to authenticated
  using (bucket_id = 'dbcm-blog-images' and public.dbcm_can_delete_blog_image(name));

create policy "DBCM editors delete retired blog images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dbcm-blog-images' and public.dbcm_can_delete_blog_image(name));

notify pgrst, 'reload schema';
commit;
