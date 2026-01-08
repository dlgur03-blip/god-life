'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { calculateNewTime, validateResize } from '@/lib/time-utils';
import type { ResizeEdge, ResizeState } from '@/types/resize';

type UseResizeTimeblockOptions = {
  blockId: string;
  startTime: string;
  endTime: string;
  allBlocks: Array<{ id: string; startTime: string; endTime: string }>;
  containerHeightPx?: number; // Height representing 1 hour in pixels
  onResizeComplete: (startTime: string, endTime: string) => Promise<void>;
};

export function useResizeTimeblock({
  blockId,
  startTime,
  endTime,
  allBlocks,
  containerHeightPx = 60, // Default: 60px per hour
  onResizeComplete,
}: UseResizeTimeblockOptions) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    edge: null,
    blockId: null,
    initialY: 0,
    initialTime: '',
    currentTime: '',
    pixelsPerMinute: containerHeightPx / 60,
  });

  const [isValid, setIsValid] = useState(true);
  const [hoveredEdge, setHoveredEdge] = useState<ResizeEdge | null>(null);

  // Refs for performance during drag
  const resizeStateRef = useRef(resizeState);
  const startTimeRef = useRef(startTime);
  const endTimeRef = useRef(endTime);

  useEffect(() => {
    resizeStateRef.current = resizeState;
  }, [resizeState]);

  useEffect(() => {
    startTimeRef.current = startTime;
    endTimeRef.current = endTime;
  }, [startTime, endTime]);

  const handlePointerDown = useCallback(
    (edge: ResizeEdge, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const initialTime = edge === 'top' ? startTime : endTime;

      setResizeState({
        isResizing: true,
        edge,
        blockId,
        initialY: e.clientY,
        initialTime,
        currentTime: initialTime,
        pixelsPerMinute: containerHeightPx / 60,
      });

      // Capture pointer for smooth dragging
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [blockId, startTime, endTime, containerHeightPx]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state.isResizing || !state.edge) return;

      const deltaY = e.clientY - state.initialY;
      const newTime = calculateNewTime(
        state.initialTime,
        deltaY,
        state.pixelsPerMinute,
        state.edge
      );

      // Validate
      const validation = validateResize(
        state.edge,
        newTime,
        startTimeRef.current,
        endTimeRef.current,
        allBlocks,
        blockId
      );

      setIsValid(validation.valid);
      setResizeState((prev) => ({ ...prev, currentTime: newTime }));
    },
    [allBlocks, blockId]
  );

  const handlePointerUp = useCallback(
    async (e: React.PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state.isResizing || !state.edge) return;

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      const newStart = state.edge === 'top' ? state.currentTime : startTimeRef.current;
      const newEnd = state.edge === 'bottom' ? state.currentTime : endTimeRef.current;

      // Validate final values
      const validation = validateResize(
        state.edge,
        state.currentTime,
        startTimeRef.current,
        endTimeRef.current,
        allBlocks,
        blockId
      );

      if (validation.valid && state.currentTime !== state.initialTime) {
        try {
          await onResizeComplete(newStart, newEnd);
        } catch (error) {
          console.error('Failed to save resize:', error);
          // Rollback handled by parent component re-render
        }
      }

      // Reset state
      setResizeState({
        isResizing: false,
        edge: null,
        blockId: null,
        initialY: 0,
        initialTime: '',
        currentTime: '',
        pixelsPerMinute: containerHeightPx / 60,
      });
      setIsValid(true);
    },
    [allBlocks, blockId, containerHeightPx, onResizeComplete]
  );

  return {
    resizeState,
    isValid,
    hoveredEdge,
    setHoveredEdge,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
