'use client';

import { LayoutDashboard, Users, FileText, Shield, BarChart3, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/admin/stats', icon: BarChart3, labelKey: 'nav.stats' },
  { href: '/admin/users', icon: Users, labelKey: 'nav.users' },
  { href: '/admin/bio', icon: FileText, labelKey: 'nav.bio' },
  { href: '/admin/system', icon: Server, labelKey: 'nav.system' },
];

export default function AdminSidebar() {
  const t = useTranslations('Admin');
  const pathname = usePathname();

  return (
    <aside className={cn(
      'fixed left-0 top-14 bottom-0 w-64',
      'bg-[rgba(255,255,255,0.02)] border-r border-[rgba(255,255,255,0.1)]',
      'flex flex-col',
      'hidden md:flex'
    )}>
      <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-2 text-[#8b5cf6]">
          <Shield className="w-5 h-5" />
          <span className="font-bold text-sm">{t('title')}</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30'
                  : 'text-[#9ca3af] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)]'
              )}
            >
              <item.icon className="w-4 h-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
