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
      {/* Motivational Text */}
      <p className="text-center py-1 md:py-1.5 text-[10px] md:text-xs text-[var(--foreground-muted)]">
        매일 아침, 반드시 이 사이트에 들어오세요. <span className="hidden sm:inline">당신은 분명 갓생을 살게 될 것입니다.</span>
      </p>

      {/* Navigation */}
      <div className="flex justify-between items-center px-4 md:px-6 py-2 md:py-2.5">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Link
              href="/"
              aria-label={t('goToDashboard')}
              className="p-1.5 md:p-2 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-card-hover)]"
            >
              <Home className="w-[18px] h-[18px] md:w-6 md:h-6" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          {session && !isMyPage && (
            <Link
              href="/mypage"
              aria-label={t('myPage')}
              className="p-1.5 md:p-2 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-card-hover)]"
            >
              <User className="w-[18px] h-[18px] md:w-6 md:h-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
