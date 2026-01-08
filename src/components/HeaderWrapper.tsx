'use client';

import { Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const t = useTranslations('Header');
  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-4 py-3 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.1)]">
      <div>
        {!isHomePage && (
          <Link
            href="/"
            aria-label={t('goToDashboard')}
            className="p-2 rounded-md transition-colors text-[#e2e8f0] hover:text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] active:bg-[rgba(6,182,212,0.2)]"
          >
            <Home size={20} />
          </Link>
        )}
      </div>
      <div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
