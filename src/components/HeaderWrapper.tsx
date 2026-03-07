'use client';

import { User, Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const t = useTranslations('Header');
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const isMyPage = pathname === '/mypage';

  const toggleTheme = () => {
    setTheme(theme === 'cream' ? 'cyber' : 'cream');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl bg-[var(--background)]/80">
      <div className="flex justify-between items-center px-4 md:px-6 h-12">
        {/* Left — GOD LIFE AI Wordmark */}
        <Link
          href="/"
          aria-label={t('goToDashboard')}
          className="flex items-center gap-1.5 group"
        >
          <span
            className="text-base md:text-lg font-extrabold tracking-tight text-[var(--foreground)] group-hover:text-[var(--color-secondary)] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            GOD LIFE AI
          </span>
        </Link>

        {/* Right — Theme Toggle + Language + User */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-card-hover)]"
            aria-label="Toggle theme"
          >
            {theme === 'cream' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          <LanguageSwitcher />

          {session && !isMyPage && (
            <Link
              href="/mypage"
              aria-label={t('myPage')}
              className="p-2 rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-card-hover)]"
            >
              <User className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
