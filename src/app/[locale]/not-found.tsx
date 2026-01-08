import { Link } from '@/navigation';
import { Home } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('Common');

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] flex items-center justify-center p-6">
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] rounded-2xl p-10 text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-4">{t('notFound.title')}</h1>
        <p className="text-gray-400 mb-8">{t('notFound.message')}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#06b6d4]/20 border border-[#06b6d4] rounded-lg text-[#06b6d4] hover:bg-[#06b6d4] hover:text-black transition-all"
        >
          <Home className="w-4 h-4" />
          {t('notFound.backHome')}
        </Link>
      </div>
    </main>
  );
}
