'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Target, Compass, Mail, DollarSign, Activity, MessageCircle, ClipboardList } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GUIDE_SEEN_KEY = 'godlife-guide-seen';

interface WelcomeGuideProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const moduleColors: Record<string, string> = {
  intro: 'var(--color-secondary)',
  aiCoach: 'var(--color-secondary)',
  destiny: 'var(--color-destiny)',
  taskBoard: 'var(--color-taskboard)',
  epistle: 'var(--color-epistle)',
  discipline: 'var(--color-discipline)',
  success: 'var(--color-success-module)',
  money: 'var(--color-money)',
};

export default function WelcomeGuide({ forceOpen = false, onClose }: WelcomeGuideProps) {
  const t = useTranslations('Guide');
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    { key: 'intro', icon: BookOpen },
    { key: 'aiCoach', icon: MessageCircle },
    { key: 'destiny', icon: Compass },
    { key: 'taskBoard', icon: ClipboardList },
    { key: 'epistle', icon: Mail },
    { key: 'discipline', icon: Activity },
    { key: 'success', icon: Target },
    { key: 'money', icon: DollarSign },
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
  const accentColor = moduleColors[currentStepData.key] || 'var(--color-secondary)';

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-md)',
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>{t('title')}</h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              {currentStep + 1} / {steps.length}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-[var(--color-card-hover)] text-[var(--foreground-muted)]"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[var(--color-border)]">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          {/* Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex w-16 h-16 items-center justify-center mb-4"
              style={{
                borderRadius: 'var(--radius-xl)',
                backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
              }}
            >
              <Icon className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {isIntro ? t('intro.title') : t(`modules.${currentStepData.key}.title`)}
            </h2>
            {!isIntro && (
              <p className="text-sm font-medium" style={{ color: accentColor }}>
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
                    i === 6 ? 'font-bold text-[var(--color-secondary)] text-lg py-2' :
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
              <div
                className="p-6 border border-[var(--color-border)]"
                style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-card-bg)' }}
              >
                {t(`modules.${currentStepData.key}.description`).split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-[var(--foreground)] leading-relaxed mb-4 last:mb-0 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div
                className="flex items-start gap-3 p-4 border-l-4"
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-card-bg)',
                  borderLeftColor: accentColor,
                }}
              >
                <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
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
                className="w-4 h-4"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              {t('dontShowAgain')}
            </label>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] hover:bg-[var(--color-card-hover)]'
              }`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('prev')}
            </button>

            <button
              onClick={handleNext}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3 font-bold text-white hover:opacity-90 transition-opacity"
              style={{
                borderRadius: 'var(--radius-md)',
                background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 80%, white))`,
              }}
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
