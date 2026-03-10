'use server';

import { prisma } from '@/lib/prisma';

export async function getSignalsByDate(date?: string) {
  const targetDate = date ?? getTodayKST();

  const signals = await prisma.newsSignal.findMany({
    where: { date: targetDate },
    orderBy: [{ importance: 'desc' }, { regionCount: 'desc' }],
  });

  return signals;
}

export async function getSignalsByCategory(category: string, date?: string) {
  const targetDate = date ?? getTodayKST();

  const signals = await prisma.newsSignal.findMany({
    where: { date: targetDate, category },
    orderBy: [{ importance: 'desc' }, { regionCount: 'desc' }],
  });

  return signals;
}

export async function getSignalDates(limit: number = 7) {
  const results = await prisma.newsSignal.findMany({
    select: { date: true },
    distinct: ['date'],
    orderBy: { date: 'desc' },
    take: limit,
  });

  return results.map((r) => r.date);
}

// 칼럼/리포트 조회
export async function getSignalReport(date?: string) {
  const targetDate = date ?? getTodayKST();

  const report = await prisma.signalReport.findUnique({
    where: { date: targetDate },
  });

  return report;
}

export async function getReportDates(limit: number = 14) {
  const results = await prisma.signalReport.findMany({
    select: { date: true, columnTitle: true, step: true },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return results;
}

function getTodayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}
