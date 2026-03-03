'use server';

import { prisma } from '@/lib/prisma';

export async function getMetResult(id: string) {
  const result = await prisma.metResult.findUnique({
    where: { id },
  });

  if (!result) return null;

  return {
    id: result.id,
    locale: result.locale,
    archetypeName: result.archetypeName,
    archetypeEmoji: result.archetypeEmoji,
    summaryShort: result.summaryShort,
    result: result.result as Record<string, unknown>,
    scores: {
      approach: result.scoreApproach,
      avoidance: result.scoreAvoidance,
      intrinsic: result.scoreIntrinsic,
      extrinsic: result.scoreExtrinsic,
      achievement: result.scoreAchievement,
      affiliation: result.scoreAffiliation,
      power: result.scorePower,
      autonomy: result.scoreAutonomy,
      competence: result.scoreCompetence,
    },
    createdAt: result.createdAt.toISOString(),
  };
}
