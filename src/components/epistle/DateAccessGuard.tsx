'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EpistleDateAccess } from '@/lib/utils';

interface DateAccessGuardProps {
  access: EpistleDateAccess;
  children: React.ReactNode;
}

export default function DateAccessGuard({ access, children }: DateAccessGuardProps) {
  const t = useTranslations('Epistle');

  if (access === 'blocked') {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center">
          <Lock className="w-12 h-12 text-[#6b7280] mb-4" />
          <p className="text-[#6b7280] text-lg font-medium">{t('dateBlocked')}</p>
          <p className="text-gray-600 text-sm mt-2">{t('dateBlockedHint')}</p>
        </div>
        <div className="opacity-30 pointer-events-none" aria-hidden="true">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
