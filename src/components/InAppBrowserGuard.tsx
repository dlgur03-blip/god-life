'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

type InAppBrowserType = 'kakaotalk' | 'line' | 'facebook' | 'instagram' | 'other' | null;

function detectInAppBrowser(): InAppBrowserType {
  if (typeof window === 'undefined') return null;

  const ua = navigator.userAgent.toLowerCase();

  // KakaoTalk
  if (ua.includes('kakaotalk')) return 'kakaotalk';
  // LINE
  if (ua.includes('line/')) return 'line';
  // Facebook
  if (ua.includes('fban') || ua.includes('fbav') || ua.includes('fb_iab')) return 'facebook';
  // Instagram
  if (ua.includes('instagram')) return 'instagram';
  // Generic WebView detection
  if (ua.includes('wv') || (ua.includes('android') && ua.includes('; wv)'))) return 'other';

  return null;
}

function getExternalBrowserUrl(): string {
  const currentUrl = window.location.href;
  const ua = navigator.userAgent.toLowerCase();

  // Android: Use intent to open in Chrome
  if (ua.includes('android')) {
    return `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
  }

  // iOS: Just return the URL (user will need to copy)
  return currentUrl;
}

export default function InAppBrowserGuard() {
  const [browserType, setBrowserType] = useState<InAppBrowserType>(null);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations('InAppBrowser');

  useEffect(() => {
    const detected = detectInAppBrowser();
    setBrowserType(detected);
  }, []);

  const handleOpenExternal = () => {
    const url = getExternalBrowserUrl();
    window.location.href = url;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Don't show if not in-app browser or dismissed
  if (!browserType || dismissed) return null;

  const isAndroid = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('android');
  const browserNames: Record<string, string> = {
    kakaotalk: t('browsers.kakaotalk'),
    line: t('browsers.line'),
    facebook: t('browsers.facebook'),
    instagram: t('browsers.instagram'),
    other: t('browsers.other'),
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a1628] border border-primary/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-primary/20">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-white mb-2">
          {t('title')}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-center text-sm mb-6">
          {t('description', { browser: browserNames[browserType] })}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          {isAndroid ? (
            <button
              onClick={handleOpenExternal}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              {t('openChrome')}
            </button>
          ) : (
            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? t('copied') : t('copyLink')}
            </button>
          )}

          {!isAndroid && (
            <p className="text-xs text-gray-500 text-center">
              {t('iosInstruction')}
            </p>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="w-full py-2 px-4 text-gray-400 hover:text-white text-sm transition-colors"
          >
            {t('continueAnyway')}
          </button>
        </div>
      </div>
    </div>
  );
}
