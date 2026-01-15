'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar } from 'lucide-react';
import TimeblockCard from './TimeblockCard';
import TimeblockAddButton from './TimeblockAddButton';
import { createAllTimeblocks } from '@/app/actions/destiny';
import type { Timeblock } from '@/types/destiny';

type TimeblockListProps = {
  dayId: string;
  initialBlocks: Timeblock[];
  isToday?: boolean;
  isYesterday?: boolean;
};

export default function TimeblockList({ dayId, initialBlocks, isToday = false, isYesterday = false }: TimeblockListProps) {
  const t = useTranslations('Destiny');
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isCreatingAll, setIsCreatingAll] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleCreateAll = async () => {
    if (isCreatingAll) return;
    setIsCreatingAll(true);
    try {
      await createAllTimeblocks(dayId);
    } catch (e) {
      console.error('Failed to create all timeblocks:', e);
    } finally {
      setIsCreatingAll(false);
    }
  };

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  // Auto-scroll to current time on mobile
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile || !listContainerRef.current || blocks.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    let closestBlockIndex = 0;
    let minDiff = Infinity;

    blocks.forEach((block, index) => {
      const [h, m] = block.startTime.split(':').map(Number);
      const blockMinutes = h * 60 + m;
      const diff = Math.abs(blockMinutes - currentTimeInMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closestBlockIndex = index;
      }
    });

    const timer = setTimeout(() => {
      const cards = listContainerRef.current?.querySelectorAll('[data-timeblock-card]');
      if (cards && cards[closestBlockIndex]) {
        cards[closestBlockIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [blocks]);

  return (
    <section className="space-y-4 mt-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider">
            {t('timeblocks')}
          </h2>
          {blocks.length > 0 && (
            <span className="text-xs text-[#6b7280]">
              {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
            </span>
          )}
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8 text-[#6b7280]">
          <p className="text-sm mb-4">{t('timeblock.noBlocks')}</p>
          {isToday && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={handleCreateAll}
                disabled={isCreatingAll}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/50 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                {isCreatingAll ? t('timeblock.creating') : t('timeblock.create24h')}
              </button>
              <span className="text-xs text-[var(--foreground-muted)]">{t('or')}</span>
              <TimeblockAddButton dayId={dayId} variant="inline" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            ref={listContainerRef}
            className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {blocks.map((block) => (
              <div key={block.id} data-timeblock-card>
                <TimeblockCard block={block} isYesterday={isYesterday} isToday={isToday} />
              </div>
            ))}
          </div>

          {isToday && <TimeblockAddButton dayId={dayId} variant="inline" />}
        </>
      )}
    </section>
  );
}
