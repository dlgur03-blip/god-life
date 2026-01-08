'use client';

import { useTranslations } from 'next-intl';
import type { Locale, TranslationInput } from '@/types/bio';

type Props = {
  activeLocale: Locale;
  onChange: (locale: Locale) => void;
  translations: Record<Locale, TranslationInput>;
};

const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語'
};

export default function TranslationTabs({ activeLocale, onChange, translations }: Props) {
  const t = useTranslations('Admin.bio');

  const getStatus = (locale: Locale): 'complete' | 'incomplete' | 'empty' => {
    const trans = translations[locale];
    if (!trans.title && !trans.content) return 'empty';
    if (trans.title && trans.content) return 'complete';
    return 'incomplete';
  };

  return (
    <div className="flex gap-2 border-b border-[rgba(255,255,255,0.1)] pb-2">
      {(['ko', 'en', 'ja'] as Locale[]).map((locale) => {
        const status = getStatus(locale);
        const isActive = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive
                ? 'bg-[rgba(139,92,246,0.2)] text-[#8b5cf6] border border-[#8b5cf6]'
                : 'bg-[rgba(255,255,255,0.03)] text-[#9ca3af] hover:text-[#e2e8f0] border border-transparent'
            }`}
          >
            {localeLabels[locale]}
            {status === 'complete' && (
              <span className="w-2 h-2 rounded-full bg-[#10b981]" title={t('translationStatus.complete')} />
            )}
            {status === 'incomplete' && (
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" title={t('translationStatus.incomplete')} />
            )}
          </button>
        );
      })}
    </div>
  );
}
