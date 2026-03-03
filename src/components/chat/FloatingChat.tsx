'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ChatInterface from './ChatInterface';
import OnboardingSurvey from './OnboardingSurvey';

interface FloatingChatProps {
  locale: string;
}

interface ChatData {
  sessionId: string;
  messages: { id: string; role: 'user' | 'assistant'; content: string; actions?: { module: string; type: string }[] }[];
  credits: number;
  hasApiKey: boolean;
  hasOnboarding: boolean;
}

export default function FloatingChat({ locale }: FloatingChatProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [onboarded, setOnboarded] = useState(true);

  // Don't render for unauthenticated users
  if (!session?.user) return null;

  const loadChat = async () => {
    if (data) return; // already loaded
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/chat/api`);
      if (res.ok) {
        const chatData = await res.json();
        setData(chatData);
        setOnboarded(chatData.hasOnboarding);
      }
    } catch {
      // Fallback: try server action
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    loadChat();
  };

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--color-secondary)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          style={{ borderRadius: '50%' }}
          aria-label="AI Coach"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end">
          {/* Backdrop (mobile full, desktop partial) */}
          <div
            className="absolute inset-0 bg-black/30 sm:bg-transparent"
            onClick={() => setOpen(false)}
          />

          {/* Chat Panel */}
          <div
            className="relative z-10 w-full h-[85vh] sm:w-[420px] sm:h-[600px] sm:m-6 bg-[var(--background)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">AI 갓생코치</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)]">하루를 함께 기록해요</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && data && !onboarded && (
                <div className="h-full overflow-y-auto">
                  <OnboardingSurvey onComplete={() => setOnboarded(true)} />
                </div>
              )}

              {!loading && data && onboarded && (
                <ChatInterface
                  sessionId={data.sessionId}
                  initialMessages={data.messages}
                  locale={locale}
                  credits={data.credits}
                  hasApiKey={data.hasApiKey}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
