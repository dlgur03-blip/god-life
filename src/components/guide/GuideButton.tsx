'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import WelcomeGuide from './WelcomeGuide';

export default function GuideButton() {
  const t = useTranslations('Guide');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] hover:text-[var(--color-primary)] bg-[var(--color-card-bg)] hover:bg-[var(--color-card-hover)] border border-[var(--color-border)] rounded-lg transition-all"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>{t('viewGuide')}</span>
      </button>

      {isOpen && (
        <WelcomeGuide
          forceOpen={true}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
