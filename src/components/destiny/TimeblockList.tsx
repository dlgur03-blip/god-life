'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorderTimeblocks } from '@/app/actions/destiny';
import SortableTimeblockCard from './SortableTimeblockCard';
import TimeblockAddButton from './TimeblockAddButton';
import TemplateActionBar from './TemplateActionBar';
import type { Timeblock } from '@/types/destiny';
import { TIME_CONFIG } from '@/lib/time-utils';

type TimeblockListProps = {
  dayId: string;
  initialBlocks: Timeblock[];
};

export default function TimeblockList({ dayId, initialBlocks }: TimeblockListProps) {
  const t = useTranslations('Destiny');
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isReordering, setIsReordering] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mobile
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile || !listContainerRef.current || blocks.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Find the block closest to current time
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

    // Scroll to the closest block with a small delay for DOM to settle
    const timer = setTimeout(() => {
      const cards = listContainerRef.current?.querySelectorAll('[data-timeblock-card]');
      if (cards && cards[closestBlockIndex]) {
        cards[closestBlockIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [blocks]);

  const handleResizeError = useCallback((error: string) => {
    // TODO: Replace with toast notification when toast library is added
    console.error('Resize error:', error);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsReordering(true);

      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);

      try {
        await reorderTimeblocks(dayId, newBlocks.map(b => b.id));
      } catch (e) {
        setBlocks(blocks);
        console.error('Failed to reorder:', e);
      } finally {
        setIsReordering(false);
      }
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider">
            {t('timeblocks')}
          </h2>
          <span className="text-xs text-[#6b7280]">
            {blocks.length} blocks
          </span>
        </div>
        <TemplateActionBar dayId={dayId} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={listContainerRef}
            className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {blocks.map((block, index) => (
              <div key={block.id} data-timeblock-card>
                <SortableTimeblockCard
                  block={block}
                  allBlocks={blocks}
                  disabled={isReordering}
                  onResizeError={handleResizeError}
                />
                {index < blocks.length - 1 && (
                  <div className="my-2 opacity-0 hover:opacity-100 transition-opacity">
                    <TimeblockAddButton dayId={dayId} afterSeq={block.seq} variant="inline" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <TimeblockAddButton dayId={dayId} variant="inline" />
    </section>
  );
}
