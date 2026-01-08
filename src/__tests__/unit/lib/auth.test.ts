import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isAdmin, getAdminEmails } from '@/lib/auth'

describe('auth utils', () => {
  const originalEnv = process.env.ADMIN_EMAILS

  beforeEach(() => {
    vi.stubEnv('ADMIN_EMAILS', 'admin@example.com,dlgur03@gmail.com')
  })

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.ADMIN_EMAILS = originalEnv
    } else {
      delete process.env.ADMIN_EMAILS
    }
  })

  describe('getAdminEmails', () => {
    it('parses comma-separated admin emails', () => {
      const emails = getAdminEmails()
      expect(emails).toContain('admin@example.com')
      expect(emails).toContain('dlgur03@gmail.com')
    })

    it('trims whitespace from emails', () => {
      vi.stubEnv('ADMIN_EMAILS', ' admin@example.com , test@example.com ')
      const emails = getAdminEmails()
      expect(emails).toContain('admin@example.com')
      expect(emails).toContain('test@example.com')
    })

    it('returns empty array when ADMIN_EMAILS is not set', () => {
      vi.stubEnv('ADMIN_EMAILS', '')
      const emails = getAdminEmails()
      expect(emails).toEqual([])
    })
  })

  describe('isAdmin', () => {
    it('returns true for admin emails', () => {
      expect(isAdmin('admin@example.com')).toBe(true)
      expect(isAdmin('dlgur03@gmail.com')).toBe(true)
    })

    it('returns false for non-admin emails', () => {
      expect(isAdmin('user@example.com')).toBe(false)
      expect(isAdmin('random@test.com')).toBe(false)
    })

    it('returns false for null or undefined email', () => {
      expect(isAdmin(null)).toBe(false)
      expect(isAdmin(undefined)).toBe(false)
    })

    it('is case insensitive', () => {
      expect(isAdmin('ADMIN@EXAMPLE.COM')).toBe(true)
      expect(isAdmin('Admin@Example.Com')).toBe(true)
    })
  })
})
