-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table rooms (
  id text primary key,                 -- 4-letter code
  host text not null,                  -- player id of host
  status text not null default 'lobby',-- lobby | entering | results | finished
  round int not null default 0,
  total_rounds int not null default 7,
  prompt text,
  picker text,                         -- player who chooses the next prompt
  round_ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table players (
  id text primary key,
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  score int not null default 0,
  last_picked_round int not null default 0,
  joined_at timestamptz not null default now(),
  unique (room_id, name)               -- same name rejoins and keeps score
);

create table submissions (
  id bigserial primary key,
  room_id text not null references rooms(id) on delete cascade,
  round int not null,
  player_id text not null references players(id) on delete cascade,
  words text[] not null,
  unique (room_id, round, player_id)
);

alter publication supabase_realtime add table rooms, players, submissions;

-- Open policies for a party game (no logins). Tighten later if you make it public.
alter table rooms enable row level security;
alter table players enable row level security;
alter table submissions enable row level security;
create policy "open rooms" on rooms for all using (true) with check (true);
create policy "open players" on players for all using (true) with check (true);
create policy "open submissions" on submissions for all using (true) with check (true);

-- Added later (manual mode). Run once if your database was created before this:
-- alter table rooms add column mode text not null default 'online';
-- alter table players add column manual jsonb not null default '{}'::jsonb;
