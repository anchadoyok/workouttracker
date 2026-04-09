import { DAILY_SLOT_COUNT, DEFAULT_SETTINGS, EXERCISE_FIELD_MAP, EXERCISES, HOURS } from "@/constants/workout";
import type { PendingOperation, WorkoutExerciseKey, WorkoutLogRow, WorkoutSessionView, WorkoutSettings } from "@/types/workout";

const clampInteger = (value: unknown, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(parsed)));
};

export const normalizeSettings = (value?: Partial<WorkoutSettings> | null): WorkoutSettings => ({
  jumpingJack: clampInteger(value?.jumpingJack, DEFAULT_SETTINGS.jumpingJack, 1, 999),
  sitUp: clampInteger(value?.sitUp, DEFAULT_SETTINGS.sitUp, 1, 999),
  pushUp: clampInteger(value?.pushUp, DEFAULT_SETTINGS.pushUp, 1, 999),
  dailyTargetSessions: clampInteger(value?.dailyTargetSessions, DEFAULT_SETTINGS.dailyTargetSessions, 1, DAILY_SLOT_COUNT),
});

export const createEmptyLog = (dateKey: string, hour: number): WorkoutLogRow => ({
  date_key: dateKey,
  hour,
  jj: false,
  su: false,
  pu: false,
});

export const getExerciseChecked = (log: WorkoutLogRow, exerciseKey: WorkoutExerciseKey) => log[EXERCISE_FIELD_MAP[exerciseKey]];

export const setExerciseChecked = (
  log: WorkoutLogRow,
  exerciseKey: WorkoutExerciseKey,
  checked: boolean,
): WorkoutLogRow => ({
  ...log,
  [EXERCISE_FIELD_MAP[exerciseKey]]: checked,
});

export const getCompletedExerciseCount = (log: WorkoutLogRow) => EXERCISES.filter((exercise) => log[exercise.field]).length;

export const isSessionComplete = (log: WorkoutLogRow) => getCompletedExerciseCount(log) === EXERCISES.length;

export const toSessionView = (log: WorkoutLogRow): WorkoutSessionView => {
  const completedCount = getCompletedExerciseCount(log);

  return {
    ...log,
    completedCount,
    isComplete: completedCount === EXERCISES.length,
    isPartial: completedCount > 0 && completedCount < EXERCISES.length,
  };
};

export const sortWorkoutLogs = (logs: WorkoutLogRow[]) =>
  [...logs].sort((left, right) => {
    if (left.date_key === right.date_key) {
      return left.hour - right.hour;
    }

    return left.date_key.localeCompare(right.date_key);
  });

export const upsertWorkoutLog = (logs: WorkoutLogRow[], nextLog: WorkoutLogRow) =>
  sortWorkoutLogs(
    [...logs.filter((log) => !(log.date_key === nextLog.date_key && log.hour === nextLog.hour)), nextLog].map((log) => ({
      ...log,
      jj: Boolean(log.jj),
      su: Boolean(log.su),
      pu: Boolean(log.pu),
    })),
  );

export const getSessionsForDate = (logs: WorkoutLogRow[], dateKey: string) => {
  const map = new Map(logs.filter((log) => log.date_key === dateKey).map((log) => [log.hour, log]));

  return HOURS.map((hour) => toSessionView(map.get(hour) ?? createEmptyLog(dateKey, hour)));
};

export const countCompletedSessions = (logs: WorkoutLogRow[], dateKey?: string) =>
  logs.filter((log) => (!dateKey || log.date_key === dateKey) && isSessionComplete(log)).length;

export const countCompletedSessionsInViews = (sessions: WorkoutSessionView[]) => sessions.filter((session) => session.isComplete).length;

export const calculateRepsForLog = (log: WorkoutLogRow, settings: WorkoutSettings) =>
  EXERCISES.reduce((total, exercise) => total + (log[exercise.field] ? settings[exercise.key] : 0), 0);

export const calculateRepsForSessions = (sessions: WorkoutSessionView[], settings: WorkoutSettings) =>
  sessions.reduce((total, session) => total + calculateRepsForLog(session, settings), 0);

export const applyPendingOperations = (
  logs: WorkoutLogRow[],
  settings: WorkoutSettings,
  operations: PendingOperation[],
) => {
  let nextLogs = [...logs];
  let nextSettings = settings;

  for (const operation of operations) {
    if (operation.type === "upsert-log") {
      nextLogs = upsertWorkoutLog(nextLogs, operation.payload);
      continue;
    }

    nextSettings = normalizeSettings(operation.payload);
  }

  return {
    logs: nextLogs,
    settings: nextSettings,
  };
};
