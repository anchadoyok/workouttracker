import type { AchievementItem } from "@/types/workout";

export const buildAchievements = ({
  todayCompletedSessions,
  streak,
  dailyTargetSessions,
}: {
  todayCompletedSessions: number;
  streak: number;
  dailyTargetSessions: number;
}): AchievementItem[] => [
  {
    id: "first-session",
    title: "First session today",
    description: "One full slot completed. Momentum is already real.",
    unlocked: todayCompletedSessions >= 1,
    accent: "slateblue",
  },
  {
    id: "three-day-streak",
    title: "3-day streak",
    description: "Three days in a row with at least one finished session.",
    unlocked: streak >= 3,
    accent: "mint",
  },
  {
    id: "target-hit",
    title: "Daily target reached",
    description: "You hit your personal target and filled the ring.",
    unlocked: todayCompletedSessions >= dailyTargetSessions,
    accent: "sunrise",
  },
  {
    id: "full-sweep",
    title: "All 15 complete",
    description: "Every hourly slot from morning to night is done.",
    unlocked: todayCompletedSessions >= 15,
    accent: "mint",
  },
];
