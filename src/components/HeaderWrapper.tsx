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
    <header className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
      {/* Motivational Banner */}
      <div className="text-white text-center py-1.5 px-4 border-b border-slate-700/30">
        <p className="text-[10px] md:text-xs font-medium tracking-wide">
          <span className="text-amber-400">✦</span>
          <span className="mx-1.5 md:mx-2">매일 아침, 반드시 이 사이트에 들어오세요.</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline ml-1.5 text-amber-200/80">당신은 분명 갓생을 살게 될 것입니다.</span>
          <span className="text-amber-400 ml-1.5">✦</span>
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Link
              href="/"
              aria-label={t('goToDashboard')}
              className="p-1.5 rounded-md transition-colors text-white/80 hover:text-amber-400 hover:bg-white/5"
            >
              <Home size={18} />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          {session && !isMyPage && (
            <Link
              href="/mypage"
              aria-label={t('myPage')}
              className="p-1.5 rounded-md transition-colors text-white/80 hover:text-amber-400 hover:bg-white/5"
            >
              <User size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
