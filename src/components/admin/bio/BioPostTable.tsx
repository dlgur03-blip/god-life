'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from '@/navigation';
import { deleteBioPost } from '@/app/actions/admin';
import DeleteBioPostDialog from './DeleteBioPostDialog';

type Props = {
  posts: Array<{
    id: string;
    slug: string;
    category: string;
    createdAt: Date;
    translations: Array<{ locale: string; title: string }>;
  }>;
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Nutrition: {
    bg: 'rgba(16, 185, 129, 0.2)',
    text: '#10b981',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  Supplements: {
    bg: 'rgba(139, 92, 246, 0.2)',
    text: '#8b5cf6',
    border: 'rgba(139, 92, 246, 0.3)'
  },
  Recovery: {
    bg: 'rgba(6, 182, 212, 0.2)',
    text: '#06b6d4',
    border: 'rgba(6, 182, 212, 0.3)'
  },
  Exercise: {
    bg: 'rgba(245, 158, 11, 0.2)',
    text: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.3)'
  },
  Mindset: {
    bg: 'rgba(236, 72, 153, 0.2)',
    text: '#ec4899',
    border: 'rgba(236, 72, 153, 0.3)'
  }
};

const locales = ['ko', 'en', 'ja'] as const;

export default function BioPostTable({ posts }: Props) {
  const t = useTranslations('Admin.bio');
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; slug: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const result = await deleteBioPost(deleteTarget.id);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const hasTranslation = (translations: Array<{ locale: string }>, locale: string) => {
    return translations.some((t) => t.locale === locale);
  };

  return (
    <>
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9ca3af]">
                  {t('slug')}
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9ca3af]">
                  {t('category')}
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9ca3af]">
                  {t('translations')}
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9ca3af]">
                  {t('created')}
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-[#9ca3af]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const colors = categoryColors[post.category] || categoryColors.Nutrition;

                return (
                  <tr
                    key={post.id}
                    className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-[#e2e8f0]">{post.slug}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium border"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        {t(`categories.${post.category}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {locales.map((locale) => (
                          <span
                            key={locale}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              hasTranslation(post.translations, locale)
                                ? 'bg-[rgba(255,255,255,0.1)] text-[#e2e8f0]'
                                : 'bg-[rgba(255,255,255,0.03)] text-[#4b5563]'
                            }`}
                          >
                            {locale.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#9ca3af]">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/bio/${post.id}/edit`}
                          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: post.id, slug: post.slug })}
                          className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.2)] text-[#9ca3af] hover:text-[#ef4444] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <DeleteBioPostDialog
          postSlug={deleteTarget.slug}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
