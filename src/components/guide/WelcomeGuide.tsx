'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Target, Clock, Mail, DollarSign, Activity, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const steps = [
    { key: 'intro', icon: BookOpen, color: 'from-amber-500 to-orange-600' },
    { key: 'success', icon: Target, color: 'from-emerald-500 to-teal-600' },
    { key: 'discipline', icon: Activity, color: 'from-rose-500 to-pink-600' },
    { key: 'destiny', icon: Clock, color: 'from-blue-500 to-indigo-600' },
    { key: 'epistle', icon: Mail, color: 'from-purple-500 to-violet-600' },
    { key: 'money', icon: DollarSign, color: 'from-yellow-500 to-amber-600' },
    { key: 'bio', icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleClose = () => {
    if (dontShowAgain || !forceOpen) {
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    }
    setIsOpen(false);
    onClose?.();
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[var(--color-card-bg)]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--color-secondary)] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Glass Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="backdrop-blur-xl bg-[var(--background)]/60 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                currentStepData.color
              )}>
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
              className="p-2 rounded-full hover:bg-white/10 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[var(--color-border)]">
          <div
            className={cn(
              "h-full bg-gradient-to-r transition-all duration-500 ease-out",
              currentStepData.color
            )}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="absolute top-24 left-0 right-0 z-10 flex justify-center gap-2 px-4">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => !isAnimating && setCurrentStep(idx)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx === currentStep
                ? cn("w-10 bg-gradient-to-r", step.color)
                : "w-2 bg-[var(--color-border)] hover:bg-[var(--foreground-muted)]"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "h-full overflow-y-auto pt-36 pb-40 px-6 transition-opacity duration-300",
          isAnimating ? "opacity-50" : "opacity-100"
        )}
      >
        <div className="max-w-3xl mx-auto">
          {/* Icon & Title Section */}
          <div className="text-center mb-10">
            <div className={cn(
              "inline-flex w-24 h-24 rounded-3xl items-center justify-center mb-6 bg-gradient-to-br shadow-2xl",
              currentStepData.color,
              "animate-float"
            )}>
              <Icon className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
              {isIntro ? t('intro.title') : t(`modules.${currentStepData.key}.title`)}
            </h2>

            {!isIntro && (
              <p className={cn(
                "inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r",
                currentStepData.color
              )}>
                {t(`modules.${currentStepData.key}.subtitle`)}
              </p>
            )}
          </div>

          {isIntro ? (
            /* Intro Content - Beautiful Typography */
            <div className="space-y-6">
              {Array.from({ length: 11 }, (_, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-lg md:text-xl leading-relaxed transition-all duration-500",
                    i === 0 && "font-medium text-[var(--foreground)]",
                    i >= 1 && i <= 5 && "text-[var(--foreground)]",
                    i === 6 && "font-bold text-2xl md:text-3xl text-[var(--color-primary)] py-4 border-y border-[var(--color-border)]",
                    i >= 7 && i <= 9 && "text-[var(--foreground-muted)] italic pl-4 border-l-2 border-[var(--color-primary)]/30",
                    i === 10 && "font-bold text-2xl md:text-3xl text-center py-6 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] bg-clip-text text-transparent"
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {t(`intro.content${i + 1}`)}
                </p>
              ))}
            </div>
          ) : (
            /* Module Content - Card Style */
            <div className="space-y-8">
              {/* Description Card */}
              <div className="backdrop-blur-sm bg-[var(--color-card-bg)]/50 rounded-3xl p-8 border border-[var(--color-border)]">
                <div className="prose prose-lg max-w-none">
                  {t(`modules.${currentStepData.key}.description`).split('\n\n').map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={cn(
                        "text-[var(--foreground)] leading-relaxed mb-6 last:mb-0",
                        paragraph.startsWith('1.') || paragraph.startsWith('사용') || paragraph.startsWith('使い方') || paragraph.startsWith('How to')
                          ? "font-medium"
                          : ""
                      )}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Source Citation */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-card-bg)] to-transparent border-l-4 border-[var(--color-primary)]">
                <BookOpen className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">References</p>
                  <p className="text-sm text-[var(--foreground-muted)] italic">
                    {t(`modules.${currentStepData.key}.source`)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glass Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="backdrop-blur-xl bg-[var(--background)]/80 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            {/* Don't show again checkbox */}
            {!forceOpen && (
              <label className="flex items-center justify-center gap-3 text-sm text-[var(--foreground-muted)] cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-5 h-5 rounded-md border-2 border-[var(--color-border)] bg-transparent checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-all cursor-pointer"
                  />
                </div>
                <span className="group-hover:text-[var(--foreground)] transition-colors">
                  {t('dontShowAgain')}
                </span>
              </label>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0 || isAnimating}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all",
                  currentStep === 0
                    ? "opacity-0 pointer-events-none"
                    : "bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--foreground)] hover:bg-[var(--color-card-hover)] hover:scale-105 active:scale-95"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                {t('prev')}
              </button>

              <button
                onClick={handleNext}
                disabled={isAnimating}
                className={cn(
                  "flex-1 max-w-sm flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r",
                  currentStepData.color,
                  "hover:shadow-xl hover:shadow-[var(--color-primary)]/20"
                )}
              >
                {isLastStep ? t('start') : t('next')}
                {!isLastStep && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
