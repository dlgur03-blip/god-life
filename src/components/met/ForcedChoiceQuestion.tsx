'use client';

import { useTranslations } from 'next-intl';

interface ForcedChoiceQuestionProps {
  questionId: string;
  value: string | null;
  onAnswer: (value: string) => void;
}

export default function ForcedChoiceQuestion({
  questionId,
  value,
  onAnswer,
}: ForcedChoiceQuestionProps) {
  const t = useTranslations('Met');
  const questionText = t(`questions.${questionId}.text`);

  const options = ['A', 'B'] as const;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <p className="text-lg sm:text-xl font-medium text-[var(--foreground)] text-center leading-relaxed">
        {questionText}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className={`flex-1 py-4 px-5 border text-sm sm:text-base font-medium transition-all duration-200 text-center ${
              value === opt
                ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--background)]'
                : 'border-[var(--color-border)] text-[var(--foreground)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-card-hover)]'
            }`}
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <span className="block text-xs opacity-60 mb-1">{opt}</span>
            {t(`questions.${questionId}.${opt}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
