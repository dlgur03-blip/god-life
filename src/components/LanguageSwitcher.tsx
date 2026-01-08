'use client';

import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Common');

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <select
      defaultValue={locale}
      onChange={onSelectChange}
      className='bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1.5 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#06b6d4] hover:border-[#06b6d4]/50 transition-colors cursor-pointer'
    >
      <option value='ko'>{t('locales.ko')}</option>
      <option value='en'>{t('locales.en')}</option>
      <option value='ja'>{t('locales.ja')}</option>
    </select>
  );
}
