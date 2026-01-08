export type ResizeEdge = 'top' | 'bottom';

export type ResizeState = {
  isResizing: boolean;
  edge: ResizeEdge | null;
  blockId: string | null;
  initialY: number;
  initialTime: string;       // Original time value
  currentTime: string;       // Preview time during drag
  pixelsPerMinute: number;   // Calculated from container height
};

export type ResizeCallbacks = {
  onResizeStart: (blockId: string, edge: ResizeEdge, e: PointerEvent) => void;
  onResizeMove: (e: PointerEvent) => void;
  onResizeEnd: (e: PointerEvent) => void;
};
