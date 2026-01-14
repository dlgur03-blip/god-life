import { getDisciplineStats } from '@/app/actions/discipline';
import { Link } from '@/navigation';
import { ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getTodayStr } from '@/lib/date';

export default async function DisciplineInsightsPage() {
  const t = await getTranslations('Discipline');
  const stats = await getDisciplineStats();
  const { getUserTimezone } = await import('@/lib/timezone');
  const timezone = await getUserTimezone();
  const todayStr = getTodayStr(timezone);

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
           <Link href={`/discipline/day/${todayStr}`} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-2 text-sm w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('backToCheck')}
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <TrendingUp className="text-[var(--color-secondary)]" />
            {t('masteryInsights')}
          </h1>
        </header>

        <div className="space-y-6">
          {stats.map((rule) => (
            <div key={rule.id} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[var(--foreground)]">{rule.title}</h2>
                <BarChart3 className="w-5 h-5 text-[var(--foreground-muted)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--background-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{rule.sevenDayRate}%</div>
                  <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest">{t('sevenDayRate')}</div>
                  <div className="w-full h-1 bg-[var(--color-border)] mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)]" style={{ width: `${rule.sevenDayRate}%` }} />
                  </div>
                </div>

                <div className="bg-[var(--background-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
                  <div className="text-2xl font-bold text-[var(--color-secondary)]">{rule.thirtyDayRate}%</div>
                  <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-widest">{t('thirtyDayRate')}</div>
                   <div className="w-full h-1 bg-[var(--color-border)] mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-secondary)]" style={{ width: `${rule.thirtyDayRate}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {stats.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--foreground-muted)]">{t('noRulesInsight')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
