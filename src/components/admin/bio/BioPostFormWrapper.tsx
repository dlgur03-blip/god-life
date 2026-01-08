'use client';

import { useRouter } from '@/navigation';
import { createBioPost, updateBioPost } from '@/app/actions/admin';
import type { BioPostDetail, BioPostFormData } from '@/app/actions/admin';
import BioPostForm from './BioPostForm';

type Props = {
  mode: 'create' | 'edit';
  initialData?: BioPostDetail;
};

export default function BioPostFormWrapper({ mode, initialData }: Props) {
  const router = useRouter();

  const handleSubmit = async (data: BioPostFormData) => {
    if (mode === 'create') {
      const result = await createBioPost(data);
      if (result.success) {
        router.push('/admin/bio');
      } else {
        // Error handling could be improved with toast notifications
        console.error('Failed to create post:', result.error);
      }
    } else if (initialData) {
      const result = await updateBioPost(initialData.id, data);
      if (result.success) {
        router.push('/admin/bio');
      } else {
        console.error('Failed to update post:', result.error);
      }
    }
  };

  return (
    <BioPostForm
      mode={mode}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}
