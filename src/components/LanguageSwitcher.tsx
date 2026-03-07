'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LocaleOption = {
  code: 'ko' | 'en' | 'ja' | 'zh' | 'hi';
  label: string;
  flag: string;
};

const localeOptions: LocaleOption[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Common');

  const currentLocale = localeOptions.find((opt) => opt.code === locale) || localeOptions[0];

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 p-2 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-card-hover)] focus:outline-none cursor-pointer"
        aria-label={t('language')}
      >
        {/* Mobile: Show current flag only */}
        <span className="sm:hidden text-lg">{currentLocale.flag}</span>

        {/* Desktop: Show Globe icon + 'Language' text */}
        <Globe className="hidden sm:block w-4 h-4" />
        <span className="hidden sm:block text-sm">{t('language')}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[140px] bg-[var(--background)] border border-[var(--color-border)] shadow-lg"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLocaleChange(option.code)}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
              locale === option.code
                ? 'text-[var(--color-secondary)] bg-[var(--color-card-hover)]'
                : 'text-[var(--foreground)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-card-hover)]'
            }`}
          >
            <span className="text-base">{option.flag}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
