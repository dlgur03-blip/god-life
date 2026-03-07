'use client';

import { useTranslations } from 'next-intl';

interface RingsData {
  destiny: number;
  discipline: number;
  epistle: number;
  tasks: number;
}

interface Props {
  rings: RingsData;
  streakDays: number;
}

const modules = [
  { key: 'destiny', label: '운명', color: 'var(--color-destiny)', emoji: '🧭' },
  { key: 'discipline', label: '규율', color: 'var(--color-discipline)', emoji: '⚡' },
  { key: 'epistle', label: '서신', color: 'var(--color-epistle)', emoji: '✉️' },
  { key: 'tasks', label: '작업', color: 'var(--color-taskboard)', emoji: '📋' },
] as const;

function ProgressRing({ percent, color, size = 52, strokeWidth = 4 }: { percent: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export default function DashboardRings({ rings, streakDays }: Props) {
  const t = useTranslations('Home');

  return (
    <div className="w-full max-w-5xl animate-fade-in-up stagger-1">
      <div
        className="flex items-center justify-between gap-2 p-4 sm:p-5 border border-[var(--color-border)]"
        style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-card-bg)' }}
      >
        {/* Streak */}
        {streakDays > 0 && (
          <div className="flex flex-col items-center gap-1 px-3">
            <span className={`text-2xl ${streakDays >= 30 ? 'animate-fire' : ''}`}>🔥</span>
            <span className="text-lg font-black text-[var(--color-secondary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {streakDays}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">{t('streak')}</span>
          </div>
        )}

        {/* Divider */}
        {streakDays > 0 && (
          <div className="w-px h-12 bg-[var(--color-border)]" />
        )}

        {/* Module Rings */}
        <div className="flex items-center justify-around flex-1 gap-1">
          {modules.map(({ key, label, color, emoji }) => {
            const percent = rings[key as keyof RingsData];
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <ProgressRing percent={percent} color={color} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm">
                    {emoji}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--foreground-muted)]">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
