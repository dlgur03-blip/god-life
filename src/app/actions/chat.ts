'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { chatWithCoach } from '@/lib/chat/gemini';
import { ChatContextData, ModuleAction } from '@/lib/chat/types';
import { getTodayStr } from '@/lib/date';
import { getUserTimezone } from '@/lib/timezone';

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// ── Get user credit info ──
export async function getUserCredits() {
  const user = await getUser();
  return {
    credits: user.credits,
    hasApiKey: !!user.geminiApiKey,
  };
}

// ── Get credit usage history ──
export async function getCreditHistory(limit = 20) {
  const user = await getUser();
  const logs = await prisma.creditLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return logs.map((l) => ({
    id: l.id,
    amount: l.amount,
    balance: l.balance,
    reason: l.reason,
    inputTokens: l.inputTokens,
    outputTokens: l.outputTokens,
    model: l.model,
    createdAt: l.createdAt.toISOString(),
  }));
}

// ── Save personal API key ──
export async function saveApiKey(apiKey: string | null) {
  const user = await getUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { geminiApiKey: apiKey || null },
  });
  revalidatePath('/chat');
  return { success: true };
}

// ── Get or create today's chat session ──
export async function getOrCreateChatSession() {
  const user = await getUser();
  const timezone = await getUserTimezone();
  const today = getTodayStr(timezone);

  let session = await prisma.chatSession.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(`${today}T00:00:00`) },
    },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: { userId: user.id, title: today },
      include: { messages: true },
    });
  }

  return session;
}

// ── Get chat context for AI ──
async function getChatContext(userId: string): Promise<ChatContextData> {
  const timezone = await getUserTimezone();
  const today = getTodayStr(timezone);

  // Calculate yesterday
  const todayDate = new Date(today + 'T00:00:00');
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const [onboarding, epistle, rules, destinyToday, destinyYesterday, moneyTx, memos, tasks, recentlyCompleted] = await Promise.all([
    prisma.userOnboarding.findUnique({ where: { userId } }),
    prisma.epistleDay.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.disciplineRule.findMany({
      where: { userId },
      include: { checks: { where: { date: today } } },
    }),
    prisma.destinyDay.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.destinyDay.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
    prisma.moneyTransaction.findFirst({ where: { userId, date: today } }),
    prisma.memo.findMany({ where: { userId, date: today }, orderBy: { createdAt: 'asc' } }),
    prisma.userTask.findMany({ where: { userId, status: { in: ['not_started', 'in_progress'] } }, orderBy: { createdAt: 'asc' }, take: 20 }),
    prisma.userTask.findMany({ where: { userId, status: 'completed', completedAt: { gte: new Date(yesterday + 'T00:00:00') } }, orderBy: { completedAt: 'desc' }, take: 10 }),
  ]);

  const disciplineTotal = rules.length;
  const disciplineChecked = rules.filter((r) => r.checks.length > 0).length;

  const pickDestiny = (d: typeof destinyToday) => d ? {
    goalToday: d.goalToday, goal1Week: d.goal1Week, goal2Week: d.goal2Week,
    goal1Month: d.goal1Month, goal3Month: d.goal3Month, goal6Month: d.goal6Month,
    goal1Year: d.goal1Year, goal3Year: d.goal3Year, goal5Year: d.goal5Year,
    goal10Year: d.goal10Year, goalUltimate: d.goalUltimate,
    habitToKeep: d.habitToKeep, habitToRemove: d.habitToRemove, restTime: d.restTime,
  } : null;

  return {
    onboarding: onboarding
      ? {
          metArchetype: undefined,
          executionLevel: onboarding.executionLevel,
          focusAreas: onboarding.focusAreas as string[] | undefined,
          availableTime: onboarding.availableTime ?? undefined,
          preferredStyle: onboarding.preferredStyle ?? undefined,
        }
      : null,
    todayStatus: {
      epistleWritten: !!(epistle?.gratitude1 || epistle?.reflection1),
      disciplineChecked,
      disciplineTotal,
      destinyPlanned: !!(destinyToday?.goalToday),
      moneyLogged: !!moneyTx,
      successUpdated: false,
    },
    destinyToday: pickDestiny(destinyToday),
    destinyYesterday: pickDestiny(destinyYesterday),
    todayMemos: memos.map(m => ({
      content: m.content,
      tags: (m.tags as string[]) || [],
      time: m.time,
      reviewed: m.reviewed,
    })),
    tasks: tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      category: t.category,
    })),
    recentlyCompletedTasks: recentlyCompleted.map(t => ({
      title: t.title,
      completedAt: t.completedAt?.toISOString() ?? null,
    })),
    recentMessages: [],
  };
}

