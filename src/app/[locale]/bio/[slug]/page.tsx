import { getBioPost } from '@/app/actions/bio';
import ReactMarkdown from 'react-markdown';
import { Link } from '@/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import NotFoundFallback from '@/components/navigation/NotFoundFallback';
import type { Locale } from '@/types/bio';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function BioPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations('Bio');
  const tCommon = await getTranslations('Common');
  const post = await getBioPost(slug, locale as Locale);

  if (!post) {
    return (
      <NotFoundFallback
        title={t('protocolNotFound')}
        message={t('protocolNotFoundMessage')}
        backHref="/bio"
        backLabel={t('returnToDatabase')}
        homeLabel={tCommon('notFound.backHome')}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <article className="max-w-3xl mx-auto">
        <Link href="/bio" className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" /> {t('backToDatabase')}
        </Link>

        <header className="mb-10 border-b border-white/10 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
              {post.category}
            </span>
            {post.locale !== locale && (
              <span className="flex items-center gap-1 text-xs text-amber-400/70 border border-amber-400/30 px-2 py-0.5 rounded">
                <Globe className="w-3 h-3" />
                {t('viewingIn', { locale: post.locale.toUpperCase() })}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-gray-500">
            {t('updated')}: {new Date(post.updatedAt).toLocaleDateString(locale)}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-a:text-green-400 prose-strong:text-white">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
