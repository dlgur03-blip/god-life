'use client';

import { useLocale } from 'next-intl';
import { formatTimeDisplay } from '@/lib/date';

type LocalizedTimeProps = {
  date: Date | string;
  className?: string;
};

export default function LocalizedTime({ date, className }: LocalizedTimeProps) {
  const locale = useLocale() as 'en' | 'ko' | 'ja';
  return <span className={className}>{formatTimeDisplay(date, locale)}</span>;
}
