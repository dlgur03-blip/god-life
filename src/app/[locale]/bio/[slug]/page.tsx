import { getBioPost } from '@/app/actions/bio';
import ReactMarkdown from 'react-markdown';
import { Link } from '@/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import NotFoundFallback from '@/components/navigation/NotFoundFallback';
import CategoryBadge from '@/components/bio/CategoryBadge';
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
    <main className="min-h-screen bg-[var(--background)] p-6 pb-20">
      <article className="max-w-3xl mx-auto">
        <Link href="/bio" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-2 mb-8 text-sm w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('backToDatabase')}
        </Link>

        <header className="mb-10 border-b border-[var(--color-border)] pb-10">
          <div className="flex items-center gap-3 mb-2">
            <CategoryBadge category={post.category} size="md" />
            {post.locale !== locale && (
              <span className="flex items-center gap-1 text-xs text-[var(--color-warning)]/70 border border-[var(--color-warning)]/30 px-2 py-0.5 rounded">
                <Globe className="w-3 h-3" />
                {t('viewingIn', { locale: post.locale.toUpperCase() })}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-[var(--foreground-muted)]">
            {t('updated')}: {new Date(post.updatedAt).toLocaleDateString(locale)}
          </div>
        </header>

        <div className="prose prose-lg max-w-none
          prose-headings:text-[var(--foreground)]
          prose-p:text-[var(--foreground)]
          prose-a:text-[var(--color-success)]
          prose-strong:text-[var(--foreground)]
          prose-li:text-[var(--foreground)]
          prose-blockquote:text-[var(--foreground-muted)]
          prose-blockquote:border-[var(--color-border)]
          prose-code:text-[var(--color-secondary)]
          prose-pre:bg-[var(--background-secondary)]
          prose-hr:border-[var(--color-border)]">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
