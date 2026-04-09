import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/format";
import type { ServiceStatusSummary } from "@/types/domain";

const statusStyles = {
  good: {
    icon: CheckCircle2,
    badge: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-200",
  },
  upcoming: {
    icon: Clock3,
    badge: "bg-amber-100 text-amber-700",
    ring: "ring-amber-200",
  },
  overdue: {
    icon: AlertTriangle,
    badge: "bg-rose-100 text-rose-700",
    ring: "ring-rose-200",
  },
};

export const ServiceStatusCard = ({ status }: { status: ServiceStatusSummary }) => {
  const Icon = statusStyles[status.status].icon;

  return (
    <Card className={`ring-1 ${statusStyles[status.status].ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{status.componentName}</h3>
          <p className="mt-1 text-sm text-stone-500">
            Last serviced on {formatDate(status.lastServiceDate)} at {formatNumber(status.lastServiceOdometer)} km
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${statusStyles[status.status].badge}`}>
          <Icon className="h-4 w-4" />
          {status.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <p className="text-stone-500">Next due km</p>
          <p className="mt-1 font-semibold text-stone-900">{formatNumber(status.nextDueOdometer)} km</p>
        </div>
        <div>
          <p className="text-stone-500">Next due date</p>
          <p className="mt-1 font-semibold text-stone-900">{formatDate(status.nextDueDate)}</p>
        </div>
        <div>
          <p className="text-stone-500">Km balance</p>
          <p className={`mt-1 font-semibold ${status.kmRemaining <= 0 ? "text-rose-600" : "text-stone-900"}`}>
            {formatNumber(Math.abs(status.kmRemaining))} km {status.kmRemaining <= 0 ? "over" : "left"}
          </p>
        </div>
        <div>
          <p className="text-stone-500">Time balance</p>
          <p className={`mt-1 font-semibold ${status.daysRemaining <= 0 ? "text-rose-600" : "text-stone-900"}`}>
            {Math.abs(status.daysRemaining)} days {status.daysRemaining <= 0 ? "over" : "left"}
          </p>
        </div>
      </div>
    </Card>
  );
};
