import { Link } from '@/navigation';
import { Compass, Trophy, Activity, Mail, BookOpen, Wallet, LogIn, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTodayStr } from '@/lib/date';
import { getUserTimezone } from '@/lib/timezone';
import { getTranslations } from 'next-intl/server';
import WelcomeGuide from '@/components/guide/WelcomeGuide';
import GuideButton from '@/components/guide/GuideButton';

export const dynamic = 'force-dynamic'; // Ensure real-time status

async function getDashboardStats(userId: string, today: string, t: (key: string, values?: Record<string, string | number>) => string) {

  // Parallel Fetch
  const [destinyDay, disciplineRules, successProjects, epistleDay] = await Promise.all([
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

  return { destinyStatus, discStatus, successStatus, epistleStatus };
}

const statusColorMap: Record<string, string> = {
  muted: 'text-[var(--foreground-muted)]',
  primary: 'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)]',
  success: 'text-[var(--color-success)]',
  info: 'text-[var(--color-info)]',
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Home');

  if (!session || !session.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-5xl font-extrabold text-[var(--foreground)] tracking-wide mb-4">
          GOD LIFE MAKER
        </h1>
        <div className="w-24 h-1 bg-[var(--color-secondary)] mx-auto mb-8" />
        <p className="text-[var(--foreground-muted)] mb-8 text-xl max-w-md leading-relaxed">
          {t('subtitle')}
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/signin"
          className="px-8 py-3 border border-[var(--color-secondary)] text-[var(--foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--background)] transition-all duration-300 font-medium flex items-center gap-2 tracking-wider uppercase text-sm"
        >
          <LogIn className="w-4 h-4" />
          {t('enterSystem')}
        </a>
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

  const modules = [
    { name: t('modules.destiny.name'), href: `/destiny/day/${todayStr}`, icon: Compass, desc: t('modules.destiny.desc'), status: stats.destinyStatus, moduleColor: 'var(--color-destiny)' },
    { name: t('modules.success.name'), href: '/success', icon: Trophy, desc: t('modules.success.desc'), status: stats.successStatus, moduleColor: 'var(--color-success-module)' },
    { name: t('modules.discipline.name'), href: `/discipline/day/${todayStr}`, icon: Activity, desc: t('modules.discipline.desc'), status: stats.discStatus, moduleColor: 'var(--color-discipline)' },
    { name: t('modules.epistle.name'), href: `/epistle/day/${todayStr}`, icon: Mail, desc: t('modules.epistle.desc'), status: stats.epistleStatus, moduleColor: 'var(--color-epistle)' },
    { name: t('modules.bio.name'), href: '/bio', icon: BookOpen, desc: t('modules.bio.desc'), status: { label: t('status.database'), color: 'success' }, moduleColor: 'var(--color-bio)' },
    { name: t('modules.money.name'), href: '/money', icon: Wallet, desc: t('modules.money.desc'), status: { label: t('status.database'), color: 'success' }, moduleColor: 'var(--color-money)' },
  ];

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-10">
      {/* Welcome Guide Popup - Shows on first visit */}
      <WelcomeGuide />

      <div className="w-full max-w-5xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-wide">
              {t('title')}
            </h1>
            <div className="w-16 h-0.5 bg-[var(--color-secondary)] mt-2" />
          </div>
          <GuideButton />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--foreground-muted)]">{t('welcome', {name: session.user.name || 'User'})}</span>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signout"
            className="p-2 rounded-md hover:bg-[var(--color-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
        {modules.map((m) => (
          <Link key={m.name} href={m.href}
            className="card-hover border border-[var(--color-border)] p-8 flex flex-col items-center gap-4 text-center cursor-pointer group relative overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <m.icon
              className="w-12 h-12 transition-colors duration-300"
              style={{ color: m.moduleColor }}
            />
            <h2 className="text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">
              {m.name}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">{m.desc}</p>

            {/* Status Badge */}
            <div
              className={`mt-2 px-3 py-1 text-xs font-medium border border-[var(--color-border)] ${statusColorMap[m.status.color] || statusColorMap.muted}`}
              style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-card-bg)' }}
            >
              {m.status.label}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
