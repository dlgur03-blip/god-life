import { notFound } from 'next/navigation';
import { getMetResult } from '@/app/actions/met';
import MetResult from '@/components/met/MetResult';
import { getTranslations } from 'next-intl/server';
import { Dimension } from '@/lib/met/types';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await getMetResult(id);
  if (!data) return { title: 'Not Found' };

  const t = await getTranslations('Met');
  return {
    title: `${data.archetypeEmoji} ${data.archetypeName} | ${t('title')}`,
    description: t('ogDescription', {
      name: data.archetypeName,
      summary: data.summaryShort,
    }),
    openGraph: {
      title: `${data.archetypeEmoji} ${data.archetypeName}`,
      description: data.summaryShort,
    },
  };
}

export default async function MetResultPage({ params }: Props) {
  const { id } = await params;
  const data = await getMetResult(id);
  if (!data) notFound();

  return (
    <MetResult
      data={{
        id: data.id,
        archetypeName: data.archetypeName,
        archetypeEmoji: data.archetypeEmoji,
        summaryShort: data.summaryShort,
        result: data.result as {
          summaryLong?: string;
          strengths?: string[];
          blindSpots?: string[];
          motivationDNA?: string;
          idealEnvironment?: string;
          growthAdvice?: string;
          mantra?: string;
        },
        scores: data.scores as Record<Dimension, number>,
      }}
    />
  );
}
