import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Link } from '@/navigation';
import { getAdminBioPostList } from '@/app/actions/admin';
import BioPostTable from '@/components/admin/bio/BioPostTable';
import BioAdminEmptyState from '@/components/admin/bio/BioAdminEmptyState';
import BioAdminLoadingSkeleton from '@/components/admin/bio/BioAdminLoadingSkeleton';

async function BioPostListContent() {
  const result = await getAdminBioPostList();

  if (!result.success) {
    return (
      <div className="text-center py-8 text-[#ef4444]">
        Failed to load posts
      </div>
    );
  }

  const { posts } = result.data;

  if (posts.length === 0) {
    return <BioAdminEmptyState />;
  }

  return <BioPostTable posts={posts} />;
}

export default async function BioPostListPage() {
  const t = await getTranslations('Admin.bio');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#e2e8f0]">{t('title')}</h1>
        <Link
          href="/admin/bio/new"
          className="inline-flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#a78bfa] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          {t('newPost')}
        </Link>
      </div>

      <Suspense fallback={<BioAdminLoadingSkeleton />}>
        <BioPostListContent />
      </Suspense>
    </div>
  );
}
