import { Globe } from 'lucide-react';
import type { Locale } from '@/types/bio';

type Props = {
  currentLocale: Locale;
  contentLocale: Locale;
  variant?: 'badge' | 'inline';
};

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'EN',
  ko: 'KO',
  ja: 'JA'
};

export default function TranslationIndicator({
  currentLocale,
  contentLocale,
  variant = 'badge'
}: Props) {
  if (currentLocale === contentLocale) return null;

  if (variant === 'inline') {
    return (
      <span className="text-xs text-amber-400/70 uppercase">
        {LOCALE_NAMES[contentLocale]}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs text-amber-400/70 border border-amber-400/30 px-2 py-0.5 rounded">
      <Globe className="w-3 h-3" />
      {LOCALE_NAMES[contentLocale]}
    </span>
  );
}
