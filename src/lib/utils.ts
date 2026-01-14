import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getTodayStr, DEFAULT_TIMEZONE } from "./date"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DateStatus = 'today' | 'past' | 'future';

export function getDateStatus(dateStr: string, timezone?: string): DateStatus {
  const today = getTodayStr(timezone);

  if (dateStr === today) return 'today';
  if (dateStr < today) return 'past';
  return 'future';
}

export type EpistleDateAccess = 'past' | 'today' | 'blocked';

export function getEpistleDateAccess(dateStr: string, timezone?: string): EpistleDateAccess {
  const today = getTodayStr(timezone);

  if (dateStr === today) return 'today';
  if (dateStr < today) return 'past';
  return 'blocked';
}

export function getYesterdayStr(dateStr: string, timezone?: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString('en-CA', { timeZone: timezone || DEFAULT_TIMEZONE });
}
