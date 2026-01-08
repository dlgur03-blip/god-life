'use client';

import { Mail, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReceivedLetterCardProps {
  content: string | null;
  fromDate: string;
  mood?: string | null;
}

export default function ReceivedLetterCard({ content, fromDate, mood }: ReceivedLetterCardProps) {
  const t = useTranslations('Epistle');

  if (!content) {
    return (
      <div className="bg-[rgba(167,139,250,0.05)] border border-[rgba(167,139,250,0.2)] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 text-[#a78bfa] mb-4">
          <Mail className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">{t('receivedLetter')}</span>
        </div>
        <p className="text-gray-500 italic text-center py-8">{t('noLetterFromYesterday')}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.3)] rounded-2xl p-6 mb-8 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
      role="article"
      aria-label={t('receivedLetterFrom', { date: fromDate })}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#a78bfa]">
          <Mail className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">{t('receivedLetter')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          {mood && <span className="text-lg">{mood}</span>}
          <Calendar className="w-4 h-4" />
          <span className="font-mono">{fromDate}</span>
        </div>
      </div>
      <div className="relative">
        <p className="text-gray-200 leading-relaxed font-serif whitespace-pre-wrap" aria-readonly="true">
          {content}
        </p>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <span className="text-4xl font-serif text-[#a78bfa]">✉</span>
        </div>
      </div>
    </div>
  );
}
