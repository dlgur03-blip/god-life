'use client';

import { useState } from 'react';
import { upsertEpistle } from '@/app/actions/epistle';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EpistleForm({
  date,
  initialData
}: {
  date: string;
  initialData: { toYesterday?: string | null; toTomorrow?: string | null; mood?: string | null } | null;
}) {
  const t = useTranslations('Epistle');
  const [yesterday, setYesterday] = useState(initialData?.toYesterday || '');
  const [tomorrow, setTomorrow] = useState(initialData?.toTomorrow || '');
  const [mood, setMood] = useState(initialData?.mood || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await upsertEpistle(date, {
      toYesterday: yesterday,
      toTomorrow: tomorrow,
      mood: mood
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Mood Selector (Simple Text for now, or emojis) */}
      <div className="flex justify-center gap-4">
        {['🌑', '🌒', '🌓', '🌕', '🌟'].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={cn(
              "text-2xl p-2 rounded-full transition-all hover:bg-white/10",
              mood === m ? "bg-white/20 scale-125" : "opacity-50"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* To Yesterday */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group focus-within:border-secondary/50 transition-colors">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
            {t('letterToYesterday')}
          </label>
          <textarea
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder={t('reflectOnPassed')}
            className="w-full h-64 bg-transparent resize-none outline-none text-gray-200 leading-relaxed font-serif placeholder:italic placeholder:text-gray-600"
          />
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-6xl font-serif text-white">❝</span>
          </div>
        </div>

        {/* To Tomorrow */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group focus-within:border-primary/50 transition-colors">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
            {t('letterToTomorrow')}
          </label>
          <textarea
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder={t('manifestIntent')}
            className="w-full h-64 bg-transparent resize-none outline-none text-gray-200 leading-relaxed font-serif placeholder:italic placeholder:text-gray-600"
          />
           <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none rotate-180">
            <span className="text-6xl font-serif text-white">❝</span>
          </div>
        </div>
      </div>

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
    </div>
  );
}
