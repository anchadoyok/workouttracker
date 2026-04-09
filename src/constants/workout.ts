import type { WorkoutExerciseKey, WorkoutFieldKey, WorkoutSettings } from "@/types/workout";

export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 21;
export const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, index) => DAY_START_HOUR + index);
export const DAILY_SLOT_COUNT = HOURS.length;
export const SETTINGS_ROW_KEY = "defaults";

export const DEFAULT_SETTINGS: WorkoutSettings = {
  jumpingJack: 20,
  sitUp: 10,
  pushUp: 10,
  dailyTargetSessions: 8,
};

export const EXERCISES: Array<{
  key: WorkoutExerciseKey;
  field: WorkoutFieldKey;
  label: string;
  shortLabel: string;
}> = [
  { key: "jumpingJack", field: "jj", label: "Jumping Jack", shortLabel: "JJ" },
  { key: "sitUp", field: "su", label: "Sit-up", shortLabel: "SU" },
  { key: "pushUp", field: "pu", label: "Push-up", shortLabel: "PU" },
];

export const EXERCISE_FIELD_MAP: Record<WorkoutExerciseKey, WorkoutFieldKey> = {
  jumpingJack: "jj",
  sitUp: "su",
  pushUp: "pu",
};

export const STORAGE_KEYS = {
  config: "workout-tracker.supabase-config",
  snapshot: "workout-tracker.snapshot",
  queue: "workout-tracker.pending-ops",
} as const;

export const SETUP_SQL = `create table workout_logs (
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
for all using (true) with check (true);`;
