'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import TimeblockCard from './TimeblockCard';
import TimeblockAddButton from './TimeblockAddButton';
import type { Timeblock } from '@/types/destiny';

type TimeblockListProps = {
  dayId: string;
  initialBlocks: Timeblock[];
};

export default function TimeblockList({ dayId, initialBlocks }: TimeblockListProps) {
  const t = useTranslations('Destiny');
  const [blocks, setBlocks] = useState(initialBlocks);
  const listContainerRef = useRef<HTMLDivElement>(null);

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
          <TimeblockAddButton dayId={dayId} variant="inline" />
        </div>
      ) : (
        <>
          <div
            ref={listContainerRef}
            className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {blocks.map((block) => (
              <div key={block.id} data-timeblock-card>
                <TimeblockCard block={block} />
              </div>
            ))}
          </div>

          <TimeblockAddButton dayId={dayId} variant="inline" />
        </>
      )}
    </section>
  );
}
