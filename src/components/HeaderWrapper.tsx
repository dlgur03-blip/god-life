'use client';

import { Home, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useSession } from 'next-auth/react';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const t = useTranslations('Header');
  const { data: session } = useSession();
  const isHomePage = pathname === '/';
  const isMyPage = pathname === '/mypage';

  return (
    <header className="fixed top-[44px] right-0 left-0 z-50 flex justify-between items-center px-4 py-3 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="flex items-center gap-2">
        {!isHomePage && (
          <Link
            href="/"
            aria-label={t('goToDashboard')}
            className="p-2 rounded-md transition-colors text-[var(--foreground)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
          >
            <Home size={20} />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {session && !isMyPage && (
          <Link
            href="/mypage"
            aria-label={t('myPage')}
            className="p-2 rounded-md transition-colors text-[var(--foreground)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
          >
            <User size={20} />
          </Link>
        )}
      </div>
    </header>
  );
}
