import { DAILY_SLOT_COUNT } from "@/constants/workout";

export const ProgressRing = ({
  completed,
  target,
}: {
  completed: number;
  target: number;
}) => {
  const size = 188;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.round((completed / Math.max(target, 1)) * 100));
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-[188px] w-[188px] items-center justify-center">
      <svg
        className="-rotate-90"
        height={size}
        width={size}
      >
        <defs>
          <linearGradient
            id="workout-ring"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#6476f7"
            />
            <stop
              offset="50%"
              stopColor="#34d399"
            />
            <stop
              offset="100%"
              stopColor="#fb923c"
            />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--ring-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="url(#workout-ring)"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-4xl font-bold tracking-tight">{percentage}%</p>
        <p className="text-sm font-semibold text-muted">
          {completed}/{target} target
        </p>
        <p className="mt-1 text-xs text-muted">
          {completed}/{DAILY_SLOT_COUNT} full sessions logged
        </p>
      </div>
    </div>
  );
};
