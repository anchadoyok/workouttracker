import { useMemo } from "react";

import { useAppStore } from "@/store/appStore";
import { buildDashboardStatuses } from "@/utils/serviceStatus";
import { getAverageDailyDistance, getCurrentOdometer } from "@/utils/odometer";

export const useAppData = () => {
  const store = useAppStore();

  const selectedMotorcycle = useMemo(
    () => store.motorcycles.find((motorcycle) => motorcycle.id === store.selectedMotorcycleId),
    [store.motorcycles, store.selectedMotorcycleId],
  );

  const selectedComponents = useMemo(
    () => store.serviceComponents.filter((component) => component.motorcycleId === store.selectedMotorcycleId),
    [store.serviceComponents, store.selectedMotorcycleId],
  );

  const selectedLogs = useMemo(
    () =>
      store.serviceLogs
        .filter((log) => log.motorcycleId === store.selectedMotorcycleId)
        .sort((left, right) => right.serviceDate.localeCompare(left.serviceDate)),
    [store.serviceLogs, store.selectedMotorcycleId],
  );

  const selectedOdometerRecords = useMemo(
    () =>
      store.odometerRecords
        .filter((record) => record.motorcycleId === store.selectedMotorcycleId)
        .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt)),
    [store.odometerRecords, store.selectedMotorcycleId],
  );

  const dashboardStatuses = useMemo(
    () => buildDashboardStatuses(selectedMotorcycle, selectedComponents, selectedLogs, selectedOdometerRecords),
    [selectedMotorcycle, selectedComponents, selectedLogs, selectedOdometerRecords],
  );

  const currentOdometer = useMemo(
    () => getCurrentOdometer(selectedOdometerRecords, selectedLogs),
    [selectedOdometerRecords, selectedLogs],
  );

  const averageDailyKm = useMemo(
    () => getAverageDailyDistance(selectedOdometerRecords, selectedLogs),
    [selectedOdometerRecords, selectedLogs],
  );

  return {
    ...store,
    selectedMotorcycle,
    selectedComponents,
    selectedLogs,
    selectedOdometerRecords,
    dashboardStatuses,
    currentOdometer,
    averageDailyKm,
    projectedMonthlyDistance: averageDailyKm ? Math.round(averageDailyKm * 30) : null,
  };
};
