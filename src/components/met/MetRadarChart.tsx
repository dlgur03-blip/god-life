'use client';

import { useTranslations } from 'next-intl';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { DIMENSIONS, Dimension } from '@/lib/met/types';

interface MetRadarChartProps {
  scores: Record<Dimension, number>;
}

export default function MetRadarChart({ scores }: MetRadarChartProps) {
  const t = useTranslations('Met');

  const data = DIMENSIONS.map((dim) => ({
    dimension: t(`dimensions.${dim}`),
    score: scores[dim],
  }));

  return (
    <div className="w-full max-w-md mx-auto">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--foreground-muted)' }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--color-secondary)"
            fill="var(--color-secondary)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
