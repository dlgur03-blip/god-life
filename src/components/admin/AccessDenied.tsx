'use client';

import { ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';

export default function AccessDenied() {
  const t = useTranslations('Admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] px-4">
      <div className={cn(
        'text-center max-w-md',
        'p-8 rounded-2xl',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
      )}>
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-[#ef4444]/10">
            <ShieldX className="w-12 h-12 text-[#ef4444]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#e2e8f0] mb-2">
          {t('accessDenied.title')}
        </h1>
        <p className="text-[#9ca3af] mb-6">
          {t('accessDenied.message')}
        </p>
        <Link
          href="/"
          className={cn(
            'inline-block px-6 py-3 rounded-xl',
            'bg-[#06b6d4] hover:bg-[#0891b2]',
            'text-black font-semibold',
            'transition-colors'
          )}
        >
          {t('accessDenied.backHome')}
        </Link>
      </div>
    </div>
  );
}
