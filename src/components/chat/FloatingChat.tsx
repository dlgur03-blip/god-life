'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Minimize2, Sunrise, Moon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import ChatInterface from './ChatInterface';

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
  const t = useTranslations('Chat');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();

  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 14;

  const loadChat = useCallback(async () => {
    if (data) return;
    setLoading(true);
    try {
      const res = await fetch(`/${locale}/chat/api`);
      if (res.ok) {
        const chatData = await res.json();
        setData(chatData);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [data, locale]);

  // Auto-open for first-time users (no chat history)
  useEffect(() => {
    if (!session?.user || autoOpened) return;
    const seen = localStorage.getItem('godlife-chat-seen');
    if (!seen) {
      setAutoOpened(true);
      const timer = setTimeout(() => {
        setOpen(true);
        loadChat();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [session, autoOpened, loadChat]);

  // Don't render for unauthenticated users
  if (!session?.user) return null;

  const handleOpen = (prompt?: string) => {
    setInitialPrompt(prompt);
    setOpen(true);
    loadChat();
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('godlife-chat-seen', 'true');
  };

  return (
    <>
      {/* FAB Button + Quick Actions */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Quick action button - time-based */}
          <button
            onClick={() => handleOpen(isMorning ? t('quickPlan') : t('quickReport'))}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] shadow-lg hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors text-xs"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {isMorning ? <Sunrise className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isMorning ? t('quickPlan') : t('quickReport')}
          </button>
          {/* Main FAB */}
          <button
            onClick={() => handleOpen()}
            className="w-14 h-14 bg-[var(--color-secondary)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
            style={{ borderRadius: '50%' }}
            aria-label="AI Coach"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Chat Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end">
          <div className="absolute inset-0 bg-black/30 sm:bg-transparent" onClick={handleClose} />

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
                  <h3 className="text-sm font-bold text-[var(--foreground)]">{t('title')}</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)]">{t('floatingSubtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleClose} className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={handleClose} className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
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

              {!loading && data && (
                <ChatInterface
                  sessionId={data.sessionId}
                  initialMessages={data.messages}
                  locale={locale}
                  credits={data.credits}
                  hasApiKey={data.hasApiKey}
                  initialPrompt={initialPrompt}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
