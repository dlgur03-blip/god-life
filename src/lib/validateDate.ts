import { getTodayStr } from './date';

/**
 * Validates a date string is in YYYY-MM-DD format and is a valid date
 * @param dateStr - Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDateParam(dateStr: string): boolean {
  // Check format: YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return false;
  }

  // Check if it's a real date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Verify the date string matches (catches invalid dates like 2024-02-31)
  return date.toISOString().split('T')[0] === dateStr;
}

/**
 * Returns the date string if valid, or today's date if invalid
 */
export function getValidDateOrToday(dateStr: string, timezone?: string): string {
  return isValidDateParam(dateStr) ? dateStr : getTodayStr(timezone);
}
