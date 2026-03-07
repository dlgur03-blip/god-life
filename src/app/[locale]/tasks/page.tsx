import { getUserTasks, getTaskProjects } from '@/app/actions/tasks';
import { getTranslations } from 'next-intl/server';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import TaskBoard from '@/components/tasks/TaskBoard';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const t = await getTranslations('Tasks');
  const [tasks, projects] = await Promise.all([
    getUserTasks(),
    getTaskProjects(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="module-header flex items-center gap-3 mb-8 p-4 pt-6 -mx-4 rounded-b-xl border-b border-[var(--color-border)]" style={{ '--module-accent': 'var(--gradient-taskboard)' } as React.CSSProperties}>
          <Link
            href="/"
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-[var(--color-taskboard)]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">{t('subtitle')}</p>
            </div>
          </div>
        </header>

        <TaskBoard
          tasks={tasks}
          projects={projects}
          labels={{
            notStarted: t('status.notStarted'),
            inProgress: t('status.inProgress'),
            completed: t('status.completed'),
            noTasks: t('noTasks'),
            due: t('due'),
            at: t('at'),
            addViaAi: t('addViaAi'),
            delete: t('delete'),
            uncategorized: t('uncategorized'),
          }}
        />
      </div>
    </main>
  );
}
