'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { deleteSuccessProject } from '@/app/actions/success';

type DeleteProjectButtonProps = {
  projectId: string;
};

export default function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const t = useTranslations('Success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSuccessProject(projectId);
      // redirect happens in server action
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
          'bg-white/5 hover:bg-[#ef4444]/20 text-[#9ca3af] hover:text-[#ef4444]',
          'border border-[rgba(255,255,255,0.1)] hover:border-[#ef4444]/50',
          'transition-all duration-200',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Trash2 className="w-4 h-4" />
        {isPending ? t('deleting') : t('deleteProject')}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title={t('deleteProjectConfirm')}
        message={t('deleteProjectWarning')}
        variant="danger"
        confirmLabel={t('deleteProject')}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
