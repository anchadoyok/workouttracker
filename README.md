# Workout Tracker

Premium hourly micro-workout tracker built with React, TypeScript, Vite, Tailwind CSS, Supabase, `date-fns`, and Recharts. The app is designed for fast repeat use on iPhone and desktop: open it, tap a few checks, and keep moving.

## What the app does

- Tracks 15 hourly workout slots each day from `07:00` to `21:00`
- Stores three exercise checks per slot: Jumping Jack, Sit-up, Push-up
- Lets the user customize reps and a personal daily target
- Shows a live today progress ring, streak, stats, charts, achievements, and insights
- Supports history navigation for reviewing or editing previous days
- Uses Supabase as the main source of truth with optimistic updates
- Queues pending changes locally when offline and syncs them automatically later
- Shows a setup/help page with the exact SQL and iPhone reminder guidance

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase JS client
- Recharts
- React Router

## Project structure

```text
src/
|-- App.tsx
|-- index.css
|-- main.tsx
|-- components/
|   |-- AchievementsPanel.tsx
|   |-- ChartsPanel.tsx
|   |-- ConnectionBadge.tsx
|   |-- DateNavigator.tsx
|   |-- InsightsPanel.tsx
|   |-- OnboardingConfig.tsx
|   |-- ProgressRing.tsx
|   |-- SessionCard.tsx
|   |-- SettingsPanel.tsx
|   |-- StatsCards.tsx
|   `-- Surface.tsx
|-- constants/
|   `-- workout.ts
|-- hooks/
|   `-- useWorkoutData.ts
|-- lib/
|   `-- cn.ts
|-- pages/
|   |-- DashboardPage.tsx
|   `-- SetupPage.tsx
|-- services/
|   |-- localCacheService.ts
|   |-- supabaseClient.ts
|   `-- workoutRepository.ts
|-- types/
|   `-- workout.ts
`-- utils/
    |-- achievements.ts
    |-- charts.ts
    |-- date.ts
    `-- workout.ts
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Copy `.env.example` to `.env` and set:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If these env vars are not set, the app shows a first-run onboarding form where the user can paste the Supabase Project URL and anon key. Those client-only values are stored in `localStorage` so the app can still run without rebuilding.

### 3. Create the Supabase tables

Run the SQL from [supabase/schema.sql](/C:/Users/ancha/OneDrive/Documents/New%20project/supabase/schema.sql) in the Supabase SQL editor:

```sql
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
```

### 4. Start the app

```bash
npm run dev
```

## Vercel deployment

The project is Vercel-ready.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

The included [vercel.json](/C:/Users/ancha/OneDrive/Documents/New%20project/vercel.json) keeps client-side routing working for the dashboard and setup/help page.

## Product notes

- Supabase is the canonical datastore when a connection is available.
- `localStorage` is only used for Supabase client config, cached UI state, and unsynced pending actions.
- The app uses lazy row creation through Supabase `upsert`, so empty days do not need to be preseeded.
- The unique constraint on `(date_key, hour)` prevents duplicate log rows.
- The settings row is stored in `workout_settings` using a single `key` with JSON content.

## Available screens

- `/`: main workout dashboard
- `/setup`: Supabase SQL setup, env help, and iPhone reminder guide
