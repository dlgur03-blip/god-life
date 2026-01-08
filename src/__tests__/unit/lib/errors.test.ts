import { describe, it, expect } from 'vitest'
import { success, error, mapErrorToCode, errorCodeToTranslationKey } from '@/lib/errors'
import type { ActionResult, ErrorCode } from '@/lib/errors'

describe('errors', () => {
  describe('success', () => {
    it('creates success result', () => {
      const result = success({ data: 'test' })
      expect(result.success).toBe(true)
      expect((result as { success: true; data: { data: string } }).data).toEqual({ data: 'test' })
    })

    it('creates success result with various data types', () => {
      expect(success('string data').success).toBe(true)
      expect(success(123).success).toBe(true)
      expect(success(null).success).toBe(true)
      expect(success([1, 2, 3]).success).toBe(true)
    })
  })

  describe('error', () => {
    it('creates error result', () => {
      const result = error('UNAUTHORIZED')
      expect(result.success).toBe(false)
      expect((result as { success: false; error: ErrorCode }).error).toBe('UNAUTHORIZED')
    })

    it('creates error result with various error codes', () => {
      const codes: ErrorCode[] = ['USER_NOT_FOUND', 'MISSING_FIELDS', 'MAX_RULES_REACHED']
      codes.forEach(code => {
        const result = error(code)
        expect(result.success).toBe(false)
        expect((result as { success: false; error: ErrorCode }).error).toBe(code)
      })
    })
  })

  describe('type checking helpers', () => {
    it('success result can be type-checked', () => {
      const successResult: ActionResult<string> = success('data')
      const errorResult: ActionResult<string> = error('UNAUTHORIZED')

      expect(successResult.success).toBe(true)
      expect(errorResult.success).toBe(false)
    })
  })

  describe('mapErrorToCode', () => {
    it('maps known error messages to codes', () => {
      expect(mapErrorToCode('Unauthorized')).toBe('UNAUTHORIZED')
      expect(mapErrorToCode('User not found')).toBe('USER_NOT_FOUND')
      expect(mapErrorToCode('Missing fields')).toBe('MISSING_FIELDS')
      expect(mapErrorToCode('Max 13 rules allowed')).toBe('MAX_RULES_REACHED')
    })

    it('returns UNKNOWN for unmapped errors', () => {
      expect(mapErrorToCode('Some random error')).toBe('UNKNOWN')
      expect(mapErrorToCode('')).toBe('UNKNOWN')
    })
  })

  describe('errorCodeToTranslationKey', () => {
    it('has translation keys for all error codes', () => {
      const codes: ErrorCode[] = [
        'UNAUTHORIZED',
        'USER_NOT_FOUND',
        'MISSING_FIELDS',
        'MAX_RULES_REACHED',
        'NETWORK_ERROR',
        'SERVER_ERROR',
        'DATE_NOT_TODAY',
        'INVALID_FILE_TYPE',
        'FILE_TOO_LARGE',
        'UPLOAD_FAILED',
        'FORBIDDEN',
        'ADMIN_ONLY',
        'SLUG_TAKEN',
        'INVALID_SLUG_FORMAT',
        'POST_NOT_FOUND',
        'SELF_DELETE_NOT_ALLOWED',
        'USER_NOT_FOUND_FOR_DELETE',
        'ERROR_LOG_NOT_FOUND',
        'INVALID_DATE_RANGE',
        'UNKNOWN'
      ]

      codes.forEach(code => {
        expect(errorCodeToTranslationKey[code]).toBeDefined()
        expect(typeof errorCodeToTranslationKey[code]).toBe('string')
      })
    })

    it('translation keys follow expected format', () => {
      expect(errorCodeToTranslationKey.UNAUTHORIZED).toBe('errors.unauthorized')
      expect(errorCodeToTranslationKey.USER_NOT_FOUND).toBe('errors.userNotFound')
    })
  })
})
