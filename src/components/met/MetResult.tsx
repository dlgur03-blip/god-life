'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Dimension } from '@/lib/met/types';
import MetRadarChart from './MetRadarChart';
import MetShareButtons from './MetShareButtons';
import { ArrowLeft, RotateCcw, Star, AlertTriangle, Dna, Building, TrendingUp, Quote } from 'lucide-react';

interface MetResultData {
  id: string;
  archetypeName: string;
  archetypeEmoji: string;
  summaryShort: string;
  result: {
    summaryLong?: string;
    strengths?: string[];
    blindSpots?: string[];
    motivationDNA?: string;
    idealEnvironment?: string;
    growthAdvice?: string;
    mantra?: string;
  };
  scores: Record<Dimension, number>;
}

interface MetResultProps {
  data: MetResultData;
}

export default function MetResult({ data }: MetResultProps) {
  const t = useTranslations('Met');

  const sections = [
    {
      key: 'strengths',
      icon: Star,
      title: t('strengths'),
      content: data.result.strengths,
      type: 'list' as const,
    },
    {
      key: 'blindSpots',
      icon: AlertTriangle,
      title: t('blindSpots'),
      content: data.result.blindSpots,
      type: 'list' as const,
    },
    {
      key: 'motivationDNA',
      icon: Dna,
      title: t('motivationDNA'),
      content: data.result.motivationDNA,
      type: 'text' as const,
    },
    {
      key: 'idealEnvironment',
      icon: Building,
      title: t('idealEnvironment'),
      content: data.result.idealEnvironment,
      type: 'text' as const,
    },
    {
      key: 'growthAdvice',
      icon: TrendingUp,
      title: t('growthAdvice'),
      content: data.result.growthAdvice,
      type: 'text' as const,
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 flex flex-col items-center gap-8 md:gap-12">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Archetype Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <span className="text-5xl sm:text-6xl">{data.archetypeEmoji}</span>
          <p className="text-sm text-[var(--foreground-muted)] uppercase tracking-wider">
            {t('yourArchetype')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-wide">
            {data.archetypeName}
          </h1>
          <div className="w-16 h-1 bg-[var(--color-secondary)]" />
          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-md">
            {data.summaryShort}
          </p>
        </div>

        {/* Summary */}
        {data.result.summaryLong && (
          <div
            className="w-full p-6 border border-[var(--color-border)] bg-[var(--color-card-bg)]"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {data.result.summaryLong}
            </p>
          </div>
        )}

        {/* Radar Chart */}
        <div
          className="w-full p-4 border border-[var(--color-border)] bg-[var(--color-card-bg)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <h2 className="text-lg font-bold text-[var(--foreground)] text-center mb-4">
            {t('dimensionScores')}
          </h2>
          <MetRadarChart scores={data.scores} />
        </div>

        {/* Detail Sections */}
        {sections.map((section) => {
          if (!section.content) return null;
          return (
            <div
              key={section.key}
              className="w-full p-6 border border-[var(--color-border)] bg-[var(--color-card-bg)]"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-5 h-5 text-[var(--color-secondary)]" />
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {section.title}
                </h2>
              </div>
              {section.type === 'list' && Array.isArray(section.content) ? (
                <ul className="flex flex-col gap-2">
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm sm:text-base text-[var(--foreground)]"
                    >
                      <span className="text-[var(--color-secondary)] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
                  {section.content as string}
                </p>
              )}
            </div>
          );
        })}

        {/* Mantra */}
        {data.result.mantra && (
          <div
            className="w-full p-6 border border-[var(--color-secondary)] bg-[var(--color-card-bg)] text-center"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <Quote className="w-6 h-6 text-[var(--color-secondary)] mx-auto mb-3" />
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] mb-3 uppercase tracking-wider">
              {t('mantra')}
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[var(--foreground)] italic">
              &ldquo;{data.result.mantra}&rdquo;
            </p>
          </div>
        )}

        {/* Share */}
        <MetShareButtons
          resultId={data.id}
          archetypeName={data.archetypeName}
          summaryShort={data.summaryShort}
        />

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/met/test"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm text-[var(--foreground-muted)] hover:border-[var(--color-border-hover)] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <RotateCcw className="w-4 h-4" />
            {t('retakeTest')}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm text-[var(--foreground-muted)] hover:border-[var(--color-border-hover)] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
