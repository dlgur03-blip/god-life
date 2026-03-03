'use client';

import { useTranslations } from 'next-intl';

interface ScenarioQuestionProps {
  questionId: string;
  value: string | null;
  onAnswer: (value: string) => void;
}

export default function ScenarioQuestion({
  questionId,
  value,
  onAnswer,
}: ScenarioQuestionProps) {
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
            className={`py-4 px-4 border text-sm font-medium transition-all duration-200 text-center ${
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
