import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isDateAccessible, getDateAccessStatus } from '@/lib/date-utils';

// Mock the date module
vi.mock('@/lib/date', () => ({
  getTodayStr: vi.fn(() => '2026-01-08')
}));

describe('date-utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-08T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isDateAccessible', () => {
    it('returns true for today', () => {
      expect(isDateAccessible('2026-01-08')).toBe(true);
    });

    it('returns false for yesterday', () => {
      expect(isDateAccessible('2026-01-07')).toBe(false);
    });

    it('returns false for tomorrow', () => {
      expect(isDateAccessible('2026-01-09')).toBe(false);
    });

    it('returns false for future dates', () => {
      expect(isDateAccessible('2026-01-15')).toBe(false);
    });
  });

  describe('getDateAccessStatus', () => {
    it('returns "today" for current date', () => {
      expect(getDateAccessStatus('2026-01-08')).toBe('today');
    });

    it('returns "past" for yesterday', () => {
      expect(getDateAccessStatus('2026-01-07')).toBe('past');
    });

    it('returns "future" for tomorrow', () => {
      expect(getDateAccessStatus('2026-01-09')).toBe('future');
    });

    it('returns "past" for old dates', () => {
      expect(getDateAccessStatus('2020-01-01')).toBe('past');
    });
  });
});
