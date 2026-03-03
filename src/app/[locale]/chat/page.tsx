import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getOrCreateChatSession, getOnboardingStatus } from '@/app/actions/chat';
import ChatPageClient from './ChatPageClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('Chat');
  return { title: t('title') };
}

export default async function ChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const { locale } = await params;
  const chatSession = await getOrCreateChatSession();
  const onboarding = await getOnboardingStatus();

  const messages = chatSession.messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    actions: m.action ? (Array.isArray(m.action) ? m.action : [m.action]) as { module: string; type: string }[] : undefined,
  }));

  return (
    <ChatPageClient
      sessionId={chatSession.id}
      initialMessages={messages}
      locale={locale}
      hasOnboarding={!!onboarding}
    />
  );
}
