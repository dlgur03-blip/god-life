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
      'flex items-center gap-3 p-4 rounded-xl',
      'bg-[rgba(239,68,68,0.1)]',
      'border border-[rgba(239,68,68,0.3)]',
      'text-[#ef4444]',
      className
    )}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm flex-1">{displayMessage}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[#ef4444] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
