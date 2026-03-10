'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");
  return user;
}

export interface UserStats {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  destiny: {
    totalDays: number;
    totalTimeblocks: number;
    totalEvents: number;
    averageScore: number | null;
    completedBlocks: number;
  };
  success: {
    totalProjects: number;
    activeProjects: number;
    completedEntries: number;
    totalDaysLogged: number;
  };
  discipline: {
    totalRules: number;
    totalChecks: number;
    last7DaysRate: number;
    last30DaysRate: number;
    currentStreak: number;
  };
  epistle: {
    totalLetters: number;
    lastWrittenDate: string | null;
  };
}

export async function getUserStats(): Promise<UserStats> {
  const user = await getUser();

  // Parallel fetch all stats
  const [
    destinyDays,
    timeblocks,
    events,
    successProjects,
    successEntries,
    disciplineRules,
    disciplineChecks,
    epistleDays,
  ] = await Promise.all([
    prisma.destinyDay.count({ where: { userId: user.id } }),
    prisma.destinyTimeBlock.findMany({
      where: { day: { userId: user.id } },
      select: { score: true, status: true },
    }),
    prisma.destinyEvent.count({ where: { userId: user.id } }),
    prisma.successProject.findMany({
      where: { userId: user.id },
      select: { enabled: true },
    }),
    prisma.successEntry.count({
      where: { project: { userId: user.id }, isCompleted: true },
    }),
    prisma.disciplineRule.findMany({
      where: { userId: user.id },
      select: { id: true },
    }),
    prisma.disciplineCheck.findMany({
      where: { rule: { userId: user.id } },
      select: { date: true },
    }),
    prisma.epistleDay.findMany({
      where: { userId: user.id },
      select: { date: true },
      orderBy: { date: 'desc' },
      take: 1,
    }),
  ]);

  // Calculate destiny stats
  const completedBlocks = timeblocks.filter(b => b.status === 'completed').length;
  const scoredBlocks = timeblocks.filter(b => b.score !== null && b.score > 0);
  const averageScore = scoredBlocks.length > 0
    ? scoredBlocks.reduce((sum, b) => sum + (b.score || 0), 0) / scoredBlocks.length
    : null;

  // Calculate discipline rates
  const today = new Date();
  const last7Days = new Set<string>();
  const last30Days = new Set<string>();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7Days.add(d.toISOString().split('T')[0]);
  }

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last30Days.add(d.toISOString().split('T')[0]);
  }

  const checksLast7 = disciplineChecks.filter(c => last7Days.has(c.date)).length;
  const checksLast30 = disciplineChecks.filter(c => last30Days.has(c.date)).length;

  const possibleLast7 = disciplineRules.length * 7;
  const possibleLast30 = disciplineRules.length * 30;

  const last7DaysRate = possibleLast7 > 0 ? Math.round((checksLast7 / possibleLast7) * 100) : 0;
  const last30DaysRate = possibleLast30 > 0 ? Math.round((checksLast30 / possibleLast30) * 100) : 0;

  // Calculate current streak
  let currentStreak = 0;
  const sortedDates = [...new Set(disciplineChecks.map(c => c.date))].sort().reverse();

  if (sortedDates.length > 0) {
    const todayStr = today.toISOString().split('T')[0];
    let checkDate = todayStr;

    for (const date of sortedDates) {
      if (date === checkDate) {
        currentStreak++;
        const d = new Date(checkDate);
        d.setDate(d.getDate() - 1);
        checkDate = d.toISOString().split('T')[0];
      } else if (date < checkDate) {
        break;
      }
    }
  }

  return {
    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    },
    destiny: {
      totalDays: destinyDays,
      totalTimeblocks: timeblocks.length,
      totalEvents: events,
      averageScore: averageScore ? Math.round(averageScore * 10) / 10 : null,
      completedBlocks,
    },
    success: {
      totalProjects: successProjects.length,
      activeProjects: successProjects.filter(p => p.enabled).length,
      completedEntries: successEntries,
      totalDaysLogged: successEntries,
    },
    discipline: {
      totalRules: disciplineRules.length,
      totalChecks: disciplineChecks.length,
      last7DaysRate,
      last30DaysRate,
      currentStreak,
    },
    epistle: {
      totalLetters: epistleDays.length > 0 ? await prisma.epistleDay.count({ where: { userId: user.id } }) : 0,
      lastWrittenDate: epistleDays[0]?.date || null,
    },
  };
}
