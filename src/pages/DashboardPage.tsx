import { AlertTriangle, Flame, RefreshCw, Sparkles, Target } from "lucide-react";

import { AchievementsPanel } from "@/components/AchievementsPanel";
import { ChartsPanel } from "@/components/ChartsPanel";
import { ConnectionBadge } from "@/components/ConnectionBadge";
import { DateNavigator } from "@/components/DateNavigator";
import { InsightsPanel } from "@/components/InsightsPanel";
import { OnboardingConfig } from "@/components/OnboardingConfig";
import { ProgressRing } from "@/components/ProgressRing";
import { SessionCard } from "@/components/SessionCard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { StatsCards } from "@/components/StatsCards";
import { Surface } from "@/components/Surface";
import { useWorkoutData } from "@/hooks/useWorkoutData";
import { formatLongDate } from "@/utils/date";

export const DashboardPage = () => {
  const workout = useWorkoutData();

  if (workout.onboardingRequired) {
    return (
      <OnboardingConfig
        isSaving={workout.isSavingConfig}
        onSubmit={workout.saveConfig}
      />
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-4 pb-20 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slateblue-700 dark:text-slateblue-200">
            Workout Tracker
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Every hour counts.</h1>
        </div>
        <ConnectionBadge
          pendingCount={workout.pendingSyncCount}
          status={workout.connectionStatus}
        />
      </div>

      {workout.errorMessage ? (
        <div className="mb-4 flex items-start gap-3 rounded-[24px] border border-sunrise-200 bg-sunrise-50/90 p-4 text-sm text-sunrise-900 dark:border-sunrise-500/30 dark:bg-sunrise-950/30 dark:text-sunrise-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{workout.errorMessage}</p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="glass-surface-strong overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-muted">Today</p>
                <h2 className="font-display text-3xl font-bold">{formatLongDate(new Date())}</h2>
                <p className="mt-2 max-w-xl text-base text-muted">
                  Fast hourly check-ins, visible momentum, and resilient syncing so you can keep the habit frictionless.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                  <div className="flex items-center gap-2 text-muted">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-semibold">Daily target</span>
                  </div>
                  <p className="mt-3 font-display text-3xl font-bold">{workout.settings.dailyTargetSessions}</p>
                  <p className="mt-1 text-sm text-muted">Personal goal for the ring</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                  <div className="flex items-center gap-2 text-muted">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-semibold">Current streak</span>
                  </div>
                  <p className="mt-3 font-display text-3xl font-bold">{workout.streak}</p>
                  <p className="mt-1 text-sm text-muted">{workout.streak === 1 ? "day" : "days"} with at least one full session</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                  <div className="flex items-center gap-2 text-muted">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Sync queue</span>
                  </div>
                  <p className="mt-3 font-display text-3xl font-bold">{workout.pendingSyncCount}</p>
                  <p className="mt-1 text-sm text-muted">Unsynced changes waiting locally</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ProgressRing
                completed={workout.todayCompletedSessions}
                target={workout.settings.dailyTargetSessions}
              />
            </div>
          </div>
        </Surface>

        <Surface className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted">Quick actions</p>
              <h2 className="font-display text-2xl font-bold">Stay in flow</h2>
            </div>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 transition hover:bg-white dark:border-white/10 dark:bg-slate-950/50"
              onClick={workout.refresh}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <p className="font-semibold">Catch-up friendly</p>
            <p className="mt-1 text-sm text-muted">
              Missed 11:00? No problem. Any visible hour slot can be completed later in the day or edited from history.
            </p>
          </div>
          <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <p className="font-semibold">Partial completion is real progress</p>
            <p className="mt-1 text-sm text-muted">
              Cards clearly show 1/3 and 2/3 states so momentum stays visible even before a full session is finished.
            </p>
          </div>
          <div className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <p className="font-semibold">Optimistic logging</p>
            <p className="mt-1 text-sm text-muted">
              Taps update instantly. If Supabase drops for a moment, the app keeps your state and syncs when it returns.
            </p>
          </div>
        </Surface>
      </div>

      <div className="mt-6">
        <DateNavigator
          isToday={workout.isViewingToday}
          onNext={workout.goToNextDay}
          onPrevious={workout.goToPreviousDay}
          onToday={workout.goToToday}
          selectedDate={workout.selectedDate}
        />
      </div>

      {!workout.isViewingToday ? (
        <div className="mt-4 rounded-[24px] border border-white/60 bg-white/70 p-4 text-sm text-muted shadow-panel dark:border-white/10 dark:bg-slate-950/45">
          You are viewing a previous day. Changes here stay clear and consistent: any edits update that date's saved history.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {workout.selectedSessions.map((session) => (
          <SessionCard
            key={`${workout.selectedDateKey}-${session.hour}`}
            hour={session.hour}
            isCurrentHour={workout.isViewingToday && workout.currentHour === session.hour}
            isPending={workout.pendingSelectedHours.includes(session.hour)}
            onMarkAll={workout.markSessionDone}
            onToggle={workout.toggleExercise}
            session={session}
            settings={workout.settings}
          />
        ))}
      </div>

      <div className="mt-6">
        <StatsCards
          sessionsThisMonth={workout.stats.sessionsThisMonth}
          sessionsThisWeek={workout.stats.sessionsThisWeek}
          totalRepsToday={workout.stats.totalRepsToday}
        />
      </div>

      <div className="mt-6">
        <ChartsPanel
          monthlyData={workout.monthlyChart}
          weeklyData={workout.weeklyChart}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <InsightsPanel insights={workout.insights} />
        <AchievementsPanel achievements={workout.achievements} />
      </div>

      <div className="mt-6">
        <SettingsPanel
          canResetToEnv={workout.canResetToEnv}
          config={workout.config}
          configSource={workout.configSource}
          connectionStatus={workout.connectionStatus}
          isSavingConfig={workout.isSavingConfig}
          isSavingSettings={workout.isSavingSettings}
          onResetConfig={workout.resetConfig}
          onSaveConfig={workout.saveConfig}
          onSaveSettings={workout.saveSettings}
          pendingSyncCount={workout.pendingSyncCount}
          settings={workout.settings}
        />
      </div>
    </main>
  );
};
