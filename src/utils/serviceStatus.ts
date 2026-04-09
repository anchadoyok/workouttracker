import { addDays, differenceInCalendarDays, parseISO } from "date-fns";

import type {
  Motorcycle,
  OdometerRecord,
  ServiceComponent,
  ServiceLog,
  ServiceStatusSummary,
} from "@/types/domain";
import { getCurrentOdometer } from "@/utils/odometer";

interface Baseline {
  date: string;
  odometer: number;
}

const getBaseline = (
  motorcycle: Motorcycle,
  component: ServiceComponent,
  serviceLogs: ServiceLog[],
  odometerRecords: OdometerRecord[],
): Baseline => {
  const relevantLog = serviceLogs
    .filter((log) => log.componentIds.includes(component.id))
    .sort((left, right) => right.serviceDate.localeCompare(left.serviceDate))[0];

  if (relevantLog) {
    return {
      date: relevantLog.serviceDate,
      odometer: relevantLog.odometer,
    };
  }

  const firstRecord = [...odometerRecords].sort((left, right) => left.recordedAt.localeCompare(right.recordedAt))[0];
  return {
    date: firstRecord?.recordedAt ?? motorcycle.createdAt,
    odometer: firstRecord?.odometer ?? 0,
  };
};

const getTimeWarningDays = (component: ServiceComponent) => {
  if (!component.timeIntervalDays || !component.kmInterval) {
    return Math.min(component.warningThreshold, component.timeIntervalDays);
  }

  const ratio = component.warningThreshold / component.kmInterval;
  return Math.round(component.timeIntervalDays * ratio);
};

export const calculateComponentStatus = (
  motorcycle: Motorcycle,
  component: ServiceComponent,
  serviceLogs: ServiceLog[],
  odometerRecords: OdometerRecord[],
  today = new Date(),
): ServiceStatusSummary => {
  const baseline = getBaseline(motorcycle, component, serviceLogs, odometerRecords);
  const baselineDate = parseISO(baseline.date);
  const currentOdometer = getCurrentOdometer(odometerRecords, serviceLogs);
  const nextDueOdometer = baseline.odometer + component.kmInterval;
  const nextDueDate = addDays(baselineDate, component.timeIntervalDays);
  const kmRemaining = nextDueOdometer - currentOdometer;
  const daysRemaining = differenceInCalendarDays(nextDueDate, today);
  const timeWarningDays = getTimeWarningDays(component);

  let status: ServiceStatusSummary["status"] = "good";
  if (kmRemaining <= 0 || daysRemaining <= 0) {
    status = "overdue";
  } else if (kmRemaining <= component.warningThreshold || daysRemaining <= timeWarningDays) {
    status = "upcoming";
  }

  return {
    componentId: component.id,
    componentName: component.name,
    lastServiceDate: baseline.date,
    lastServiceOdometer: baseline.odometer,
    nextDueDate: nextDueDate.toISOString(),
    nextDueOdometer,
    currentOdometer,
    daysRemaining,
    kmRemaining,
    status,
    warningThreshold: component.warningThreshold,
  };
};

export const buildDashboardStatuses = (
  motorcycle: Motorcycle | undefined,
  components: ServiceComponent[],
  serviceLogs: ServiceLog[],
  odometerRecords: OdometerRecord[],
) => {
  if (!motorcycle) {
    return [];
  }

  return components.map((component) =>
    calculateComponentStatus(motorcycle, component, serviceLogs, odometerRecords),
  );
};
