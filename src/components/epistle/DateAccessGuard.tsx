'use client';

import { Lock, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EpistleDateAccess } from '@/lib/utils';

interface DateAccessGuardProps {
  access: EpistleDateAccess;
  children: React.ReactNode;
}

export default function DateAccessGuard({ access, children }: DateAccessGuardProps) {
  const t = useTranslations('Epistle');

  // Blocked state - future dates (including tomorrow)
  if (access === 'blocked') {
    return (
      <div className="relative">
        <div
          className="absolute inset-0 rounded-2xl z-10 flex flex-col items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Lock
            className="w-12 h-12 mb-4"
            style={{ color: '#6b7280' }}
          />
          <p
            className="text-lg font-medium"
            style={{ color: '#6b7280' }}
          >
            {t('dateBlocked')}
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: '#4b5563' }}
          >
            {t('dateBlockedHint')}
          </p>
        </div>
        <div className="opacity-30 pointer-events-none" aria-hidden="true">
          {children}
        </div>
      </div>
    );
  }

  // Past state - read-only indicator (form itself handles read-only behavior)
  if (access === 'past') {
    return (
      <div className="relative">
        <div
          className="flex items-center justify-center gap-2 mb-4 py-2 px-4 rounded-lg mx-auto w-fit"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#9ca3af'
          }}
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">{t('readOnly')}</span>
        </div>
        {children}
      </div>
    );
  }

  // Today - full access
  return <>{children}</>;
}
