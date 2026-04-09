create table workout_logs (
  id bigserial primary key,
  date_key text not null,
  hour integer not null,
  jj boolean default false,
  su boolean default false,
  pu boolean default false,
  created_at timestamptz default now(),
  unique(date_key, hour)
);

create table workout_settings (
  key text primary key,
  value jsonb not null
);

alter table workout_logs enable row level security;
alter table workout_settings enable row level security;

create policy "allow all" on workout_logs
for all using (true) with check (true);

create policy "allow all" on workout_settings
for all using (true) with check (true);
