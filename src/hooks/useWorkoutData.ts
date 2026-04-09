import { useEffect, useRef, useState } from "react";

import { DEFAULT_SETTINGS } from "@/constants/workout";
import {
  buildPendingId,
  clearStoredSupabaseConfig,
  mergePendingOperations,
  readCacheSnapshot,
  readPendingOperations,
  saveStoredSupabaseConfig,
  writeCacheSnapshot,
  writePendingOperations,
} from "@/services/localCacheService";
import { createSupabaseBrowserClient, getEnvSupabaseConfig, resolveSupabaseConfig } from "@/services/supabaseClient";
import { fetchWorkoutBootstrap, saveWorkoutSettingsRecord, upsertWorkoutLogRecord } from "@/services/workoutRepository";
import type {
  ConfigSource,
  ConnectionStatus,
  DashboardStats,
  PendingOperation,
  SupabaseConfig,
  WorkoutExerciseKey,
  WorkoutLogRow,
  WorkoutSettings,
} from "@/types/workout";
import { buildAchievements } from "@/utils/achievements";
import {
  buildInsights,
  buildMonthlyChart,
  buildWeeklyChart,
  calculateCurrentStreak,
  countSessionsThisMonth,
  countSessionsThisWeek,
} from "@/utils/charts";
import { isDateToday, shiftDate, toDateKey } from "@/utils/date";
import {
  applyPendingOperations,
  calculateRepsForSessions,
  countCompletedSessionsInViews,
  createEmptyLog,
  getExerciseChecked,
  getSessionsForDate,
  normalizeSettings,
  setExerciseChecked,
  sortWorkoutLogs,
  upsertWorkoutLog,
} from "@/utils/workout";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to reach Supabase right now.";
};

