// Error codes that map to translation keys
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'USER_NOT_FOUND'
  | 'MISSING_FIELDS'
  | 'MAX_RULES_REACHED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'DATE_NOT_TODAY'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'UPLOAD_FAILED'
  | 'FORBIDDEN'
  | 'ADMIN_ONLY'
  | 'SLUG_TAKEN'
  | 'INVALID_SLUG_FORMAT'
  | 'POST_NOT_FOUND'
  | 'SELF_DELETE_NOT_ALLOWED'
  | 'USER_NOT_FOUND_FOR_DELETE'
  | 'ERROR_LOG_NOT_FOUND'
  | 'INVALID_DATE_RANGE'
  | 'INVALID_BLOCK_ID'
  | 'BLOCK_NOT_FOUND'
  | 'INVALID_TIME_RANGE'
  | 'TIME_OVERLAP'
  | 'DATABASE_ERROR'
  | 'UPDATE_FAILED'
  | 'OVERLAP_CHECK_FAILED'
  | 'UNEXPECTED_ERROR'
  | 'STORAGE_NOT_CONFIGURED'
  | 'INVALID_URL'
  | 'DELETE_FAILED'
  | 'GOAL_NOT_FOUND'
  | 'GOAL_CREATE_FAILED'
  | 'GOAL_UPDATE_FAILED'
  | 'GOAL_DELETE_FAILED'
  | 'INVALID_GOAL_PARENT'
  | 'INVALID_GOAL_TYPE_HIERARCHY'
  | 'UNKNOWN';

// Map error codes to translation keys under Common.errors
export const errorCodeToTranslationKey: Record<ErrorCode, string> = {
  UNAUTHORIZED: 'errors.unauthorized',
  USER_NOT_FOUND: 'errors.userNotFound',
  MISSING_FIELDS: 'errors.missingFields',
  MAX_RULES_REACHED: 'errors.maxRulesReached',
  NETWORK_ERROR: 'errors.networkError',
  SERVER_ERROR: 'errors.serverError',
  DATE_NOT_TODAY: 'errors.dateNotToday',
  INVALID_FILE_TYPE: 'errors.invalidFileType',
  FILE_TOO_LARGE: 'errors.fileTooLarge',
  UPLOAD_FAILED: 'errors.uploadFailed',
  FORBIDDEN: 'errors.forbidden',
  ADMIN_ONLY: 'errors.adminOnly',
  SLUG_TAKEN: 'errors.slugTaken',
  INVALID_SLUG_FORMAT: 'errors.invalidSlugFormat',
  POST_NOT_FOUND: 'errors.postNotFound',
  SELF_DELETE_NOT_ALLOWED: 'errors.selfDeleteNotAllowed',
  USER_NOT_FOUND_FOR_DELETE: 'errors.userNotFoundForDelete',
  ERROR_LOG_NOT_FOUND: 'errors.errorLogNotFound',
  INVALID_DATE_RANGE: 'errors.invalidDateRange',
  INVALID_BLOCK_ID: 'errors.invalidBlockId',
  BLOCK_NOT_FOUND: 'errors.blockNotFound',
  INVALID_TIME_RANGE: 'errors.invalidTimeRange',
  TIME_OVERLAP: 'errors.timeOverlap',
  DATABASE_ERROR: 'errors.databaseError',
  UPDATE_FAILED: 'errors.updateFailed',
  OVERLAP_CHECK_FAILED: 'errors.overlapCheckFailed',
  UNEXPECTED_ERROR: 'errors.unexpectedError',
  STORAGE_NOT_CONFIGURED: 'errors.storageNotConfigured',
  INVALID_URL: 'errors.invalidUrl',
  DELETE_FAILED: 'errors.deleteFailed',
  GOAL_NOT_FOUND: 'errors.goalNotFound',
  GOAL_CREATE_FAILED: 'errors.goalCreateFailed',
  GOAL_UPDATE_FAILED: 'errors.goalUpdateFailed',
  GOAL_DELETE_FAILED: 'errors.goalDeleteFailed',
  INVALID_GOAL_PARENT: 'errors.invalidGoalParent',
  INVALID_GOAL_TYPE_HIERARCHY: 'errors.invalidGoalTypeHierarchy',
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

// Error logging types and utility
export type ErrorLevel = 'error' | 'warning' | 'info';

export type LogErrorParams = {
  level: ErrorLevel;
  message: string;
  stack?: string;
  userId?: string;
  requestUrl?: string;
  requestMethod?: string;
};

const MAX_STACK_LENGTH = 5000;

export async function logError(params: LogErrorParams): Promise<void> {
  try {
    // Dynamic import to avoid circular dependency
    const { prisma } = await import('@/lib/prisma');
    const stack = params.stack?.slice(0, MAX_STACK_LENGTH);
    await prisma.errorLog.create({
      data: {
        level: params.level,
        message: params.message,
        stack,
        userId: params.userId,
        requestUrl: params.requestUrl,
        requestMethod: params.requestMethod,
      },
    });
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}
