import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { formatCompactDate } from "@/utils/date";

export const DateNavigator = ({
  selectedDate,
  isToday,
  onPrevious,
  onNext,
  onToday,
}: {
  selectedDate: Date;
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}) => (
  <div className="glass-surface-strong flex flex-col gap-4 rounded-[24px] p-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slateblue-100 text-slateblue-700 dark:bg-slateblue-900/40 dark:text-slateblue-100">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted">{isToday ? "Today's log" : "History view"}</p>
        <p className="font-display text-xl font-bold">{formatCompactDate(selectedDate)}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-slate-900 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100"
        onClick={onPrevious}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/50"
        onClick={onToday}
        type="button"
      >
        <RefreshCw className="h-4 w-4" />
        Today
      </button>
      <button
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-slate-900 transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100"
        disabled={isToday}
        onClick={onNext}
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);
