import { useEffect, useState } from "react";
import { ExternalLink, KeyRound, Save, Settings2, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

import { Surface } from "@/components/Surface";
import type { ConfigSource, ConnectionStatus, SupabaseConfig, WorkoutSettings } from "@/types/workout";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm outline-none transition focus:border-slateblue-300 focus:ring-4 focus:ring-slateblue-100 dark:border-white/10 dark:bg-slate-950/50 dark:focus:border-slateblue-500 dark:focus:ring-slateblue-900/30";

export const SettingsPanel = ({
  settings,
  config,
  configSource,
  connectionStatus,
  pendingSyncCount,
  canResetToEnv,
  isSavingSettings,
  isSavingConfig,
  onSaveSettings,
  onSaveConfig,
  onResetConfig,
}: {
  settings: WorkoutSettings;
  config: SupabaseConfig | null;
  configSource: ConfigSource;
  connectionStatus: ConnectionStatus;
  pendingSyncCount: number;
  canResetToEnv: boolean;
  isSavingSettings: boolean;
  isSavingConfig: boolean;
  onSaveSettings: (settings: WorkoutSettings) => void;
  onSaveConfig: (config: SupabaseConfig) => void;
  onResetConfig: () => void;
}) => {
  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [configDraft, setConfigDraft] = useState({
    url: config?.url ?? "",
    anonKey: config?.anonKey ?? "",
  });

  useEffect(() => {
    setSettingsDraft(settings);
  }, [settings]);

  useEffect(() => {
    setConfigDraft({
      url: config?.url ?? "",
      anonKey: config?.anonKey ?? "",
    });
  }, [config?.anonKey, config?.url]);

  return (
    <Surface>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">Settings and help</p>
          <h3 className="font-display text-2xl font-bold">Tune the routine</h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
          <Settings2 className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <p className="text-sm font-semibold text-muted">Workout defaults</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Jumping Jack reps
                <input
                  className={inputClassName}
                  min={1}
                  onChange={(event) =>
                    setSettingsDraft((current) => ({
                      ...current,
                      jumpingJack: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={settingsDraft.jumpingJack}
                />
              </label>
              <label className="text-sm font-medium">
                Sit-up reps
                <input
                  className={inputClassName}
                  min={1}
                  onChange={(event) =>
                    setSettingsDraft((current) => ({
                      ...current,
                      sitUp: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={settingsDraft.sitUp}
                />
              </label>
              <label className="text-sm font-medium">
                Push-up reps
                <input
                  className={inputClassName}
                  min={1}
                  onChange={(event) =>
                    setSettingsDraft((current) => ({
                      ...current,
                      pushUp: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={settingsDraft.pushUp}
                />
              </label>
              <label className="text-sm font-medium">
                Daily target sessions
                <input
                  className={inputClassName}
                  max={15}
                  min={1}
                  onChange={(event) =>
                    setSettingsDraft((current) => ({
                      ...current,
                      dailyTargetSessions: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={settingsDraft.dailyTargetSessions}
                />
              </label>
            </div>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-slateblue-500 dark:hover:bg-slateblue-400"
              onClick={() => onSaveSettings(settingsDraft)}
              type="button"
            >
              <Save className="h-4 w-4" />
              {isSavingSettings ? "Saving..." : "Save workout defaults"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sunrise-100 text-sunrise-700 dark:bg-sunrise-900/40 dark:text-sunrise-100">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold">iPhone reminder guide</p>
                <p className="text-sm text-muted">Use Shortcuts or Reminders to ping yourself every hour.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <p>1. Open Shortcuts or Reminders and create a repeating alert every hour between 07:00 and 21:00.</p>
              <p>2. Use labels like “Workout slot 10:00” so each reminder matches the app.</p>
              <p>3. Keep the reminder action lightweight: open the app, tap the slot, move on.</p>
            </div>
            <Link
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slateblue-700 dark:text-slateblue-200"
              to="/setup"
            >
              Open full setup guide
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-100">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">Supabase connection</p>
              <p className="text-sm text-muted">
                Source: {configSource}. Status: {connectionStatus}. Pending sync: {pendingSyncCount}.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium">
              Supabase Project URL
              <input
                className={inputClassName}
                onChange={(event) =>
                  setConfigDraft((current) => ({
                    ...current,
                    url: event.target.value,
                  }))
                }
                placeholder="https://your-project.supabase.co"
                type="text"
                value={configDraft.url}
              />
            </label>
            <label className="text-sm font-medium">
              Supabase anon key
              <textarea
                className={`${inputClassName} min-h-28 resize-y`}
                onChange={(event) =>
                  setConfigDraft((current) => ({
                    ...current,
                    anonKey: event.target.value,
                  }))
                }
                placeholder="eyJ..."
                value={configDraft.anonKey}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-slateblue-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slateblue-400"
              onClick={() => onSaveConfig(configDraft)}
              type="button"
            >
              <Save className="h-4 w-4" />
              {isSavingConfig ? "Saving..." : "Save connection"}
            </button>
            {canResetToEnv ? (
              <button
                className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/50"
                onClick={onResetConfig}
                type="button"
              >
                Reset to env config
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Surface>
  );
};
