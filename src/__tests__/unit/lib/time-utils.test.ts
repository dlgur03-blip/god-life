import { describe, it, expect } from 'vitest'
import { timeToMinutes, minutesToTime, snapToIncrement, validateResize, calculateNewTime } from '@/lib/time-utils'

describe('time-utils', () => {
  describe('timeToMinutes', () => {
    it('converts HH:MM to minutes correctly', () => {
      expect(timeToMinutes('00:00')).toBe(0)
      expect(timeToMinutes('14:30')).toBe(870)
      expect(timeToMinutes('23:59')).toBe(1439)
      expect(timeToMinutes('24:00')).toBe(1440)
    })

    it('handles edge cases', () => {
      expect(timeToMinutes('01:00')).toBe(60)
      expect(timeToMinutes('12:00')).toBe(720)
    })
  })

  describe('minutesToTime', () => {
    it('converts minutes to HH:MM correctly', () => {
      expect(minutesToTime(0)).toBe('00:00')
      expect(minutesToTime(870)).toBe('14:30')
      expect(minutesToTime(1440)).toBe('24:00')
    })

    it('pads single digit hours and minutes', () => {
      expect(minutesToTime(65)).toBe('01:05')
      expect(minutesToTime(9)).toBe('00:09')
    })

    it('clamps values to valid range', () => {
      expect(minutesToTime(-10)).toBe('00:00')
      expect(minutesToTime(1500)).toBe('24:00')
    })
  })

  describe('snapToIncrement', () => {
    it('snaps to 5-minute increments by default', () => {
      expect(snapToIncrement(873)).toBe(875)
      expect(snapToIncrement(872)).toBe(870)
      expect(snapToIncrement(0)).toBe(0)
      expect(snapToIncrement(1440)).toBe(1440)
    })

    it('snaps to custom increments', () => {
      expect(snapToIncrement(873, 10)).toBe(870)
      expect(snapToIncrement(876, 10)).toBe(880)
      expect(snapToIncrement(100, 15)).toBe(105)
    })
  })

  describe('calculateNewTime', () => {
    it('calculates new time based on delta', () => {
      // With 1 pixel per minute
      const result = calculateNewTime('10:00', 30, 1, 'bottom')
      expect(result).toBe('10:30')
    })

    it('handles negative delta', () => {
      const result = calculateNewTime('10:30', -30, 1, 'top')
      expect(result).toBe('10:00')
    })
  })

  describe('validateResize', () => {
    const blocks = [
      { id: '1', startTime: '08:00', endTime: '09:00' },
      { id: '2', startTime: '10:00', endTime: '11:00' }
    ]

    it('returns valid for non-overlapping resize', () => {
      const result = validateResize('bottom', '09:30', '08:00', '09:00', blocks, '1')
      expect(result.valid).toBe(true)
    })

    it('returns invalid for minimum duration violation', () => {
      const result = validateResize('bottom', '08:02', '08:00', '09:00', blocks, '1')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('minimum_duration')
    })

    it('returns invalid for boundary violation', () => {
      const result = validateResize('bottom', '24:30', '23:00', '24:00', blocks, '1')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('boundary')
    })

    it('returns invalid for overlap', () => {
      const result = validateResize('bottom', '10:30', '08:00', '09:00', blocks, '1')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('overlap')
    })
  })
})
