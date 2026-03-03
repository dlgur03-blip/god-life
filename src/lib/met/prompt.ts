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

  // Extract custom "OTHER:" answers for AI to interpret directly
  const customAnswers = answers
    .filter((a) => a.answer.startsWith('OTHER:'))
    .map((a) => `${a.questionId}: "${a.answer.slice(6)}"`)
    .join('\n');

  return `You are a world-class motivational psychologist with deep expertise in:
- Self-Determination Theory (Deci & Ryan)
- McClelland's Need Theory (Achievement, Affiliation, Power)
- Higgins' Regulatory Focus Theory (Promotion vs Prevention Focus)
- Atomic Habits (James Clear) - habit formation and identity-based motivation
- Deep Work (Cal Newport) - focus and meaningful productivity
- Mindset (Carol Dweck) - growth vs fixed mindset patterns
- The Psychology of Money (Morgan Housel) - emotional relationship with success
- Can't Hurt Me (David Goggins) - mental toughness patterns
- 돈의 속성 (김승호) - relationship between discipline and wealth

A person has completed a 30-question Motivation Engine Type (MET) assessment.

## CRITICAL ANALYSIS NOTES:
- High Avoidance + High Achievement = "Defensive Achiever" pattern. This person succeeds NOT from joy but from fear of failure. They prove themselves through results. Recognize this nuance.
- If Approach is low but Achievement is high, the person is likely driven by "proving they won't fail" rather than "chasing a dream."
- Custom text answers (marked OTHER:) reveal what the predefined options MISSED about this person. Treat these as the most authentic signals.

## Dimension Scores (0-100):
- Approach Motivation: ${scores.approach} (promotion focus - chasing gains)
- Avoidance Motivation: ${scores.avoidance} (prevention focus - avoiding losses)
- Intrinsic Motivation: ${scores.intrinsic} (internal satisfaction)
- Extrinsic Motivation: ${scores.extrinsic} (external rewards/recognition)
- Achievement Need: ${scores.achievement} (mastery, excellence)
- Affiliation Need: ${scores.affiliation} (belonging, relationships)
- Power Need: ${scores.power} (influence, impact)
- Autonomy Need: ${scores.autonomy} (independence, self-direction)
- Competence Need: ${scores.competence} (skill building, expertise)

## Raw Answers:
${JSON.stringify(answers)}

${customAnswers ? `## Custom Free-Text Answers (MOST IMPORTANT — these reveal what choices couldn't capture):\n${customAnswers}` : ''}

## Instructions:
1. ALL output must be in ${language}
2. Be brutally specific to THIS person's unique pattern — no generic advice
3. The archetype name should feel like a personal identity discovery (2-4 words, poetic)
4. Analyze the INTERACTION between dimensions, not each in isolation
5. If avoidance is high, explicitly address whether their "success drive" comes from fear or desire
6. For "thingsToDiscard": be concrete — name specific behaviors, habits, thought patterns to eliminate
7. For "godLifeStrategy": reference the specific God Life Maker modules (Destiny Navigator for timeblocking, Success Code for 100-day projects, Discipline Mastery for daily rules, Self Epistle for reflection, Money Flow for financial tracking) and explain HOW this person should use each based on their motivation profile
8. For "bookRecommendations": pick 3 books that specifically match this person's motivation pattern, with 1-sentence reason each
9. For "hiddenPattern": reveal something about their motivation they probably don't realize about themselves

Respond in the following JSON format exactly:
{
  "archetypeName": "string (unique 2-4 word archetype name)",
  "archetypeEmoji": "string (single emoji)",
  "summaryShort": "string (1-line summary, max 60 chars)",
  "summaryLong": "string (3-4 paragraph deep personality analysis, be specific and insightful)",
  "coreDesire": "string (the ONE thing this person fundamentally wants, 1-2 sentences)",
  "coreFear": "string (the ONE thing this person fundamentally fears, 1-2 sentences)",
  "strengths": ["string", "string", "string"],
  "blindSpots": ["string", "string", "string"],
  "thingsToDiscard": ["string (specific behavior/habit to eliminate)", "string", "string"],
  "motivationDNA": "string (2-3 paragraph core motivation pattern, explain the interplay between approach/avoidance and intrinsic/extrinsic)",
  "hiddenPattern": "string (1-2 paragraph insight they probably don't know about themselves)",
  "idealEnvironment": "string (specific work/life environment description with concrete examples)",
  "toxicEnvironment": "string (environments that will drain or destroy this person's motivation)",
  "peopleToSeek": "string (types of people who will energize and grow this person, with concrete traits)",
  "peopleToAvoid": "string (types of people who will drain this person, with concrete patterns to watch for)",
  "godLifeStrategy": "string (2-3 paragraphs: specific strategy for using God Life Maker modules — Destiny Navigator, Success Code, Discipline Mastery, Self Epistle, Money Flow — tailored to this person's motivation type)",
  "bookRecommendations": ["string (Book Title by Author — 1-sentence why)", "string", "string"],
  "growthAdvice": "string (2 paragraph personalized growth roadmap)",
  "mantra": "string (personal mantra that captures their core identity, 1 powerful sentence)"
}`;
}
