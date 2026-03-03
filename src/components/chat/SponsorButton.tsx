'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export default function SponsorButton() {
  const t = useTranslations('Chat');

  return (
    <a
      href="https://buymeacoffee.com/godlifemaker"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm text-[var(--foreground-muted)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <Heart className="w-4 h-4" />
      {t('sponsor')}
    </a>
  );
}
