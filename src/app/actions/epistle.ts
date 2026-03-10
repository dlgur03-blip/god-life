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
  gratitude1?: string;
  gratitude2?: string;
  gratitude3?: string;
  important1?: string;
  important2?: string;
  important3?: string;
  anger?: string;
  leisure1?: string;
  leisure2?: string;
  leisure3?: string;
  reflection1?: string;
  reflection2?: string;
  reflection3?: string;
}) {
  const user = await getUser();

  // Validate date accessibility - today and yesterday can be written
  const { getUserTimezone } = await import('@/lib/timezone');
  const timezone = await getUserTimezone();
  if (!isDateAccessible(date, timezone)) {
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
