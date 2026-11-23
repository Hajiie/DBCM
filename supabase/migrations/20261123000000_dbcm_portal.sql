begin;

create table public.dbcm_editors (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.dbcm_editors enable row level security;
revoke all on public.dbcm_editors from public, anon, authenticated;

create table public.dbcm_content (
  section text primary key check (section in ('articles', 'members', 'about')),
  revision integer not null check (revision > 0),
  data jsonb not null check (pg_catalog.octet_length(data::text) <= 1048576),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.dbcm_content enable row level security;
revoke all on public.dbcm_content from public, anon, authenticated;
grant select (section, revision, data) on public.dbcm_content to anon, authenticated;
create policy "Public DBCM content" on public.dbcm_content
  for select to anon, authenticated using (true);

create function public.dbcm_is_editor() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.dbcm_editors e
    join auth.sessions s on s.user_id = e.user_id
    where e.user_id = (select auth.uid())
      and s.id::text = (select auth.jwt() ->> 'session_id')
      and (s.not_after is null or s.not_after > now())
  );
$$;
revoke all on function public.dbcm_is_editor() from public, anon, authenticated;
grant execute on function public.dbcm_is_editor() to authenticated;

-- Validate the JSON at the database boundary as RPC callers can use the Data API directly.
create function public.dbcm_content_is_valid(section_name text, new_data jsonb)
returns boolean language plpgsql immutable set search_path = ''
as $$
declare
  rules jsonb;
  entries jsonb;
  max_entries integer;
  entry jsonb;
  field record;
  value text;
  image text;
  key text;
  keys text[] := array[]::text[];
begin
  if new_data is null or octet_length(new_data::text) > 1048576 then return false; end if;

  case section_name
    when 'articles' then
      rules := '{"route":5,"slug":80,"date":10,"title":240,"summary":600,"body":40000,"author":120,"category":10,"tags":-240,"image":-500}';
      max_entries := 250;
    when 'members' then
      rules := '{"id":80,"group":11,"name":160,"tenure":-120,"image":-500,"bio":-4000}';
      max_entries := 120;
    when 'about' then
      rules := '{"title":160,"subtitle":-300,"body":40000}';
      max_entries := 1;
    else return false;
  end case;

  entries := case when section_name = 'about' then jsonb_build_array(new_data) else new_data end;
  if jsonb_typeof(entries) <> 'array' then return false; end if;
  if jsonb_array_length(entries) > max_entries then return false; end if;

  for entry in select jsonb_array_elements(entries) loop
    if jsonb_typeof(entry) <> 'object' then return false; end if;

    for field in select j.key as name, j.value::integer as max_chars from jsonb_each_text(rules) as j loop
      if jsonb_typeof(entry -> field.name) is distinct from 'string' then return false; end if;
      value := entry ->> field.name;
      if char_length(value) + char_length(regexp_replace(value, '[^\U00010000-\U0010ffff]', '', 'g')) > abs(field.max_chars)
         or (field.max_chars > 0 and value !~ '[^[:space:]]') then
        return false;
      end if;
    end loop;

    if section_name in ('articles', 'members') then
      image := entry ->> 'image';
      if image <> '' and (
        image ~ '[[:cntrl:]]' or position(chr(92) in image) > 0
        or (image !~ '^/images/[^/]' and image !~* '^https://([[:alnum:]_.-]+|\[[a-f0-9:]+\])(:[0-9]{1,5})?([/?#].*)?$')
      ) then return false; end if;
    end if;

    if section_name = 'articles' then
      if entry ->> 'route' not in ('blog', 'paper')
         or entry ->> 'category' not in ('News', 'Paper', 'Research', 'Events')
         or jsonb_typeof(entry -> 'featured') is distinct from 'boolean'
         or entry ->> 'slug' !~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$'
         or lower(entry ->> 'slug') in ('index', 'your-first-article')
         or entry ->> 'date' !~ '^\d{4}-\d{2}-\d{2}$'
         or to_char((entry ->> 'date')::date, 'YYYY-MM-DD') <> entry ->> 'date' then
        return false;
      end if;
      key := (entry ->> 'route') || '/' || lower(entry ->> 'slug');
    elsif section_name = 'members' then
      if entry ->> 'group' not in ('Professor', 'Researchers', 'Alumni')
         or entry ->> 'id' !~ '^[a-zA-Z0-9_-]+$' then
        return false;
      end if;
      key := entry ->> 'id';
    else
      continue;
    end if;

    if key = any(keys) then return false; end if;
    keys := array_append(keys, key);
  end loop;

  return true;
exception when datetime_field_overflow or invalid_datetime_format then
  return false;
end;
$$;
revoke all on function public.dbcm_content_is_valid(text, jsonb) from public, anon, authenticated;

create function public.dbcm_publish_section(section_name text, expected_revision integer, new_data jsonb)
returns integer language plpgsql security definer set search_path = ''
as $$
declare
  published_revision integer;
begin
  if not public.dbcm_is_editor() then
    raise exception 'DBCM editor access required' using errcode = '42501';
  end if;
  if expected_revision is null or expected_revision < 0 or expected_revision >= 2147483647
     or not public.dbcm_content_is_valid(section_name, new_data) then
    raise exception 'Invalid DBCM content or revision' using errcode = '22023';
  end if;

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

  return published_revision;
end;
$$;
revoke all on function public.dbcm_publish_section(text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.dbcm_publish_section(text, integer, jsonb) to authenticated;

notify pgrst, 'reload schema';
commit;
