import MetLanding from '@/components/met/MetLanding';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Met');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function MetPage() {
  return <MetLanding />;
}
