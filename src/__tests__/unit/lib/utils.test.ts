import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getDateStatus, getEpistleDateAccess, getYesterdayStr, cn } from '@/lib/utils'

describe('utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-08T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    })

    it('merges tailwind classes correctly', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })

  describe('getDateStatus', () => {
    it('returns "today" for current date', () => {
      expect(getDateStatus('2026-01-08')).toBe('today')
    })

    it('returns "past" for past dates', () => {
      expect(getDateStatus('2026-01-07')).toBe('past')
      expect(getDateStatus('2025-12-31')).toBe('past')
    })

    it('returns "future" for future dates', () => {
      expect(getDateStatus('2026-01-09')).toBe('future')
      expect(getDateStatus('2026-02-01')).toBe('future')
    })
  })

  describe('getEpistleDateAccess', () => {
    it('returns "past" for yesterday', () => {
      expect(getEpistleDateAccess('2026-01-07')).toBe('past')
    })

    it('returns "today" for today', () => {
      expect(getEpistleDateAccess('2026-01-08')).toBe('today')
    })

    it('returns "blocked" for tomorrow', () => {
      expect(getEpistleDateAccess('2026-01-09')).toBe('blocked')
    })

    it('returns "blocked" for future dates', () => {
      expect(getEpistleDateAccess('2026-01-10')).toBe('blocked')
      expect(getEpistleDateAccess('2026-02-01')).toBe('blocked')
    })
  })
})

// Separate describe block for getYesterdayStr to avoid fake timer issues
describe('getYesterdayStr', () => {
  it('returns a valid date format', () => {
    const result = getYesterdayStr('2026-01-08')
    // Should match YYYY-MM-DD format
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('decrements the date correctly', () => {
    // Use a mid-year date to avoid timezone edge cases at year/month boundaries
    const inputDate = new Date('2026-06-15T00:00:00')
    inputDate.setDate(inputDate.getDate() - 1)
    const expectedStr = inputDate.toISOString().split('T')[0]
    const result = getYesterdayStr('2026-06-15')
    expect(result).toBe(expectedStr)
  })

  it('produces consistent results', () => {
    // Calling it multiple times with same input should give same result
    const result1 = getYesterdayStr('2026-06-15')
    const result2 = getYesterdayStr('2026-06-15')
    expect(result1).toBe(result2)
  })
})
