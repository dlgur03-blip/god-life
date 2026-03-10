// Tomorrow Signal - Manual trigger API
// Two modes: "standard" (글로벌 시그널) and "daytrader" (데이트레이더)
// No auto-cron. 이혁이 버튼 눌러서 실행.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { fetchAllNews } from '@/lib/signal/fetch-news';
import { analyzeNewsWithAI } from '@/lib/signal/analyze';
import { SIGNAL_CATEGORIES } from '@/lib/signal/constants';
import { getDateContext, buildStep1Prompt, buildStep2Prompt, buildStep3Prompt, buildStep4Prompt } from '@/lib/signal/prompts';

export const maxDuration = 300;

const GEMINI_MODEL = 'gemini-2.0-flash-lite';

function getTodayStr(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function callGemini(prompt: string, maxTokens: number = 8192): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenAI({ apiKey });
  const response = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.3, maxOutputTokens: maxTokens },
  });

  return response.text?.trim() ?? '';
}

// ── RSS 수집 + 교차분석 → NewsSignal DB ──
async function collectRssSignals() {
  const date = getTodayStr();
  const rawNews = await fetchAllNews();
  if (rawNews.length === 0) return { rawHeadlines: '', signals: 0 };

  const allSignals = [];
  for (const category of SIGNAL_CATEGORIES) {
    const signals = await analyzeNewsWithAI(rawNews, category.id);
    allSignals.push(...signals);
  }

  let savedCount = 0;
  for (const signal of allSignals) {
    try {
      await prisma.newsSignal.upsert({
        where: { date_category_title: { date, category: signal.category, title: signal.title } },
        create: { date, category: signal.category, title: signal.title, summary: signal.summary, regions: signal.regions, regionCount: signal.regionCount, sources: signal.sources, importance: signal.importance },
        update: { summary: signal.summary, regions: signal.regions, regionCount: signal.regionCount, sources: signal.sources, importance: signal.importance },
      });
      savedCount++;
    } catch (e) {
      console.error(`[Signal] Save failed`, e);
    }
  }

  const rawHeadlines = rawNews.map((n) => `[${n.region}/${n.category}] ${n.title}`).join('\n');
  return { rawHeadlines, signals: savedCount };
}

// ============================================
// MODE: "standard" - 글로벌 시그널
// Step 0 (RSS) → Step 1 (뉴스분류) → Step 4 (칼럼)
// ============================================
async function runStandard() {
  const dateCtx = getDateContext();
  const date = dateCtx.isoDate;
  const mode = 'standard';

  const { rawHeadlines, signals } = await collectRssSignals();

  const step1Prompt = buildStep1Prompt(rawHeadlines, dateCtx);
  const step1Data = await callGemini(step1Prompt, 8192);

  const columnPrompt = `아래 글로벌 뉴스 분석을 바탕으로 [IQ130혁] 투모로우시그널 칼럼을 작성해줘.

=== 뉴스 데이터 ===
${step1Data}

**칼럼 요구사항:**
- 거시→중위→미시 구조
- 10개 지역 모두 커버
- 미국/연준 가중치
- 허밍웨이식 짧은 문체
- "~을 보여준다" "~라는 신호다" 객관적 서술만
- 1인칭/조언 표현 금지
- 숫자와 팩트 풍부하게
- 5,000~10,000자
- 마크다운 형식

현재시각: ${dateCtx.fullStr}`;

  const column = await callGemini(columnPrompt, 16384);
  const titleMatch = column.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1] ?? `투모로우시그널 ${dateCtx.dateStr}`;

  await prisma.signalReport.upsert({
    where: { date_mode: { date, mode } },
    create: { date, mode, step: 4, newsData: step1Data, column, columnTitle: title },
    update: { step: 4, newsData: step1Data, column, columnTitle: title },
  });

  return { date, mode, title, signals, columnLength: column.length };
}

// ============================================
// MODE: "daytrader" - 데이트레이더 버전
// Step 0 → Step 1 → Step 2 (지표) → Step 3 (투자자) → Step 4 (칼럼)
// ============================================
async function runDaytrader() {
  const dateCtx = getDateContext();
  const date = dateCtx.isoDate;
  const mode = 'daytrader';

  const { rawHeadlines } = await collectRssSignals();

  const step1Data = await callGemini(buildStep1Prompt(rawHeadlines, dateCtx), 8192);

  await prisma.signalReport.upsert({
    where: { date_mode: { date, mode } },
    create: { date, mode, step: 1, newsData: step1Data },
    update: { step: 1, newsData: step1Data },
  });

  const step2Data = await callGemini(buildStep2Prompt(step1Data, dateCtx), 8192);

  await prisma.signalReport.upsert({
    where: { date_mode: { date, mode } },
    create: { date, mode, step: 2, indicators: step2Data },
    update: { step: 2, indicators: step2Data },
  });

  const step3Data = await callGemini(buildStep3Prompt(step1Data, step2Data, dateCtx), 16384);

  await prisma.signalReport.upsert({
    where: { date_mode: { date, mode } },
    create: { date, mode, step: 3, analysis: step3Data },
    update: { step: 3, analysis: step3Data },
  });

  const column = await callGemini(buildStep4Prompt(step1Data, step2Data, step3Data, dateCtx), 16384);
  const titleMatch = column.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1] ?? `데이트레이더 시그널 ${dateCtx.dateStr}`;

  await prisma.signalReport.upsert({
    where: { date_mode: { date, mode } },
    create: { date, mode, step: 4, newsData: step1Data, indicators: step2Data, analysis: step3Data, column, columnTitle: `🎯 ${title}` },
    update: { step: 4, column, columnTitle: `🎯 ${title}` },
  });

  return { date, mode, title, columnLength: column.length };
}

// ── POST /api/cron/signal?mode=standard|daytrader ──
export async function POST(request: NextRequest) {
  // Admin only
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') ?? 'standard';

  try {
    if (mode === 'daytrader') {
      const result = await runDaytrader();
      return NextResponse.json({ success: true, ...result });
    } else {
      const result = await runStandard();
      return NextResponse.json({ success: true, ...result });
    }
  } catch (error) {
    console.error(`[Signal] ${mode} failed:`, error);
    return NextResponse.json({ error: `${mode} failed`, message: String(error) }, { status: 500 });
  }
}

// GET - 상태 확인
export async function GET() {
  const date = getTodayStr();
  const [standard, daytrader, signalCount] = await Promise.all([
    prisma.signalReport.findUnique({ where: { date_mode: { date, mode: 'standard' } } }),
    prisma.signalReport.findUnique({ where: { date_mode: { date, mode: 'daytrader' } } }),
    prisma.newsSignal.count({ where: { date } }),
  ]);

  return NextResponse.json({
    date,
    signalCount,
    standard: { exists: !!standard, step: standard?.step ?? 0 },
    daytrader: { exists: !!daytrader, step: daytrader?.step ?? 0 },
  });
}
