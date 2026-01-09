'use client';

import { useState } from 'react';
import { upsertEpistle } from '@/app/actions/epistle';
import { cn } from '@/lib/utils';
import { Save, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EpistleForm({
  date,
  initialData,
  readOnly = false
}: {
  date: string;
  initialData: { toYesterday?: string | null; toTomorrow?: string | null; mood?: string | null } | null;
  readOnly?: boolean;
}) {
  const t = useTranslations('Epistle');
  const tCommon = useTranslations('Common');
  const [yesterday, setYesterday] = useState(initialData?.toYesterday || '');
  const [tomorrow, setTomorrow] = useState(initialData?.toTomorrow || '');
  const [mood, setMood] = useState(initialData?.mood || '');
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
        mood: mood
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
        {/* To Yesterday */}
        <div className={cn(
          "bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 relative group transition-colors",
          !readOnly && "focus-within:border-[var(--color-secondary)]/50"
        )}>
          <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase mb-4 tracking-widest">
            {t('letterToYesterday')}
          </label>
          <textarea
            value={yesterday}
            onChange={(e) => !readOnly && setYesterday(e.target.value)}
            placeholder={t('reflectOnPassed')}
            readOnly={readOnly}
            aria-readonly={readOnly}
            className={cn(
              "w-full h-64 bg-transparent resize-none outline-none text-[var(--foreground)] leading-relaxed font-serif placeholder:italic placeholder:text-[var(--foreground-muted)]",
              readOnly && "cursor-default"
            )}
          />
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-6xl font-serif text-[var(--foreground)]">❝</span>
          </div>
        </div>

        {/* To Tomorrow */}
        <div className={cn(
          "bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 relative group transition-colors",
          !readOnly && "focus-within:border-[var(--color-primary)]/50"
        )}>
          <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase mb-4 tracking-widest">
            {t('letterToTomorrow')}
          </label>
          <textarea
            value={tomorrow}
            onChange={(e) => !readOnly && setTomorrow(e.target.value)}
            placeholder={t('manifestIntent')}
            readOnly={readOnly}
            aria-readonly={readOnly}
            className={cn(
              "w-full h-64 bg-transparent resize-none outline-none text-[var(--foreground)] leading-relaxed font-serif placeholder:italic placeholder:text-[var(--foreground-muted)]",
              readOnly && "cursor-default"
            )}
          />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none rotate-180">
            <span className="text-6xl font-serif text-[var(--foreground)]">❝</span>
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
