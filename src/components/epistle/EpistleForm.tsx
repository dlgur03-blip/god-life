'use client';

import { useState } from 'react';
import { upsertEpistle } from '@/app/actions/epistle';
import { cn } from '@/lib/utils';
import { Save, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EpistleData {
  toYesterday?: string | null;
  toTomorrow?: string | null;
  mood?: string | null;
  gratitude1?: string | null;
  gratitude2?: string | null;
  gratitude3?: string | null;
  important1?: string | null;
  important2?: string | null;
  important3?: string | null;
  anger?: string | null;
  leisure1?: string | null;
  leisure2?: string | null;
  leisure3?: string | null;
  reflection1?: string | null;
  reflection2?: string | null;
  reflection3?: string | null;
}

export default function EpistleForm({
  date,
  initialData,
  readOnly = false
}: {
  date: string;
  initialData: EpistleData | null;
  readOnly?: boolean;
}) {
  const t = useTranslations('Epistle');
  const tCommon = useTranslations('Common');

  // Legacy fields
  const [yesterday, setYesterday] = useState(initialData?.toYesterday || '');
  const [tomorrow, setTomorrow] = useState(initialData?.toTomorrow || '');
  const [mood, setMood] = useState(initialData?.mood || '');

  // Fixed fields for toYesterday
  const [gratitude1, setGratitude1] = useState(initialData?.gratitude1 || '');
  const [gratitude2, setGratitude2] = useState(initialData?.gratitude2 || '');
  const [gratitude3, setGratitude3] = useState(initialData?.gratitude3 || '');
  const [important1, setImportant1] = useState(initialData?.important1 || '');
  const [important2, setImportant2] = useState(initialData?.important2 || '');
  const [important3, setImportant3] = useState(initialData?.important3 || '');
  const [anger, setAnger] = useState(initialData?.anger || '');
  const [leisure1, setLeisure1] = useState(initialData?.leisure1 || '');
  const [leisure2, setLeisure2] = useState(initialData?.leisure2 || '');
  const [leisure3, setLeisure3] = useState(initialData?.leisure3 || '');

  // Fixed fields for toTomorrow
  const [reflection1, setReflection1] = useState(initialData?.reflection1 || '');
  const [reflection2, setReflection2] = useState(initialData?.reflection2 || '');
  const [reflection3, setReflection3] = useState(initialData?.reflection3 || '');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (readOnly) return;
    setIsSaving(true);
    setError(null);

    try {
      await upsertEpistle(date, {
        toYesterday: yesterday,
        toTomorrow: tomorrow,
        mood: mood,
        gratitude1, gratitude2, gratitude3,
        important1, important2, important3,
        anger,
        leisure1, leisure2, leisure3,
        reflection1, reflection2, reflection3,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'unknown';
      setError(tCommon(`errors.${errorMessage}`));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("space-y-8", readOnly && "opacity-80")}>
      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg text-center bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 text-[var(--color-warning)]">
          {error}
        </div>
      )}

      {/* Read Only Badge */}
      {readOnly && (
        <div className="flex items-center justify-center gap-2 text-[var(--foreground-muted)] text-sm">
          <Lock className="w-4 h-4" />
          <span>{t('readOnly')}</span>
        </div>
      )}

      {/* Mood Selector */}
      <div className="flex justify-center gap-4">
        {['🌑', '🌒', '🌓', '🌕', '🌟'].map((m) => (
          <button
            key={m}
            onClick={() => !readOnly && setMood(m)}
            disabled={readOnly}
            className={cn(
              "text-2xl p-2 rounded-full transition-all",
              !readOnly && "hover:bg-[var(--color-card-hover)]",
              mood === m ? "bg-[var(--color-secondary)]/20 scale-125" : "opacity-50",
              readOnly && "cursor-default"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* To Yesterday - Fixed Fields */}
        <div className={cn(
          "bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 relative group transition-colors space-y-4",
          !readOnly && "focus-within:border-[var(--color-secondary)]/50"
        )}>
          <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
            {t('letterToYesterday')}
          </label>

          {/* Gratitude (3) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-success)]">{t('fixedFields.gratitude')}</span>
            {[gratitude1, gratitude2, gratitude3].map((val, i) => (
              <input
                key={`gratitude-${i}`}
                type="text"
                value={val}
                onChange={(e) => !readOnly && [setGratitude1, setGratitude2, setGratitude3][i](e.target.value)}
                placeholder={`${i + 1}. ${t('fixedFields.gratitudePlaceholder')}`}
                readOnly={readOnly}
                className="w-full bg-transparent border-b border-[var(--color-border)] py-2 outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-sm"
              />
            ))}
          </div>

          {/* Important (3) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-primary)]">{t('fixedFields.important')}</span>
            {[important1, important2, important3].map((val, i) => (
              <input
                key={`important-${i}`}
                type="text"
                value={val}
                onChange={(e) => !readOnly && [setImportant1, setImportant2, setImportant3][i](e.target.value)}
                placeholder={`${i + 1}. ${t('fixedFields.importantPlaceholder')}`}
                readOnly={readOnly}
                className="w-full bg-transparent border-b border-[var(--color-border)] py-2 outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-sm"
              />
            ))}
          </div>

          {/* Anger (1) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-error)]">{t('fixedFields.anger')}</span>
            <input
              type="text"
              value={anger}
              onChange={(e) => !readOnly && setAnger(e.target.value)}
              placeholder={t('fixedFields.angerPlaceholder')}
              readOnly={readOnly}
              className="w-full bg-transparent border-b border-[var(--color-border)] py-2 outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-sm"
            />
          </div>

          {/* Leisure (3) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-accent)]">{t('fixedFields.leisure')}</span>
            {[leisure1, leisure2, leisure3].map((val, i) => (
              <input
                key={`leisure-${i}`}
                type="text"
                value={val}
                onChange={(e) => !readOnly && [setLeisure1, setLeisure2, setLeisure3][i](e.target.value)}
                placeholder={`${i + 1}. ${t('fixedFields.leisurePlaceholder')}`}
                readOnly={readOnly}
                className="w-full bg-transparent border-b border-[var(--color-border)] py-2 outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-sm"
              />
            ))}
          </div>

          {/* Free-form (legacy) */}
          <div className="pt-2">
            <textarea
              value={yesterday}
              onChange={(e) => !readOnly && setYesterday(e.target.value)}
              placeholder={t('reflectOnPassed')}
              readOnly={readOnly}
              aria-readonly={readOnly}
              className={cn(
                "w-full h-24 bg-transparent resize-none outline-none text-[var(--foreground)] leading-relaxed font-serif placeholder:italic placeholder:text-[var(--foreground-muted)] text-sm",
                readOnly && "cursor-default"
              )}
            />
          </div>
        </div>

        {/* To Tomorrow - Fixed Fields */}
        <div className={cn(
          "bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 relative group transition-colors space-y-4",
          !readOnly && "focus-within:border-[var(--color-primary)]/50"
        )}>
          <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
            {t('letterToTomorrow')}
          </label>

          {/* Reflection (3) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-warning)]">{t('fixedFields.reflection')}</span>
            {[reflection1, reflection2, reflection3].map((val, i) => (
              <input
                key={`reflection-${i}`}
                type="text"
                value={val}
                onChange={(e) => !readOnly && [setReflection1, setReflection2, setReflection3][i](e.target.value)}
                placeholder={`${i + 1}. ${t('fixedFields.reflectionPlaceholder')}`}
                readOnly={readOnly}
                className="w-full bg-transparent border-b border-[var(--color-border)] py-2 outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-sm"
              />
            ))}
          </div>

          {/* Free-form (legacy) */}
          <div className="pt-4">
            <textarea
              value={tomorrow}
              onChange={(e) => !readOnly && setTomorrow(e.target.value)}
              placeholder={t('manifestIntent')}
              readOnly={readOnly}
              aria-readonly={readOnly}
              className={cn(
                "w-full h-48 bg-transparent resize-none outline-none text-[var(--foreground)] leading-relaxed font-serif placeholder:italic placeholder:text-[var(--foreground-muted)] text-sm",
                readOnly && "cursor-default"
              )}
            />
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/50 px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? t('sealing') : t('sealEpistle')}
          </button>
        </div>
      )}
    </div>
  );
}
