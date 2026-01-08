'use client';

import { useLocale } from 'next-intl';
import { formatDateDisplay, formatDateShort, formatRelativeDate } from '@/lib/date';

type LocalizedDateProps = {
  date: Date | string;
  format?: 'full' | 'short' | 'relative';
  className?: string;
};

export default function LocalizedDate({ date, format = 'full', className }: LocalizedDateProps) {
  const locale = useLocale() as 'en' | 'ko' | 'ja';

  const formatted = (() => {
    switch (format) {
      case 'short':
        return formatDateShort(date, locale);
      case 'relative':
        return formatRelativeDate(date, locale);
      default:
        return formatDateDisplay(date, locale);
    }
  })();

  return <span className={className}>{formatted}</span>;
}
