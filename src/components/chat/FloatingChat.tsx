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
          {/* Quick action buttons - always 3 */}
          {showActions && quickActions.map(({ key, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handleOpen(t(key))}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] shadow-lg hover:shadow-xl transition-all text-xs animate-in fade-in slide-in-from-bottom-2"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {t(key)}
            </button>
          ))}
          {/* Main FAB */}
          <button
            onClick={() => {
              if (showActions) {
                handleOpen();
              } else {
                setShowActions(true);
              }
            }}
            className="w-14 h-14 bg-[var(--color-secondary)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
            style={{ borderRadius: '50%' }}
            aria-label="AI Coach"
          >
            {showActions ? <MessageCircle className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
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