export const useWorkoutData = () => {
  const resolvedConfig = resolveSupabaseConfig();
  const initialSnapshot = readCacheSnapshot();

  const [config, setConfig] = useState<SupabaseConfig | null>(resolvedConfig.config);
  const [configSource, setConfigSource] = useState<ConfigSource>(resolvedConfig.source);
  const [logs, setLogs] = useState<WorkoutLogRow[]>(() => sortWorkoutLogs(initialSnapshot?.logs ?? []));
  const [settings, setSettings] = useState<WorkoutSettings>(() => normalizeSettings(initialSnapshot?.settings ?? DEFAULT_SETTINGS));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [queue, setQueue] = useState<PendingOperation[]>(() => readPendingOperations());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(config ? "connecting" : "config-missing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !initialSnapshot);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const syncInFlightRef = useRef(false);

  const applyQueueAndPersist = (nextLogs: WorkoutLogRow[], nextSettings: WorkoutSettings) => {
    const sorted = sortWorkoutLogs(nextLogs);
    setLogs(sorted);
    setSettings(nextSettings);
    writeCacheSnapshot({
      logs: sorted,
      settings: nextSettings,
      updatedAt: new Date().toISOString(),
    });
  };

  const flushQueue = async (operations = queue, activeConfig = config) => {
    if (!operations.length) {
      setConnectionStatus(activeConfig ? "connected" : "config-missing");
      return;
    }

    if (!activeConfig) {
      setConnectionStatus("config-missing");
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setConnectionStatus("offline");
      return;
    }

    if (syncInFlightRef.current) {
      return;
    }

    syncInFlightRef.current = true;
    setConnectionStatus("syncing");

    try {
      const client = createSupabaseBrowserClient(activeConfig);

      for (const operation of operations) {
        if (operation.type === "upsert-log") {
          await upsertWorkoutLogRecord(client, operation.payload);
          continue;
        }

        await saveWorkoutSettingsRecord(client, operation.payload);
      }

      setQueue([]);
      writePendingOperations([]);
      setConnectionStatus("connected");
      setErrorMessage(null);
    } catch (error) {
      setConnectionStatus(typeof navigator !== "undefined" && navigator.onLine ? "error" : "offline");
      setErrorMessage(getErrorMessage(error));
    } finally {
      syncInFlightRef.current = false;
      setIsSavingSettings(false);
      setIsSavingConfig(false);
    }
  };

  const refreshFromServer = async (activeConfig = config) => {
    if (!activeConfig) {
      setConnectionStatus("config-missing");
      setIsLoading(false);
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setConnectionStatus("offline");
      setIsLoading(false);
      return;
    }

    setConnectionStatus(queue.length > 0 ? "syncing" : "connecting");

    try {
      const client = createSupabaseBrowserClient(activeConfig);
      const bootstrap = await fetchWorkoutBootstrap(client);
      const baseSettings = normalizeSettings(bootstrap.settings ?? DEFAULT_SETTINGS);
      const optimisticState = applyPendingOperations(bootstrap.logs, baseSettings, queue);

      applyQueueAndPersist(optimisticState.logs, optimisticState.settings);
      setConnectionStatus(queue.length > 0 ? "syncing" : "connected");
      setErrorMessage(null);

      if (queue.length > 0) {
        await flushQueue(queue, activeConfig);
      }
    } catch (error) {
      setConnectionStatus(typeof navigator !== "undefined" && navigator.onLine ? "error" : "offline");
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsSavingConfig(false);
    }
  };

  useEffect(() => {
    void refreshFromServer(config);
  }, [config?.anonKey, config?.url]);

  useEffect(() => {
    const handleOnline = () => {
      void refreshFromServer(config);
    };

    const handleFocus = () => {
      if (config && (typeof navigator === "undefined" || navigator.onLine)) {
        void flushQueue(queue, config);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("focus", handleFocus);
    };
  }, [config, queue]);

  const queueOperation = (operation: PendingOperation) => {
    const nextQueue = mergePendingOperations(queue, operation);
    setQueue(nextQueue);
    writePendingOperations(nextQueue);
    return nextQueue;
  };

  const persistLog = (nextLog: WorkoutLogRow) => {
    const nextLogs = upsertWorkoutLog(logs, nextLog);
    applyQueueAndPersist(nextLogs, settings);

    const nextQueue = queueOperation({
      id: buildPendingId(),
      type: "upsert-log",
      payload: nextLog,
      createdAt: new Date().toISOString(),
    });

    if (config && (typeof navigator === "undefined" || navigator.onLine)) {
      void flushQueue(nextQueue, config);
      return;
    }

    setConnectionStatus(config ? "offline" : "config-missing");
  };

  const toggleExercise = (hour: number, exerciseKey: WorkoutExerciseKey) => {
    const dateKey = toDateKey(selectedDate);
    const existing = logs.find((log) => log.date_key === dateKey && log.hour === hour) ?? createEmptyLog(dateKey, hour);
    const nextLog = setExerciseChecked(existing, exerciseKey, !getExerciseChecked(existing, exerciseKey));

    persistLog(nextLog);
  };

  const markSessionDone = (hour: number) => {
    const dateKey = toDateKey(selectedDate);
    const existing = logs.find((log) => log.date_key === dateKey && log.hour === hour) ?? createEmptyLog(dateKey, hour);

    persistLog({
      ...existing,
      jj: true,
      su: true,
      pu: true,
    });
  };

  const saveSettings = (nextSettings: WorkoutSettings) => {
    const normalized = normalizeSettings(nextSettings);
    setIsSavingSettings(true);
    applyQueueAndPersist(logs, normalized);

    const nextQueue = queueOperation({
      id: buildPendingId(),
      type: "save-settings",
      payload: normalized,
      createdAt: new Date().toISOString(),
    });

    if (config && (typeof navigator === "undefined" || navigator.onLine)) {
      void flushQueue(nextQueue, config);
      return;
    }

    setConnectionStatus(config ? "offline" : "config-missing");
  };

  const saveConfig = (nextConfig: SupabaseConfig) => {
    setIsSavingConfig(true);
    saveStoredSupabaseConfig(nextConfig);
    setConfig(nextConfig);
    setConfigSource("local");
    setConnectionStatus("connecting");
    setErrorMessage(null);
  };

  const resetConfig = () => {
    clearStoredSupabaseConfig();
    const envConfig = getEnvSupabaseConfig();
    setConfig(envConfig);
    setConfigSource(envConfig ? "env" : "none");
    setConnectionStatus(envConfig ? "connecting" : "config-missing");
    setErrorMessage(null);
  };

  const today = new Date();
  const todayKey = toDateKey(today);
  const selectedDateKey = toDateKey(selectedDate);
  const todaySessions = getSessionsForDate(logs, todayKey);
  const selectedSessions = getSessionsForDate(logs, selectedDateKey);
  const todayCompletedSessions = countCompletedSessionsInViews(todaySessions);
  const currentStreak = calculateCurrentStreak(logs, today);
  const stats: DashboardStats = {
    totalRepsToday: calculateRepsForSessions(todaySessions, settings),
    sessionsThisWeek: countSessionsThisWeek(logs, today),
    sessionsThisMonth: countSessionsThisMonth(logs, today),
  };

  const pendingSelectedHours = queue
    .filter(
      (operation): operation is Extract<PendingOperation, { type: "upsert-log" }> =>
        operation.type === "upsert-log" && operation.payload.date_key === selectedDateKey,
    )
    .map((operation) => operation.payload.hour);

  return {
    config,
    configSource,
    connectionStatus,
    errorMessage,
    isLoading,
    isSavingConfig,
    isSavingSettings,
    onboardingRequired: !config,
    canResetToEnv: configSource === "local" && Boolean(getEnvSupabaseConfig()),
    pendingSyncCount: queue.length,
    selectedDate,
    selectedDateKey,
    selectedSessions,
    todayCompletedSessions,
    stats,
    settings,
    streak: currentStreak,
    weeklyChart: buildWeeklyChart(logs, today),
    monthlyChart: buildMonthlyChart(logs, today),
    insights: buildInsights(logs, today),
    achievements: buildAchievements({
      todayCompletedSessions,
      streak: currentStreak,
      dailyTargetSessions: settings.dailyTargetSessions,
    }),
    pendingSelectedHours,
    isViewingToday: isDateToday(selectedDate),
    currentHour: today.getHours(),
    goToPreviousDay: () => setSelectedDate((current) => shiftDate(current, -1)),
    goToNextDay: () => {
      if (toDateKey(selectedDate) === todayKey) {
        return;
      }

      setSelectedDate((current) => shiftDate(current, 1));
    },
    goToToday: () => setSelectedDate(today),
    saveConfig,
    resetConfig,
    saveSettings,
    refresh: () => refreshFromServer(config),
    toggleExercise,
    markSessionDone,
  };
};
