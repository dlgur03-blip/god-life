import { getOrCreateDestinyDay, getWeeklyPlans } from '@/app/actions/destiny';
import TimeblockList from '@/components/destiny/TimeblockList';
import DestinyNavigatorCard from '@/components/destiny/DestinyNavigatorCard';
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

  // Fetch Data
  const day = await getOrCreateDestinyDay(date);

  // Fetch weekly plans starting from today (component uses today as default start)
  const todayStr = getTodayStr();
  const weeklyPlans = await getWeeklyPlans(todayStr);

  // Date Navigation Logic
  const currentDate = new Date(date + 'T00:00:00');
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

        {/* Core Objectives: 5-Level Goals */}
        <DestinyNavigatorCard
          dayId={day.id}
          goalUltimate={day.goalUltimate}
          goalLong={day.goalLong}
          goalMonth={day.goalMonth}
          goalWeek={day.goalWeek}
          goalToday={day.goalToday}
          weeklyPlans={weeklyPlans}
        />

        {/* Timeblocks Grid - 24-Hour System */}
        <TimeblockList dayId={day.id} initialBlocks={day.timeblocks} />

        {/* M4: Event Timeline */}
        <EventTimeline
          dayId={day.id}
          events={day.events.map(event => ({
            ...event,
            recordedAt: event.recordedAt.toISOString()
          }))}
        />

      </div>
    </main>
  );
}
