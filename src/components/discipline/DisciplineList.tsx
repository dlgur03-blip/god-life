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
              dateStatus === 'today' && "bg-[var(--color-card-bg)] border-[var(--color-secondary)]/30 hover:bg-[var(--color-card-hover)]",
              // Past state
              dateStatus === 'past' && "bg-[var(--background-secondary)] border-[var(--color-border)] opacity-60",
              // Future state
              dateStatus === 'future' && "bg-[var(--background-secondary)] border-[var(--color-border)] opacity-40"
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              {dateStatus === 'future' ? (
                // Future: Show lock icon
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[var(--color-border)] cursor-not-allowed"
                  aria-label={t('dateRestriction.futureDateLocked')}
                >
                  <Lock className="w-4 h-4 text-[var(--foreground-muted)]" />
                </div>
              ) : dateStatus === 'past' ? (
                // Past: Show read-only state (checked or unchecked, no interaction)
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 cursor-not-allowed",
                    rule.isChecked
                      ? "bg-[var(--color-success)]/50 border-[var(--color-success)]/50 text-white"
                      : "border-[var(--color-border)]"
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
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                      : "border-[var(--color-border)] hover:border-[var(--color-secondary)]"
                  )}
                  aria-label={t('dateRestriction.todayOnly')}
                >
                  {rule.isChecked && <Check className="w-5 h-5" />}
                </button>
              )}
              <span className={cn(
                "text-lg font-medium transition-colors",
                dateStatus === 'today' && rule.isChecked && "text-[var(--color-success)] line-through opacity-70",
                dateStatus === 'today' && !rule.isChecked && "text-[var(--foreground)]",
                dateStatus === 'past' && "text-[var(--foreground-muted)]",
                dateStatus === 'future' && "text-[var(--foreground-muted)]"
              )}>
                {rule.title}
              </span>
            </div>

            {dateStatus === 'today' && (
              <button
                onClick={() => handleDeleteClick(rule.id)}
                className="opacity-0 group-hover:opacity-100 text-[var(--foreground-muted)] hover:text-[var(--color-error)] transition-opacity p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-10 text-[var(--foreground-muted)] italic">
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
