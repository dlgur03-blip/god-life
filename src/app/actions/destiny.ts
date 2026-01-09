'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to get current user
async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) throw new Error("User not found");
  return user;
}

export async function getOrCreateDestinyDay(date: string) {
  const user = await getUser();

  // 1. Try to find existing day
  let day = await prisma.destinyDay.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: date,
      },
    },
    include: {
      timeblocks: {
        orderBy: { seq: 'asc' },
      },
      events: {
        orderBy: { recordedAt: 'asc' },
      }
    },
  });

  // 2. If not exists, create day (no default blocks - user adds as needed)
  if (!day) {
    day = await prisma.destinyDay.create({
      data: {
        userId: user.id,
        date: date,
      },
      include: {
        timeblocks: { orderBy: { seq: 'asc' } },
        events: { orderBy: { recordedAt: 'asc' } },
      },
    });
  }

  return day!; // Non-null assertion as we just created it if missing
}

export async function updateDestinyGoals(dayId: string, goals: {
  ultimate?: string;
  long?: string;
  month?: string;
  week?: string;
  today?: string;
}) {
  await getUser(); // Auth check

  await prisma.destinyDay.update({
    where: { id: dayId },
    data: {
      goalUltimate: goals.ultimate,
      goalLong: goals.long,
      goalMonth: goals.month,
      goalWeek: goals.week,
      goalToday: goals.today,
    },
  });

  revalidatePath('/destiny/day/[date]');
}

// Upsert Weekly Plan for a slot (0-6)
export async function updateWeeklyPlan(slot: number, content: string): Promise<{ id: string }> {
  const user = await getUser();

  if (slot < 0 || slot > 6) {
    throw new Error('Invalid slot');
  }

  const plan = await prisma.weeklyPlan.upsert({
    where: {
      userId_slot: {
        userId: user.id,
        slot: slot,
      },
    },
    update: { content },
    create: {
      userId: user.id,
      slot: slot,
      content,
    },
  });

  revalidatePath('/destiny/day/[date]');
  return { id: plan.id };
}

// Delete Weekly Plan for a slot
export async function deleteWeeklyPlan(id: string) {
  await getUser();
  await prisma.weeklyPlan.delete({ where: { id } });
  revalidatePath('/destiny/day/[date]');
}

// Get all 7 Weekly Plan slots
export async function getWeeklyPlans(): Promise<Array<{ id: string; content: string }>> {
  const user = await getUser();

  const plans = await prisma.weeklyPlan.findMany({
    where: { userId: user.id },
    orderBy: { slot: 'asc' },
  });

  // Return array with 7 slots (empty slots have empty content)
  return Array.from({ length: 7 }, (_, i) => {
    const plan = plans.find(p => p.slot === i);
    return plan ? { id: plan.id, content: plan.content } : { id: '', content: '' };
  });
}

export async function updateTimeblock(blockId: string, data: {
  planText?: string | null;
  planLocation?: string | null;
  actualText?: string | null;
  score?: number | null;
  feedback?: string | null;
  status?: string;
}) {
  await getUser(); // Auth check

  await prisma.destinyTimeBlock.update({
    where: { id: blockId },
    data: {
      ...data,
      // If score is updated to > 0, auto-mark as completed if not specified
      status: data.status || (data.score !== undefined && data.score !== null && data.score > 0 ? 'completed' : undefined),
    },
  });

  revalidatePath('/destiny/day/[date]');
}

export async function createDestinyEvent(dayId: string, title: string) {
  const user = await getUser();

  await prisma.destinyEvent.create({
    data: {
      userId: user.id,
      dayId: dayId,
      title: title,
    },
  });

  revalidatePath('/destiny/day/[date]');
}

export async function updateDestinyEvent(eventId: string, title: string) {
  const user = await getUser();

  const event = await prisma.destinyEvent.findUnique({
    where: { id: eventId },
    select: { userId: true },
  });

  if (!event || event.userId !== user.id) {
    throw new Error('Event not found or unauthorized');
  }

  await prisma.destinyEvent.update({
    where: { id: eventId },
    data: { title },
  });

  revalidatePath('/destiny/day/[date]');
}

