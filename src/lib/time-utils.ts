// Time configuration constants for timeblock scheduling
export const TIME_CONFIG = {
  MIN_HOUR: 0,      // 00:00 - earliest allowed time
  MAX_HOUR: 23,     // 23:00 - latest allowed start time (end can be 24:00)
  DEFAULT_START: 6, // 06:00 - default view start hour
  DEFAULT_END: 23,  // 23:00 - default view end hour
  INTERVAL: 30,     // 30-minute increments for time selection
} as const;

export type TimeConfig = typeof TIME_CONFIG;

// Convert HH:MM string to total minutes from midnight
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes from midnight to HH:MM string
export function minutesToTime(minutes: number): string {
  const clampedMinutes = Math.max(0, Math.min(24 * 60, minutes));
  const h = Math.floor(clampedMinutes / 60);
  const m = clampedMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Snap minutes to nearest increment
export function snapToIncrement(minutes: number, increment: number = TIME_CONFIG.INTERVAL): number {
  return Math.round(minutes / increment) * increment;
}

// Calculate new time based on pixel delta
export function calculateNewTime(
  initialTime: string,
  deltaY: number,
  pixelsPerMinute: number,
  _edge: 'top' | 'bottom'
): string {
  const initialMinutes = timeToMinutes(initialTime);
  // Positive deltaY = dragging down = increase time for both edges
  const minutesDelta = deltaY / pixelsPerMinute;
  const newMinutes = snapToIncrement(initialMinutes + minutesDelta);
  return minutesToTime(newMinutes);
}

// Validate resize constraints
export function validateResize(
  edge: 'top' | 'bottom',
  newTime: string,
  startTime: string,
  endTime: string,
  allBlocks: Array<{ id: string; startTime: string; endTime: string }>,
  currentBlockId: string
): { valid: boolean; reason?: string } {
  const MIN_DURATION = 5; // 5 minutes minimum

  const newStart = edge === 'top' ? newTime : startTime;
  const newEnd = edge === 'bottom' ? newTime : endTime;

  const startMinutes = timeToMinutes(newStart);
  const endMinutes = timeToMinutes(newEnd);

  // Check minimum duration
  if (endMinutes - startMinutes < MIN_DURATION) {
    return { valid: false, reason: 'minimum_duration' };
  }

  // Check boundaries
  if (startMinutes < TIME_CONFIG.MIN_HOUR * 60 || endMinutes > 24 * 60) {
    return { valid: false, reason: 'boundary' };
  }

  // Check overlaps with other blocks
  const hasOverlap = allBlocks.some(block => {
    if (block.id === currentBlockId) return false;
    const blockStart = timeToMinutes(block.startTime);
    const blockEnd = timeToMinutes(block.endTime);
    return startMinutes < blockEnd && endMinutes > blockStart;
  });

  if (hasOverlap) {
    return { valid: false, reason: 'overlap' };
  }

  return { valid: true };
}
