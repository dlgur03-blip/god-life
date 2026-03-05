'use client';

import { Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PrintButton() {
  const t = useTranslations('Home');

  return (
    <button
      onClick={() => window.print()}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:text-[var(--foreground)] transition-all"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <Printer className="w-3.5 h-3.5" />
      {t('print')}
    </button>
  );
}
