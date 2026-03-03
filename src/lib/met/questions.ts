import { Question } from './types';

/**
 * 30 MET Questions
 * Framework: SDT (Self-Determination Theory) + McClelland's Need Theory + Higgins' Regulatory Focus
 *
 * Q1-Q12:  Likert 7-point (1-7)
 * Q13-Q20: Forced choice (A vs B)
 * Q21-Q26: Scenario (A/B/C/D)
 * Q27-Q30: Metaphor (A/B/C/D)
 *
 * Text is in i18n files (Met.questions.Q1.text, etc.)
 */
export const QUESTIONS: Question[] = [
  // ===== LIKERT 7-POINT (Q1-Q12) =====
  {
    id: 'Q1',
    type: 'likert',
    weights: { approach: 1, achievement: 0.7 },
  },
  {
    id: 'Q2',
    type: 'likert',
    weights: { avoidance: 1, extrinsic: 0.5 },
  },
  {
    id: 'Q3',
    type: 'likert',
    weights: { intrinsic: 1, autonomy: 0.6 },
  },
  {
    id: 'Q4',
    type: 'likert',
    weights: { extrinsic: 1, power: 0.4 },
  },
  {
    id: 'Q5',
    type: 'likert',
    weights: { achievement: 1, competence: 0.7 },
  },
  {
    id: 'Q6',
    type: 'likert',
    weights: { affiliation: 1, avoidance: 0.3 },
  },
  {
    id: 'Q7',
    type: 'likert',
    weights: { power: 1, approach: 0.5 },
  },
  {
    id: 'Q8',
    type: 'likert',
    weights: { autonomy: 1, intrinsic: 0.5 },
  },
  {
    id: 'Q9',
    type: 'likert',
    weights: { competence: 1, achievement: 0.4 },
  },
  {
    id: 'Q10',
    type: 'likert',
    weights: { approach: 0.8, intrinsic: 0.6 },
  },
  {
    id: 'Q11',
    type: 'likert',
    weights: { avoidance: 0.8, affiliation: 0.5 },
  },
  {
    id: 'Q12',
    type: 'likert',
    weights: { extrinsic: 0.7, achievement: 0.6 },
  },

  // ===== FORCED CHOICE (Q13-Q20) =====
  {
    id: 'Q13',
    type: 'forced',
    options: [
      { key: 'A', weights: { approach: 1, achievement: 0.8 } },
      { key: 'B', weights: { avoidance: 1, affiliation: 0.6 } },
    ],
  },
  {
    id: 'Q14',
    type: 'forced',
    options: [
      { key: 'A', weights: { intrinsic: 1, autonomy: 0.7 } },
      { key: 'B', weights: { extrinsic: 1, power: 0.5 } },
    ],
  },
  {
    id: 'Q15',
    type: 'forced',
    options: [
      { key: 'A', weights: { autonomy: 1, intrinsic: 0.5 } },
      { key: 'B', weights: { affiliation: 1, extrinsic: 0.4 } },
    ],
  },
  {
    id: 'Q16',
    type: 'forced',
    options: [
      { key: 'A', weights: { competence: 1, achievement: 0.6 } },
      { key: 'B', weights: { power: 1, approach: 0.5 } },
    ],
  },
  {
    id: 'Q17',
    type: 'forced',
    options: [
      { key: 'A', weights: { approach: 1, power: 0.6 } },
      { key: 'B', weights: { avoidance: 1, competence: 0.5 } },
    ],
  },
  {
    id: 'Q18',
    type: 'forced',
    options: [
      { key: 'A', weights: { achievement: 1, approach: 0.5 } },
      { key: 'B', weights: { affiliation: 1, avoidance: 0.4 } },
    ],
  },
  {
    id: 'Q19',
    type: 'forced',
    options: [
      { key: 'A', weights: { intrinsic: 1, competence: 0.6 } },
      { key: 'B', weights: { extrinsic: 1, affiliation: 0.5 } },
    ],
  },
  {
    id: 'Q20',
    type: 'forced',
    options: [
      { key: 'A', weights: { autonomy: 1, approach: 0.5 } },
      { key: 'B', weights: { power: 1, extrinsic: 0.6 } },
    ],
  },

  // ===== SCENARIO (Q21-Q26) =====
  {
    id: 'Q21',
    type: 'scenario',
    options: [
      { key: 'A', weights: { achievement: 1, approach: 0.7 } },
      { key: 'B', weights: { affiliation: 1, avoidance: 0.4 } },
      { key: 'C', weights: { autonomy: 1, intrinsic: 0.6 } },
      { key: 'D', weights: { power: 1, extrinsic: 0.5 } },
    ],
  },
  {
    id: 'Q22',
    type: 'scenario',
    options: [
      { key: 'A', weights: { avoidance: 1, affiliation: 0.5 } },
      { key: 'B', weights: { approach: 1, competence: 0.7 } },
      { key: 'C', weights: { power: 1, achievement: 0.5 } },
      { key: 'D', weights: { autonomy: 1, intrinsic: 0.6 } },
    ],
  },
  {
    id: 'Q23',
    type: 'scenario',
    options: [
      { key: 'A', weights: { intrinsic: 1, autonomy: 0.8 } },
      { key: 'B', weights: { extrinsic: 1, achievement: 0.6 } },
      { key: 'C', weights: { competence: 1, approach: 0.5 } },
      { key: 'D', weights: { affiliation: 1, avoidance: 0.4 } },
    ],
  },
  {
    id: 'Q24',
    type: 'scenario',
    options: [
      { key: 'A', weights: { power: 1, approach: 0.6 } },
      { key: 'B', weights: { affiliation: 1, intrinsic: 0.5 } },
      { key: 'C', weights: { achievement: 1, competence: 0.7 } },
      { key: 'D', weights: { avoidance: 1, extrinsic: 0.5 } },
    ],
  },
  {
    id: 'Q25',
    type: 'scenario',
    options: [
      { key: 'A', weights: { competence: 1, intrinsic: 0.6 } },
      { key: 'B', weights: { power: 1, extrinsic: 0.7 } },
      { key: 'C', weights: { autonomy: 1, approach: 0.5 } },
      { key: 'D', weights: { affiliation: 1, avoidance: 0.5 } },
    ],
  },
  {
    id: 'Q26',
    type: 'scenario',
    options: [
      { key: 'A', weights: { approach: 1, achievement: 0.7 } },
      { key: 'B', weights: { avoidance: 1, competence: 0.6 } },
      { key: 'C', weights: { intrinsic: 1, autonomy: 0.5 } },
      { key: 'D', weights: { extrinsic: 1, power: 0.6 } },
    ],
  },

  // ===== METAPHOR (Q27-Q30) =====
  {
    id: 'Q27',
    type: 'metaphor',
    options: [
      { key: 'A', weights: { approach: 1, achievement: 0.8 } },
      { key: 'B', weights: { avoidance: 0.8, affiliation: 1 } },
      { key: 'C', weights: { autonomy: 1, intrinsic: 0.7 } },
      { key: 'D', weights: { power: 1, extrinsic: 0.6 } },
    ],
  },
  {
    id: 'Q28',
    type: 'metaphor',
    options: [
      { key: 'A', weights: { competence: 1, intrinsic: 0.6 } },
      { key: 'B', weights: { achievement: 1, approach: 0.7 } },
      { key: 'C', weights: { affiliation: 1, avoidance: 0.5 } },
      { key: 'D', weights: { autonomy: 1, power: 0.4 } },
    ],
  },
  {
    id: 'Q29',
    type: 'metaphor',
    options: [
      { key: 'A', weights: { intrinsic: 1, competence: 0.7 } },
      { key: 'B', weights: { extrinsic: 1, achievement: 0.6 } },
      { key: 'C', weights: { power: 1, approach: 0.5 } },
      { key: 'D', weights: { affiliation: 1, autonomy: 0.4 } },
    ],
  },
  {
    id: 'Q30',
    type: 'metaphor',
    options: [
      { key: 'A', weights: { achievement: 1, competence: 0.6 } },
      { key: 'B', weights: { affiliation: 1, intrinsic: 0.5 } },
      { key: 'C', weights: { power: 1, extrinsic: 0.7 } },
      { key: 'D', weights: { autonomy: 1, avoidance: 0.4 } },
    ],
  },
];
