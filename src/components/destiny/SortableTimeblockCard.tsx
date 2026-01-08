'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ResizableTimeblockCard from './ResizableTimeblockCard';
import { cn } from '@/lib/utils';
import type { Timeblock } from '@/types/destiny';

type SortableTimeblockCardProps = {
  block: Timeblock;
  allBlocks: Timeblock[];
  disabled?: boolean;
  onResizeError?: (error: string) => void;
};

export default function SortableTimeblockCard({
  block,
  allBlocks,
  disabled,
  onResizeError,
}: SortableTimeblockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && 'z-50 opacity-90 shadow-2xl shadow-[rgba(6,182,212,0.4)]'
      )}
    >
      <ResizableTimeblockCard
        block={block}
        allBlocks={allBlocks}
        dragHandleProps={{ listeners, attributes }}
        isDragging={isDragging}
        onResizeError={onResizeError}
      />
    </div>
  );
}
