
-- ===== ENUM =====
create type public.app_role as enum ('admin', 'user');

-- ===== PROFILES =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  points numeric not null default 0,
  owned jsonb not null default '{}'::jsonb,
  is_online boolean not null default false,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles readable by all"
  on public.profiles for select using (true);

create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ===== USER ROLES =====
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

create policy "roles readable by all"
  on public.user_roles for select using (true);

create policy "admins manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ===== AUTO-CREATE PROFILE + FIRST USER = ADMIN =====
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  uname text;
  is_first boolean;
begin
  uname := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  -- ensure unique
  while exists (select 1 from public.profiles where username = uname) loop
    uname := uname || floor(random()*1000)::text;
  end loop;

  insert into public.profiles (id, username) values (new.id, uname);

  select count(*) = 0 into is_first from public.user_roles where role = 'admin';
  if is_first then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== CHAT =====
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  content text not null check (char_length(content) between 1 and 500),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

create policy "chat readable by all"
  on public.chat_messages for select using (true);

create policy "logged-in users post own"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "admins delete any"
  on public.chat_messages for delete
  using (public.has_role(auth.uid(), 'admin'));

create policy "users delete own"
  on public.chat_messages for delete
  using (auth.uid() = user_id);

-- ===== BROADCASTS (admin commands fanout) =====
create table public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete cascade,
  admin_name text not null,
  kind text not null,        -- 'give_points' | 'give_all' | 'godmode' | 'announce'
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.broadcasts enable row level security;

create policy "broadcasts readable by all"
  on public.broadcasts for select using (true);

create policy "only admins broadcast"
  on public.broadcasts for insert
  with check (public.has_role(auth.uid(), 'admin'));

-- ===== REALTIME =====
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.broadcasts;
alter publication supabase_realtime add table public.profiles;