// ── Execute module actions ──
async function executeActions(userId: string, actions: ModuleAction[]) {
  const timezone = await getUserTimezone();
  const today = getTodayStr(timezone);
  const executed: string[] = [];

  for (const action of actions) {
    try {
      if (action.module === 'epistle' && action.type === 'fill') {
        await prisma.epistleDay.upsert({
          where: { userId_date: { userId, date: today } },
          create: { userId, date: today, [action.data.field]: action.data.value },
          update: { [action.data.field]: action.data.value },
        });
        executed.push(`셀프 서신: ${action.data.field}`);
      }
      if (action.module === 'discipline' && action.type === 'create_rule') {
        const count = await prisma.disciplineRule.count({ where: { userId } });
        if (count < 13) {
          await prisma.disciplineRule.create({
            data: { userId, title: action.data.title, sortOrder: count },
          });
          executed.push(`규율: ${action.data.title}`);
        }
      }
      if (action.module === 'destiny' && action.type === 'set_goal') {
        await prisma.destinyDay.upsert({
          where: { userId_date: { userId, date: today } },
          create: { userId, date: today, [action.data.field]: action.data.value },
          update: { [action.data.field]: action.data.value },
        });
        executed.push(`운명: ${action.data.field}`);
      }
      if (action.module === 'money' && action.type === 'add_transaction') {
        await prisma.moneyTransaction.create({
          data: {
            userId,
            type: action.data.type,
            category: action.data.category,
            amount: action.data.amount,
            memo: action.data.memo ?? null,
            date: today,
          },
        });
        executed.push(`머니: ${action.data.amount}원`);
      }
      if (action.module === 'success' && action.type === 'create_project') {
        await prisma.successProject.create({
          data: { userId, title: action.data.title, startDate: new Date() },
        });
        executed.push(`성공: ${action.data.title}`);
      }
      if (action.module === 'memo' && action.type === 'save') {
        const now = new Date();
        const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const time = `${userTime.getHours().toString().padStart(2, '0')}:${userTime.getMinutes().toString().padStart(2, '0')}`;
        await prisma.memo.create({
          data: {
            userId,
            content: action.data.content,
            tags: action.data.tags || [],
            date: today,
            time,
          },
        });
        executed.push(`메모: ${action.data.content.substring(0, 20)}...`);
      }
      if (action.module === 'task' && action.type === 'create') {
        await prisma.userTask.create({
          data: {
            userId,
            title: action.data.title,
            description: action.data.description ?? null,
            category: action.data.category ?? null,
          },
        });
        executed.push(`작업: ${action.data.title}`);
      }
      if (action.module === 'task' && action.type === 'update_status') {
        const updateData: { status: string; completedAt?: Date | null } = { status: action.data.status };
        if (action.data.status === 'completed') {
          updateData.completedAt = new Date();
        } else {
          updateData.completedAt = null;
        }
        const task = await prisma.userTask.update({
          where: { id: action.data.taskId, userId },
          data: updateData,
        });
        // Organic connection: completed task → auto-append to destiny goalToday
        if (action.data.status === 'completed') {
          const destinyDay = await prisma.destinyDay.findUnique({
            where: { userId_date: { userId, date: today } },
          });
          const currentGoalToday = destinyDay?.goalToday || '';
          const newGoalToday = currentGoalToday
            ? `${currentGoalToday} / ✅ ${task.title}`
            : `✅ ${task.title}`;
          await prisma.destinyDay.upsert({
            where: { userId_date: { userId, date: today } },
            create: { userId, date: today, goalToday: newGoalToday },
            update: { goalToday: newGoalToday },
          });
          executed.push(`작업 완료→운명: ${task.title}`);
        } else {
          const statusLabel = action.data.status === 'in_progress' ? '진행중' : '시작 전';
          executed.push(`작업 ${statusLabel}: ${task.title}`);
        }
      }
    } catch (e) {
      console.error('Action execution failed:', action, e);
    }
  }
  return executed;
}

