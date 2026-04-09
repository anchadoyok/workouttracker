import { Activity, CalendarRange, Flame } from "lucide-react";

import { Surface } from "@/components/Surface";

export const StatsCards = ({
  totalRepsToday,
  sessionsThisWeek,
  sessionsThisMonth,
}: {
  totalRepsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <Surface className="space-y-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
        <Activity className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-muted">Total reps today</p>
      <p className="font-display text-3xl font-bold">{totalRepsToday}</p>
    </Surface>
    <Surface className="space-y-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-100">
        <Flame className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-muted">Sessions this week</p>
      <p className="font-display text-3xl font-bold">{sessionsThisWeek}</p>
    </Surface>
    <Surface className="space-y-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sunrise-100 text-sunrise-700 dark:bg-sunrise-900/40 dark:text-sunrise-100">
        <CalendarRange className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-muted">Sessions this month</p>
      <p className="font-display text-3xl font-bold">{sessionsThisMonth}</p>
    </Surface>
  </div>
);
