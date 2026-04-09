import { differenceInCalendarDays, parseISO } from "date-fns";

import type { OdometerRecord, ServiceLog } from "@/types/domain";

export const getCurrentOdometer = (
  records: OdometerRecord[],
  serviceLogs: ServiceLog[],
) => {
  const recordMax = records.reduce((max, record) => Math.max(max, record.odometer), 0);
  const logMax = serviceLogs.reduce((max, log) => Math.max(max, log.odometer), 0);
  return Math.max(recordMax, logMax);
};

export const getAverageDailyDistance = (
  records: OdometerRecord[],
  serviceLogs: ServiceLog[],
) => {
  const combined = [
    ...records.map((record) => ({
      date: record.recordedAt,
      odometer: record.odometer,
    })),
    ...serviceLogs.map((log) => ({
      date: log.serviceDate,
      odometer: log.odometer,
    })),
  ]
    .sort((left, right) => left.date.localeCompare(right.date))
    .filter((item, index, array) =>
      index === 0 || item.date !== array[index - 1].date || item.odometer !== array[index - 1].odometer,
    );

  if (combined.length < 2) {
    return null;
  }

  const first = combined[0];
  const last = combined[combined.length - 1];
  const days = Math.max(differenceInCalendarDays(parseISO(last.date), parseISO(first.date)), 0);

  if (days < 1 || last.odometer <= first.odometer) {
    return null;
  }

  return (last.odometer - first.odometer) / days;
};
