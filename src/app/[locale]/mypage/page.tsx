import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserStats } from '@/app/actions/mypage';
import { getTranslations } from 'next-intl/server';
import { Compass, Trophy, Activity, Mail, Calendar, Target, Flame, Check } from 'lucide-react';
import ThemeSelector from '@/components/mypage/ThemeSelector';
import UserProfile from '@/components/mypage/UserProfile';

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');

  const t = await getTranslations('MyPage');
  const stats = await getUserStats();

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-wide">
            {t('title')}
          </h1>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {t('subtitle')}
          </p>
        </div>

        {/* User Profile Card */}
        <UserProfile
          name={stats.user.name}
          email={stats.user.email}
          image={stats.user.image}
          createdAt={stats.user.createdAt}
        />

        {/* Theme Selector */}
        <section className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
            {t('theme.title')}
          </h2>
          <ThemeSelector />
        </section>

        {/* Statistics Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            {t('stats.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destiny Navigator Stats */}
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-destiny)]/10">
                  <Compass className="w-5 h-5 text-[var(--color-destiny)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('stats.destiny.title')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.destiny.totalDays')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.destiny.totalDays}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.destiny.timeblocks')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.destiny.totalTimeblocks}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.destiny.completed')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.destiny.completedBlocks}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.destiny.avgScore')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {stats.destiny.averageScore ?? '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Success Code Stats */}
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-success-module)]/10">
                  <Trophy className="w-5 h-5 text-[var(--color-success-module)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('stats.success.title')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.success.projects')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.success.totalProjects}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.success.active')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.success.activeProjects}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[var(--foreground-muted)]">{t('stats.success.daysLogged')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.success.totalDaysLogged}</p>
                </div>
              </div>
            </div>

            {/* Discipline Mastery Stats */}
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-discipline)]/10">
                  <Activity className="w-5 h-5 text-[var(--color-discipline)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('stats.discipline.title')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.discipline.rules')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.discipline.totalRules}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.discipline.streak')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    <Flame className="w-4 h-4 inline mr-1 text-orange-500" />
                    {stats.discipline.currentStreak}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.discipline.last7Days')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.discipline.last7DaysRate}%</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.discipline.last30Days')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.discipline.last30DaysRate}%</p>
                </div>
              </div>
            </div>

            {/* Self Epistle Stats */}
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-epistle)]/10">
                  <Mail className="w-5 h-5 text-[var(--color-epistle)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{t('stats.epistle.title')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.epistle.totalLetters')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{stats.epistle.totalLetters}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">{t('stats.epistle.lastWritten')}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {stats.epistle.lastWrittenDate || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="pt-6 border-t border-[var(--color-border)]">
          <a
            href="/api/auth/signout"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
          >
            {t('signOut')}
          </a>
        </section>
      </div>
    </main>
  );
}
