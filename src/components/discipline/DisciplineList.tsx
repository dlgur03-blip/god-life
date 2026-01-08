'use client';

import { useState } from 'react';
import { toggleRuleCheck, deleteRule } from '@/app/actions/discipline';
import { Check, Trash2, Lock } from 'lucide-react';
import { cn, getDateStatus, type DateStatus } from '@/lib/utils';
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

  const dateStatus: DateStatus = getDateStatus(date);

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
          <div
            key={rule.id}
            className={cn(
              "flex items-center justify-between border p-4 rounded-xl group transition-colors",
              // Today state
              dateStatus === 'today' && "bg-[rgba(6,182,212,0.1)] border-[rgba(6,182,212,0.3)] hover:bg-white/10",
              // Past state
              dateStatus === 'past' && "bg-[rgba(255,255,255,0.03)] border-white/10 opacity-50",
              // Future state
              dateStatus === 'future' && "bg-[rgba(255,255,255,0.02)] border-white/10 opacity-40"
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              {dateStatus === 'future' ? (
                // Future: Show lock icon
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-600 cursor-not-allowed"
                  aria-label={t('dateRestriction.futureDateLocked')}
                >
                  <Lock className="w-4 h-4 text-[#6b7280]" />
                </div>
              ) : dateStatus === 'past' ? (
                // Past: Show read-only state (checked or unchecked, no interaction)
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 cursor-not-allowed",
                    rule.isChecked
                      ? "bg-primary/50 border-primary/50 text-black/50"
                      : "border-gray-600/50"
                  )}
                  aria-label={t('dateRestriction.pastDateReadOnly')}
                >
                  {rule.isChecked && <Check className="w-5 h-5" />}
                </div>
              ) : (
                // Today: Interactive button
                <button
                  onClick={() => toggleRuleCheck(rule.id, date, !rule.isChecked)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                    rule.isChecked
                      ? "bg-primary border-primary text-black"
                      : "border-gray-600 hover:border-gray-400"
                  )}
                  aria-label={t('dateRestriction.todayOnly')}
                >
                  {rule.isChecked && <Check className="w-5 h-5" />}
                </button>
              )}
              <span className={cn(
                "text-lg font-medium transition-colors",
                dateStatus === 'today' && rule.isChecked && "text-primary line-through opacity-70",
                dateStatus === 'today' && !rule.isChecked && "text-gray-200",
                dateStatus === 'past' && "text-[#4b5563]",
                dateStatus === 'future' && "text-[#4b5563]"
              )}>
                {rule.title}
              </span>
            </div>

            {dateStatus === 'today' && (
              <button
                onClick={() => handleDeleteClick(rule.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
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
