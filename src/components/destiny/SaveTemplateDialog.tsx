'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Save, X } from 'lucide-react';
import { saveTemplate } from '@/app/actions/destiny';

type Props = {
  dayId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SaveTemplateDialog({ dayId, onClose, onSuccess }: Props) {
  const t = useTranslations('Destiny.template');
  const tCommon = useTranslations('Common');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveTemplate(dayId, name.trim());
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.8)]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#050b14] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2">
            <Save className="w-5 h-5 text-[#06b6d4]" />
            {t('saveTitle')}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#e2e8f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#9ca3af] mb-4">
          {t('saveDescription')}
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          maxLength={50}
          className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#e2e8f0] placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] transition-colors"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) handleSave();
            if (e.key === 'Escape') onClose();
          }}
        />

        {error && (
          <p className="mt-2 text-sm text-[#ef4444]">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-[#9ca3af] hover:text-[#e2e8f0] transition-colors disabled:opacity-50"
          >
            {tCommon('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
            className="px-4 py-2 text-sm bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? tCommon('status.saving') : tCommon('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
