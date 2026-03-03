'use client';

import { useTranslations } from 'next-intl';

interface MetaphorQuestionProps {
  questionId: string;
  value: string | null;
  onAnswer: (value: string) => void;
}

export default function MetaphorQuestion({
  questionId,
  value,
  onAnswer,
}: MetaphorQuestionProps) {
  const t = useTranslations('Met');
  const questionText = t(`questions.${questionId}.text`);

  const options = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <p className="text-lg sm:text-xl font-medium text-[var(--foreground)] text-center leading-relaxed">
        {questionText}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className={`py-5 px-4 border text-sm sm:text-base font-medium transition-all duration-200 text-center ${
              value === opt
                ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--background)]'
                : 'border-[var(--color-border)] text-[var(--foreground)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-card-hover)]'
            }`}
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {t(`questions.${questionId}.${opt}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
