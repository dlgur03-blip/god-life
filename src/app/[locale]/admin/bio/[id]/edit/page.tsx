import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { getAdminBioPost } from '@/app/actions/admin';
import BioPostFormWrapper from '@/components/admin/bio/BioPostFormWrapper';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBioPostPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('Admin.bio');
  const result = await getAdminBioPost(id);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bio"
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">{t('editPost')}</h1>
        </div>
        <div className="text-center py-8 text-[#ef4444]">
          Post not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/bio"
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-[#e2e8f0]">{t('editPost')}</h1>
      </div>

      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6">
        <BioPostFormWrapper mode="edit" initialData={result.data} />
      </div>
    </div>
  );
}
