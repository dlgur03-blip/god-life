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

type WeeklyPlan = { id: string; content: string };

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

  // Fetch weekly plans (7 free-form slots)
  const weeklyPlans = await getWeeklyPlans();

  // Date Navigation Logic
  const currentDate = new Date(date + 'T00:00:00');
  const prevDate = new Date(currentDate); prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate); nextDate.setDate(nextDate.getDate() + 1);

  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  // Check if viewing today
  const isToday = date === getTodayStr();

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      <div className="max-w-3xl mx-auto p-4 md:p-6">

        {/* Header Navigation */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-[var(--color-border)]">
          <Link href={`/destiny/day/${prevStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-[var(--color-secondary)]">
              {t('title')}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] font-mono">{date}</p>
          </div>
          <Link href={`/destiny/day/${nextStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
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
          isToday={isToday}
        />

      </div>
    </main>
  );
}
