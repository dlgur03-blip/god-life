import { getEpistle } from '@/app/actions/epistle';
import EpistleForm from '@/components/epistle/EpistleForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Link } from '@/navigation';
import { redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { isValidDateParam } from '@/lib/validateDate';
import { getTodayStr } from '@/lib/date';

export default async function EpistleDayPage({ params }: { params: Promise<{ date: string }> }) {
  const t = await getTranslations('Epistle');
  const locale = await getLocale();
  const { date } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/${locale}`);

  if (!isValidDateParam(date)) {
    redirect(`/${locale}/epistle/day/${getTodayStr()}`);
  }

  const data = await getEpistle(date);

  // Nav Logic
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate); prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate); nextDate.setDate(nextDate.getDate() + 1);
  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-4 md:p-8 pb-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-white/5">
          <Link href={`/epistle/day/${prevStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{date}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/epistle/timeline" className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors" title={t('timeline')}>
               <History />
            </Link>
            <Link href={`/epistle/day/${nextStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
              <ChevronRight />
            </Link>
          </div>
        </header>

        <EpistleForm date={date} initialData={data} />

      </div>
    </main>
  );
}
