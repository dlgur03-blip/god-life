'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { deleteTimeblock } from '@/app/actions/destiny';
import DeleteConfirmDialog from './DeleteConfirmDialog';

type TimeblockDeleteButtonProps = {
  blockId: string;
};

export default function TimeblockDeleteButton({ blockId }: TimeblockDeleteButtonProps) {
  const t = useTranslations('Destiny.timeblock');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTimeblock(blockId);
    } catch (e) {
      console.error('Failed to delete timeblock:', e);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1.5 rounded-md text-[#6b7280] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
        title={t('deleteBlock')}
      >
        <Trash2 size={16} />
      </button>

      {showConfirm && (
        <DeleteConfirmDialog
          title={t('deleteBlockTitle')}
          message={t('deleteBlockConfirm')}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
    </>
  );
}
