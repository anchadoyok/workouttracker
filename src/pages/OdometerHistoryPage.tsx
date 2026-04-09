import { useState } from "react";

import { OdometerChart } from "@/components/charts/OdometerChart";
import { OdometerForm } from "@/components/forms/OdometerForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import type { OdometerRecord } from "@/types/domain";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/format";

export const OdometerHistoryPage = () => {
  const {
    selectedMotorcycle,
    selectedOdometerRecords,
    selectedLogs,
    averageDailyKm,
    projectedMonthlyDistance,
    createOdometerRecord,
    updateOdometerRecord,
    deleteOdometerRecord,
    isSaving,
  } = useAppData();
  const [editingRecord, setEditingRecord] = useState<OdometerRecord | undefined>();
  const [isAdding, setIsAdding] = useState(false);

  if (!selectedMotorcycle) {
    return (
      <EmptyState
        title="Select a motorcycle"
        description="Choose a motorcycle first to review its odometer timeline and riding distance estimates."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Odometer history"
        description="Manual odometer check-ins sharpen service forecasts when service visits are sparse."
        action={
          <Button
            variant={isAdding ? "secondary" : "primary"}
            onClick={() => {
              setIsAdding((current) => !current);
              setEditingRecord(undefined);
            }}
          >
            {isAdding ? "Close form" : "Add odometer record"}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm text-stone-500">Average daily distance</p>
          <p className="mt-2 text-2xl font-bold text-stone-950">
            {averageDailyKm ? `${formatNumber(Math.round(averageDailyKm))} km/day` : "Not enough data"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Estimated monthly distance</p>
          <p className="mt-2 text-2xl font-bold text-stone-950">
            {projectedMonthlyDistance ? `${formatNumber(projectedMonthlyDistance)} km/month` : "Not enough data"}
          </p>
        </Card>
      </div>

      <OdometerChart records={selectedOdometerRecords} serviceLogs={selectedLogs} />

      {isAdding || editingRecord ? (
        <OdometerForm
          record={editingRecord}
          isSaving={isSaving}
          onCancel={() => {
            setEditingRecord(undefined);
            setIsAdding(false);
          }}
          onSubmit={async (values) => {
            if (editingRecord) {
              await updateOdometerRecord(editingRecord.id, values);
            } else {
              await createOdometerRecord(values);
            }
            setEditingRecord(undefined);
            setIsAdding(false);
          }}
        />
      ) : null}

      {selectedOdometerRecords.length === 0 ? (
        <EmptyState
          title="No odometer history yet"
          description="Add periodic odometer snapshots to improve forecasts between service visits."
        />
      ) : (
        <div className="space-y-4">
          {selectedOdometerRecords.map((record) => (
            <Card key={record.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">{formatNumber(record.odometer)} km</h3>
                  <p className="text-sm text-stone-500">{formatDate(record.recordedAt)}</p>
                  {record.notes ? <p className="mt-2 text-sm text-stone-600">{record.notes}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditingRecord(record)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-rose-600" onClick={() => void deleteOdometerRecord(record.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
