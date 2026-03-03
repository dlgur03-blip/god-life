'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link2, MessageCircle } from 'lucide-react';

interface MetShareButtonsProps {
  resultId: string;
  archetypeName: string;
  summaryShort: string;
}

export default function MetShareButtons({
  resultId,
  archetypeName,
  summaryShort,
}: MetShareButtonsProps) {
  const t = useTranslations('Met');
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname.split('/met')[0]}/met/result/${resultId}`
    : '';
  const shareText = `${archetypeName} - ${summaryShort}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareKakao = () => {
    // Fallback to copy link if Kakao SDK not available
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.Kakao?.Share?.sendDefault) {
        w.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: archetypeName,
            description: summaryShort,
            imageUrl: `${shareUrl}/opengraph-image`,
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        });
        return;
      }
    } catch {
      // Kakao SDK not loaded
    }
    handleCopyLink();
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      <h3 className="text-sm font-medium text-[var(--foreground-muted)] text-center">
        {t('shareResult')}
      </h3>
      <div className="flex gap-3 justify-center">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm hover:border-[var(--color-border-hover)] transition-colors"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <Link2 className="w-4 h-4" />
          {copied ? t('copied') : t('copyLink')}
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleShareTwitter}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm hover:border-[var(--color-border-hover)] transition-colors"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          𝕏
          <span className="hidden sm:inline">{t('shareTwitter')}</span>
        </button>

        {/* Kakao */}
        <button
          onClick={handleShareKakao}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm hover:border-[var(--color-border-hover)] transition-colors"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{t('shareKakao')}</span>
        </button>
      </div>
    </div>
  );
}
