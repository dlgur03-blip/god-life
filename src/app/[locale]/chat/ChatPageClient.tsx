'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import OnboardingSurvey from '@/components/chat/OnboardingSurvey';

interface ChatPageClientProps {
  sessionId: string;
  initialMessages: { id: string; role: 'user' | 'assistant'; content: string; actions?: { module: string; type: string }[] }[];
  locale: string;
  hasOnboarding: boolean;
  credits: number;
  hasApiKey: boolean;
}

export default function ChatPageClient({ sessionId, initialMessages, locale, hasOnboarding, credits, hasApiKey }: ChatPageClientProps) {
  const [onboarded, setOnboarded] = useState(hasOnboarding);

  if (!onboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OnboardingSurvey onComplete={() => setOnboarded(true)} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-52px)] md:h-[calc(100vh-56px)] flex flex-col">
      <ChatInterface
        sessionId={sessionId}
        initialMessages={initialMessages}
        locale={locale}
        credits={credits}
        hasApiKey={hasApiKey}
      />
    </div>
  );
}
