'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserSearchInput() {
  const t = useTranslations('Admin.users');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');

  // 디바운싱된 검색 함수
  const debouncedSearch = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('search', searchValue);
      params.delete('page'); // 검색 시 첫 페이지로
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, debouncedSearch]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
        size={18}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className={cn(
          'w-full pl-10 pr-10 py-2.5 rounded-lg',
          'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
          'text-[#e2e8f0] placeholder-[#6b7280]',
          'focus:outline-none focus:border-[#8b5cf6]',
          'transition-colors'
        )}
        aria-label={t('searchPlaceholder')}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#e2e8f0] transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
