'use server';

import { prisma } from '@/lib/prisma';
import { getDefaultUser } from '@/lib/default-user';

/**
 * Calculate the user's "godlife streak" — consecutive days with at least one activity.
 * Activities: DestinyDay, DisciplineCheck, EpistleDay, or completed UserTask.
 */
export async function getUserStreak(): Promise<{ current: number; best: number }> {
  const user = await getDefaultUser();

  // Collect all activity dates from multiple modules
  const [destinyDays, disciplineChecks, epistleDays, completedTasks] = await Promise.all([
    prisma.destinyDay.findMany({
      where: { userId: user.id },
      select: { date: true },
    }),
    prisma.disciplineCheck.findMany({
      where: { rule: { userId: user.id } },
      select: { date: true },
    }),
    prisma.epistleDay.findMany({
      where: { userId: user.id },
      select: { date: true },
    }),
    prisma.userTask.findMany({
      where: { userId: user.id, status: 'completed', completedAt: { not: null } },
      select: { completedAt: true },
    }),
  ]);

  // Merge into unique date set (YYYY-MM-DD)
  const dateSet = new Set<string>();

  destinyDays.forEach(d => dateSet.add(d.date));
  disciplineChecks.forEach(d => dateSet.add(d.date));
  epistleDays.forEach(d => dateSet.add(d.date));
  completedTasks.forEach(d => {
    if (d.completedAt) {
      dateSet.add(d.completedAt.toISOString().split('T')[0]);
    }
  });

  if (dateSet.size === 0) return { current: 0, best: 0 };

  // Sort dates descending
  const sortedDates = Array.from(dateSet).sort().reverse();

  // Calculate current streak (from today backwards)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let current = 0;
  // Start counting from today or yesterday
  let checkDate = sortedDates[0] === today ? today : (sortedDates[0] === yesterday ? yesterday : '');

  if (checkDate) {
    for (const date of sortedDates) {
      if (date === checkDate) {
        current++;
        // Move to previous day
        const prev = new Date(checkDate + 'T00:00:00');
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split('T')[0];
      } else if (date < checkDate) {
        break; // Gap found
      }
    }
  }

  // Calculate best streak
  let best = 0;
  let streak = 1;
  const ascending = Array.from(dateSet).sort();

  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1] + 'T00:00:00');
    prev.setDate(prev.getDate() + 1);
    const expectedNext = prev.toISOString().split('T')[0];

    if (ascending[i] === expectedNext) {
      streak++;
    } else {
      best = Math.max(best, streak);
      streak = 1;
    }
  }
  best = Math.max(best, streak, current);

  return { current, best };
}
