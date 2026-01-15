import { getEpistle, getYesterdayLetter } from '@/app/actions/epistle';
import EpistleForm from '@/components/epistle/EpistleForm';
import ReceivedLetterCard from '@/components/epistle/ReceivedLetterCard';
import DateAccessGuard from '@/components/epistle/DateAccessGuard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Link } from '@/navigation';
import { redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import GuideButton from '@/components/guide/GuideButton';
import { getTranslations, getLocale } from 'next-intl/server';
import { isValidDateParam } from '@/lib/validateDate';
import { getTodayStr } from '@/lib/date';
import { getEpistleDateAccess, getYesterdayStr } from '@/lib/utils';

export default async function EpistleDayPage({ params }: { params: Promise<{ date: string }> }) {
  const t = await getTranslations('Epistle');
  const locale = await getLocale();
  const { date } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/${locale}`);

  const { getUserTimezone } = await import('@/lib/timezone');
  const timezone = await getUserTimezone();
  const todayStr = getTodayStr(timezone);

  if (!isValidDateParam(date)) {
    redirect(`/${locale}/epistle/day/${todayStr}`);
  }

  const access = getEpistleDateAccess(date, timezone);

  // Redirect blocked dates to today
  if (access === 'blocked') {
    redirect(`/${locale}/epistle/day/${todayStr}`);
  }

  const [data, yesterdayLetter] = await Promise.all([
    getEpistle(date),
    getYesterdayLetter(date)
  ]);

  // Nav Logic
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate); prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate); nextDate.setDate(nextDate.getDate() + 1);
  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  // Check if next navigation is allowed
  const nextAccess = getEpistleDateAccess(nextStr, timezone);
  const canNavigateNext = nextAccess !== 'blocked';

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 md:p-8 pb-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-[var(--color-border)]">
          <Link href={`/epistle/day/${prevStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold tracking-widest text-[var(--color-accent)]">
                {t('title')}
              </h1>
              <GuideButton />
            </div>
            <p className="text-sm text-[var(--foreground-muted)] font-mono">{date}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/epistle/timeline" className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors" title={t('timeline')}>
              <History />
            </Link>
            {canNavigateNext ? (
              <Link href={`/epistle/day/${nextStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
                <ChevronRight />
              </Link>
            ) : (
              <button
                disabled
                className="p-2 rounded-full text-[var(--foreground-muted)] cursor-not-allowed opacity-50"
                title={t('dateBlockedHint')}
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </header>

        {/* Received Letter Section */}
        <ReceivedLetterCard
          content={yesterdayLetter?.toTomorrow || null}
          fromDate={getYesterdayStr(date)}
          mood={yesterdayLetter?.mood}
        />

        {/* Letter Composition Section */}
        <DateAccessGuard access={access}>
          <EpistleForm
            date={date}
            initialData={data}
            readOnly={access === 'past'}
          />
        </DateAccessGuard>

      </div>
    </main>
  );
}
