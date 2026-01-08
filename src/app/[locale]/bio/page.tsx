import { getBioPosts } from '@/app/actions/bio';
import { getTranslations } from 'next-intl/server';
import BioPostGrid from '@/components/bio/BioPostGrid';
import type { Locale } from '@/types/bio';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('Bio');
  const posts = await getBioPosts(locale as Locale);

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4] mb-2">
            {t('title')}
          </h1>
          <p className="text-[#9ca3af]">{t('subtitle')}</p>
        </header>

        <BioPostGrid posts={posts} locale={locale} />
      </div>
    </main>
  );
}
