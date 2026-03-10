'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ActionResult, success, error } from '@/lib/errors';
import { getDateStatus } from '@/lib/utils';

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) throw new Error("User not found");
  return user;
}

export async function getDisciplineData(date: string) {
  const user = await getUser();

  // Parse the requested date to filter rules created on or before this date
  const requestedDate = new Date(date + 'T23:59:59.999Z');

  // Fetch Rules - only show rules created on or before the requested date
  const rules = await prisma.disciplineRule.findMany({
    where: {
      userId: user.id,
      createdAt: { lte: requestedDate }
    },
    orderBy: { sortOrder: 'asc' },
    include: {
      checks: {
        where: { date: date },
        select: { id: true, checkedAt: true } // If exists, it's checked
      }
    }
  });

  return rules.map(rule => ({
    ...rule,
    isChecked: rule.checks.length > 0
  }));
}

export async function createRule(title: string): Promise<ActionResult> {
  try {
    const user = await getUser();

    const count = await prisma.disciplineRule.count({ where: { userId: user.id } });
    if (count >= 13) return error('MAX_RULES_REACHED');

    await prisma.disciplineRule.create({
      data: {
        userId: user.id,
        title,
        sortOrder: count + 1
      }
    });

    revalidatePath('/discipline/day/[date]');
    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'User not found') return error('USER_NOT_FOUND');
    }
    return error('UNKNOWN');
  }
}

export async function toggleRuleCheck(ruleId: string, date: string, isChecked: boolean): Promise<ActionResult> {
  try {
    await getUser();

    // Validate date is today (using user's timezone from cookie)
    const { getUserTimezone } = await import('@/lib/timezone');
    const timezone = await getUserTimezone();
    const dateStatus = getDateStatus(date, timezone);
    if (dateStatus !== 'today') {
      return error('DATE_NOT_TODAY');
    }

    if (isChecked) {
      // Check (Upsert handled by unique constraint logic usually, but here create if not exists)
      // We used simple create because unique constraint is [ruleId, date].
      // But check if exists first to avoid error? or use upsert?
      // Since id is cuid, upsert needs unique where.
      await prisma.disciplineCheck.upsert({
        where: {
          ruleId_date: { ruleId, date }
        },
        update: {}, // Already checked
        create: {
          ruleId,
          date
        }
      });
    } else {
      // Uncheck (Delete)
      await prisma.disciplineCheck.deleteMany({
        where: {
          ruleId,
          date
        }
      });
    }

    revalidatePath('/discipline/day/[date]');
    return success(undefined);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Unauthorized') return error('UNAUTHORIZED');
      if (e.message === 'User not found') return error('USER_NOT_FOUND');
    }
    return error('UNKNOWN');
  }
}

export async function deleteRule(ruleId: string) {
  await getUser();
  await prisma.disciplineRule.delete({ where: { id: ruleId } });
  revalidatePath('/discipline/day/[date]');
}

// Insight Logic
export async function getDisciplineStats() {
  const user = await getUser();
  const rules = await prisma.disciplineRule.findMany({
    where: { userId: user.id },
    include: {
      checks: {
        orderBy: { date: 'desc' },
        take: 30 // Last 30 checks
      }
    }
  });

  // Calculate 7-day and 30-day rates
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  return rules.map(rule => {
    const sevenDayChecks = rule.checks.filter(c => c.date >= sevenDaysAgoStr);
    return {
      id: rule.id,
      title: rule.title,
      sevenDayRate: Math.round((sevenDayChecks.length / 7) * 100),
      thirtyDayRate: Math.round((rule.checks.length / 30) * 100),
    };
  });
}

