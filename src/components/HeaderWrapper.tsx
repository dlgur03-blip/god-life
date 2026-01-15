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
    <header className="fixed top-0 right-0 left-0 z-50 bg-[var(--background)] border-b border-[var(--color-border)]">
      <div className="flex justify-between items-center px-3 md:px-6 py-2">
        {/* Left - Home */}
        <div className="flex items-center gap-2 w-20">
          {!isHomePage && (
            <Link
              href="/"
              aria-label={t('goToDashboard')}
              className="p-1.5 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-card-hover)]"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          )}
        </div>

        {/* Center - Motivational Text */}
        <p className="text-[10px] md:text-xs text-[var(--foreground-muted)] tracking-wide">
          <span className="text-[var(--color-primary)]">✦</span>
          <span className="mx-1">매일 아침, 반드시 들어오세요</span>
          <span className="text-[var(--color-primary)]">✦</span>
        </p>

        {/* Right - Language & User */}
        <div className="flex items-center gap-1 w-20 justify-end">
          <LanguageSwitcher />

          {session && !isMyPage && (
            <Link
              href="/mypage"
              aria-label={t('myPage')}
              className="p-1.5 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-card-hover)]"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
