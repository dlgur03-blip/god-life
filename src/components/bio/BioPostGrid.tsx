'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/navigation';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CategoryList from './CategoryList';
import CategoryBadge from './CategoryBadge';
import type { BioPostWithTranslation } from '@/types/bio';

type Props = {
  posts: BioPostWithTranslation[];
  locale: string;
};

export default function BioPostGrid({ posts, locale }: Props) {
  const t = useTranslations('Bio');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate post counts per category
  const postCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <>
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        postCounts={postCounts}
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#9ca3af]">{t('noPostsInCategory')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/bio/${post.slug}`}
              className="group bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 rounded-2xl hover:border-[rgba(74,222,128,0.5)] transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <CategoryBadge category={post.category} />
                <div className="flex items-center gap-2">
                  {post.locale !== locale && (
                    <span className="text-xs text-[#f59e0b]/70 uppercase">
                      {post.locale}
                    </span>
                  )}
                  <BookOpen className="w-5 h-5 text-[#4b5563] group-hover:text-[#10b981] transition-colors" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#e2e8f0] mb-2 group-hover:text-white">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#4b5563] group-hover:text-[#9ca3af] mt-4">
                {t('readProtocol')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {selectedCategory && filteredPosts.length > 0 && (
        <p className="text-center text-[#4b5563] text-sm mt-6">
          {t('postsCount', { count: filteredPosts.length })}
        </p>
      )}
    </>
  );
}
