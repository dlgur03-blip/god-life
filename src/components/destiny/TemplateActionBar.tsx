'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Save, FolderOpen } from 'lucide-react';
import SaveTemplateDialog from './SaveTemplateDialog';
import LoadTemplateDialog from './LoadTemplateDialog';

type Props = {
  dayId: string;
};

export default function TemplateActionBar({ dayId }: Props) {
  const t = useTranslations('Destiny.template');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const handleSuccess = () => {
    // Force page refresh to show updated timeblocks
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#06b6d4] bg-[rgba(6,182,212,0.1)] hover:bg-[rgba(6,182,212,0.2)] border border-[rgba(6,182,212,0.3)] rounded-lg transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {t('save')}
        </button>
        <button
          onClick={() => setShowLoadDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#f59e0b] bg-[rgba(245,158,11,0.1)] hover:bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)] rounded-lg transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {t('load')}
        </button>
      </div>

      {showSaveDialog && (
        <SaveTemplateDialog
          dayId={dayId}
          onClose={() => setShowSaveDialog(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showLoadDialog && (
        <LoadTemplateDialog
          dayId={dayId}
          onClose={() => setShowLoadDialog(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
