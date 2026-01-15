import { getSuccessProjects } from '@/app/actions/success';
import { Link } from '@/navigation';
import { Plus, Trophy, Calendar } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { formatDateDisplay } from '@/lib/date';

export default async function SuccessPage() {
  const t = await getTranslations('Success');
  const locale = await getLocale() as 'en' | 'ko' | 'ja';
  const projects = await getSuccessProjects();

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-secondary)]">
              {t('title')}
            </h1>
            <p className="text-[var(--foreground-muted)] text-sm">{t('subtitle')}</p>
          </div>
          <Link href="/success/projects/new" className="bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-[var(--color-primary)]/50">
            <Plus className="w-4 h-4" />
            {t('newProject')}
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const progress = project.entries.length; // entries where isCompleted: true
            const percentage = Math.round(progress); // Total is 100, so count is percentage

            return (
              <Link key={project.id} href={`/success/project/${project.id}`} className="group relative bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl hover:border-[var(--color-primary)]/50 transition-all hover:translate-y-[-2px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[var(--background-secondary)] p-3 rounded-xl text-[var(--color-secondary)] group-hover:text-[var(--color-accent)] transition-colors">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-[var(--foreground-muted)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                    {t('dayCount', { current: progress + 1 })}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">{project.title}</h2>
                <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] mb-6">
                  <Calendar className="w-3 h-3" />
                  {t('started', { date: formatDateDisplay(project.startDate, locale) })}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-secondary)] transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Link>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--foreground-muted)] mb-4">{t('noProjects')}</p>
              <Link href="/success/projects/new" className="text-[var(--color-primary)] hover:underline">{t('startJourney')}</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
