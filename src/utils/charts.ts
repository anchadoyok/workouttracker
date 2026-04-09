import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subWeeks } from "date-fns";

import { HOURS } from "@/constants/workout";
import type { ChartDatum, InsightItem, WorkoutLogRow } from "@/types/workout";
import { formatHourLabel, toDateKey } from "@/utils/date";
import { isSessionComplete } from "@/utils/workout";

const countCompleteSessionsBetween = (logs: WorkoutLogRow[], start: Date, end: Date) => {
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);

  return logs.filter((log) => isSessionComplete(log) && log.date_key >= startKey && log.date_key <= endKey).length;
};

export const buildWeeklyChart = (logs: WorkoutLogRow[], referenceDate = new Date()): ChartDatum[] => {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(weekStart, index);
    const dateKey = toDateKey(day);
    const value = logs.filter((log) => log.date_key === dateKey && isSessionComplete(log)).length;

    return {
      label: format(day, "EEE"),
      value,
      meta: format(day, "d MMM"),
    };
  });
};

export const buildMonthlyChart = (logs: WorkoutLogRow[], referenceDate = new Date()): ChartDatum[] =>
  Array.from({ length: 4 }, (_, index) => {
    const weekStart = startOfWeek(subWeeks(referenceDate, 3 - index), { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);

    return {
      label: format(weekStart, "d MMM"),
      value: countCompleteSessionsBetween(logs, weekStart, weekEnd),
      meta: `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`,
    };
  });

export const countSessionsThisWeek = (logs: WorkoutLogRow[], referenceDate = new Date()) =>
  countCompleteSessionsBetween(
    logs,
    startOfWeek(referenceDate, { weekStartsOn: 1 }),
    endOfWeek(referenceDate, { weekStartsOn: 1 }),
  );

export const countSessionsThisMonth = (logs: WorkoutLogRow[], referenceDate = new Date()) =>
  countCompleteSessionsBetween(logs, startOfMonth(referenceDate), endOfMonth(referenceDate));

export const calculateCurrentStreak = (logs: WorkoutLogRow[], referenceDate = new Date()) => {
  const completedDays = new Set(logs.filter((log) => isSessionComplete(log)).map((log) => log.date_key));
  let streak = 0;
  let cursor = referenceDate;

  while (completedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
};

export const buildInsights = (logs: WorkoutLogRow[], referenceDate = new Date()): InsightItem[] => {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekStartKey = toDateKey(weekStart);
  const weekEndKey = toDateKey(weekEnd);
  const weekLogs = logs.filter((log) => log.date_key >= weekStartKey && log.date_key <= weekEndKey && isSessionComplete(log));

  const hourTotals = HOURS.map((hour) => ({
    hour,
    count: weekLogs.filter((log) => log.hour === hour).length,
  }));

  const mostCompletedHour = [...hourTotals].sort((left, right) => right.count - left.count || left.hour - right.hour)[0];
  const leastCompletedHour = [...hourTotals].sort((left, right) => left.count - right.count || left.hour - right.hour)[0];
  const bestDay = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
    .map((day) => {
      const dateKey = toDateKey(day);

      return {
        day,
        value: weekLogs.filter((log) => log.date_key === dateKey).length,
      };
    })
    .sort((left, right) => right.value - left.value)[0];

  return [
    {
      id: "most-completed-hour",
      label: "Most completed hour",
      value: mostCompletedHour.count > 0 ? formatHourLabel(mostCompletedHour.hour) : "No winner yet",
      hint:
        mostCompletedHour.count > 0
          ? `${mostCompletedHour.count} finished sessions landed here this week.`
          : "Complete one full session to start seeing your pattern.",
    },
    {
      id: "least-completed-hour",
      label: "Least completed hour",
      value: leastCompletedHour.count > 0 ? formatHourLabel(leastCompletedHour.hour) : "Every hour is open",
      hint:
        leastCompletedHour.count > 0
          ? `${leastCompletedHour.count} finished sessions this week. Great slot to reinforce.`
          : "No hour has a completed session yet this week.",
    },
    {
      id: "best-day",
      label: "Best day this week",
      value: bestDay.value > 0 ? format(bestDay.day, "EEEE") : "Still loading momentum",
      hint:
        bestDay.value > 0
          ? `${bestDay.value} finished sessions made this your strongest day.`
          : "A single completed session will light this up.",
    },
  ];
};
