import { getBioPosts } from '@/app/actions/bio';
import { Link } from '@/navigation';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function BioPage() {
  const t = await getTranslations('Bio');
  const posts = await getBioPosts();

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-400">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/bio/${post.slug}`} className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-green-400/50 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest border border-green-400/30 px-2 py-1 rounded">
                  {post.category}
                </span>
                <BookOpen className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-white">{post.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-300 mt-4">
                {t('readProtocol')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
