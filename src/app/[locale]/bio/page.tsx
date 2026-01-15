import { getBioPosts } from '@/app/actions/bio';
import { getTranslations } from 'next-intl/server';
import BioPostGrid from '@/components/bio/BioPostGrid';
import type { Locale } from '@/types/bio';
import GuideButton from '@/components/guide/GuideButton';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('Bio');
  const posts = await getBioPosts(locale as Locale);

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-extrabold text-[var(--color-success)]">
              {t('title')}
            </h1>
            <GuideButton />
          </div>
          <p className="text-[var(--foreground-muted)]">{t('subtitle')}</p>
        </header>

        <BioPostGrid posts={posts} locale={locale} />
      </div>
    </main>
  );
}
