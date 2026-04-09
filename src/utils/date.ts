import { addDays, format, isToday, parseISO } from "date-fns";

export const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

export const fromDateKey = (dateKey: string) => parseISO(dateKey);

export const formatDisplayDate = (date: Date) => format(date, "EEEE, d MMM");

export const formatCompactDate = (date: Date) => format(date, "EEE, d MMM");

export const formatLongDate = (date: Date) => format(date, "EEEE, d MMMM");

export const formatHourLabel = (hour: number) => format(new Date(2024, 0, 1, hour), "HH:mm");

export const shiftDate = (date: Date, amount: number) => addDays(date, amount);

export const isDateToday = (date: Date) => isToday(date);

export const formatDate = (value: Date | string, dateFormat = "d MMM yyyy") =>
  format(typeof value === "string" ? parseISO(value) : value, dateFormat);

export const toDateInputValue = (value?: Date | string | null) => {
  if (!value) {
    return "";
  }

  return format(typeof value === "string" ? parseISO(value) : value, "yyyy-MM-dd");
};
