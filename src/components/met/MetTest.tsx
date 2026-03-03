'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { QUESTIONS } from '@/lib/met/questions';
import { Answer } from '@/lib/met/types';
import MetProgress from './MetProgress';
import LikertQuestion from './LikertQuestion';
import ForcedChoiceQuestion from './ForcedChoiceQuestion';
import ScenarioQuestion from './ScenarioQuestion';
import MetaphorQuestion from './MetaphorQuestion';
import MetLoading from './MetLoading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'met-answers';
const TOTAL = QUESTIONS.length;

// SSR-safe sessionStorage hook
function useSessionState() {
  const getSnapshot = useCallback(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }, []);
  const getServerSnapshot = useCallback(() => null, []);
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function MetTest() {
  const t = useTranslations('Met');
  const locale = useLocale();
  const router = useRouter();
  const saved = useSessionState();
  const parsed = saved ? (() => { try { return JSON.parse(saved); } catch { return null; } })() : null;

  const [currentIndex, setCurrentIndex] = useState(() => parsed?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => parsed?.answers ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save answers to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, currentIndex })
      );
    } catch {
      // ignore
    }
  }, [answers, currentIndex]);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === TOTAL;

  const handleAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
      // Auto-advance after a brief delay
      if (currentIndex < TOTAL - 1) {
        setTimeout(() => setCurrentIndex((prev: number) => prev + 1), 300);
      }
    },
    [currentQuestion.id, currentIndex]
  );

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const answerList: Answer[] = QUESTIONS.map((q) => ({
        questionId: q.id,
        answer: answers[q.id],
        value: q.type === 'likert' ? parseInt(answers[q.id]) : 0,
      }));

      const res = await fetch('/api/met/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerList, locale }),
      });

      if (res.status === 429) {
        setError(t('rateLimited'));
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        setError(t('errorAnalysis'));
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      // Clear saved answers on success
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/met/result/${data.resultId}`);
    } catch {
      setError(t('errorAnalysis'));
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <MetLoading />;
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'likert':
        return (
          <LikertQuestion
            questionId={currentQuestion.id}
            value={currentAnswer}
            onAnswer={handleAnswer}
          />
        );
      case 'forced':
        return (
          <ForcedChoiceQuestion
            questionId={currentQuestion.id}
            value={currentAnswer}
            onAnswer={handleAnswer}
          />
        );
      case 'scenario':
        return (
          <ScenarioQuestion
            questionId={currentQuestion.id}
            value={currentAnswer}
            onAnswer={handleAnswer}
          />
        );
      case 'metaphor':
        return (
          <MetaphorQuestion
            questionId={currentQuestion.id}
            value={currentAnswer}
            onAnswer={handleAnswer}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-8">
      {/* Progress */}
      <MetProgress current={currentIndex + 1} total={TOTAL} />

      {/* Question */}
      <div className="flex-1 flex items-center justify-center w-full py-4">
        <div className="w-full" key={currentQuestion.id}>
          {renderQuestion()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 w-full max-w-lg justify-between">
        <button
          onClick={() => setCurrentIndex((prev: number) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 text-sm text-[var(--foreground-muted)] disabled:opacity-30 hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('prev')}
        </button>

        {currentIndex === TOTAL - 1 && allAnswered ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] font-medium text-sm tracking-wider hover:opacity-90 transition-opacity"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {t('submit')}
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((prev: number) => Math.min(TOTAL - 1, prev + 1))
            }
            disabled={currentIndex === TOTAL - 1}
            className="flex items-center gap-1 px-4 py-2 text-sm text-[var(--foreground-muted)] disabled:opacity-30 hover:text-[var(--foreground)] transition-colors"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[var(--color-error)] text-center">{error}</p>
      )}
    </div>
  );
}
