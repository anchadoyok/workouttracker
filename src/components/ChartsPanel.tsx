import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Surface } from "@/components/Surface";
import type { ChartDatum } from "@/types/workout";

export const ChartsPanel = ({
  weeklyData,
  monthlyData,
}: {
  weeklyData: ChartDatum[];
  monthlyData: ChartDatum[];
}) => (
  <div className="grid gap-4 xl:grid-cols-2">
    <Surface>
      <div className="mb-4">
        <p className="text-sm font-semibold text-muted">Weekly bar chart</p>
        <h3 className="font-display text-2xl font-bold">Mon-Sun completions</h3>
      </div>
      <div className="h-60">
        <ResponsiveContainer
          height="100%"
          width="100%"
        >
          <BarChart data={weeklyData}>
            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.16)"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={26}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                background: "rgba(15, 23, 42, 0.9)",
              }}
              formatter={(value: number) => [`${value} sessions`, "Completed"]}
              labelFormatter={(label, payload) => `${label} ${payload?.[0]?.payload?.meta ?? ""}`}
            />
            <Bar
              dataKey="value"
              fill="#6476f7"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Surface>

    <Surface>
      <div className="mb-4">
        <p className="text-sm font-semibold text-muted">Monthly bar chart</p>
        <h3 className="font-display text-2xl font-bold">Last 4 weeks</h3>
      </div>
      <div className="h-60">
        <ResponsiveContainer
          height="100%"
          width="100%"
        >
          <BarChart data={monthlyData}>
            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.16)"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={26}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                background: "rgba(15, 23, 42, 0.9)",
              }}
              formatter={(value: number) => [`${value} sessions`, "Completed"]}
              labelFormatter={(label, payload) => `${label} ${payload?.[0]?.payload?.meta ?? ""}`}
            />
            <Bar
              dataKey="value"
              fill="#12b172"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Surface>
  </div>
);
