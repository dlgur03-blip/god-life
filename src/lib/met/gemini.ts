import { GoogleGenAI } from '@google/genai';
import { Answer, DimensionScores, MetAnalysisResult } from './types';
import { buildAnalysisPrompt } from './prompt';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeWithGemini(
  scores: DimensionScores,
  answers: Answer[],
  locale: string
): Promise<MetAnalysisResult> {
  const prompt = buildAnalysisPrompt(scores, answers, locale);

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text ?? '';
  const parsed = JSON.parse(text) as MetAnalysisResult;

  // Validate required fields
  if (!parsed.archetypeName || !parsed.archetypeEmoji || !parsed.summaryShort) {
    throw new Error('Invalid Gemini response: missing required fields');
  }

  return parsed;
}
