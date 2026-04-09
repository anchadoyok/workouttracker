import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/hooks/useAppData";

export const MotorcycleSettingsPage = () => {
  const navigate = useNavigate();
  const { selectedMotorcycle, selectedComponents, updateServiceComponent } = useAppData();

  if (!selectedMotorcycle) {
    return (
      <EmptyState
        title="Select a motorcycle"
        description="Settings are motorcycle-specific, so choose a bike before editing intervals and identifiers."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Motorcycle settings"
        description="Edit bike metadata and tune service intervals per component for real-world commuting conditions."
        action={
          <Button variant="secondary" onClick={() => navigate(`/motorcycles/${selectedMotorcycle.id}/edit`)}>
            Edit motorcycle details
          </Button>
        }
      />

      <Card className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-stone-500">Plate number</p>
          <p className="mt-1 font-semibold text-stone-950">{selectedMotorcycle.plateNumber}</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Engine number</p>
          <p className="mt-1 font-semibold text-stone-950">{selectedMotorcycle.engineNumber}</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Chassis number</p>
          <p className="mt-1 font-semibold text-stone-950">{selectedMotorcycle.chassisNumber}</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Powertrain</p>
          <p className="mt-1 font-semibold text-stone-950">
            {selectedMotorcycle.fuelType} / {selectedMotorcycle.transmission}
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        {selectedComponents.map((component) => (
          <Card key={component.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">{component.name}</h3>
                <p className="mt-1 text-sm text-stone-500">{component.notes || "No notes"}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium text-stone-700">
                  Km interval
                  <input
                    type="number"
                    defaultValue={component.kmInterval}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
                    onBlur={(event) =>
                      void updateServiceComponent({
                        ...component,
                        kmInterval: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Time interval (days)
                  <input
                    type="number"
                    defaultValue={component.timeIntervalDays}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
                    onBlur={(event) =>
                      void updateServiceComponent({
                        ...component,
                        timeIntervalDays: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Warning threshold (km)
                  <input
                    type="number"
                    defaultValue={component.warningThreshold}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
                    onBlur={(event) =>
                      void updateServiceComponent({
                        ...component,
                        warningThreshold: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
