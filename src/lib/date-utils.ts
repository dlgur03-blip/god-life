/**
 * Date accessibility utilities for epistle module
 * Uses user's timezone parameter
 */

import { getTodayStr } from './date';

export type DateAccessStatus = 'past' | 'today' | 'future';

export type SupportedLocale = 'en' | 'ko' | 'ja';

export interface AdaptiveWeekDate {
  date: string;      // YYYY-MM-DD format
  dayLabel: string;  // 요일 라벨 (Mon, 월, 月)
  dateLabel: string; // 날짜 라벨 (1/8)
  isToday: boolean;
}

/**
 * 주어진 시작일부터 7일간의 날짜 배열을 반환합니다.
 * @param startDate - 시작 날짜 (YYYY-MM-DD 형식). 기본값은 오늘.
 * @param locale - 로케일 ('en' | 'ko' | 'ja')
 * @param timezone - 타임존
 * @returns AdaptiveWeekDate 배열
 */
export function getAdaptiveWeekDates(
  startDate: string | null = null,
  locale: SupportedLocale = 'ko',
  timezone?: string
): AdaptiveWeekDate[] {
  const todayStr = getTodayStr(timezone);
  const start = startDate || todayStr;

  const dayNames: Record<SupportedLocale, string[]> = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ko: ['일', '월', '화', '수', '목', '금', '토'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  };

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start + 'T00:00:00');
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[locale][d.getDay()];
    const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;

    return {
      date: dateStr,
      dayLabel,
      dateLabel,
      isToday: dateStr === todayStr,
    };
  });
}

/**
 * 주간 범위 라벨을 생성합니다.
 * 예: '1/8 (목) ~ 1/14 (수)'
 * @param startDate - 시작 날짜 (YYYY-MM-DD 형식)
 * @param locale - 로케일 ('en' | 'ko' | 'ja')
 * @returns 포맷된 주간 범위 문자열
 */
export function getWeekRangeLabel(
  startDate: string,
  locale: SupportedLocale = 'ko'
): string {
  const dayNames: Record<SupportedLocale, string[]> = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ko: ['일', '월', '화', '수', '목', '금', '토'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  };

  const startD = new Date(startDate + 'T00:00:00');
  const endD = new Date(startDate + 'T00:00:00');
  endD.setDate(endD.getDate() + 6);

  const startLabel = `${startD.getMonth() + 1}/${startD.getDate()}`;
  const endLabel = `${endD.getMonth() + 1}/${endD.getDate()}`;
  const startDayLabel = dayNames[locale][startD.getDay()];
  const endDayLabel = dayNames[locale][endD.getDay()];

  return `${startLabel} (${startDayLabel}) ~ ${endLabel} (${endDayLabel})`;
}

/**
 * 주어진 날짜에서 n주 전/후의 날짜를 반환합니다.
 * @param baseDate - 기준 날짜 (YYYY-MM-DD 형식)
 * @param weekOffset - 주 오프셋 (-1: 이전 주, 1: 다음 주)
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function getWeekOffsetDate(baseDate: string, weekOffset: number): string {
  const d = new Date(baseDate + 'T00:00:00');
  d.setDate(d.getDate() + (weekOffset * 7));
  return d.toISOString().split('T')[0];
}

/**
 * Check if a date is accessible for writing (only today is accessible)
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param timezone - User's timezone
 * @returns boolean - true only if the date is today
 */
export function isDateAccessible(dateStr: string, timezone?: string): boolean {
  const today = getTodayStr(timezone);
  return dateStr === today;
}

/**
 * Get the access status of a date relative to today
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param timezone - User's timezone
 * @returns DateAccessStatus - 'past' | 'today' | 'future'
 */
export function getDateAccessStatus(dateStr: string, timezone?: string): DateAccessStatus {
  const today = getTodayStr(timezone);

  if (dateStr === today) return 'today';
  if (dateStr < today) return 'past';
  return 'future';
}
