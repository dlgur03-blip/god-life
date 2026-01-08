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
  const [yesterday, setYesterday] = useState(initialData?.toYesterday || '');
  const [tomorrow, setTomorrow] = useState(initialData?.toTomorrow || '');
  const [mood, setMood] = useState(initialData?.mood || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (readOnly) return;
    setIsSaving(true);
    await upsertEpistle(date, {
      toYesterday: yesterday,
      toTomorrow: tomorrow,
      mood: mood
    });
    setIsSaving(false);
  };

  return (
    <div className={cn("space-y-8", readOnly && "opacity-80")}>
      {/* Read Only Badge */}
      {readOnly && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
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
              !readOnly && "hover:bg-white/10",
              mood === m ? "bg-white/20 scale-125" : "opacity-50",
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
          "bg-white/5 border border-white/10 rounded-2xl p-6 relative group transition-colors",
          !readOnly && "focus-within:border-secondary/50"
        )}>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
            {t('letterToYesterday')}
          </label>
          <textarea
            value={yesterday}
            onChange={(e) => !readOnly && setYesterday(e.target.value)}
            placeholder={t('reflectOnPassed')}
            readOnly={readOnly}
            aria-readonly={readOnly}
            className={cn(
              "w-full h-64 bg-transparent resize-none outline-none text-gray-200 leading-relaxed font-serif placeholder:italic placeholder:text-gray-600",
              readOnly && "cursor-default"
            )}
          />
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-6xl font-serif text-white">❝</span>
          </div>
        </div>

        {/* To Tomorrow */}
        <div className={cn(
          "bg-white/5 border border-white/10 rounded-2xl p-6 relative group transition-colors",
          !readOnly && "focus-within:border-primary/50"
        )}>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
            {t('letterToTomorrow')}
          </label>
          <textarea
            value={tomorrow}
            onChange={(e) => !readOnly && setTomorrow(e.target.value)}
            placeholder={t('manifestIntent')}
            readOnly={readOnly}
            aria-readonly={readOnly}
            className={cn(
              "w-full h-64 bg-transparent resize-none outline-none text-gray-200 leading-relaxed font-serif placeholder:italic placeholder:text-gray-600",
              readOnly && "cursor-default"
            )}
          />
          <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none rotate-180">
            <span className="text-6xl font-serif text-white">❝</span>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? t('sealing') : t('sealEpistle')}
          </button>
        </div>
      )}
    </div>
  );
}
