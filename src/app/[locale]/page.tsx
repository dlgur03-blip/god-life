import { Link } from '@/navigation';
import { Brain, LogIn, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTodayStr } from '@/lib/date';
import { getUserTimezone } from '@/lib/timezone';
import { getTranslations } from 'next-intl/server';
import WelcomeGuide from '@/components/guide/WelcomeGuide';
import GuideButton from '@/components/guide/GuideButton';
import DashboardModules from '@/components/dashboard/DashboardModules';
import type { ModuleCardData } from '@/components/dashboard/DashboardModules';
import PrintButton from '@/components/dashboard/PrintButton';

export const dynamic = 'force-dynamic'; // Ensure real-time status

async function getDashboardStats(userId: string, today: string, t: (key: string, values?: Record<string, string | number>) => string) {

  // Parallel Fetch
  const [destinyDay, disciplineRules, successProjects, epistleDay, taskCount] = await Promise.all([
    prisma.destinyDay.findUnique({
      where: { userId_date: { userId, date: today } },
      include: { timeblocks: true }
    }),
    prisma.disciplineRule.findMany({
      where: { userId },
      include: { checks: { where: { date: today } } }
    }),
    prisma.successProject.findMany({
      where: { userId, enabled: true },
    }),
    prisma.epistleDay.findUnique({
      where: { userId_date: { userId, date: today } }
    }),
    prisma.userTask.count({
      where: { userId, status: { not: 'completed' } }
    })
  ]);

  // Calculate Statuses
  const destinyStatus = !destinyDay
    ? { label: t('status.notStarted'), color: 'muted' }
    : destinyDay.timeblocks.some(b => b.score && b.score > 0)
      ? { label: t('status.inProgress'), color: 'primary' }
      : { label: t('status.planned'), color: 'info' };

  const discTotal = disciplineRules.length;
  const discChecked = disciplineRules.filter(r => r.checks.length > 0).length;
  const discStatus = discTotal === 0
    ? { label: t('status.noRules'), color: 'muted' }
    : { label: t('status.percentDone', {percent: Math.round((discChecked / discTotal) * 100)}), color: discChecked === discTotal ? 'success' : 'secondary' };

  const successCount = successProjects.length;
  const successStatus = successCount === 0
    ? { label: t('status.noActive'), color: 'muted' }
    : { label: t('status.activeCount', {count: successCount}), color: 'accent' };

  const epistleStatus = epistleDay
    ? { label: t('status.sealed'), color: 'success' }
    : { label: t('status.pending'), color: 'muted' };

  const taskStatus = taskCount === 0
    ? { label: t('status.noTasks'), color: 'muted' }
    : { label: t('status.taskCount', {count: taskCount}), color: 'primary' };

  return { destinyStatus, discStatus, successStatus, epistleStatus, taskStatus };
}

// statusColorMap moved to DashboardModules component

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Home');

  if (!session || !session.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-wide mb-4">
          GOD LIFE MAKER
        </h1>
        <div className="w-16 sm:w-24 h-1 bg-[var(--color-secondary)] mx-auto mb-6 sm:mb-8" />
        <p className="text-[var(--foreground-muted)] mb-6 sm:mb-8 text-base sm:text-xl max-w-md leading-relaxed">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signin"
            className="px-6 sm:px-8 py-3 border border-[var(--color-secondary)] text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--background)] transition-all duration-300 font-medium flex items-center gap-2 tracking-wider uppercase text-sm"
          >
            <LogIn className="w-4 h-4" />
            {t('enterSystem')}
          </a>
          <Link
            href="/met"
            className="px-6 sm:px-8 py-3 border border-[var(--color-border)] text-[var(--foreground-muted)] hover:border-[var(--color-secondary)] hover:text-[var(--foreground)] transition-all duration-300 font-medium flex items-center gap-2 tracking-wider uppercase text-sm"
          >
            <Brain className="w-4 h-4" />
            {t('modules.met.name')}
          </Link>
        </div>
      </main>
    );
  }

  // Fetch Real Data
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[var(--foreground-muted)]">{t('userError')}</p>
    </div>
  );

  const timezone = await getUserTimezone();
  const todayStr = getTodayStr(timezone);
  const stats = await getDashboardStats(user.id, todayStr, t);

  const modules: ModuleCardData[] = [
    { name: t('modules.destiny.name'), href: `/destiny/day/${todayStr}`, iconKey: 'compass', desc: t('modules.destiny.desc'), status: stats.destinyStatus, moduleColor: 'var(--color-destiny)', aiPrompt: t('modules.destiny.aiPrompt') },
    { name: t('modules.taskBoard.name'), href: '/tasks', iconKey: 'clipboardList', desc: t('modules.taskBoard.desc'), status: stats.taskStatus, moduleColor: 'var(--color-primary)', aiPrompt: t('modules.taskBoard.aiPrompt') },
    { name: t('modules.success.name'), href: '/success', iconKey: 'trophy', desc: t('modules.success.desc'), status: stats.successStatus, moduleColor: 'var(--color-success-module)', aiPrompt: t('modules.success.aiPrompt') },
    { name: t('modules.discipline.name'), href: `/discipline/day/${todayStr}`, iconKey: 'activity', desc: t('modules.discipline.desc'), status: stats.discStatus, moduleColor: 'var(--color-discipline)', aiPrompt: t('modules.discipline.aiPrompt') },
    { name: t('modules.epistle.name'), href: `/epistle/day/${todayStr}`, iconKey: 'mail', desc: t('modules.epistle.desc'), status: stats.epistleStatus, moduleColor: 'var(--color-epistle)', aiPrompt: t('modules.epistle.aiPrompt') },
    { name: t('modules.money.name'), href: '/money', iconKey: 'wallet', desc: t('modules.money.desc'), status: { label: t('status.database'), color: 'success' }, moduleColor: 'var(--color-money)', aiPrompt: t('modules.money.aiPrompt') },
    { name: t('modules.met.name'), href: '/met', iconKey: 'brain', desc: t('modules.met.desc'), status: { label: 'AI', color: 'secondary' }, moduleColor: 'var(--color-secondary)' },
    { name: t('modules.chat.name'), href: '/chat', iconKey: 'messageCircle', desc: t('modules.chat.desc'), status: { label: 'AI Coach', color: 'secondary' }, moduleColor: 'var(--color-secondary)' },
  ];

  return (
    <main className="min-h-screen px-4 py-6 md:p-8 flex flex-col items-center gap-6 md:gap-10">
      {/* Welcome Guide Popup - Shows on first visit */}
      <WelcomeGuide />

      <div className="w-full max-w-5xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-wide">
              {t('title')}
            </h1>
            <div className="w-12 sm:w-16 h-0.5 bg-[var(--color-secondary)] mt-2" />
          </div>
          <GuideButton />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-sm">
          <PrintButton />
          <span className="text-[var(--foreground-muted)] truncate max-w-[200px]">{t('welcome', {name: session.user.name || 'User'})}</span>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signout"
            className="p-2 rounded-md hover:bg-[var(--color-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex-shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>

      <DashboardModules modules={modules} />
    </main>
  );
}
