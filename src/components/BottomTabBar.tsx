'use client';

import { Compass, ClipboardList, Home, Activity, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

const tabs: { key: string; href: string; icon: typeof Compass; color: string; needsDate?: boolean }[] = [
  { key: 'destiny', href: '/destiny/day/', icon: Compass, color: 'var(--color-destiny)', needsDate: true },
  { key: 'tasks', href: '/tasks', icon: ClipboardList, color: 'var(--color-taskboard)' },
  { key: 'home', href: '/', icon: Home, color: 'var(--color-secondary)' },
  { key: 'discipline', href: '/discipline/day/', icon: Activity, color: 'var(--color-discipline)', needsDate: true },
  { key: 'mypage', href: '/mypage', icon: User, color: 'var(--foreground-muted)' },
];

export default function BottomTabBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations('Nav');

  if (!session?.user) return null;

  const today = new Date().toLocaleDateString('en-CA');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-[var(--color-border)] bg-[var(--background)]/95 backdrop-blur-md print:hidden">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map(({ key, href, icon: Icon, color, needsDate }) => {
          const fullHref = needsDate ? `${href}${today}` : href;
          // Check if current path matches this tab
          const isActive = key === 'home'
            ? pathname.match(/^\/[a-z]{2}\/?$/)
            : pathname.includes(href.replace(/\/$/, ''));

          return (
            <Link
              key={key}
              href={fullHref as '/'}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors"
              style={{ color: isActive ? color : 'var(--foreground-muted)' }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
