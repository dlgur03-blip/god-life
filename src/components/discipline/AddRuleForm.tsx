'use client';

import { createRule } from '@/app/actions/discipline';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ValidationMessage from '@/components/ui/ValidationMessage';
import ErrorAlert from '@/components/ui/ErrorAlert';
import type { ErrorCode } from '@/lib/errors';

export default function AddRuleForm() {
  const t = useTranslations('Discipline');
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<ErrorCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    // Client-side validation
    if (!title.trim()) {
      setValidationError('required');
      return;
    }

    if (title.length > 100) {
      setValidationError('maxLength');
      return;
    }

    setIsSubmitting(true);
    const result = await createRule(title);
    setIsSubmitting(false);

    if (result.success) {
      setTitle('');
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="mb-8">
      {serverError && (
        <ErrorAlert
          error={serverError}
          onDismiss={() => setServerError(null)}
          className="mb-4"
        />
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setValidationError(null);
            }}
            placeholder={t('addNewDiscipline')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none"
          />
          {validationError && (
            <ValidationMessage
              translationKey={validationError}
              params={validationError === 'maxLength' ? { max: 100 } : undefined}
            />
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 rounded-xl px-6 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
