'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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

export async function getDisciplineData(date: string) {
  const user = await getUser();

  // Fetch Rules
  const rules = await prisma.disciplineRule.findMany({
    where: { userId: user.id },
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

export async function createRule(title: string) {
  const user = await getUser();
  
  const count = await prisma.disciplineRule.count({ where: { userId: user.id } });
  if (count >= 13) throw new Error("Max 13 rules allowed");

  await prisma.disciplineRule.create({
    data: {
      userId: user.id,
      title,
      sortOrder: count + 1
    }
  });

  revalidatePath('/discipline/day/[date]');
}

export async function toggleRuleCheck(ruleId: string, date: string, isChecked: boolean) {
  const user = await getUser();

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

