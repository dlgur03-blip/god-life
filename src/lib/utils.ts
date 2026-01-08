import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DateStatus = 'today' | 'past' | 'future';

export function getDateStatus(dateStr: string): DateStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateStr + 'T00:00:00');
  targetDate.setHours(0, 0, 0, 0);

  const todayTime = today.getTime();
  const targetTime = targetDate.getTime();

  if (targetTime === todayTime) return 'today';
  if (targetTime < todayTime) return 'past';
  return 'future';
}

export type EpistleDateAccess = 'past' | 'today' | 'tomorrow' | 'blocked';

export function getEpistleDateAccess(dateStr: string): EpistleDateAccess {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateStr + 'T00:00:00');
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'past';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  return 'blocked';
}

export function getYesterdayStr(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}
