import { getSuccessProject } from '@/app/actions/success';
import SuccessGrid from '@/components/success/SuccessGrid';
import { Link } from '@/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import NotFoundFallback from '@/components/navigation/NotFoundFallback';

// Helper to calc day index
function calculateDayIndex(startDate: Date) {
  const start = new Date(startDate);
  // Reset time to midnight for calculation in User's timezone (simplified to server time for now, or fixed offset)
  // Plan says "User timezone", but server is running locally.
  // We'll use a simple diff for MVP.
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  void diffTime; // Used for backup calculation
  // If started today, diff might be 0 or 1 depending on logic.
  // If start is today 09:00 and now is today 10:00 -> diff is small.
  // We want Day 1 on the start date.

  // Robust way:
  const startStr = start.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const nowStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

  const d1 = new Date(startStr);
  const d2 = new Date(nowStr);
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
  return diff + 1;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations('Success');
  const tCommon = await getTranslations('Common');
  const { id } = await params;
  const project = await getSuccessProject(id);

  if (!project) {
    return (
      <NotFoundFallback
        title={t('projectNotFound')}
        message={t('projectNotFoundMessage')}
        backHref="/success"
        backLabel={t('backToDashboard')}
        homeLabel={tCommon('notFound.backHome')}
      />
    );
  }

  const currentDayIndex = calculateDayIndex(project.startDate);

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
           <Link href="/success" className="text-gray-500 hover:text-white flex items-center gap-2 mb-4 text-sm w-fit">
            <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">{project.title}</h1>
              <div className="flex gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {t('start')}: {new Date(project.startDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t('reminder')}: {project.reminderTime}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{Math.min(Math.max(currentDayIndex, 1), 100)} <span className="text-lg text-gray-500">/ 100</span></div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{t('currentDay')}</div>
            </div>
          </div>
        </header>

        {/* The Grid Interface */}
        <SuccessGrid 
          projectId={project.id} 
          entries={project.entries} 
          startDate={project.startDate.toISOString()}
          currentDayIndex={currentDayIndex}
        />

      </div>
    </main>
  );
}
