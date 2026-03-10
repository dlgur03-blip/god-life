import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTodayStr } from '@/lib/date';
import { getUserTimezone } from '@/lib/timezone';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const timezone = await getUserTimezone();
  const today = getTodayStr(timezone);

  // Get or create today's chat session
  let chatSession = await prisma.chatSession.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(`${today}T00:00:00`) },
    },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!chatSession) {
    chatSession = await prisma.chatSession.create({
      data: { userId: user.id, title: today },
      include: { messages: true },
    });
  }

  const onboarding = await prisma.userOnboarding.findUnique({
    where: { userId: user.id },
  });

  const messages = chatSession.messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    actions: m.action
      ? (Array.isArray(m.action) ? m.action : [m.action])
      : undefined,
  }));

  return NextResponse.json({
    sessionId: chatSession.id,
    messages,
    credits: user.credits,
    hasApiKey: !!user.geminiApiKey,
    hasOnboarding: !!onboarding,
  });
}
