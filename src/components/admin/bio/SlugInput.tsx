'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { checkSlugAvailability } from '@/app/actions/admin';

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  excludeId?: string;
};

export default function SlugInput({ value, onChange, disabled, error, excludeId }: Props) {
  const t = useTranslations('Admin.bio');
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slugified = slugify(e.target.value);
    onChange(slugified);
    setSlugAvailable(null);
  };

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    try {
      const result = await checkSlugAvailability(slug, excludeId);
      if (result.success) {
        setSlugAvailable(result.data.available);
      }
    } finally {
      setCheckingSlug(false);
    }
  }, [excludeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value && value.length >= 3) {
        checkSlug(value);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, checkSlug]);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#e2e8f0]">
        {t('slug')}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={t('form.slugPlaceholder')}
          className={`w-full bg-[rgba(255,255,255,0.05)] border rounded-lg px-4 py-2 text-[#e2e8f0] font-mono focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] disabled:opacity-50 ${
            error || slugAvailable === false
              ? 'border-[#ef4444]'
              : slugAvailable === true
              ? 'border-[#10b981]'
              : 'border-[rgba(255,255,255,0.1)]'
          }`}
        />
        {checkingSlug && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!checkingSlug && slugAvailable === true && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10b981]">
            ✓
          </div>
        )}
        {!checkingSlug && slugAvailable === false && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ef4444]">
            ✗
          </div>
        )}
      </div>
      <p className="text-xs text-[#6b7280]">{t('form.slugHint')}</p>
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      {slugAvailable === false && !error && (
        <p className="text-xs text-[#ef4444]">{t('validation.slugTaken')}</p>
      )}
    </div>
  );
}
