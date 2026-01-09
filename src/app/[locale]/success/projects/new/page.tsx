'use client';

import { createSuccessProject } from '@/app/actions/success';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function NewProjectPage() {
  const t = useTranslations('Success');
  return (
    <main className="min-h-screen bg-[var(--background)] p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--color-card-bg)] backdrop-blur-xl border border-[var(--color-border)] p-8 rounded-2xl shadow-lg">
        <Link href="/success" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-2 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('backToList')}
        </Link>

        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">{t('form.title')}</h1>

        <form action={createSuccessProject} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase mb-2">{t('form.projectTitle')}</label>
            <input
              name="title"
              type="text"
              placeholder={t('form.projectTitlePlaceholder')}
              required
              className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--foreground)] focus:border-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--foreground-muted)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase mb-2">{t('form.startDate')}</label>
              <input
                name="startDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--foreground)] focus:border-[var(--color-primary)] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase mb-2">{t('form.reminderTime')}</label>
              <input
                name="reminderTime"
                type="time"
                defaultValue="09:00"
                className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--foreground)] focus:border-[var(--color-primary)] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-colors"
          >
            {t('form.generateGrid')}
          </button>
        </form>
      </div>
    </main>
  );
}
