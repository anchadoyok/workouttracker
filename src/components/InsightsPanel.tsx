import { Clock3, Sparkle, TrendingUp } from "lucide-react";

import { Surface } from "@/components/Surface";
import type { InsightItem } from "@/types/workout";

const icons = [Clock3, Sparkle, TrendingUp];

export const InsightsPanel = ({ insights }: { insights: InsightItem[] }) => (
  <Surface>
    <div className="mb-4">
      <p className="text-sm font-semibold text-muted">Personal insights</p>
      <h3 className="font-display text-2xl font-bold">Patterns worth noticing</h3>
    </div>
    <div className="grid gap-3">
      {insights.map((insight, index) => {
        const Icon = icons[index] ?? Clock3;

        return (
          <div
            key={insight.id}
            className="rounded-3xl border border-white/50 bg-white/65 p-4 dark:border-white/10 dark:bg-slate-950/45"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted">{insight.label}</p>
                <p className="text-lg font-bold">{insight.value}</p>
                <p className="text-sm text-muted">{insight.hint}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Surface>
);
