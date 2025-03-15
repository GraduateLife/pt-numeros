import { clsx, type ClassValue } from "clsx";
import {
  formatDuration,
  intervalToDuration,
  isSameDay,
  isSameWeek,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PrimitiveType = string | number | boolean;

export const hm = (value: number) => {
  const duration = intervalToDuration({
    start: 0,
    end: value * 60 * 1000,
  });
  return formatDuration(duration, {
    format: ["hours", "minutes"],
    delimiter: "",
    zero: false,
  })
    .replace(/ hours?/, "h")
    .replace(/ minutes?/, "m");
};

export const MMMDotDD = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month}.${day}`;
};

export const toWeekDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString("pt-BR", { weekday: "short" });
};

export const isToday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return isSameDay(date, new Date());
};
export const isThisWeek = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return isSameWeek(date, new Date());
};
