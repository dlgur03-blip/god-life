import { QUESTIONS } from './questions';
import {
  Answer,
  Dimension,
  DIMENSIONS,
  DimensionScores,
  DimensionWeight,
} from './types';

/**
 * Calculate dimension scores (0-100) from user answers.
 *
 * Likert (Q1-Q12): normalize 1-7 → 0-100, apply dimension weights
 * Forced/Scenario/Metaphor: selected option's weights contribute a fixed amount
 */
export function calculateScores(answers: Answer[]): DimensionScores {
  const rawScores: Record<Dimension, number> = {} as Record<Dimension, number>;
  const rawCounts: Record<Dimension, number> = {} as Record<Dimension, number>;

  for (const dim of DIMENSIONS) {
    rawScores[dim] = 0;
    rawCounts[dim] = 0;
  }

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    if (question.type === 'likert') {
      // Normalize 1-7 to 0-100
      const normalized = ((parseInt(answer.answer) - 1) / 6) * 100;
      applyWeights(rawScores, rawCounts, question.weights, normalized);
    } else {
      // Forced choice, scenario, metaphor
      // Skip scoring for custom "OTHER:" answers — AI will interpret them directly
      if (answer.answer.startsWith('OTHER:')) continue;

      const selectedOption = question.options.find(
        (o) => o.key === answer.answer
      );
      if (selectedOption) {
        // Selected option contributes 100, non-selected contribute 0
        applyWeights(rawScores, rawCounts, selectedOption.weights, 100);
      }
    }
  }

  // Average by count, default to 50 if no data
  const scores: DimensionScores = {} as DimensionScores;
  for (const dim of DIMENSIONS) {
    scores[dim] =
      rawCounts[dim] > 0 ? Math.round(rawScores[dim] / rawCounts[dim]) : 50;
  }

  return scores;
}

function applyWeights(
  scores: Record<Dimension, number>,
  counts: Record<Dimension, number>,
  weights: DimensionWeight,
  value: number
) {
  for (const [dim, weight] of Object.entries(weights)) {
    const d = dim as Dimension;
    scores[d] += value * (weight ?? 0);
    counts[d] += weight ?? 0;
  }
}
