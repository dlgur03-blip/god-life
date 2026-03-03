'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Brain, Sparkles, Clock, Share2 } from 'lucide-react';

export default function MetLanding() {
  const t = useTranslations('Met');

  const features = [
    { icon: Brain, text: t('landing.features.science') },
    { icon: Sparkles, text: t('landing.features.ai') },
    { icon: Clock, text: t('landing.features.time') },
    { icon: Share2, text: t('landing.features.share') },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        {/* Badge */}
        <span
          className="px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-[var(--color-secondary)] text-[var(--color-secondary)]"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {t('landing.badge')}
        </span>

        {/* Hero */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-wide leading-tight whitespace-pre-line">
          {t('landing.heroTitle')}
        </h1>

        <div className="w-16 sm:w-24 h-1 bg-[var(--color-secondary)]" />

        <p className="text-[var(--foreground-muted)] text-base sm:text-lg max-w-lg leading-relaxed">
          {t('landing.heroDescription')}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
          {features.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] text-sm text-[var(--foreground-muted)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <f.icon className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0" />
              <span className="text-xs sm:text-sm">{f.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/met/test"
          className="px-8 sm:px-12 py-3.5 bg-[var(--foreground)] text-[var(--background)] font-medium tracking-wider uppercase text-sm hover:opacity-90 transition-opacity"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {t('startTest')}
        </Link>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
          <span>{t('free')}</span>
          <span>·</span>
          <span>{t('noLogin')}</span>
          <span>·</span>
          <span>{t('timeEstimate')}</span>
        </div>
      </div>
    </main>
  );
}
