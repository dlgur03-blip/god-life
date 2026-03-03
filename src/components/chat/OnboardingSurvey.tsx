'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { saveOnboarding } from '@/app/actions/chat';
import { Clock, Target, Sunrise, MessageCircle, ChevronRight } from 'lucide-react';

interface OnboardingSurveyProps {
  onComplete: () => void;
}

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const t = useTranslations('Chat.onboarding');
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    availableTime: '',
    habitExperience: '',
    focusAreas: [] as string[],
    chronotype: '',
    preferredStyle: '',
  });
  const [saving, setSaving] = useState(false);

  const steps = [
    {
      key: 'availableTime',
      icon: Clock,
      question: t('timeQuestion'),
      options: [
        { value: '15min', label: t('time15') },
        { value: '30min', label: t('time30') },
        { value: '1hour', label: t('time1h') },
        { value: '2hour+', label: t('time2h') },
      ],
    },
    {
      key: 'habitExperience',
      icon: Target,
      question: t('habitQuestion'),
      options: [
        { value: 'none', label: t('habitNone') },
        { value: 'some', label: t('habitSome') },
        { value: 'many', label: t('habitMany') },
      ],
    },
    {
      key: 'focusAreas',
      icon: Target,
      question: t('focusQuestion'),
      multi: true,
      options: [
        { value: 'goals', label: t('focusGoals') },
        { value: 'habits', label: t('focusHabits') },
        { value: 'finance', label: t('focusFinance') },
        { value: 'health', label: t('focusHealth') },
        { value: 'emotion', label: t('focusEmotion') },
        { value: 'time', label: t('focusTime') },
      ],
    },
    {
      key: 'chronotype',
      icon: Sunrise,
      question: t('chronoQuestion'),
      options: [
        { value: 'morning', label: t('chronoMorning') },
        { value: 'evening', label: t('chronoEvening') },
      ],
    },
    {
      key: 'preferredStyle',
      icon: MessageCircle,
      question: t('styleQuestion'),
      options: [
        { value: 'ai-guided', label: t('styleAI') },
        { value: 'self', label: t('styleSelf') },
      ],
    },
  ];

  const current = steps[step];

  const handleSelect = async (value: string) => {
    if (current.multi) {
      setData((prev) => ({
        ...prev,
        focusAreas: prev.focusAreas.includes(value)
          ? prev.focusAreas.filter((v) => v !== value)
          : [...prev.focusAreas, value],
      }));
      return;
    }

    const updated = { ...data, [current.key]: value };
    setData(updated);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setSaving(true);
      await saveOnboarding(updated);
      onComplete();
    }
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setSaving(true);
      await saveOnboarding(data);
      onComplete();
    }
  };

  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-6">
      {/* Progress */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 transition-colors ${
              i <= step ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-border)]'
            }`}
            style={{ borderRadius: '999px' }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] bg-opacity-10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[var(--color-secondary)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          {current.question}
        </h2>
        <p className="text-xs text-[var(--foreground-muted)]">
          {step + 1} / {steps.length}
        </p>
      </div>

      {/* Options */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {current.options.map((opt) => {
          const isSelected = current.multi
            ? data.focusAreas.includes(opt.value)
            : data[current.key as keyof typeof data] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={saving}
              className={`w-full px-4 py-3 text-left text-sm border transition-all ${
                isSelected
                  ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] bg-opacity-5 text-[var(--color-secondary)] font-medium'
                  : 'border-[var(--color-border)] text-[var(--foreground)] hover:border-[var(--color-border-hover)]'
              }`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Next button for multi-select */}
      {current.multi && data.focusAreas.length > 0 && (
        <button
          onClick={handleNext}
          disabled={saving}
          className="flex items-center gap-1 px-6 py-2 bg-[var(--color-secondary)] text-white text-sm font-medium disabled:opacity-50"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {saving ? t('saving') : t('next')}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
