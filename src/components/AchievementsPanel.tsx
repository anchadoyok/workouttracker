import { BadgeCheck } from "lucide-react";

import { Surface } from "@/components/Surface";
import { cn } from "@/lib/cn";
import type { AchievementItem } from "@/types/workout";

const accentClasses = {
  slateblue: "bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100",
  mint: "bg-mint-100 text-mint-700 dark:bg-mint-900/40 dark:text-mint-100",
  sunrise: "bg-sunrise-100 text-sunrise-700 dark:bg-sunrise-900/40 dark:text-sunrise-100",
};

export const AchievementsPanel = ({ achievements }: { achievements: AchievementItem[] }) => (
  <Surface>
    <div className="mb-4">
      <p className="text-sm font-semibold text-muted">Motivation layer</p>
      <h3 className="font-display text-2xl font-bold">Milestones</h3>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={cn(
            "rounded-3xl border p-4 transition-all",
            achievement.unlocked
              ? "border-white/60 bg-white/80 shadow-lift dark:border-white/10 dark:bg-slate-950/55"
              : "border-white/40 bg-white/55 opacity-70 dark:border-white/10 dark:bg-slate-950/35",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{achievement.title}</p>
              <p className="mt-1 text-sm text-muted">{achievement.description}</p>
            </div>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", accentClasses[achievement.accent])}>
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {achievement.unlocked ? "Unlocked" : "Locked"}
          </p>
        </div>
      ))}
    </div>
  </Surface>
);
