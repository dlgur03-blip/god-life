'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Dimension } from '@/lib/met/types';
import MetRadarChart from './MetRadarChart';
import MetShareButtons from './MetShareButtons';
import {
  ArrowLeft, RotateCcw, Star, AlertTriangle, Dna, Building, TrendingUp,
  Quote, Heart, ShieldAlert, Trash2, Eye, Skull, Users, UserX,
  Gamepad2, BookOpen,
} from 'lucide-react';

interface MetResultData {
  id: string;
  archetypeName: string;
  archetypeEmoji: string;
  summaryShort: string;
  result: {
    summaryLong?: string;
    coreDesire?: string;
    coreFear?: string;
    strengths?: string[];
    blindSpots?: string[];
    thingsToDiscard?: string[];
    motivationDNA?: string;
    hiddenPattern?: string;
    idealEnvironment?: string;
    toxicEnvironment?: string;
    peopleToSeek?: string;
    peopleToAvoid?: string;
    godLifeStrategy?: string;
    bookRecommendations?: string[];
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

  const sections: {
    key: string;
    icon: typeof Star;
    title: string;
    content: string | string[] | undefined;
    type: 'text' | 'list';
    accent?: boolean;
  }[] = [
    { key: 'coreDesire', icon: Heart, title: t('coreDesire'), content: data.result.coreDesire, type: 'text', accent: true },
    { key: 'coreFear', icon: ShieldAlert, title: t('coreFear'), content: data.result.coreFear, type: 'text', accent: true },
    { key: 'strengths', icon: Star, title: t('strengths'), content: data.result.strengths, type: 'list' },
    { key: 'blindSpots', icon: AlertTriangle, title: t('blindSpots'), content: data.result.blindSpots, type: 'list' },
    { key: 'thingsToDiscard', icon: Trash2, title: t('thingsToDiscard'), content: data.result.thingsToDiscard, type: 'list' },
    { key: 'motivationDNA', icon: Dna, title: t('motivationDNA'), content: data.result.motivationDNA, type: 'text' },
    { key: 'hiddenPattern', icon: Eye, title: t('hiddenPattern'), content: data.result.hiddenPattern, type: 'text' },
    { key: 'idealEnvironment', icon: Building, title: t('idealEnvironment'), content: data.result.idealEnvironment, type: 'text' },
    { key: 'toxicEnvironment', icon: Skull, title: t('toxicEnvironment'), content: data.result.toxicEnvironment, type: 'text' },
    { key: 'peopleToSeek', icon: Users, title: t('peopleToSeek'), content: data.result.peopleToSeek, type: 'text' },
    { key: 'peopleToAvoid', icon: UserX, title: t('peopleToAvoid'), content: data.result.peopleToAvoid, type: 'text' },
    { key: 'godLifeStrategy', icon: Gamepad2, title: t('godLifeStrategy'), content: data.result.godLifeStrategy, type: 'text' },
    { key: 'bookRecommendations', icon: BookOpen, title: t('bookRecommendations'), content: data.result.bookRecommendations, type: 'list' },
    { key: 'growthAdvice', icon: TrendingUp, title: t('growthAdvice'), content: data.result.growthAdvice, type: 'text' },
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
              className={`w-full p-6 border bg-[var(--color-card-bg)] ${
                section.accent
                  ? 'border-[var(--color-secondary)]'
                  : 'border-[var(--color-border)]'
              }`}
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
                <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed whitespace-pre-line">
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
