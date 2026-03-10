// Gemini-based news analysis for Tomorrow Signal
// Groups news by topic, finds cross-region overlap, summarizes

import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.0-flash-lite';

interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  region: string;
  category: string;
}

export interface AnalyzedSignal {
  category: string;
  title: string;
  summary: string;
  regions: string[];
  regionCount: number;
  sources: Array<{ region: string; title: string; url: string }>;
  importance: number;
}

export async function analyzeNewsWithAI(
  items: RawNewsItem[],
  category: string,
): Promise<AnalyzedSignal[]> {
  if (items.length === 0) return [];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenAI({ apiKey });

  // Group by category
  const categoryItems = items.filter((i) => i.category === category);
  if (categoryItems.length === 0) return [];

  // Build prompt with news headlines
  const headlineList = categoryItems
    .map((item) => `[${item.region}] ${item.title}`)
    .join('\n');

  const prompt = `You are a news analyst for "Tomorrow Signal" service.
Below are news headlines from 6 regions (KR=Korea, US=USA, CN=China, JP=Japan, GB=UK, ME=Middle East) in the "${category}" category.

HEADLINES:
${headlineList}

TASK:
1. Group headlines that cover the SAME topic/event across different regions.
2. ONLY return topics that appear in 2 or more regions.
3. For each overlapping topic, provide:
   - title: concise Korean title (max 50 chars)
   - summary: Korean summary (2-3 sentences, explain why this matters)
   - regions: array of region codes where this topic appeared
   - sources: array of {region, title, url} for each matching headline
   - importance: 1-10 score (10 = most impactful globally)

Return ONLY valid JSON array. No markdown, no explanation.
Example: [{"title":"...", "summary":"...", "regions":["KR","US"], "sources":[{"region":"KR","title":"...","url":"..."}], "importance": 7}]

If no overlapping topics found, return empty array: []`;

  try {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text?.trim() ?? '[]';

    // Clean potential markdown wrapping
    const jsonStr = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: Record<string, unknown>) => ({
      category,
      title: String(item.title ?? ''),
      summary: String(item.summary ?? ''),
      regions: Array.isArray(item.regions) ? item.regions.map(String) : [],
      regionCount: Array.isArray(item.regions) ? item.regions.length : 0,
      sources: Array.isArray(item.sources) ? item.sources : [],
      importance: Number(item.importance) || 0,
    }));
  } catch (error) {
    console.error(`[Signal] AI analysis failed for category ${category}:`, error);
    return [];
  }
}
