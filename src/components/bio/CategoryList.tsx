'use client';

import { useTranslations } from 'next-intl';
import { BIO_CATEGORIES, CATEGORY_COLORS, type BioCategory } from '@/types/bio';

type Props = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  postCounts?: Record<string, number>;
};

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
  postCounts = {}
}: Props) {
  const t = useTranslations('Bio');

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {/* All categories button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-[#06b6d4] text-white'
            : 'bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:text-[#e2e8f0] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
        }`}
      >
        {t('allCategories')}
      </button>

      {/* Category buttons */}
      {BIO_CATEGORIES.map((category) => {
        const color = CATEGORY_COLORS[category];
        const isSelected = selectedCategory === category;
        const count = postCounts[category] || 0;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isSelected
                ? 'text-white'
                : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-opacity-50'
            }`}
            style={{
              backgroundColor: isSelected ? color : undefined,
              borderColor: !isSelected ? `${color}30` : undefined,
              color: !isSelected ? color : undefined
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {t(`categories.${category}`)}
            {count > 0 && (
              <span className={`text-xs ${
                isSelected ? 'opacity-80' : 'opacity-60'
              }`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
