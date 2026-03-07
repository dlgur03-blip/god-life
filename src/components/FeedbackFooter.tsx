'use client';

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FeedbackFooter() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-[var(--color-border)] py-6 mt-auto">
      <div className="text-center">
        <a
          href="mailto:dlgur03@gmail.com"
          className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--color-secondary)] transition-colors"
          aria-label={t('feedbackAndInquiries')}
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm">{t('feedbackAndInquiries')}</span>
        </a>
      </div>
    </footer>
  );
}
