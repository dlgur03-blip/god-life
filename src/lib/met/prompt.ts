import { Answer, DimensionScores } from './types';

export function buildAnalysisPrompt(
  scores: DimensionScores,
  answers: Answer[],
  locale: string
): string {
  const langMap: Record<string, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
    hi: 'हिन्दी',
  };
  const language = langMap[locale] || 'English';

  return `You are a world-class motivational psychologist specializing in Self-Determination Theory (SDT), McClelland's Need Theory, and Higgins' Regulatory Focus Theory.

A person has completed a 30-question Motivation Engine Type (MET) assessment. Based on their dimension scores and raw answers, create a deeply personal and insightful motivation archetype analysis.

## Dimension Scores (0-100):
- Approach Motivation: ${scores.approach}
- Avoidance Motivation: ${scores.avoidance}
- Intrinsic Motivation: ${scores.intrinsic}
- Extrinsic Motivation: ${scores.extrinsic}
- Achievement Need: ${scores.achievement}
- Affiliation Need: ${scores.affiliation}
- Power Need: ${scores.power}
- Autonomy Need: ${scores.autonomy}
- Competence Need: ${scores.competence}

## Raw Answers:
${JSON.stringify(answers)}

## Instructions:
1. Create a unique, evocative archetype name (2-4 words, poetic and memorable)
2. Choose a single emoji that best represents this archetype
3. Write a compelling 1-line summary (max 60 chars)
4. Provide detailed analysis covering all aspects below
5. ALL output must be in ${language}
6. Be specific to THIS person's unique pattern, not generic
7. The archetype name should feel like a personal identity discovery

Respond in the following JSON format exactly:
{
  "archetypeName": "string (unique archetype name)",
  "archetypeEmoji": "string (single emoji)",
  "summaryShort": "string (1-line summary, max 60 chars)",
  "summaryLong": "string (2-3 paragraph detailed personality analysis)",
  "strengths": ["string (strength 1)", "string (strength 2)", "string (strength 3)"],
  "blindSpots": ["string (blind spot 1)", "string (blind spot 2)", "string (blind spot 3)"],
  "motivationDNA": "string (core motivation pattern explanation)",
  "idealEnvironment": "string (ideal work/life environment description)",
  "growthAdvice": "string (personalized growth advice)",
  "mantra": "string (personal mantra/affirmation, 1 sentence)"
}`;
}
