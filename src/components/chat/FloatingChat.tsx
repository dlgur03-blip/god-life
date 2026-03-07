'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Minimize2, Sunrise, Moon, StickyNote } from 'lucide-react';
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
  const [showActions, setShowActions] = useState(false);

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

  // Listen for custom event from module cards
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.prompt) {
        handleOpen(detail.prompt);
      }
    };
    window.addEventListener('open-ai-chat', handler);
    return () => window.removeEventListener('open-ai-chat', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render for unauthenticated users
  if (!session?.user) return null;

  const handleOpen = (prompt?: string) => {
    setInitialPrompt(prompt);
    setOpen(true);
    setShowActions(false);
    loadChat();
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('godlife-chat-seen', 'true');
  };

  const quickActions = [
    { key: 'quickPlan', icon: Sunrise, color: 'var(--color-destiny)' },
    { key: 'quickReport', icon: Moon, color: 'var(--color-epistle)' },
    { key: 'quickMemo', icon: StickyNote, color: 'var(--color-secondary)' },
  ] as const;

  return (
    <>
      {/* FAB + Quick Actions */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Quick action buttons */}
          {showActions && quickActions.map(({ key, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handleOpen(t(key))}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] shadow-lg hover:shadow-xl transition-all text-xs font-medium animate-scale-in"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {t(key)}
            </button>
          ))}
          {/* Main FAB — Gradient background */}
          <button
            onClick={() => {
              if (showActions) {
                handleOpen();
              } else {
                setShowActions(true);
              }
            }}
            className="w-14 h-14 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            style={{
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
            }}
            aria-label="AI Coach"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Backdrop to close actions */}
      {!open && showActions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
      )}

      {/* Chat Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end">
          <div className="absolute inset-0 bg-black/30 sm:bg-transparent" onClick={handleClose} />

          <div
            className="relative z-10 w-full h-[100dvh] sm:w-[420px] sm:h-[600px] sm:m-6 bg-[var(--background)] border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden animate-scale-in"
            style={{ borderRadius: '0 0 0 0', ['--tw-shadow' as string]: 'var(--shadow-lg)' }}
          >
            {/* Use border-radius only on desktop */}
            <style>{`
              @media (min-width: 640px) {
                .chat-panel { border-radius: var(--radius-xl) !important; }
              }
            `}</style>
            <div className="chat-panel relative z-10 w-full h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-card-bg)]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center text-white"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>{t('title')}</h3>
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
        </div>
      )}
    </>
  );
}
