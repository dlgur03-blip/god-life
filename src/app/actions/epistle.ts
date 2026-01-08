'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isDateAccessible } from "@/lib/date-utils";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) throw new Error("User not found");
  return user;
}

export async function getEpistle(date: string) {
  const user = await getUser();
  return await prisma.epistleDay.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: date
      }
    }
  });
}

export async function upsertEpistle(date: string, data: {
  toYesterday?: string;
  toTomorrow?: string;
  mood?: string;
}) {
  const user = await getUser();

  // Validate date accessibility - only today can be written
  if (!isDateAccessible(date)) {
    throw new Error("dateNotAccessible");
  }

  await prisma.epistleDay.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: date
      }
    },
    update: data,
    create: {
      userId: user.id,
      date,
      ...data
    }
  });

  revalidatePath('/epistle/timeline');
  revalidatePath('/epistle/day/[date]');
}

export async function getEpistleTimeline() {
  const user = await getUser();
  return await prisma.epistleDay.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  });
}

export async function getYesterdayLetter(todayDate: string) {
  const user = await getUser();
  const yesterday = new Date(todayDate + 'T00:00:00');
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const epistle = await prisma.epistleDay.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: yesterdayStr
      }
    },
    select: {
      toTomorrow: true,
      mood: true,
      date: true
    }
  });

  return epistle;
}
