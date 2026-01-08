import { Link } from '@/navigation';
import { Compass, Trophy, Activity, Mail, BookOpen, LogIn, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTodayStr } from '@/lib/date';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic'; // Ensure real-time status

async function getDashboardStats(userId: string, t: (key: string, values?: Record<string, string | number>) => string) {
  const today = getTodayStr();

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
      // Check if today's entry is done? Complex query, simplify for MVP
    }),
    prisma.epistleDay.findUnique({
      where: { userId_date: { userId, date: today } }
    })
  ]);

  // Calculate Statuses
  const destinyStatus = !destinyDay
    ? { label: t('status.notStarted'), color: 'text-gray-500' }
    : destinyDay.timeblocks.some(b => b.score && b.score > 0)
      ? { label: t('status.inProgress'), color: 'text-primary' }
      : { label: t('status.planned'), color: 'text-blue-400' };

  const discTotal = disciplineRules.length;
  const discChecked = disciplineRules.filter(r => r.checks.length > 0).length;
  const discStatus = discTotal === 0
    ? { label: t('status.noRules'), color: 'text-gray-500' }
    : { label: t('status.percentDone', {percent: Math.round((discChecked / discTotal) * 100)}), color: discChecked === discTotal ? 'text-green-400' : 'text-secondary' };

  const successCount = successProjects.length;
  const successStatus = successCount === 0
    ? { label: t('status.noActive'), color: 'text-gray-500' }
    : { label: t('status.activeCount', {count: successCount}), color: 'text-accent' };

  const epistleStatus = epistleDay
    ? { label: t('status.sealed'), color: 'text-purple-400' }
    : { label: t('status.pending'), color: 'text-gray-500' };

  return { destinyStatus, discStatus, successStatus, epistleStatus };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Home');

  if (!session || !session.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[url('/bg-grid.svg')] text-center p-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] mb-8">
          {t('title')}
        </h1>
        <p className="text-gray-400 mb-8 text-xl max-w-md">
          {t('subtitle')}
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/signin"
          className="px-8 py-3 rounded-full bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 font-bold flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          {t('enterSystem')}
        </a>
      </main>
    );
  }

  // Fetch Real Data
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-grid.svg')]">
      <p className="text-gray-400">{t('userError')}</p>
    </div>
  );

  const stats = await getDashboardStats(user.id, t);
  const todayStr = getTodayStr();

  const modules = [
    { name: t('modules.destiny.name'), href: `/destiny/day/${todayStr}`, icon: Compass, desc: t('modules.destiny.desc'), status: stats.destinyStatus },
    { name: t('modules.success.name'), href: '/success', icon: Trophy, desc: t('modules.success.desc'), status: stats.successStatus },
    { name: t('modules.discipline.name'), href: `/discipline/day/${todayStr}`, icon: Activity, desc: t('modules.discipline.desc'), status: stats.discStatus },
    { name: t('modules.epistle.name'), href: `/epistle/day/${todayStr}`, icon: Mail, desc: t('modules.epistle.desc'), status: stats.epistleStatus },
    { name: t('modules.bio.name'), href: '/bio', icon: BookOpen, desc: t('modules.bio.desc'), status: { label: t('status.database'), color: 'text-green-400' } },
  ];

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-10 bg-[url('/bg-grid.svg')]">        
      <div className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {t('title')}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{t('welcome', {name: session.user.name || 'User'})}</span>
          {/* LanguageSwitcher is already in HeaderWrapper */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signout"
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">        
        {modules.map((m) => (
          <Link key={m.name} href={m.href}
            className="card-hover border border-white/10 bg-white/5 p-8 rounded-2xl flex flex-col items-center gap-4 text-center cursor-pointer group hover:border-primary/50 backdrop-blur-sm relative overflow-hidden"
          >
            <m.icon className={`w-12 h-12 transition-colors duration-300 ${m.status.color.replace('text-', 'text-opacity-80 ')}`} />
            <h2 className="text-2xl font-bold text-gray-100 group-hover:text-primary transition-colors duration-300">{m.name}</h2>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">{m.desc}</p>

            {/* Status Badge */}
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border border-white/5 bg-black/50 ${m.status.color}`}>
              {m.status.label}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
