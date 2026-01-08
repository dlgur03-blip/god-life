'use client';

import { LayoutDashboard, Users, FileText, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/admin/users', icon: Users, labelKey: 'nav.users' },
  { href: '/admin/bio', icon: FileText, labelKey: 'nav.bio' },
  { href: '/admin/system', icon: Server, labelKey: 'nav.system' },
];

export default function AdminMobileNav() {
  const t = useTranslations('Admin');
  const pathname = usePathname();

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-[rgba(5,11,20,0.95)] backdrop-blur-sm',
      'border-t border-[rgba(255,255,255,0.1)]',
      'flex justify-around items-center py-2',
      'md:hidden'
    )}>
      {navItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-lg',
              'transition-colors',
              isActive
                ? 'text-[#8b5cf6]'
                : 'text-[#9ca3af] hover:text-[#e2e8f0]'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
