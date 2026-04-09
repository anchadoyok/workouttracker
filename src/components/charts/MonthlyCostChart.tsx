import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

import { Card } from "@/components/ui/Card";
import type { ServiceLog } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

export const MonthlyCostChart = ({ serviceLogs }: { serviceLogs: ServiceLog[] }) => {
  const grouped = new Map<string, number>();

  serviceLogs.forEach((log) => {
    const monthKey = format(parseISO(log.serviceDate), "MMM yy");
    grouped.set(monthKey, (grouped.get(monthKey) ?? 0) + log.cost);
  });

  const data = Array.from(grouped.entries()).map(([month, total]) => ({ month, total })).slice(-6);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-stone-950">Maintenance cost trend</h3>
        <p className="text-sm text-stone-500">Six most recent months of maintenance spending.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e7e5e4" strokeDasharray="4 4" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#41899a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
