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
import DashboardRings from '@/components/dashboard/DashboardRings';
import { getUserStreak } from '@/app/actions/streak';

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
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Home');

  if (!session || !session.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 relative overflow-hidden">
        {/* Animated background for landing */}
        <div className="animated-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        {/* Nike-style hero */}
        <div className="animate-fade-in-up">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-black text-[var(--foreground)] tracking-tighter leading-none mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            GOD LIFE AI
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-[var(--color-secondary)] mx-auto mb-6 sm:mb-8" />
          <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[var(--color-secondary)] mb-4">
            TRAIN. TRACK. TRANSFORM.
          </p>
          <p className="text-[var(--foreground-muted)] mb-8 sm:mb-10 text-base sm:text-lg max-w-md leading-relaxed mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signin"
            className="px-8 sm:px-10 py-3.5 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--color-secondary)] transition-all duration-300 font-bold flex items-center justify-center gap-2 tracking-wider uppercase text-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <LogIn className="w-4 h-4" />
            {t('enterSystem')}
          </a>
          <Link
            href="/met"
            className="px-8 sm:px-10 py-3.5 border-2 border-[var(--color-border)] text-[var(--foreground-muted)] hover:border-[var(--color-secondary)] hover:text-[var(--foreground)] transition-all duration-300 font-bold flex items-center justify-center gap-2 tracking-wider uppercase text-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
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
              {t('welcome', {name: session.user.name || 'User'})}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm animate-fade-in-up stagger-2">
            <GuideButton />
            <PrintButton />
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/auth/signout"
              className="p-2 rounded-md hover:bg-[var(--color-card-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex-shrink-0"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <DashboardRings rings={stats.rings} streakDays={streak.current} />

      <DashboardModules modules={modules} />
    </main>
  );
}
