'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ErrorCode } from '@/lib/errors';
import { errorCodeToTranslationKey } from '@/lib/errors';

type ErrorAlertProps = {
  error?: ErrorCode | string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
};

export default function ErrorAlert({ error, message, onDismiss, className }: ErrorAlertProps) {
  const t = useTranslations('Common');

  if (!error && !message) return null;

  const displayMessage = error
    ? (errorCodeToTranslationKey[error as ErrorCode]
        ? t(errorCodeToTranslationKey[error as ErrorCode])
        : error)
    : message;

  return (
    <div className={cn(
      'flex items-center gap-3 p-4',
      'bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)]',
      'border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)]',
      'text-[var(--color-error)]',
      className
    )} style={{ borderRadius: 'var(--radius-lg)' }}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm flex-1">{displayMessage}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[var(--color-error)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
