import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { MonthlyCostChart } from "@/components/charts/MonthlyCostChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { formatDate } from "@/utils/date";
import { formatCurrency, formatNumber } from "@/utils/format";

export const ServiceLogPage = () => {
  const { selectedLogs, selectedMotorcycle, deleteServiceLog } = useAppData();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredLogs = useMemo(
    () =>
      selectedLogs.filter((log) => {
        if (startDate && log.serviceDate < startDate) {
          return false;
        }
        if (endDate && log.serviceDate > endDate) {
          return false;
        }
        return true;
      }),
    [selectedLogs, startDate, endDate],
  );

  const totalCost = filteredLogs.reduce((sum, log) => sum + log.cost, 0);

  if (!selectedMotorcycle) {
    return (
      <EmptyState
        title="Select a motorcycle"
        description="Service logs are filtered by motorcycle, so start by selecting one from the header."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service log"
        description="Newest-first maintenance history with component linkage, date filters, and spend summary."
        action={
          <Link to="/service-log/new">
            <Button>Add service entry</Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr,220px,220px]">
        <Card>
          <p className="text-sm text-stone-500">Total maintenance cost</p>
          <p className="mt-2 text-2xl font-bold text-stone-950">{formatCurrency(totalCost)}</p>
          <p className="mt-1 text-sm text-stone-500">{filteredLogs.length} entries in current filter</p>
        </Card>
        <Card>
          <label className="text-sm font-medium text-stone-700">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
            />
          </label>
        </Card>
        <Card>
          <label className="text-sm font-medium text-stone-700">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
            />
          </label>
        </Card>
      </div>

      <MonthlyCostChart serviceLogs={filteredLogs} />

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No service entries in this filter"
          description="Try widening the date range or add the first service entry for this motorcycle."
        />
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-950">{log.serviceType}</h3>
                    <p className="text-sm text-stone-500">
                      {formatDate(log.serviceDate)} at {formatNumber(log.odometer)} km
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                    <span className="rounded-full bg-stone-100 px-3 py-1">{log.workshop}</span>
                    {log.componentIds.length > 0 ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1">{log.componentIds.length} components linked</span>
                    ) : null}
                    {log.nextReminderDate ? (
                      <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-700">
                        Reminder {formatDate(log.nextReminderDate)}
                      </span>
                    ) : null}
                  </div>
                  {log.notes ? <p className="text-sm text-stone-600">{log.notes}</p> : null}
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <p className="text-lg font-semibold text-stone-950">{formatCurrency(log.cost)}</p>
                  <div className="flex gap-2">
                    <Link to={`/service-log/${log.id}/edit`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button variant="ghost" className="text-rose-600" onClick={() => void deleteServiceLog(log.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
