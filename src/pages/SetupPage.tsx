import { useState } from "react";
import { ArrowLeft, ClipboardCopy, Smartphone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Surface } from "@/components/Surface";
import { SETUP_SQL } from "@/constants/workout";

const ENV_EXAMPLE = `VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`;

export const SetupPage = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1600);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-16 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-semibold shadow-panel transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/50"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tracker
        </Link>
      </div>

      <Surface className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slateblue-700 dark:text-slateblue-200">
              Setup and help
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Everything needed to wire up Supabase fast.</h1>
            <p className="max-w-2xl text-base text-muted">
              This app is intentionally small and focused. Create the two tables, enable the policies, add your client
              env vars, and you are ready to log workouts from phone or desktop.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold">Two-table schema</p>
              <p className="mt-1 text-sm text-muted">Logs and settings only. No backend beyond Supabase.</p>
            </div>
            <div className="rounded-3xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-100">
                <Smartphone className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold">Reminder friendly</p>
              <p className="mt-1 text-sm text-muted">Use hourly nudges to turn the app into a one-tap ritual.</p>
            </div>
          </div>
        </div>
      </Surface>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Surface>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-muted">Supabase SQL</p>
              <h2 className="font-display text-2xl font-bold">Paste this into the SQL editor</h2>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slateblue-500 dark:hover:bg-slateblue-400"
              onClick={() => copyText(SETUP_SQL, "sql")}
              type="button"
            >
              <ClipboardCopy className="h-4 w-4" />
              {copiedKey === "sql" ? "Copied" : "Copy SQL"}
            </button>
          </div>
          <pre className="scrollbar-thin mt-5 max-h-[480px] overflow-auto rounded-[24px] bg-slate-950 p-4 text-sm text-slate-100">
            <code>{SETUP_SQL}</code>
          </pre>
        </Surface>

        <div className="grid gap-6">
          <Surface>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted">Env variables</p>
                <h2 className="font-display text-2xl font-bold">Use these in `.env` or Vercel</h2>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-semibold transition hover:bg-white dark:border-white/10 dark:bg-slate-950/50"
                onClick={() => copyText(ENV_EXAMPLE, "env")}
                type="button"
              >
                <ClipboardCopy className="h-4 w-4" />
                {copiedKey === "env" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-5 rounded-[24px] bg-slate-950 p-4 text-sm text-slate-100">
              <code>{ENV_EXAMPLE}</code>
            </pre>
          </Surface>

          <Surface>
            <p className="text-sm font-semibold text-muted">Quick setup steps</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>1. Create a Supabase project and open the SQL editor.</p>
              <p>2. Paste the SQL above, run it, and confirm both tables exist.</p>
              <p>3. Copy your Project URL and anon key from the Supabase project settings.</p>
              <p>4. Add them to `.env` or paste them into the in-app onboarding form.</p>
              <p>5. Run `npm run dev` locally or deploy to Vercel with the same env vars.</p>
            </div>
          </Surface>

          <Surface>
            <p className="text-sm font-semibold text-muted">iPhone reminder guide</p>
            <h2 className="font-display text-2xl font-bold">Shortcuts or Reminders</h2>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>1. In Reminders, create a list named `Workout Tracker` and add one reminder that repeats hourly.</p>
              <p>2. Set the reminder window from 07:00 to 21:00 so it matches the 15 slots in the app.</p>
              <p>3. If you prefer Shortcuts, create a Personal Automation at each hour and use a short message like `Log 14:00 session`.</p>
              <p>4. Keep the action simple: open the app, tap the slot, and optionally use `Mark all done` when the full mini-set is complete.</p>
              <p>5. If you miss an hour, just log that slot later. The tracker intentionally supports catch-up without penalty.</p>
            </div>
          </Surface>
        </div>
      </div>
    </main>
  );
};
