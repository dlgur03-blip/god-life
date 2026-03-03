'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';

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
  const isOther = value?.startsWith('OTHER:') ?? false;
  const [showInput, setShowInput] = useState(isOther);
  const [customText, setCustomText] = useState(isOther ? value!.slice(6) : '');

  const options = ['A', 'B'] as const;

  const handleOtherClick = () => {
    setShowInput(true);
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onAnswer(`OTHER:${customText.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <p className="text-lg sm:text-xl font-medium text-[var(--foreground)] text-center leading-relaxed">
        {questionText}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => { setShowInput(false); onAnswer(opt); }}
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

      {/* Other option */}
      {!showInput ? (
        <button
          onClick={handleOtherClick}
          className={`w-full py-3 px-4 border text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isOther
              ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-[var(--background)]'
              : 'border-dashed border-[var(--color-border)] text-[var(--foreground-muted)] hover:border-[var(--color-border-hover)]'
          }`}
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <Pencil className="w-3.5 h-3.5" />
          {isOther ? customText : t('other')}
        </button>
      ) : (
        <div className="w-full flex flex-col gap-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onBlur={handleCustomSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCustomSubmit(); }}}
            placeholder={t('otherPlaceholder')}
            className="w-full py-3 px-4 border border-[var(--color-border)] text-sm bg-[var(--color-input-bg)] text-[var(--foreground)] focus:border-[var(--color-secondary)] outline-none resize-none"
            style={{ borderRadius: 'var(--radius-lg)' }}
            rows={2}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
