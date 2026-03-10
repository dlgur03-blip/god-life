'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SIGNAL_CATEGORIES, SIGNAL_REGIONS, SIGNAL_FOLDERS } from '@/lib/signal/constants';

interface Signal {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  regions: unknown;
  regionCount: number;
  sources: unknown;
  importance: number;
}

interface Props {
  signals: Signal[];
  availableDates: string[];
  currentDate: string;
  locale: string;
}

function RegionBadge({ code }: { code: string }) {
  const region = SIGNAL_REGIONS.find((r) => r.code === code);
  if (!region) return null;
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded-full bg-white/10">
      {region.flag} {region.labelKo}
    </span>
  );
}

function ImportanceDots({ score }: { score: number }) {
  const level = Math.min(5, Math.ceil(score / 2));
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < level ? 'bg-amber-400' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const category = SIGNAL_CATEGORIES.find((c) => c.id === signal.category);

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.emoji}</span>
          <span className="text-xs text-white/50 font-medium">
            {category?.labelKo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ImportanceDots score={signal.importance} />
          <span className="text-xs text-amber-400/70 font-mono">
            {signal.regionCount}개국
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {signal.title}
      </h3>

      <p className="text-sm text-white/60 leading-relaxed mb-3">
        {signal.summary}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        {(signal.regions as string[]).map((code) => (
          <RegionBadge key={code} code={code} />
        ))}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <p className="text-xs text-white/40 font-medium mb-2">원본 소스</p>
          {(signal.sources as Array<{ region: string; title: string; url: string }>).map(
            (source, idx) => {
              const region = SIGNAL_REGIONS.find((r) => r.code === source.region);
              return (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-start gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{region?.flag ?? '🌐'}</span>
                  <span className="line-clamp-1">{source.title}</span>
                </a>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

function GenerateButtons({ locale, onComplete }: { locale: string; onComplete: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = useCallback(async (mode: 'standard' | 'daytrader') => {
    setLoading(mode);
    setResult(null);
    try {
      const res = await fetch(`/api/cron/signal?mode=${mode}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResult(`${mode === 'daytrader' ? '🎯 데이트레이더' : '🔮 글로벌'} 완료! (${data.columnLength?.toLocaleString()}자)`);
        onComplete();
        // 리포트 페이지로 이동
        setTimeout(() => router.push(`/${locale}/signal/report`), 1500);
      } else {
        setResult(`실패: ${data.error}`);
      }
    } catch (e) {
      setResult(`에러: ${String(e)}`);
    } finally {
      setLoading(null);
    }
  }, [locale, onComplete, router]);

  return (
    <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-white/40 mb-3 font-medium">시그널 생성</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleGenerate('standard')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold hover:bg-blue-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading === 'standard' ? (
            <span className="animate-pulse">분석 중...</span>
          ) : (
            <>🔮 글로벌 시그널</>
          )}
        </button>
        <button
          onClick={() => handleGenerate('daytrader')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-300 text-sm font-semibold hover:bg-amber-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading === 'daytrader' ? (
            <span className="animate-pulse">분석 중...</span>
          ) : (
            <>🎯 데이트레이더</>
          )}
        </button>
      </div>
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
          <div className="w-3 h-3 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
          {loading === 'daytrader'
            ? 'RSS 수집 → 뉴스 분류 → 경제 지표 → 투자자 분석 → 칼럼 작성 (약 2~5분)'
            : 'RSS 수집 → 뉴스 분류 → 칼럼 작성 (약 1~2분)'}
        </div>
      )}
      {result && (
        <p className={`mt-2 text-xs ${result.includes('완료') ? 'text-green-400' : 'text-red-400'}`}>
          {result}
        </p>
      )}
    </div>
  );
}

export default function SignalPageClient({
  signals,
  availableDates,
  currentDate,
  locale,
}: Props) {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState<string>('news');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter by folder first, then by category
  const folderCategories = SIGNAL_CATEGORIES.filter((c) => c.folder === activeFolder);
  const folderSignals = signals.filter((s) =>
    folderCategories.some((c) => c.id === s.category),
  );
  const filteredSignals = selectedCategory
    ? folderSignals.filter((s) => s.category === selectedCategory)
    : folderSignals;

  const handleDateChange = (date: string) => {
    router.push(`/${locale}/signal?date=${date}`);
  };

  const handleFolderChange = (folderId: string) => {
    setActiveFolder(folderId);
    setSelectedCategory(null);
  };

  // Count signals per category (within active folder)
  const categoryCounts = folderCategories.map((cat) => ({
    ...cat,
    count: signals.filter((s) => s.category === cat.id).length,
  }));

  const activeFolderInfo = SIGNAL_FOLDERS.find((f) => f.id === activeFolder);

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            🔮 투모로우시그널
          </h1>
          <p className="text-sm text-white/50">
            6개국 뉴스에서 겹치는 핵심만
          </p>
          <button
            onClick={() => router.push(`/${locale}/signal/report`)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors"
          >
            📊 데일리 리포트 보기
          </button>
        </header>

        {/* Generate buttons */}
        <GenerateButtons locale={locale} onComplete={() => router.refresh()} />

        {/* Folder tabs */}
        <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
          {SIGNAL_FOLDERS.map((folder) => {
            const folderCats = SIGNAL_CATEGORIES.filter((c) => c.folder === folder.id);
            const count = signals.filter((s) => folderCats.some((c) => c.id === s.category)).length;
            return (
              <button
                key={folder.id}
                onClick={() => handleFolderChange(folder.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeFolder === folder.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span>{folder.emoji}</span>
                <span>{folder.labelKo}</span>
                {count > 0 && (
                  <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Date selector */}
        {availableDates.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  date === currentDate
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {formatDateLabel(date)}
              </button>
            ))}
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            전체 ({folderSignals.length})
          </button>
          {categoryCounts
            .filter((c) => c.count > 0)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {cat.emoji} {cat.labelKo} ({cat.count})
              </button>
            ))}
        </div>

        {/* Signal list */}
        {filteredSignals.length > 0 ? (
          <div className="space-y-3">
            {filteredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{activeFolderInfo?.emoji ?? '📡'}</div>
            <h2 className="text-xl font-bold text-white/60 mb-2">
              {activeFolder === 'stock'
                ? '주식시장 리포트가 없습니다'
                : '아직 시그널이 없습니다'}
            </h2>
            <p className="text-sm text-white/40">
              매일 아침 6시에 자동으로 수집됩니다
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = dayNames[date.getDay()];
  return `${month}/${day} (${dayOfWeek})`;
}
