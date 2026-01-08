'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { createTimeblock } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';

type TimeblockAddButtonProps = {
  dayId: string;
  afterSeq?: number;
  variant?: 'inline' | 'floating';
};

export default function TimeblockAddButton({ dayId, afterSeq, variant = 'inline' }: TimeblockAddButtonProps) {
  const t = useTranslations('Destiny.timeblock');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await createTimeblock(dayId, afterSeq);
    } catch (e) {
      console.error('Failed to create timeblock:', e);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleAdd}
        disabled={loading}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full z-40",
          "bg-[#06b6d4] hover:bg-[#0891b2] shadow-lg shadow-[rgba(6,182,212,0.3)]",
          "transition-all hover:scale-110",
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        <Plus size={24} className="text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={cn(
        "w-full py-3 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.1)]",
        "hover:border-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)]",
        "flex items-center justify-center gap-2 text-[#6b7280] hover:text-[#06b6d4]",
        "transition-all",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      <Plus size={20} />
      <span className="text-sm">{loading ? t('adding') : t('addBlock')}</span>
    </button>
  );
}
