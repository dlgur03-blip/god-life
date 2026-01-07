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

  // 2. If not exists, create day and 11 blocks
  if (!day) {
    // Transaction to ensure atomicity
    day = await prisma.$transaction(async (tx) => {
      const newDay = await tx.destinyDay.create({
        data: {
          userId: user.id,
          date: date,
        },
      });

      // Create 11 blocks (Sequence 1 to 11)
      // Standard Destiny blocks often start from 5:00 or 6:00, but we'll just use seq 1-11 as generic slots for now
      // or map them to specific times if defined. Using 06:00 as start based on typical "Miracle Morning" context.
      const blocksData = Array.from({ length: 11 }, (_, i) => ({
        dayId: newDay.id,
        seq: i + 1,
        startTime: `${String(6 + i).padStart(2, '0')}:00`, // 06:00, 07:00 ...
        endTime: `${String(7 + i).padStart(2, '0')}:00`,
        status: 'planned',
      }));

      // SQLite does not support createMany in standard Prisma
      await Promise.all(blocksData.map(block => 
        tx.destinyTimeBlock.create({ data: block })
      ));

      return await tx.destinyDay.findUnique({
        where: { id: newDay.id },
        include: {
          timeblocks: { orderBy: { seq: 'asc' } },
          events: { orderBy: { recordedAt: 'asc' } },
        },
      });
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
