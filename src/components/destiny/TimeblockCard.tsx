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
  className
}: {
  value: string | null;
  onSave: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
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
      className={cn("bg-transparent border-b border-white/10 focus:border-[#06b6d4] outline-none px-2 py-1 w-full text-sm transition-colors", className)}
    />
  );
}

export default function TimeblockCard({ block }: { block: Timeblock }) {
  const t = useTranslations('Destiny');
  const [mode, setMode] = useState<'plan' | 'actual'>('plan');
  const [isEditingTime, setIsEditingTime] = useState(false);

  const handleUpdate = async (data: Partial<Timeblock>) => {
    await updateTimeblock(block.id, data);
  };

  return (
    <div className={cn(
      "relative p-4 rounded-xl border bg-[rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300",
      block.status === 'active'
        ? "border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isEditingTime ? (
            <TimeRangeEditor
              blockId={block.id}
              startTime={block.startTime}
              endTime={block.endTime}
              onCancel={() => setIsEditingTime(false)}
              onSave={() => setIsEditingTime(false)}
            />
          ) : (
            <button
              onClick={() => setIsEditingTime(true)}
              className="flex items-center gap-2 group"
            >
              <span className="text-xl font-mono text-[#06b6d4] font-bold">
                {block.startTime}
              </span>
              <span className="text-xs text-[#6b7280]">
                {t('timeblock.timeTo', { time: block.endTime })}
              </span>
              <Edit2
                size={14}
                className="text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/30 rounded-lg p-1">
            <button
              onClick={() => setMode('plan')}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                mode === 'plan'
                  ? "bg-[rgba(6,182,212,0.2)] text-[#06b6d4]"
                  : "text-[#6b7280] hover:text-[#9ca3af]"
              )}
            >
              {t('timeblock.planMode')}
            </button>
            <button
              onClick={() => setMode('actual')}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                mode === 'actual'
                  ? "bg-[rgba(245,158,11,0.2)] text-[#f59e0b]"
                  : "text-[#6b7280] hover:text-[#9ca3af]"
              )}
            >
              {t('timeblock.actualMode')}
            </button>
          </div>

          <TimeblockDeleteButton blockId={block.id} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {mode === 'plan' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] w-12">{t('timeblock.whereLabel')}</span>
              <DebouncedInput
                value={block.planLocation}
                onSave={(v) => handleUpdate({ planLocation: v })}
                placeholder={t('timeblock.locationPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] w-12">{t('timeblock.whatLabel')}</span>
              <DebouncedInput
                value={block.planText}
                onSave={(v) => handleUpdate({ planText: v })}
                placeholder={t('timeblock.planPlaceholder')}
                className="font-medium text-[#e2e8f0]"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] w-12">{t('timeblock.doneLabel')}</span>
              <DebouncedInput
                value={block.actualText}
                onSave={(v) => handleUpdate({ actualText: v })}
                placeholder={t('timeblock.actualPlaceholder')}
                className="font-medium text-[#e2e8f0]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] w-12">{t('timeblock.scoreLabel')}</span>
              <input
                type="number"
                min="0" max="10"
                defaultValue={block.score ?? ''}
                onBlur={(e) => handleUpdate({ score: parseInt(e.target.value) || 0 })}
                className="bg-transparent border-b border-[rgba(255,255,255,0.1)] focus:border-[#f59e0b] outline-none px-2 py-1 w-16 text-sm text-[#f59e0b] font-bold"
              />
              <span className="text-xs text-[#4b5563]">{t('timeblock.scoreSuffix')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b7280] w-12">{t('timeblock.feedLabel')}</span>
              <DebouncedInput
                value={block.feedback}
                onSave={(v) => handleUpdate({ feedback: v })}
                placeholder={t('timeblock.feedbackPlaceholder')}
                className="text-xs text-[#9ca3af] italic"
              />
            </div>
          </>
        )}
      </div>

      {/* Footer Status Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl overflow-hidden">
        <div className={cn(
          "h-full transition-all duration-500",
          block.score && block.score >= 8 ? "bg-[#ffd700]" :
          block.score && block.score >= 5 ? "bg-[#06b6d4]" :
          block.score ? "bg-[#ef4444]" : "bg-transparent"
        )} style={{ width: `${(block.score || 0) * 10}%` }} />
      </div>
    </div>
  );
}
