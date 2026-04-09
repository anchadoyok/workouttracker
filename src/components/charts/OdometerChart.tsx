import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card";
import type { OdometerRecord, ServiceLog } from "@/types/domain";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/format";

export const OdometerChart = ({
  records,
  serviceLogs,
}: {
  records: OdometerRecord[];
  serviceLogs: ServiceLog[];
}) => {
  const data = [
    ...records.map((record) => ({
      date: record.recordedAt,
      odometer: record.odometer,
      source: "record",
    })),
    ...serviceLogs.map((log) => ({
      date: log.serviceDate,
      odometer: log.odometer,
      source: "service",
    })),
  ]
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(-12);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-stone-950">Odometer trend</h3>
        <p className="text-sm text-stone-500">Combined view of manual odometer inputs and service visits.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="odometerGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#416f47" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#416f47" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e7e5e4" strokeDasharray="4 4" />
            <XAxis dataKey="date" tickFormatter={(value: string) => formatDate(value, "")} />
            <YAxis tickFormatter={(value: number) => formatNumber(value)} />
            <Tooltip
              formatter={(value: number) => [`${formatNumber(value)} km`, "Odometer"]}
              labelFormatter={(value: string) => formatDate(value)}
            />
            <Area
              dataKey="odometer"
              stroke="#416f47"
              fill="url(#odometerGradient)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
