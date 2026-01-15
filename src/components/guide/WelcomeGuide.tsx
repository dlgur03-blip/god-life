'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Target, Clock, Mail, DollarSign, Activity, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GUIDE_SEEN_KEY = 'godlife-guide-seen';

interface WelcomeGuideProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function WelcomeGuide({ forceOpen = false, onClose }: WelcomeGuideProps) {
  const t = useTranslations('Guide');
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    { key: 'intro', icon: BookOpen },
    { key: 'success', icon: Target },
    { key: 'discipline', icon: Activity },
    { key: 'destiny', icon: Clock },
    { key: 'epistle', icon: Mail },
    { key: 'money', icon: DollarSign },
    { key: 'bio', icon: Sparkles },
  ];

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    const hasSeen = localStorage.getItem(GUIDE_SEEN_KEY);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    if (dontShowAgain || !forceOpen) {
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    }
    setIsOpen(false);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isIntro = currentStepData.key === 'intro';
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">{t('title')}</h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              {currentStep + 1} / {steps.length}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-[var(--color-card-hover)] text-[var(--foreground-muted)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[var(--color-border)]">
        <div
          className="h-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-full bg-[var(--color-primary)]/10 items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {isIntro ? t('intro.title') : t(`modules.${currentStepData.key}.title`)}
            </h2>
            {!isIntro && (
              <p className="text-sm text-[var(--color-primary)] font-medium">
                {t(`modules.${currentStepData.key}.subtitle`)}
              </p>
            )}
          </div>

          {/* Body */}
          {isIntro ? (
            <div className="space-y-4">
              {Array.from({ length: 11 }, (_, i) => (
                <p
                  key={i}
                  className={`text-base leading-relaxed ${
                    i === 6 ? 'font-bold text-[var(--color-primary)] text-lg py-2' :
                    i === 10 ? 'font-bold text-[var(--color-accent)] text-lg text-center' :
                    i >= 7 && i <= 9 ? 'text-[var(--foreground-muted)] italic' :
                    'text-[var(--foreground)]'
                  }`}
                >
                  {t(`intro.content${i + 1}`)}
                </p>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[var(--color-card-bg)] rounded-xl p-6 border border-[var(--color-border)]">
                {t(`modules.${currentStepData.key}.description`).split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-[var(--foreground)] leading-relaxed mb-4 last:mb-0 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4 bg-[var(--color-card-bg)] rounded-lg border-l-4 border-[var(--color-primary)]">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--foreground-muted)] italic">
                  {t(`modules.${currentStepData.key}.source`)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto space-y-4">
          {!forceOpen && (
            <label className="flex items-center justify-center gap-2 text-sm text-[var(--foreground-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              {t('dontShowAgain')}
            </label>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] hover:bg-[var(--color-card-hover)]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('prev')}
            </button>

            <button
              onClick={handleNext}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              {isLastStep ? t('start') : t('next')}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
