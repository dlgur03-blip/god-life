'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Report {
  date: string;
  mode: string;
  step: number;
  columnTitle: string | null;
  column: string | null;
}

interface ReportDate {
  date: string;
  columnTitle: string | null;
  step: number;
}

interface Props {
  report: Report | null;
  reportDates: ReportDate[];
  currentDate: string;
  currentMode: string;
  locale: string;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = dayNames[date.getDay()];
  return `${month}/${day} (${dayOfWeek})`;
}

const MODES = [
  { id: 'standard', label: '🔮 글로벌 시그널', color: 'blue' },
  { id: 'daytrader', label: '🎯 데이트레이더', color: 'amber' },
] as const;

export default function ReportPageClient({ report, reportDates, currentDate, currentMode, locale }: Props) {
  const router = useRouter();

  const handleDateChange = (date: string) => {
    router.push(`/${locale}/signal/report?mode=${currentMode}&date=${date}`);
  };

  const handleModeChange = (mode: string) => {
    router.push(`/${locale}/signal/report?mode=${mode}`);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <button
            onClick={() => router.push(`/${locale}/signal`)}
            className="text-sm text-white/40 hover:text-white/60 mb-3 flex items-center gap-1"
          >
            ← 시그널로 돌아가기
          </button>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            📊 투모로우시그널 리포트
          </h1>
        </header>

        {/* Mode tabs */}
        <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                currentMode === m.id
                  ? m.color === 'blue'
                    ? 'bg-blue-600/30 text-blue-300'
                    : 'bg-amber-600/30 text-amber-300'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Date selector */}
        {reportDates.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {reportDates.map((rd) => (
              <button
                key={rd.date}
                onClick={() => handleDateChange(rd.date)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  rd.date === currentDate
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {formatDateLabel(rd.date)}
                {rd.step < 4 && (
                  <span className="ml-1 text-xs text-amber-400">진행중</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Column content */}
        {report?.column ? (
          <article className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            {report.columnTitle && (
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
                {report.columnTitle}
              </h2>
            )}
            <div className="prose prose-invert prose-sm md:prose-base max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-white/80 prose-p:leading-relaxed
              prose-strong:text-amber-300
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-ul:text-white/70 prose-ol:text-white/70
              prose-blockquote:border-purple-500 prose-blockquote:text-white/60
              prose-code:text-green-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
            ">
              <ReactMarkdown>{report.column}</ReactMarkdown>
            </div>
          </article>
        ) : report ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold text-white/60 mb-2">
              리포트 생성 중...
            </h2>
            <p className="text-sm text-white/40">
              현재 Step {report.step}/4 진행 중입니다
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-white/60 mb-2">
              {currentMode === 'daytrader' ? '데이트레이더 리포트가 없습니다' : '글로벌 시그널 리포트가 없습니다'}
            </h2>
            <p className="text-sm text-white/40">
              시그널 페이지에서 생성 버튼을 눌러주세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
