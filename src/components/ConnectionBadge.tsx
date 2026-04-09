import { Cloud, CloudOff, RefreshCw, WifiOff } from "lucide-react";

import { cn } from "@/lib/cn";
import type { ConnectionStatus } from "@/types/workout";

const STATUS_META: Record<
  ConnectionStatus,
  {
    label: string;
    className: string;
    icon: typeof Cloud;
  }
> = {
  "config-missing": {
    label: "Config needed",
    className: "bg-slate-200/70 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200",
    icon: CloudOff,
  },
  connecting: {
    label: "Connecting",
    className: "bg-sunrise-100 text-sunrise-800 dark:bg-sunrise-900/40 dark:text-sunrise-200",
    icon: RefreshCw,
  },
  connected: {
    label: "Connected",
    className: "bg-mint-100 text-mint-800 dark:bg-mint-900/40 dark:text-mint-200",
    icon: Cloud,
  },
  syncing: {
    label: "Syncing",
    className: "bg-slateblue-100 text-slateblue-800 dark:bg-slateblue-900/40 dark:text-slateblue-100",
    icon: RefreshCw,
  },
  offline: {
    label: "Offline",
    className: "bg-sunrise-100 text-sunrise-800 dark:bg-sunrise-900/40 dark:text-sunrise-100",
    icon: WifiOff,
  },
  error: {
    label: "Error",
    className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-100",
    icon: CloudOff,
  },
};

export const ConnectionBadge = ({
  status,
  pendingCount,
}: {
  status: ConnectionStatus;
  pendingCount: number;
}) => {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold", meta.className)}>
      <Icon className={cn("h-3.5 w-3.5", status === "syncing" && "animate-spin")} />
      <span>{meta.label}</span>
      {pendingCount > 0 ? <span className="rounded-full bg-white/60 px-1.5 py-0.5 dark:bg-black/20">{pendingCount}</span> : null}
    </div>
  );
};
