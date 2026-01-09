import { getEpistleTimeline } from '@/app/actions/epistle';
import { Link } from '@/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getTodayStr } from '@/lib/date';

export default async function EpistleTimelinePage() {
  const t = await getTranslations('Epistle');
  const letters = await getEpistleTimeline();
  const todayStr = getTodayStr();

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
           <Link href={`/epistle/day/${todayStr}`} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-2 text-sm w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('backToWriting')}
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{t('archives')}</h1>
        </header>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-border)] before:to-transparent">
          {letters.map((letter) => (
            <div key={letter.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--background)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-2xl">
                {letter.mood || '📜'}
              </div>

              {/* Card */}
              <Link href={`/epistle/day/${letter.date}`} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl hover:border-[var(--color-accent)]/50 transition-all hover:-translate-y-1">
                <div className="flex justify-between items-center mb-2">
                  <time className="font-mono text-sm text-[var(--foreground-muted)]">{letter.date}</time>
                  <Mail className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--color-accent)]" />
                </div>
                <div className="space-y-2">
                   {letter.toYesterday && (
                     <p className="text-[var(--foreground)] text-sm line-clamp-2 italic border-l-2 border-[var(--color-border)] pl-2">
                       &quot;{letter.toYesterday}&quot;
                     </p>
                   )}
                   {letter.toTomorrow && (
                     <p className="text-[var(--foreground-muted)] text-sm line-clamp-2 border-l-2 border-[var(--color-primary)]/20 pl-2">
                       &rarr; {letter.toTomorrow}
                     </p>
                   )}
                </div>
              </Link>
            </div>
          ))}

          {letters.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--foreground-muted)]">{t('noLetters')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
