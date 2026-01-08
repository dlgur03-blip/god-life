// Error codes that map to translation keys
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'USER_NOT_FOUND'
  | 'MISSING_FIELDS'
  | 'MAX_RULES_REACHED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

// Map error codes to translation keys under Common.errors
export const errorCodeToTranslationKey: Record<ErrorCode, string> = {
  UNAUTHORIZED: 'errors.unauthorized',
  USER_NOT_FOUND: 'errors.userNotFound',
  MISSING_FIELDS: 'errors.missingFields',
  MAX_RULES_REACHED: 'errors.maxRulesReached',
  NETWORK_ERROR: 'errors.networkError',
  SERVER_ERROR: 'errors.serverError',
  UNKNOWN: 'errors.unknown'
};

// Standard action result type for server actions
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: ErrorCode };

// Helper to create success result
export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

// Helper to create error result
export function error(code: ErrorCode): ActionResult<never> {
  return { success: false, error: code };
}

// Map legacy error messages to error codes
export function mapErrorToCode(errorMessage: string): ErrorCode {
  const errorMap: Record<string, ErrorCode> = {
    'Unauthorized': 'UNAUTHORIZED',
    'User not found': 'USER_NOT_FOUND',
    'Missing fields': 'MISSING_FIELDS',
    'Max 13 rules allowed': 'MAX_RULES_REACHED'
  };
  return errorMap[errorMessage] || 'UNKNOWN';
}
