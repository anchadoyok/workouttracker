import { CheckCircle2, Circle, Sparkles, TimerReset } from "lucide-react";

import { EXERCISES } from "@/constants/workout";
import { cn } from "@/lib/cn";
import type { WorkoutExerciseKey, WorkoutSessionView, WorkoutSettings } from "@/types/workout";
import { formatHourLabel } from "@/utils/date";

const toneClasses = {
  idle: "border-white/60 bg-white/72 dark:border-white/10 dark:bg-slate-950/50",
  partial: "border-slateblue-200/90 bg-gradient-to-br from-slateblue-50/95 via-white/90 to-sky-50/80 dark:border-slateblue-500/30 dark:from-slateblue-950/30 dark:via-slate-950/80 dark:to-cyan-950/20",
  complete: "border-mint-200/90 bg-gradient-to-br from-mint-50/95 via-white/90 to-emerald-50/80 shadow-lift dark:border-mint-500/30 dark:from-mint-950/30 dark:via-slate-950/80 dark:to-emerald-950/20",
};

export const SessionCard = ({
  hour,
  isCurrentHour,
  isPending,
  session,
  settings,
  onToggle,
  onMarkAll,
}: {
  hour: number;
  isCurrentHour: boolean;
  isPending: boolean;
  session: WorkoutSessionView;
  settings: WorkoutSettings;
  onToggle: (hour: number, exerciseKey: WorkoutExerciseKey) => void;
  onMarkAll: (hour: number) => void;
}) => {
  const tone = session.isComplete ? "complete" : session.isPartial ? "partial" : "idle";

  return (
    <article
      className={cn(
        "rounded-[28px] border p-4 shadow-panel transition-all duration-300 hover:-translate-y-0.5 sm:p-5",
        toneClasses[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold">{formatHourLabel(hour)}</h3>
            {isCurrentHour ? (
              <span className="rounded-full bg-slateblue-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
                Now
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">
            {session.isComplete
              ? "Full session done. Nice work."
              : session.isPartial
                ? `${session.completedCount}/3 exercises checked`
                : "Open slot. Finish it whenever you get to it."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="rounded-full bg-slateblue-100 px-2.5 py-1 text-[11px] font-semibold text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
              Queued
            </span>
          ) : null}
          {session.isComplete ? <Sparkles className="h-5 w-5 text-mint-600 dark:text-mint-300" /> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 rounded-full transition-all",
              index < session.completedCount
                ? "bg-gradient-to-r from-slateblue-500 via-sky-400 to-mint-400"
                : "bg-slate-200/80 dark:bg-slate-800/80",
            )}
          />
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {EXERCISES.map((exercise) => {
          const checked = session[exercise.field];

          return (
            <button
              key={exercise.key}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                checked
                  ? "border-mint-200 bg-mint-50 text-slate-900 dark:border-mint-500/30 dark:bg-mint-950/25 dark:text-slate-50"
                  : "border-white/60 bg-white/60 hover:border-slateblue-200 hover:bg-white dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-slateblue-500/20",
              )}
              onClick={() => onToggle(hour, exercise.key)}
              type="button"
            >
              <div className="flex items-center gap-3">
                {checked ? (
                  <CheckCircle2 className="h-5 w-5 text-mint-600 dark:text-mint-300" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                )}
                <div>
                  <p className={cn("font-semibold", checked && "line-through decoration-2")}>{exercise.label}</p>
                  <p className="text-sm text-muted">{settings[exercise.key]} reps</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-muted dark:bg-white/5">
                {exercise.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      <button
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slateblue-500 dark:hover:bg-slateblue-400"
        disabled={session.isComplete}
        onClick={() => onMarkAll(hour)}
        type="button"
      >
        <TimerReset className="h-4 w-4" />
        Mark all done
      </button>
    </article>
  );
};
