import { getOrCreateDestinyDay } from '@/app/actions/destiny';
import TimeblockCard from '@/components/destiny/TimeblockCard';
import { Link } from '@/navigation';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventTimeline from '@/components/destiny/EventTimeline';
import { getTranslations, getLocale } from 'next-intl/server';
import { isValidDateParam } from '@/lib/validateDate';
import { getTodayStr } from '@/lib/date';

export default async function DestinyDayPage({ params }: { params: Promise<{ date: string }> }) {
  const t = await getTranslations('Destiny');
  const locale = await getLocale();
  const { date } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}`);
  }

  if (!isValidDateParam(date)) {
    redirect(`/${locale}/destiny/day/${getTodayStr()}`);
  }

  // Fetch or Create Data
  const day = await getOrCreateDestinyDay(date);

  // Date Navigation Logic
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate); prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate); nextDate.setDate(nextDate.getDate() + 1);
  
  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] pb-20">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        
        {/* Header Navigation */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-white/5">
          <Link href={`/destiny/day/${prevStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{date}</p>
          </div>
          <Link href={`/destiny/day/${nextStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
            <ChevronRight />
          </Link>
        </header>

        {/* 5 Goals Section (Placeholder for now, can be componentized) */}
        <section className="mb-8 space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('coreObjectives')}</h2>
          {[
            { label: t('goals.ultimate'), key: 'goalUltimate' },
            { label: t('goals.longTerm'), key: 'goalLong' },
            { label: t('goals.month'), key: 'goalMonth' },
            { label: t('goals.week'), key: 'goalWeek' },
            { label: t('goals.today'), key: 'goalToday' }
          ].map((item) => (
             <div key={item.key} className="flex items-center gap-4">
               <span className="w-20 text-xs font-bold text-gray-500 uppercase text-right">{item.label}</span>
               <div className="flex-1 h-8 bg-black/20 rounded border border-white/5 flex items-center px-3 text-sm text-gray-300">
                  {/* Connect to updateDestinyGoals later */}
                  {(day as unknown as Record<string, string | null>)[item.key] || '-'}
               </div>
             </div>
          ))}
        </section>

        {/* Timeblocks Grid */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">{t('timeblocks')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {day.timeblocks.map((block) => (
              <TimeblockCard key={block.id} block={block} />
            ))}
          </div>
        </section>

        {/* M4: Event Timeline */}
        <EventTimeline dayId={day.id} events={day.events} />

      </div>
    </main>
  );
}