export async function deleteDestinyEvent(eventId: string) {
  const user = await getUser();

  const event = await prisma.destinyEvent.findUnique({
    where: { id: eventId },
    select: { userId: true },
  });

  if (!event || event.userId !== user.id) {
    throw new Error('Event not found or unauthorized');
  }

  await prisma.destinyEvent.delete({
    where: { id: eventId },
  });

  revalidatePath('/destiny/day/[date]');
}

// === TIME VALIDATION HELPERS ===

function validateTimeRange(startTime: string, endTime: string): { valid: boolean; error?: string } {
  try {
    // Null/undefined check
    if (!startTime || !endTime) {
      return { valid: false, error: 'Time values are required.' };
    }

    // Type check
    if (typeof startTime !== 'string' || typeof endTime !== 'string') {
      return { valid: false, error: 'Time values must be strings.' };
    }

    // Allow 24:00 as valid end time
    const timeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/;
    if (!timeRegex.test(startTime)) {
      return { valid: false, error: 'Invalid start time format. Use HH:MM.' };
    }
    if (!timeRegex.test(endTime)) {
      return { valid: false, error: 'Invalid end time format. Use HH:MM.' };
    }

    // Check 5-minute increments
    const startParts = startTime.split(':');
    const endParts = endTime.split(':');

    if (startParts.length !== 2 || endParts.length !== 2) {
      return { valid: false, error: 'Invalid time format.' };
    }

    const startMin = parseInt(startParts[1], 10);
    const endMin = parseInt(endParts[1], 10);

    if (isNaN(startMin) || isNaN(endMin)) {
      return { valid: false, error: 'Invalid time values.' };
    }

    if (startMin % 5 !== 0 || endMin % 5 !== 0) {
      return { valid: false, error: 'Time must be in 5-minute increments.' };
    }

    // Check endTime > startTime (24:00 is greater than any other time)
    if (endTime !== '24:00' && startTime >= endTime) {
      return { valid: false, error: 'End time must be after start time.' };
    }

    return { valid: true };
  } catch (error) {
    console.error('[validateTimeRange] Unexpected error:', error);
    return { valid: false, error: 'Time validation failed.' };
  }
}

async function checkTimeOverlap(
  dayId: string,
  startTime: string,
  endTime: string,
  excludeBlockId?: string
): Promise<boolean> {
  try {
    if (!dayId) {
      throw new Error('dayId is required');
    }

    const blocks = await prisma.destinyTimeBlock.findMany({
      where: { dayId, id: excludeBlockId ? { not: excludeBlockId } : undefined },
      select: { startTime: true, endTime: true },
    });

    return blocks.some(block => {
      // Overlap: new.start < existing.end AND new.end > existing.start
      return startTime < block.endTime && endTime > block.startTime;
    });
  } catch (error) {
    console.error('[checkTimeOverlap] Error:', error);
    throw error; // Re-throw to be caught by caller
  }
}

function addHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const newH = Math.min(h + 1, 24);
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Get current time rounded down to 5-minute increments
function getCurrentTimeRounded(): string {
  const now = new Date();
  const h = now.getHours();
  const m = Math.floor(now.getMinutes() / 5) * 5; // Round down to 5-min
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Get next full hour (e.g., 12:16 -> 13:00)
function getNextFullHour(time: string): string {
  const [h] = time.split(':').map(Number);
  const nextH = Math.min(h + 1, 24);
  return `${String(nextH).padStart(2, '0')}:00`;
}

// === NEW SERVER ACTIONS ===

export async function createTimeblock(dayId: string, afterSeq?: number) {
  await getUser();

  const existingBlocks = await prisma.destinyTimeBlock.findMany({
    where: { dayId },
    orderBy: { seq: 'asc' },
  });

  let newSeq: number;
  let startTime: string;
  let endTime: string;

  if (afterSeq !== undefined) {
    const afterBlock = existingBlocks.find(b => b.seq === afterSeq);
    if (afterBlock) {
      startTime = afterBlock.endTime;
      const nextBlock = existingBlocks.find(b => b.seq > afterSeq);
      endTime = nextBlock?.startTime || addHour(startTime);
    } else {
      const lastBlock = existingBlocks[existingBlocks.length - 1];
      if (lastBlock) {
        startTime = lastBlock.endTime;
        endTime = addHour(startTime);
      } else {
        // No existing blocks - use current time
        startTime = getCurrentTimeRounded();
        endTime = getNextFullHour(startTime);
      }
    }

    // Shift seq values of blocks after insertion point
    await prisma.destinyTimeBlock.updateMany({
      where: { dayId, seq: { gt: afterSeq } },
      data: { seq: { increment: 1 } },
    });
    newSeq = afterSeq + 1;
  } else {
    const maxSeq = existingBlocks.length > 0
      ? Math.max(...existingBlocks.map(b => b.seq))
      : 0;
    newSeq = maxSeq + 1;

    const lastBlock = existingBlocks[existingBlocks.length - 1];
    if (lastBlock) {
      // Continue from last block's end time to +1 hour
      startTime = lastBlock.endTime;
      endTime = addHour(startTime);
    } else {
      // First block: current time (rounded) to next full hour
      startTime = getCurrentTimeRounded();
      endTime = getNextFullHour(startTime);
    }
  }

  // Clamp to valid times
  if (endTime > '24:00') endTime = '24:00';
  if (startTime >= '24:00') {
    throw new Error('Cannot add more blocks. Day is full.');
  }

  const newBlock = await prisma.destinyTimeBlock.create({
    data: {
      dayId,
      seq: newSeq,
      startTime,
      endTime,
      status: 'planned',
    },
  });

  revalidatePath('/destiny/day/[date]');
  return newBlock;
}

export async function deleteTimeblock(blockId: string) {
  await getUser();

  const block = await prisma.destinyTimeBlock.findUnique({
    where: { id: blockId },
    select: { dayId: true, seq: true },
  });

  if (!block) throw new Error('Block not found');

  await prisma.destinyTimeBlock.delete({ where: { id: blockId } });

  // Resequence remaining blocks
  await prisma.destinyTimeBlock.updateMany({
    where: { dayId: block.dayId, seq: { gt: block.seq } },
    data: { seq: { decrement: 1 } },
  });

  revalidatePath('/destiny/day/[date]');
}

export async function reorderTimeblocks(dayId: string, orderedBlockIds: string[]) {
  await getUser();

  await prisma.$transaction(
    orderedBlockIds.map((id, index) =>
      prisma.destinyTimeBlock.update({
        where: { id },
        data: { seq: index + 1 },
      })
    )
  );

  revalidatePath('/destiny/day/[date]');
}

export async function updateTimeblockTime(
  blockId: string,
  startTime: string,
  endTime: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    // 1. Auth check with error handling
    let user;
    try {
      user = await getUser();
    } catch (authError) {
      console.error('[updateTimeblockTime] Auth error:', authError);
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 2. Validate blockId format (non-empty string)
    if (!blockId || typeof blockId !== 'string' || blockId.trim() === '') {
      console.error('[updateTimeblockTime] Invalid blockId:', blockId);
      return { success: false, error: 'INVALID_BLOCK_ID' };
    }

    // 3. Validate time range
    const validation = validateTimeRange(startTime, endTime);
    if (!validation.valid) {
      console.error('[updateTimeblockTime] Validation failed:', validation.error);
      return { success: false, error: validation.error || 'INVALID_TIME_RANGE' };
    }

    // 4. Find block with error handling
    let block;
    try {
      block = await prisma.destinyTimeBlock.findUnique({
        where: { id: blockId },
        select: { dayId: true },
      });
    } catch (dbError) {
      console.error('[updateTimeblockTime] Database error finding block:', dbError);
      return { success: false, error: 'DATABASE_ERROR' };
    }

    if (!block) {
      console.error('[updateTimeblockTime] Block not found:', blockId);
      return { success: false, error: 'BLOCK_NOT_FOUND' };
    }

    // 5. Update block (overlaps allowed)
    // Note: Overlap check removed - users can have overlapping timeblocks
    try {
      await prisma.destinyTimeBlock.update({
        where: { id: blockId },
        data: { startTime, endTime },
      });
    } catch (updateError) {
      console.error('[updateTimeblockTime] Update error:', updateError);
      return { success: false, error: 'UPDATE_FAILED' };
    }

    // 7. Revalidate with try-catch (critical for Server Components)
    try {
      revalidatePath('/destiny/day/[date]');
    } catch (revalidateError) {
      console.error('[updateTimeblockTime] Revalidate error:', revalidateError);
      // Don't fail the whole operation, update succeeded
    }

    return { success: true };
  } catch (unexpectedError) {
    console.error('[updateTimeblockTime] Unexpected error:', unexpectedError);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
}

// ============ TEMPLATE ACTIONS ============

export async function saveTemplate(dayId: string, name: string) {
  const user = await getUser();

  if (!name || name.trim().length === 0) {
    throw new Error('Template name is required');
  }

  if (name.length > 50) {
    throw new Error('Template name must be 50 characters or less');
  }

  // Get current day's timeblocks
  const day = await prisma.destinyDay.findUnique({
    where: { id: dayId },
    include: { timeblocks: { orderBy: { seq: 'asc' } } },
  });

  if (!day || day.userId !== user.id) {
    throw new Error('Day not found or unauthorized');
  }

  if (day.timeblocks.length === 0) {
    throw new Error('No timeblocks to save');
  }

  // Extract only the plan-related fields for template
  const templateBlocks = day.timeblocks.map((block, index) => ({
    seq: index + 1,
    startTime: block.startTime,
    endTime: block.endTime,
    planText: block.planText,
    planLocation: block.planLocation,
  }));

  // Upsert template (update if name exists, create if not)
  const template = await prisma.destinyTemplate.upsert({
    where: {
      userId_name: { userId: user.id, name: name.trim() },
    },
    update: {
      blocks: templateBlocks,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      name: name.trim(),
      blocks: templateBlocks,
    },
  });

  revalidatePath('/destiny');
  return template;
}

export async function getTemplates() {
  const user = await getUser();

  const templates = await prisma.destinyTemplate.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return templates;
}

export async function loadTemplate(dayId: string, templateId: string) {
  const user = await getUser();

  // Verify day ownership
  const day = await prisma.destinyDay.findUnique({
    where: { id: dayId },
  });

  if (!day || day.userId !== user.id) {
    throw new Error('Day not found or unauthorized');
  }

  // Fetch template
  const template = await prisma.destinyTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template || template.userId !== user.id) {
    throw new Error('Template not found or unauthorized');
  }

  const templateBlocks = template.blocks as Array<{
    seq: number;
    startTime: string;
    endTime: string;
    planText: string | null;
    planLocation: string | null;
  }>;

  // Use transaction: delete existing blocks, create new ones from template
  await prisma.$transaction(async (tx) => {
    // Delete all existing timeblocks for this day
    await tx.destinyTimeBlock.deleteMany({
      where: { dayId },
    });

    // Create new timeblocks from template
    await tx.destinyTimeBlock.createMany({
      data: templateBlocks.map((block) => ({
        dayId,
        seq: block.seq,
        startTime: block.startTime,
        endTime: block.endTime,
        planText: block.planText,
        planLocation: block.planLocation,
        status: 'planned',
      })),
    });
  });

  revalidatePath(`/destiny/day/${day.date}`);
  return { success: true };
}

export async function deleteTemplate(templateId: string) {
  const user = await getUser();

  const template = await prisma.destinyTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template || template.userId !== user.id) {
    throw new Error('Template not found or unauthorized');
  }

  await prisma.destinyTemplate.delete({
    where: { id: templateId },
  });

  revalidatePath('/destiny');
  return { success: true };
}
