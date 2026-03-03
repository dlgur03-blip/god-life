'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Coins, Key, ChevronDown, ChevronUp, X } from 'lucide-react';
import { saveApiKey } from '@/app/actions/chat';

interface CreditBarProps {
  credits: number;
  hasApiKey: boolean;
}

export default function CreditBar({ credits: initCredits, hasApiKey: initHasKey }: CreditBarProps) {
  const t = useTranslations('Chat.credits');
  const [expanded, setExpanded] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(initHasKey);
  const [saving, setSaving] = useState(false);

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    await saveApiKey(apiKeyInput.trim());
    setHasApiKey(true);
    setApiKeyInput('');
    setSaving(false);
    setExpanded(false);
  };

  const handleRemoveKey = async () => {
    setSaving(true);
    await saveApiKey(null);
    setHasApiKey(false);
    setSaving(false);
  };

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-card-bg)]">
      {/* Main bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[var(--foreground)]">
            <Coins className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            <span className="font-medium">{initCredits}</span> {t('credits')}
          </span>
          {hasApiKey && (
            <span className="flex items-center gap-1 text-[var(--color-success)]">
              <Key className="w-3 h-3" />
              {t('ownKey')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[var(--foreground-muted)]">
          <span>{t('details')}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-3 space-y-3 text-xs">
          <div className="h-px bg-[var(--color-border)]" />

          {/* Credit info */}
          <div className="space-y-1.5 text-[var(--foreground-muted)]">
            <p>{t('costInfo')}</p>
            <p>{t('noChargingInfo')}</p>
          </div>

          {/* API Key section */}
          <div className="space-y-2">
            <p className="font-medium text-[var(--foreground)]">{t('apiKeyTitle')}</p>
            <p className="text-[var(--foreground-muted)]">{t('apiKeyDesc')}</p>

            {hasApiKey ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-1 bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)] border border-[var(--color-success)] border-opacity-30" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <Key className="w-3 h-3" />
                  {t('keyActive')}
                </span>
                <button
                  onClick={handleRemoveKey}
                  disabled={saving}
                  className="flex items-center gap-1 px-2 py-1 text-[var(--foreground-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('removeKey')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={t('apiKeyPlaceholder')}
                  className="flex-1 px-2 py-1.5 bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] text-xs focus:outline-none focus:border-[var(--color-secondary)]"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKeyInput.trim() || saving}
                  className="px-3 py-1.5 bg-[var(--color-secondary)] text-white text-xs disabled:opacity-30"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  {t('saveKey')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
