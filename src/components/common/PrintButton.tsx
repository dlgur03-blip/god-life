'use client';

import { Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PrintButtonProps {
  className?: string;
}

export default function PrintButton({ className = '' }: PrintButtonProps) {
  const t = useTranslations('Common');

  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors print:hidden ${className}`}
      title={t('print')}
    >
      <Printer className="w-5 h-5" />
    </button>
  );
}
