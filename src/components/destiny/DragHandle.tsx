'use client';

import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { DraggableAttributes } from '@dnd-kit/core';

type DragHandleProps = {
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
  isDragging?: boolean;
};

export default function DragHandle({ listeners, attributes, isDragging }: DragHandleProps) {
  return (
    <button
      type="button"
      {...listeners}
      {...attributes}
      className={cn(
        "p-1 rounded cursor-grab active:cursor-grabbing",
        "text-[#6b7280] hover:text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)]",
        "transition-colors touch-none",
        isDragging && "text-[#06b6d4]"
      )}
    >
      <GripVertical size={20} />
    </button>
  );
}
