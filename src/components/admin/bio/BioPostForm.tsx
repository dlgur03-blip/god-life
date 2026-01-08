'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import type { Locale, TranslationInput } from '@/types/bio';
import type { BioPostDetail, BioPostFormData } from '@/app/actions/admin';
import CategorySelector from './CategorySelector';
import SlugInput from './SlugInput';
import TranslationTabs from './TranslationTabs';
import TranslationEditor from './TranslationEditor';

type Props = {
  mode: 'create' | 'edit';
  initialData?: BioPostDetail;
  onSubmit: (data: BioPostFormData) => Promise<void>;
};

export default function BioPostForm({ mode, initialData, onSubmit }: Props) {
  const t = useTranslations('Admin.bio');

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [activeLocale, setActiveLocale] = useState<Locale>('ko');
  const [translations, setTranslations] = useState<Record<Locale, TranslationInput>>(() => {
    const initial: Record<Locale, TranslationInput> = {
      ko: { title: '', content: '' },
      en: { title: '', content: '' },
      ja: { title: '', content: '' }
    };

    if (initialData?.translations) {
      initialData.translations.forEach((trans) => {
        if (trans.locale === 'ko' || trans.locale === 'en' || trans.locale === 'ja') {
          initial[trans.locale] = { title: trans.title, content: trans.content };
        }
      });
    }

    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!slug) {
      newErrors.slug = t('validation.slugRequired');
    } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug = t('validation.slugFormat');
    }

    if (!category) {
      newErrors.category = t('validation.categoryRequired');
    }

    const hasCompleteTranslation = Object.values(translations).some(
      (trans) => trans.title && trans.content
    );

    if (!hasCompleteTranslation) {
      newErrors.translations = t('validation.translationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        slug,
        category,
        translations: {
          ko: translations.ko.title || translations.ko.content ? translations.ko : undefined,
          en: translations.en.title || translations.en.content ? translations.en : undefined,
          ja: translations.ja.title || translations.ja.content ? translations.ja : undefined
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTranslation = (locale: Locale, value: TranslationInput) => {
    setTranslations((prev) => ({ ...prev, [locale]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SlugInput
          value={slug}
          onChange={setSlug}
          error={errors.slug}
          excludeId={initialData?.id}
        />
        <CategorySelector
          value={category}
          onChange={setCategory}
          error={errors.category}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
            {t('translations')}
          </label>
          {errors.translations && (
            <p className="text-xs text-[#ef4444] mb-2">{errors.translations}</p>
          )}
          <TranslationTabs
            activeLocale={activeLocale}
            onChange={setActiveLocale}
            translations={translations}
          />
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-lg p-4">
          <TranslationEditor
            value={translations[activeLocale]}
            onChange={(value) => updateTranslation(activeLocale, value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.1)]">
        <Link
          href="/admin/bio"
          className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          {t('actions.cancel')}
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a78bfa] text-white font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'create'
              ? t('actions.creating')
              : t('actions.updating')
            : mode === 'create'
            ? t('actions.create')
            : t('actions.update')}
        </button>
      </div>
    </form>
  );
}
