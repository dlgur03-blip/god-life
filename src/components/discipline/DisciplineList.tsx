'use client';

import { useState } from 'react';
import { toggleRuleCheck, deleteRule } from '@/app/actions/discipline';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

type Rule = {
  id: string;
  title: string;
  isChecked: boolean;
};

export default function DisciplineList({
  rules,
  date
}: {
  rules: Rule[];
  date: string;
}) {
  const t = useTranslations('Discipline');
  const tCommon = useTranslations('Common');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; ruleId: string | null }>({
    isOpen: false,
    ruleId: null
  });

  const handleDeleteClick = (ruleId: string) => {
    setDeleteConfirm({ isOpen: true, ruleId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.ruleId) {
      await deleteRule(deleteConfirm.ruleId);
    }
    setDeleteConfirm({ isOpen: false, ruleId: null });
  };

  return (
    <>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl group hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => toggleRuleCheck(rule.id, date, !rule.isChecked)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                  rule.isChecked
                    ? "bg-primary border-primary text-black"
                    : "border-gray-600 hover:border-gray-400"
                )}
              >
                {rule.isChecked && <Check className="w-5 h-5" />}
              </button>
              <span className={cn(
                "text-lg font-medium transition-colors",
                rule.isChecked ? "text-primary line-through opacity-70" : "text-gray-200"
              )}>
                {rule.title}
              </span>
            </div>

            <button
              onClick={() => handleDeleteClick(rule.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">
            {t('noRulesDefined')}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={t('deleteRuleConfirm')}
        message={tCommon('dialog.confirmDelete')}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, ruleId: null })}
      />
    </>
  );
}
