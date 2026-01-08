'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { updateTimeblock } from '@/app/actions/destiny';
import { cn } from '@/lib/utils'; // We need a utility for classnames

type Timeblock = {
  id: string;
  seq: number;
  startTime: string | null;
  endTime: string | null;
  planText: string | null;
  planLocation: string | null;
  actualText: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
};

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
  // We use 'defaultValue' and rely on the parent to change 'key' if the upstream value changes significantly
  // or we accept that typing doesn't sync FROM server while typing.
  
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
      className={cn("bg-transparent border-b border-white/10 focus:border-primary outline-none px-2 py-1 w-full text-sm transition-colors", className)}
    />
  );
}

export default function TimeblockCard({ block }: { block: Timeblock }) {
  const t = useTranslations('Destiny');
  const [mode, setMode] = useState<'plan' | 'actual'>('plan');

  const handleUpdate = async (data: Partial<Timeblock>) => {
    // Optimistic UI could go here
    await updateTimeblock(block.id, data);
  };

  return (
    <div className={cn(
      "relative p-4 rounded-xl border bg-white/5 backdrop-blur-sm transition-all duration-300",
      block.status === 'active' ? "border-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "border-white/10 hover:border-white/20"
    )}>
      {/* Header: Time & Mode Toggle */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono text-primary font-bold">{block.startTime}</span>
          <span className="text-xs text-gray-500">{t('timeblock.timeTo', { time: block.endTime ?? '' })}</span>
        </div>
        <div className="flex bg-black/30 rounded-lg p-1">
          <button 
            onClick={() => setMode('plan')}
            className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", mode === 'plan' ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-gray-300")}
          >
            {t('timeblock.planMode')}
          </button>
          <button 
            onClick={() => setMode('actual')}
            className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", mode === 'actual' ? "bg-secondary/20 text-secondary" : "text-gray-500 hover:text-gray-300")}
          >
            {t('timeblock.actualMode')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {mode === 'plan' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t('timeblock.whereLabel')}</span>
              <DebouncedInput 
                value={block.planLocation} 
                onSave={(v) => handleUpdate({ planLocation: v })}
                placeholder={t('timeblock.locationPlaceholder')}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t('timeblock.whatLabel')}</span>
              <DebouncedInput 
                value={block.planText} 
                onSave={(v) => handleUpdate({ planText: v })}
                placeholder={t('timeblock.planPlaceholder')}
                className="font-medium text-gray-200"
              />
            </div>
          </>
        ) : (
          <>
             <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t('timeblock.doneLabel')}</span>
              <DebouncedInput 
                value={block.actualText} 
                onSave={(v) => handleUpdate({ actualText: v })}
                placeholder={t('timeblock.actualPlaceholder')}
                className="font-medium text-gray-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t('timeblock.scoreLabel')}</span>
              <input 
                type="number" 
                min="0" max="10"
                defaultValue={block.score ?? ''}
                onBlur={(e) => handleUpdate({ score: parseInt(e.target.value) || 0 })}
                className="bg-transparent border-b border-white/10 focus:border-secondary outline-none px-2 py-1 w-16 text-sm text-secondary font-bold"
              />
              <span className="text-xs text-gray-600">{t('timeblock.scoreSuffix')}</span>
            </div>
             <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{t('timeblock.feedLabel')}</span>
              <DebouncedInput 
                value={block.feedback} 
                onSave={(v) => handleUpdate({ feedback: v })}
                placeholder={t('timeblock.feedbackPlaceholder')}
                className="text-xs text-gray-400 italic"
              />
            </div>
          </>
        )}
      </div>

      {/* Footer Status Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl overflow-hidden">
        <div className={cn(
          "h-full transition-all duration-500",
          block.score && block.score >= 8 ? "bg-accent" :
          block.score && block.score >= 5 ? "bg-primary" :
          block.score ? "bg-red-500" : "bg-transparent"
        )} style={{ width: `${(block.score || 0) * 10}%` }} />
      </div>
    </div>
  );
}
