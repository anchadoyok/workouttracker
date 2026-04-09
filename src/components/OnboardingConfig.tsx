import { useState } from "react";
import { ArrowRight, DatabaseZap } from "lucide-react";
import { Link } from "react-router-dom";

import type { SupabaseConfig } from "@/types/workout";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm outline-none transition focus:border-slateblue-300 focus:ring-4 focus:ring-slateblue-100 dark:border-white/10 dark:bg-slate-950/50 dark:focus:border-slateblue-500 dark:focus:ring-slateblue-900/30";

export const OnboardingConfig = ({
  onSubmit,
  isSaving,
}: {
  onSubmit: (config: SupabaseConfig) => void;
  isSaving: boolean;
}) => {
  const [config, setConfig] = useState({
    url: "",
    anonKey: "",
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="glass-surface-strong grid w-full gap-8 rounded-[32px] p-6 shadow-glow sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
            <DatabaseZap className="h-7 w-7" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slateblue-700 dark:text-slateblue-200">
              Workout Tracker
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Connect Supabase and start logging in seconds.
            </h1>
            <p className="max-w-xl text-base text-muted">
              Paste your Supabase project URL and anon key once. After that, the app keeps your sessions, settings,
              streak, and offline queue synced automatically.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/50 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/45">
              <p className="font-semibold">Fast taps</p>
              <p className="mt-1 text-sm text-muted">Designed for hourly use without modal clutter.</p>
            </div>
            <div className="rounded-3xl border border-white/50 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/45">
              <p className="font-semibold">Offline queue</p>
              <p className="mt-1 text-sm text-muted">Pending checkoffs stay safe until Supabase comes back.</p>
            </div>
            <div className="rounded-3xl border border-white/50 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/45">
              <p className="font-semibold">Setup guide</p>
              <p className="mt-1 text-sm text-muted">SQL, env tips, and iPhone reminder instructions are included.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/50 bg-white/70 p-5 dark:border-white/10 dark:bg-slate-950/50">
          <label className="block text-sm font-medium">
            Supabase Project URL
            <input
              className={inputClassName}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
              placeholder="https://your-project.supabase.co"
              type="text"
              value={config.url}
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Supabase anon key
            <textarea
              className={`${inputClassName} min-h-36 resize-y`}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  anonKey: event.target.value,
                }))
              }
              placeholder="eyJhbGciOi..."
              value={config.anonKey}
            />
          </label>
          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slateblue-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slateblue-400"
            onClick={() => onSubmit(config)}
            type="button"
          >
            {isSaving ? "Saving connection..." : "Save and open tracker"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slateblue-700 dark:text-slateblue-200"
            to="/setup"
          >
            Need the SQL or reminder guide? Open setup help
          </Link>
        </div>
      </div>
    </main>
  );
};
