export const DIMENSIONS = [
  'approach',
  'avoidance',
  'intrinsic',
  'extrinsic',
  'achievement',
  'affiliation',
  'power',
  'autonomy',
  'competence',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type QuestionType = 'likert' | 'forced' | 'scenario' | 'metaphor';

/** Weight mapping for a question/option → dimension */
export type DimensionWeight = Partial<Record<Dimension, number>>;

export interface LikertQuestion {
  id: string;
  type: 'likert';
  /** Dimension weights applied proportionally to the 1-7 answer */
  weights: DimensionWeight;
}

export interface ForcedChoiceQuestion {
  id: string;
  type: 'forced';
  options: {
    key: 'A' | 'B';
    weights: DimensionWeight;
  }[];
}

export interface ScenarioQuestion {
  id: string;
  type: 'scenario';
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    weights: DimensionWeight;
  }[];
}

export interface MetaphorQuestion {
  id: string;
  type: 'metaphor';
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    weights: DimensionWeight;
  }[];
}

export type Question =
  | LikertQuestion
  | ForcedChoiceQuestion
  | ScenarioQuestion
  | MetaphorQuestion;

export interface Answer {
  questionId: string;
  answer: string; // '1'-'7' for likert, 'A'|'B' for forced, 'A'-'D' for scenario/metaphor
  value: number; // numeric value (1-7 for likert, 0/1 for others)
}

export type DimensionScores = Record<Dimension, number>; // 0-100

export interface MetAnalysisResult {
  archetypeName: string;
  archetypeEmoji: string;
  summaryShort: string;
  summaryLong: string;
  strengths: string[];
  blindSpots: string[];
  motivationDNA: string;
  idealEnvironment: string;
  growthAdvice: string;
  mantra: string;
}
