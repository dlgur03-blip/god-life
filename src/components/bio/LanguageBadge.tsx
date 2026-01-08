import type { Locale } from '@/types/bio';

type Props = {
  locale: Locale;
  size?: 'sm' | 'md';
};

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語'
};

export default function LanguageBadge({ locale, size = 'sm' }: Props) {
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1';

  return (
    <span className={`${sizeClasses} font-medium text-gray-300 border border-white/10 rounded bg-white/5`}>
      {LOCALE_LABELS[locale]}
    </span>
  );
}
