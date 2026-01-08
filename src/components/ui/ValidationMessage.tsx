'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ValidationMessageProps = {
  message?: string;
  translationKey?: string;
  params?: Record<string, string | number>;
  className?: string;
};

export default function ValidationMessage({
  message,
  translationKey,
  params,
  className
}: ValidationMessageProps) {
  const t = useTranslations('Common');

  if (!message && !translationKey) return null;

  const displayMessage = translationKey
    ? t(`validation.${translationKey}`, params)
    : message;

  return (
    <p className={cn(
      'text-xs mt-1',
      'text-[#ef4444]',
      className
    )}>
      {displayMessage}
    </p>
  );
}
