'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { updateTimeblock } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';
import TimeRangeEditor from './TimeRangeEditor';
import TimeblockDeleteButton from './TimeblockDeleteButton';
import { Edit2 } from 'lucide-react';
import type { Timeblock } from '@/types/destiny';

function DebouncedInput({
  value,
  onSave,
  placeholder,
  className,
  readOnly = false
}: {
  value: string | null;
  onSave: (val: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}) {
  if (readOnly) {
    return (
      <div className={cn("px-2 py-1 w-full text-sm text-[var(--foreground)] opacity-70", className)}>
        {value || <span className="text-[var(--foreground-muted)]">{placeholder || '-'}</span>}
      </div>
    );
  }

  return (
    <input
      type="text"
      defaultValue={value || ''}
      onBlur={(e) => {
        if (e.target.value !== (value || '')) {
          onSave(e.target.value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      placeholder={placeholder}
      className={cn("bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-secondary)] outline-none px-2 py-1 w-full text-sm transition-colors text-[var(--foreground)]", className)}
    />
  );
}

export default function TimeblockCard({ block, isYesterday = false, isToday = false }: { block: Timeblock; isYesterday?: boolean; isToday?: boolean }) {
  const t = useTranslations('Destiny');
  // For yesterday, default to actual mode
  const [mode, setMode] = useState<'plan' | 'actual'>(isYesterday ? 'actual' : 'plan');
  const [isEditingTime, setIsEditingTime] = useState(false);

  // Editing permissions
  const canEditPlan = isToday;
  const canEditActual = isToday || isYesterday;
  const canEditTime = isToday;
  const canDelete = isToday;

  const handleUpdate = async (data: Partial<Timeblock>) => {
    await updateTimeblock(block.id, data);
  };

  return (
    <div className={cn(
      "relative p-4 rounded-xl border bg-[var(--color-card-bg)] transition-colors duration-200",
      block.status === 'active'
        ? "border-[var(--color-secondary)] shadow-[var(--shadow-glow)]"
        : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isEditingTime && canEditTime ? (
            <TimeRangeEditor
              blockId={block.id}
              startTime={block.startTime}
              endTime={block.endTime}
              onCancel={() => setIsEditingTime(false)}
              onSave={() => setIsEditingTime(false)}
            />
          ) : (
            <button
              onClick={() => canEditTime && setIsEditingTime(true)}
              className={cn("flex items-center gap-2 group", !canEditTime && "cursor-default")}
              disabled={!canEditTime}
            >
              <span className="text-xl font-mono text-[var(--color-secondary)] font-bold">
                {block.startTime}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {t('timeblock.timeTo', { time: block.endTime })}
              </span>
              {canEditTime && (
                <Edit2
                  size={14}
                  className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--background-secondary)] rounded-lg p-1 border border-[var(--color-border)]">
            <button
              onClick={() => setMode('plan')}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                mode === 'plan'
                  ? "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              {t('timeblock.planMode')}
            </button>
            <button
              onClick={() => setMode('actual')}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                mode === 'actual'
                  ? "bg-[var(--color-warning)]/20 text-[var(--color-warning)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              {t('timeblock.actualMode')}
            </button>
          </div>

          {canDelete && <TimeblockDeleteButton blockId={block.id} />}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2" key={mode}>
        {mode === 'plan' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] w-12">{t('timeblock.whereLabel')}</span>
              <DebouncedInput
                key={`location-${block.id}`}
                value={block.planLocation}
                onSave={(v) => handleUpdate({ planLocation: v })}
                placeholder={t('timeblock.locationPlaceholder')}
                readOnly={!canEditPlan}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] w-12">{t('timeblock.whatLabel')}</span>
              <DebouncedInput
                key={`plan-${block.id}`}
                value={block.planText}
                onSave={(v) => handleUpdate({ planText: v })}
                placeholder={t('timeblock.planPlaceholder')}
                className="font-medium"
                readOnly={!canEditPlan}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] w-12">{t('timeblock.doneLabel')}</span>
              <DebouncedInput
                key={`actual-${block.id}`}
                value={block.actualText}
                onSave={(v) => handleUpdate({ actualText: v })}
                placeholder={t('timeblock.actualPlaceholder')}
                className="font-medium"
                readOnly={!canEditActual}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] w-12">{t('timeblock.scoreLabel')}</span>
              {canEditActual ? (
                <input
                  type="number"
                  min="0" max="10"
                  defaultValue={block.score ?? ''}
                  onBlur={(e) => handleUpdate({ score: parseInt(e.target.value) || 0 })}
                  className="bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-warning)] outline-none px-2 py-1 w-16 text-sm text-[var(--color-warning)] font-bold"
                />
              ) : (
                <span className="px-2 py-1 text-sm text-[var(--color-warning)] font-bold opacity-70">
                  {block.score ?? '-'}
                </span>
              )}
              <span className="text-xs text-[var(--foreground-muted)]">{t('timeblock.scoreSuffix')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] w-12">{t('timeblock.feedLabel')}</span>
              <DebouncedInput
                key={`feedback-${block.id}`}
                value={block.feedback}
                onSave={(v) => handleUpdate({ feedback: v })}
                placeholder={t('timeblock.feedbackPlaceholder')}
                className="text-xs italic"
                readOnly={!canEditActual}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer Status Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl overflow-hidden bg-[var(--color-border)]">
        <div className={cn(
          "h-full transition-all duration-500",
          block.score && block.score >= 8 ? "bg-[var(--color-accent)]" :
          block.score && block.score >= 5 ? "bg-[var(--color-success)]" :
          block.score ? "bg-[var(--color-error)]" : "bg-transparent"
        )} style={{ width: `${(block.score || 0) * 10}%` }} />
      </div>
    </div>
  );
}
