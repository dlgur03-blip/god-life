// Google News RSS fetcher for Tomorrow Signal

import { SIGNAL_REGIONS, SEARCH_KEYWORDS, SIGNAL_CATEGORIES } from './constants';

interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  region: string;
  category: string;
}

function parseRSSXml(xml: string): Array<{ title: string; link: string; pubDate: string }> {
  const items: Array<{ title: string; link: string; pubDate: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() ?? '';
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? '';
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';

    if (title && link) {
      items.push({ title, link, pubDate });
    }
  }

  return items;
}

async function fetchGoogleNewsRSS(
  query: string,
  hl: string,
  gl: string,
): Promise<Array<{ title: string; link: string; pubDate: string }>> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl.split('-')[0]}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TomorrowSignal/1.0)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const xml = await response.text();
    return parseRSSXml(xml).slice(0, 5); // Top 5 per region per category
  } catch {
    console.error(`[Signal] Failed to fetch RSS: ${gl}/${hl} - ${query}`);
    return [];
  }
}

export async function fetchAllNews(): Promise<RawNewsItem[]> {
  const allItems: RawNewsItem[] = [];

  // Fetch all categories x regions in parallel (batched)
  const tasks: Array<{
    region: typeof SIGNAL_REGIONS[number];
    category: typeof SIGNAL_CATEGORIES[number];
  }> = [];

  for (const category of SIGNAL_CATEGORIES) {
    for (const region of SIGNAL_REGIONS) {
      tasks.push({ region, category });
    }
  }

  // Process in batches of 12 to avoid rate limiting
  const BATCH_SIZE = 12;
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async ({ region, category }) => {
        const keywords = SEARCH_KEYWORDS[category.id]?.[region.googleNewsHL]
          ?? SEARCH_KEYWORDS[category.id]?.['en']
          ?? category.labelEn;

        const items = await fetchGoogleNewsRSS(
          keywords,
          region.googleNewsHL,
          region.googleNewsGL,
        );

        return items.map((item) => ({
          ...item,
          region: region.code,
          category: category.id,
        }));
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }

    // Small delay between batches
    if (i + BATCH_SIZE < tasks.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return allItems;
}
