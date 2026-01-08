'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

type Props = {
  postSlug: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function DeleteBioPostDialog({
  postSlug,
  onConfirm,
  onCancel,
  loading
}: Props) {
  const t = useTranslations('Admin.bio');
  const tCommon = useTranslations('Common');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.8)]"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-sm mx-4 p-6 rounded-2xl bg-[#050b14] border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-[rgba(239,68,68,0.2)]">
            <AlertTriangle className="text-[#ef4444]" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#e2e8f0] mb-1">
              {t('deleteConfirm.title')}
            </h3>
            <p className="text-sm text-[#9ca3af] mb-2">
              {t('deleteConfirm.message')}
            </p>
            <p className="text-sm font-mono text-[#6b7280]">
              {postSlug}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            {tCommon('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? t('actions.deleting') : tCommon('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
