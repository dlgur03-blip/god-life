'use client';

import { useTranslations } from 'next-intl';
import { BIO_CATEGORIES } from '@/types/bio';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const categoryColors: Record<string, string> = {
  Nutrition: '#10b981',
  Supplements: '#8b5cf6',
  Recovery: '#06b6d4',
  Exercise: '#f59e0b',
  Mindset: '#ec4899'
};

export default function CategorySelector({ value, onChange, error }: Props) {
  const t = useTranslations('Admin.bio');

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#e2e8f0]">
        {t('category')}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[rgba(255,255,255,0.05)] border rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] ${
          error ? 'border-[#ef4444]' : 'border-[rgba(255,255,255,0.1)]'
        }`}
      >
        <option value="" className="bg-[#0a0a0f]">
          {t('form.selectCategory')}
        </option>
        {BIO_CATEGORIES.map((category) => (
          <option
            key={category}
            value={category}
            className="bg-[#0a0a0f]"
            style={{ color: categoryColors[category] }}
          >
            {t(`categories.${category}`)}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}
