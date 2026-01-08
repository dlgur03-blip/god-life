// Existing functions remain unchanged for internal date operations (YYYY-MM-DD format)
export function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
}

// NEW: Locale-aware display formatting
type SupportedLocale = 'en' | 'ko' | 'ja';

// Format date for display (e.g., "January 15, 2026" in en, "2026년 1월 15일" in ko)
export function formatDateDisplay(date: Date | string, locale: SupportedLocale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(getLocaleCode(locale), {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date short (e.g., "Jan 15" in en, "1월 15일" in ko)
export function formatDateShort(date: Date | string, locale: SupportedLocale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(getLocaleCode(locale), {
    timeZone: 'Asia/Seoul',
    month: 'short',
    day: 'numeric'
  });
}

// Format time for display (e.g., "14:30" in 24h format or locale-appropriate)
export function formatTimeDisplay(date: Date | string, locale: SupportedLocale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(getLocaleCode(locale), {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en' // 12-hour for English, 24-hour for ko/ja
  });
}

// Format datetime for display
export function formatDateTimeDisplay(date: Date | string, locale: SupportedLocale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(getLocaleCode(locale), {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en'
  });
}

// Format relative date (e.g., "2 days ago")
export function formatRelativeDate(date: Date | string, locale: SupportedLocale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(getLocaleCode(locale), { numeric: 'auto' });

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return rtf.format(-diffMins, 'minute');
    }
    return rtf.format(-diffHours, 'hour');
  }
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
}

// Helper: Map app locale to Intl locale code
function getLocaleCode(locale: SupportedLocale): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    ko: 'ko-KR',
    ja: 'ja-JP'
  };
  return localeMap[locale];
}
