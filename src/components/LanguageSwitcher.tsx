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
  code: 'ko' | 'en' | 'ja' | 'zh';
  label: string;
  flag: string;
};

const localeOptions: LocaleOption[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-[#e2e8f0] hover:text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 cursor-pointer"
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
        className="min-w-[140px] bg-[#050b14] border border-[rgba(255,255,255,0.1)] rounded-md shadow-lg"
      >
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLocaleChange(option.code)}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
              locale === option.code
                ? 'text-[#06b6d4] bg-[rgba(6,182,212,0.1)]'
                : 'text-[#e2e8f0] hover:text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)]'
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
