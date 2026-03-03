import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateScores } from '@/lib/met/scoring';
import { analyzeWithGemini } from '@/lib/met/gemini';
import { Answer } from '@/lib/met/types';
import crypto from 'crypto';

// Rate limit: 5 requests per hour per IP
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, locale } = body as {
      answers: Answer[];
      locale: string;
    };

    if (!answers || !Array.isArray(answers) || answers.length !== 30) {
      return NextResponse.json(
        { error: 'Invalid answers: expected 30 answers' },
        { status: 400 }
      );
    }

    if (!locale || !['ko', 'en', 'ja', 'zh', 'hi'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      );
    }

    // Rate limiting by IP hash
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashIP(ip);

    const windowStart = new Date(Date.now() - RATE_WINDOW_MS);
    const recentCount = await prisma.metResult.count({
      where: {
        ipHash,
        createdAt: { gte: windowStart },
      },
    });

    if (recentCount >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Calculate dimension scores
    const scores = calculateScores(answers);

    // Call Gemini for analysis
    const analysis = await analyzeWithGemini(scores, answers, locale);

    // Save to DB
    const result = await prisma.metResult.create({
      data: {
        locale,
        answers: JSON.parse(JSON.stringify(answers)),
        result: JSON.parse(JSON.stringify(analysis)),
        archetypeName: analysis.archetypeName,
        archetypeEmoji: analysis.archetypeEmoji,
        summaryShort: analysis.summaryShort,
        scoreApproach: scores.approach,
        scoreAvoidance: scores.avoidance,
        scoreIntrinsic: scores.intrinsic,
        scoreExtrinsic: scores.extrinsic,
        scoreAchievement: scores.achievement,
        scoreAffiliation: scores.affiliation,
        scorePower: scores.power,
        scoreAutonomy: scores.autonomy,
        scoreCompetence: scores.competence,
        ipHash,
      },
    });

    return NextResponse.json({ resultId: result.id });
  } catch (error) {
    console.error('MET analyze error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
