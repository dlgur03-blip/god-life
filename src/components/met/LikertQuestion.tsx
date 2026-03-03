'use client';

import { useTranslations } from 'next-intl';

interface LikertQuestionProps {
  questionId: string;
  value: string | null;
  onAnswer: (value: string) => void;
}

export default function LikertQuestion({
  questionId,
  value,
  onAnswer,
}: LikertQuestionProps) {
  const t = useTranslations('Met');
  const questionText = t(`questions.${questionId}.text`);

  const options = ['1', '2', '3', '4', '5', '6', '7'] as const;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <p className="text-lg sm:text-xl font-medium text-[var(--foreground)] text-center leading-relaxed">
        {questionText}
      </p>

      <div className="flex flex-col gap-2 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className={`w-full py-3 px-4 border text-sm sm:text-base font-medium transition-all duration-200 text-left ${
              value === opt
                ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--background)]'
                : 'border-[var(--color-border)] text-[var(--foreground)] hover:border-[var(--color-border-hover)]'
            }`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <span className="mr-3 inline-block w-5 text-center opacity-60">{opt}</span>
            {t(`likertLabels.${opt}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
