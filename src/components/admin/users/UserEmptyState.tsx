'use client';

import { useTranslations } from 'next-intl';
import { Users, SearchX } from 'lucide-react';

type Props = {
  type: 'no-users' | 'no-results';
};

export default function UserEmptyState({ type }: Props) {
  const t = useTranslations('Admin.users');
  const Icon = type === 'no-users' ? Users : SearchX;

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#8b5cf6]" />
      </div>
      <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">
        {type === 'no-users' ? t('noUsers') : t('noSearchResults')}
      </h3>
    </div>
  );
}