// Admin emails with unlimited credits
const UNLIMITED_EMAILS = ['dlgur03@gmail.com'];

// ── Send message (with credits) ──
export async function sendChatMessage(sessionId: string, content: string, locale: string) {
  const user = await getUser();
  const isUnlimited = UNLIMITED_EMAILS.includes(user.email);
  const useOwnKey = !!user.geminiApiKey;
  const skipCredits = isUnlimited || useOwnKey;

  // Check credits
  if (!skipCredits && user.credits <= 0) {
    return {
      text: '',
      actions: [],
      executed: [],
      usage: { inputTokens: 0, outputTokens: 0, creditUsed: 0, creditsRemaining: 0 },
      error: 'NO_CREDITS',
    };
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId, role: 'user', content },
  });

  // Get history
  const history = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: 30,
  });

  const messages = history.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const context = await getChatContext(user.id);
  const timezone = await getUserTimezone();

  // Call AI (with user's key or system key)
  const response = await chatWithCoach(
    messages,
    context,
    locale,
    useOwnKey ? user.geminiApiKey : null,
    timezone
  );

  // Credit cost: 0.1 per call (skip for admin/BYOK)
  const creditCost = skipCredits ? 0 : 0.1;
  let newBalance = user.credits;

  if (creditCost > 0) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: creditCost } },
    });
    newBalance = updated.credits;

    await prisma.creditLog.create({
      data: {
        userId: user.id,
        amount: -creditCost,
        balance: newBalance,
        reason: 'chat',
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        model: response.usage.model,
      },
    });
  }

  // Execute actions
  let executedSummary: string[] = [];
  if (response.actions.length > 0) {
    executedSummary = await executeActions(user.id, response.actions);
  }

  // Save assistant message
  await prisma.chatMessage.create({
    data: {
      sessionId,
      role: 'assistant',
      content: response.text,
      action: response.actions.length > 0 ? JSON.parse(JSON.stringify(response.actions)) : undefined,
    },
  });

  revalidatePath('/');

  return {
    text: response.text,
    actions: response.actions,
    executed: executedSummary,
    usage: {
      inputTokens: response.usage.inputTokens,
      outputTokens: response.usage.outputTokens,
      creditUsed: creditCost,
      creditsRemaining: newBalance,
    },
  };
}

// ── Save onboarding ──
export async function saveOnboarding(data: {
  availableTime: string;
  habitExperience: string;
  focusAreas: string[];
  chronotype: string;
  preferredStyle: string;
  metResultId?: string;
}) {
  const user = await getUser();
  await prisma.userOnboarding.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...data,
      executionLevel: data.habitExperience === 'many' ? 3 : data.habitExperience === 'some' ? 2 : 1,
    },
    update: {
      ...data,
      executionLevel: data.habitExperience === 'many' ? 3 : data.habitExperience === 'some' ? 2 : 1,
    },
  });
  revalidatePath('/');
  return { success: true };
}

// ── Get onboarding status ──
export async function getOnboardingStatus() {
  const user = await getUser();
  return prisma.userOnboarding.findUnique({ where: { userId: user.id } });
}

// ── Memo functions ──
export async function saveMemo(content: string, tags: string[]) {
  const user = await getUser();
  const timezone = await getUserTimezone();
  const date = getTodayStr(timezone);
  const now = new Date();
  const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const time = `${userTime.getHours().toString().padStart(2, '0')}:${userTime.getMinutes().toString().padStart(2, '0')}`;

  const memo = await prisma.memo.create({
    data: { userId: user.id, content, tags, date, time },
  });
  return { id: memo.id, time };
}

export async function getTodayMemos() {
  const user = await getUser();
  const timezone = await getUserTimezone();
  const date = getTodayStr(timezone);

  return prisma.memo.findMany({
    where: { userId: user.id, date },
    orderBy: { createdAt: 'asc' },
  });
}

export async function markMemosReviewed(memoIds: string[]) {
  const user = await getUser();
  await prisma.memo.updateMany({
    where: { id: { in: memoIds }, userId: user.id },
    data: { reviewed: true },
  });
}
