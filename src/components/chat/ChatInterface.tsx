'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Bot, User, Zap, Loader2, Coins, Info } from 'lucide-react';
import { sendChatMessage } from '@/app/actions/chat';
import ChatActionBadge from './ChatActionBadge';
import CreditBar from './CreditBar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { module: string; type: string }[];
  executed?: string[];
  usage?: { inputTokens: number; outputTokens: number; creditUsed: number };
}

interface ChatInterfaceProps {
  sessionId: string;
  initialMessages: Message[];
  locale: string;
  credits: number;
  hasApiKey: boolean;
  initialPrompt?: string;
}

export default function ChatInterface({ sessionId, initialMessages, locale, credits: initCredits, hasApiKey, initialPrompt }: ChatInterfaceProps) {
  const t = useTranslations('Chat');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(initCredits);
  const [promptSent, setPromptSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const noCredits = !hasApiKey && credits <= 0;

  const sendMessage = async (text: string) => {
    if (!text || loading || noCredits) return;

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: text };
    setMessages((prev: Message[]) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(sessionId, text, locale);

      if (res.error === 'NO_CREDITS') {
        setMessages((prev: Message[]) => [...prev, {
          id: `err-${Date.now()}`, role: 'assistant', content: t('noCredits'),
        }]);
        setCredits(0);
        return;
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        actions: res.actions.map((a) => ({ module: a.module, type: a.type })),
        executed: res.executed,
        usage: res.usage ? {
          inputTokens: res.usage.inputTokens,
          outputTokens: res.usage.outputTokens,
          creditUsed: res.usage.creditUsed,
        } : undefined,
      };
      setMessages((prev: Message[]) => [...prev, assistantMsg]);
      if (res.usage) setCredits(res.usage.creditsRemaining);
    } catch {
      setMessages((prev: Message[]) => [...prev, {
        id: `error-${Date.now()}`, role: 'assistant', content: t('error'),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input.trim());

  // Auto-send initialPrompt when provided (e.g. from quick action buttons)
  useEffect(() => {
    if (initialPrompt && !promptSent && !loading && messages.length === 0) {
      setPromptSent(true);
      sendMessage(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, promptSent, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Credit Bar */}
      <CreditBar credits={credits} hasApiKey={hasApiKey} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)] bg-opacity-10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-[var(--color-secondary)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{t('welcomeTitle')}</h2>
            <p className="text-sm text-[var(--foreground-muted)] max-w-xs">{t('welcomeDesc')}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['quickEpistle', 'quickGoal', 'quickMoney'].map((key) => (
                <button
                  key={key}
                  onClick={() => setInput(t(key))}
                  className="px-3 py-1.5 text-xs border border-[var(--color-border)] text-[var(--foreground-muted)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="max-w-[80%] flex flex-col gap-1">
              <div
                className={`px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)]'
                }`}
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                {msg.content}
              </div>
              {/* Action badges */}
              {msg.executed && msg.executed.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {msg.executed.map((ex, i) => (
                    <ChatActionBadge key={i} text={ex} />
                  ))}
                </div>
              )}
              {/* Token usage (transparent) */}
              {msg.usage && (
                <div className="flex items-center gap-2 text-[10px] text-[var(--foreground-muted)] mt-0.5">
                  <Info className="w-3 h-3" />
                  <span>in:{msg.usage.inputTokens} out:{msg.usage.outputTokens}</span>
                  {msg.usage.creditUsed > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Coins className="w-3 h-3" />-{msg.usage.creditUsed}
                    </span>
                  )}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div
              className="px-3 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)]"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <Loader2 className="w-4 h-4 text-[var(--foreground-muted)] animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* No credits banner */}
      {noCredits && (
        <div className="px-4 py-3 bg-[var(--color-accent)] bg-opacity-10 border-t border-[var(--color-accent)] text-center">
          <p className="text-sm text-[var(--foreground)]">{t('noCredits')}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">{t('noCharging')}</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-card-bg)]">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={noCredits ? t('noCreditsPlaceholder') : t('placeholder')}
              rows={1}
              disabled={loading || noCredits}
              className="w-full resize-none px-3 py-2 text-sm bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--color-secondary)] disabled:opacity-50"
              style={{ borderRadius: 'var(--radius-sm)', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || noCredits}
            className="p-2 bg-[var(--color-secondary)] text-white disabled:opacity-30 transition-opacity flex-shrink-0"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-[var(--foreground-muted)] mt-1.5 flex items-center justify-center gap-1">
          <Zap className="w-3 h-3" />
          {t('poweredBy')}
        </p>
      </div>
    </div>
  );
}
