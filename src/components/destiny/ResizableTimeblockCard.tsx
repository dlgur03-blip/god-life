'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { updateTimeblockTime } from '@/app/actions/destiny';
import { useResizeTimeblock } from '@/hooks/useResizeTimeblock';
import ResizeHandle from './ResizeHandle';
import TimePreviewTooltip from './TimePreviewTooltip';
import TimeblockCard from './TimeblockCard';
import type { Timeblock } from '@/types/destiny';
import type { DraggableSyntheticListeners, DraggableAttributes } from '@dnd-kit/core';

type DragHandlePropsType = {
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
};

type ResizableTimeblockCardProps = {
  block: Timeblock;
  allBlocks: Timeblock[];
  dragHandleProps?: DragHandlePropsType;
  isDragging?: boolean;
  onResizeError?: (error: string) => void;
};

export default function ResizableTimeblockCard({
  block,
  allBlocks,
  dragHandleProps,
  isDragging,
  onResizeError,
}: ResizableTimeblockCardProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleResizeComplete = useCallback(
    async (newStart: string, newEnd: string) => {
      setIsSaving(true);
      try {
        const result = await updateTimeblockTime(block.id, newStart, newEnd);

        // Handle new return type
        if (result && 'success' in result && !result.success) {
          const message = result.error || 'Failed to save';
          onResizeError?.(message);
          throw new Error(message); // Re-throw to signal failure to hook
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save';
        console.error('[ResizableTimeblockCard] Resize error:', message);
        onResizeError?.(message);
        throw error; // Re-throw to signal failure to hook
      } finally {
        setIsSaving(false);
      }
    },
    [block.id, onResizeError]
  );

  const {
    resizeState,
    isValid,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useResizeTimeblock({
    blockId: block.id,
    startTime: block.startTime,
    endTime: block.endTime,
    allBlocks: allBlocks.map((b) => ({
      id: b.id,
      startTime: b.startTime,
      endTime: b.endTime,
    })),
    onResizeComplete: handleResizeComplete,
  });

  // Don't show resize handles while drag-reordering
  const showResizeHandles = !isDragging;

  return (
    <div
      className={cn(
        'group relative',
        resizeState.isResizing && 'z-30',
        isSaving && 'opacity-70 pointer-events-none'
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Top Resize Handle */}
      {showResizeHandles && (
        <>
          <ResizeHandle
            edge="top"
            isActive={resizeState.isResizing && resizeState.edge === 'top'}
            onPointerDown={(e) => handlePointerDown('top', e)}
          />
          {resizeState.isResizing && resizeState.edge === 'top' && (
            <TimePreviewTooltip
              time={resizeState.currentTime}
              edge="top"
              isValid={isValid}
              visible={true}
            />
          )}
        </>
      )}

      {/* The actual card */}
      <TimeblockCard
        block={{
          ...block,
          // Show preview time during resize
          startTime:
            resizeState.isResizing && resizeState.edge === 'top'
              ? resizeState.currentTime
              : block.startTime,
          endTime:
            resizeState.isResizing && resizeState.edge === 'bottom'
              ? resizeState.currentTime
              : block.endTime,
        }}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
      />

      {/* Bottom Resize Handle */}
      {showResizeHandles && (
        <>
          <ResizeHandle
            edge="bottom"
            isActive={resizeState.isResizing && resizeState.edge === 'bottom'}
            onPointerDown={(e) => handlePointerDown('bottom', e)}
          />
          {resizeState.isResizing && resizeState.edge === 'bottom' && (
            <TimePreviewTooltip
              time={resizeState.currentTime}
              edge="bottom"
              isValid={isValid}
              visible={true}
            />
          )}
        </>
      )}

      {/* Invalid resize overlay */}
      {resizeState.isResizing && !isValid && (
        <div className="absolute inset-0 rounded-xl border-2 border-[#ef4444] bg-[rgba(239,68,68,0.1)] pointer-events-none" />
      )}
    </div>
  );
}
