'use client';

import { useTranslations } from 'next-intl';
import { FileText, Plus } from 'lucide-react';
import { Link } from '@/navigation';

export default function BioAdminEmptyState() {
  const t = useTranslations('Admin.bio');

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-[#8b5cf6]" />
      </div>
      <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">{t('noPosts')}</h3>
      <p className="text-[#6b7280] mb-6">{t('createFirst')}</p>
      <Link
        href="/admin/bio/new"
        className="inline-flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#a78bfa] px-4 py-2 rounded-lg text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t('newPost')}
      </Link>
    </div>
  );
}
