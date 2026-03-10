import { prisma } from '@/lib/prisma';
import { getTodayStr } from '@/lib/date';
import { getUserTimezone } from '@/lib/timezone';
import { getTranslations } from 'next-intl/server';
import WelcomeGuide from '@/components/guide/WelcomeGuide';
import GuideButton from '@/components/guide/GuideButton';
import DashboardModules from '@/components/dashboard/DashboardModules';
import type { ModuleCardData } from '@/components/dashboard/DashboardModules';
import PrintButton from '@/components/dashboard/PrintButton';
import DashboardRings from '@/components/dashboard/DashboardRings';
import { getUserStreak } from '@/app/actions/streak';
import { getDefaultUser } from '@/lib/default-user';

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

  // Ring data for dashboard progress rings
  const destinyBlocks = destinyDay?.timeblocks.length || 0;
  const destinyScored = destinyDay?.timeblocks.filter(b => b.score && b.score > 0).length || 0;
  const rings = {
    destiny: destinyBlocks > 0 ? Math.round((destinyScored / destinyBlocks) * 100) : (destinyDay ? 10 : 0),
    discipline: discTotal > 0 ? Math.round((discChecked / discTotal) * 100) : 0,
    epistle: epistleDay ? 100 : 0,
    tasks: taskCount > 0 ? 0 : 100, // 0 remaining = 100% done
  };

  return { destinyStatus, discStatus, successStatus, epistleStatus, taskStatus, rings };
}

// statusColorMap moved to DashboardModules component

export default async function Home() {
  const t = await getTranslations('Home');
  const user = await getDefaultUser();

  const timezone = await getUserTimezone();
  const todayStr = getTodayStr(timezone);
  const [stats, streak] = await Promise.all([
    getDashboardStats(user.id, todayStr, t),
    getUserStreak(),
  ]);

  const modules: ModuleCardData[] = [
    { name: t('modules.destiny.name'), href: `/destiny/day/${todayStr}`, iconKey: 'compass', desc: t('modules.destiny.desc'), status: stats.destinyStatus, moduleColor: 'var(--color-destiny)', aiPrompt: t('modules.destiny.aiPrompt') },
    { name: t('modules.taskBoard.name'), href: '/tasks', iconKey: 'clipboardList', desc: t('modules.taskBoard.desc'), status: stats.taskStatus, moduleColor: 'var(--color-primary)', aiPrompt: t('modules.taskBoard.aiPrompt') },
    { name: t('modules.success.name'), href: '/success', iconKey: 'trophy', desc: t('modules.success.desc'), status: stats.successStatus, moduleColor: 'var(--color-success-module)', aiPrompt: t('modules.success.aiPrompt') },
    { name: t('modules.discipline.name'), href: `/discipline/day/${todayStr}`, iconKey: 'activity', desc: t('modules.discipline.desc'), status: stats.discStatus, moduleColor: 'var(--color-discipline)', aiPrompt: t('modules.discipline.aiPrompt') },
    { name: t('modules.epistle.name'), href: `/epistle/day/${todayStr}`, iconKey: 'mail', desc: t('modules.epistle.desc'), status: stats.epistleStatus, moduleColor: 'var(--color-epistle)', aiPrompt: t('modules.epistle.aiPrompt') },
    { name: t('modules.money.name'), href: '/money', iconKey: 'wallet', desc: t('modules.money.desc'), status: { label: t('status.database'), color: 'success' }, moduleColor: 'var(--color-money)', aiPrompt: t('modules.money.aiPrompt') },
    { name: t('modules.met.name'), href: '/met', iconKey: 'brain', desc: t('modules.met.desc'), status: { label: 'AI', color: 'secondary' }, moduleColor: 'var(--color-secondary)' },
    { name: t('modules.chat.name'), href: '/chat', iconKey: 'messageCircle', desc: t('modules.chat.desc'), status: { label: 'AI Coach', color: 'secondary' }, moduleColor: 'var(--color-secondary)' },
    { name: 'FOX학개론', href: '/videos', iconKey: 'play', desc: 'ONE LOVE EDU 영상 강의', status: { label: '35 videos', color: 'accent' }, moduleColor: 'var(--color-secondary)' },
  ];

  // Get today's date for hero display
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString(undefined, dateOptions);

  return (
    <main className="min-h-screen px-4 py-6 md:p-8 flex flex-col items-center gap-6 md:gap-8">
      {/* Welcome Guide Popup - Shows on first visit */}
      <WelcomeGuide />

      {/* Hero Section */}
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
          <div className="animate-fade-in-up">
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mb-1">{dateStr}</p>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('welcome', {name: user.name || 'User'})}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm animate-fade-in-up stagger-2">
            <GuideButton />
            <PrintButton />
          </div>
        </div>
      </div>

      <DashboardRings rings={stats.rings} streakDays={streak.current} />

      <DashboardModules modules={modules} />
    </main>
  );
}
