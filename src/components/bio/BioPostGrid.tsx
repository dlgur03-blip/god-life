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
          <p className="text-[var(--foreground-muted)]">{t('noPostsInCategory')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/bio/${post.slug}`}
              className="group bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl hover:border-[var(--color-success)] transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <CategoryBadge category={post.category} />
                <div className="flex items-center gap-2">
                  {post.locale !== locale && (
                    <span className="text-xs text-[var(--color-warning)]/70 uppercase">
                      {post.locale}
                    </span>
                  )}
                  <BookOpen className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--color-success)] transition-colors" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--color-primary)]">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] mt-4">
                {t('readProtocol')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {selectedCategory && filteredPosts.length > 0 && (
        <p className="text-center text-[var(--foreground-muted)] text-sm mt-6">
          {t('postsCount', { count: filteredPosts.length })}
        </p>
      )}
    </>
  );
}
