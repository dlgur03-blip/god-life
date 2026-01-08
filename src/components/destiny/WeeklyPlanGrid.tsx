'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { updateWeeklyPlan } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';
import {
  getAdaptiveWeekDates,
  getWeekRangeLabel,
  getWeekOffsetDate,
  type SupportedLocale,
} from '@/lib/date-utils';
import { getTodayStr } from '@/lib/date';

interface WeeklyPlanGridProps {
  initialPlans: Record<string, string | null>;
  onWeekChange?: (startDate: string) => void;
}

interface DayColumnInputProps {
  date: string;
  dayLabel: string;
  dateLabel: string;
  value: string | null;
  isToday: boolean;
  onSave: (date: string, value: string) => Promise<void>;
  placeholder: string;
}

function DayColumnInput({ date, dayLabel, dateLabel, value, isToday, onSave, placeholder }: DayColumnInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value || '');
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async (newValue: string) => {
    if (newValue === (value || '')) return;

    setIsSaving(true);
    try {
      await onSave(date, newValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (newValue: string) => {
    setInputValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSave(newValue);
    }, 500);
  };

  const handleBlur = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    handleSave(inputValue);
    setIsEditing(false);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-2 min-w-[100px] transition-all",
        isToday
          ? "border-[#06b6d4] bg-[rgba(6,182,212,0.1)]"
          : "border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.05)]",
        "hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]"
      )}
    >
      <div className="text-center mb-2">
        <div className={cn(
          "text-xs font-bold uppercase",
          isToday ? "text-[#06b6d4]" : "text-[#6b7280]"
        )}>
          {dayLabel}
        </div>
        <div className="text-xs text-[#6b7280]">{dateLabel}</div>
      </div>

      <div className="relative flex-1 min-h-[60px]">
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              "w-full h-full min-h-[60px] bg-[rgba(0,0,0,0.3)] rounded border px-2 py-1 text-xs text-[#e2e8f0] outline-none resize-none transition-all",
              "border-[#06b6d4] focus:border-[#06b6d4]",
              isSaving && "bg-[rgba(6,182,212,0.3)]"
            )}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={cn(
              "w-full h-full min-h-[60px] bg-[rgba(0,0,0,0.3)] rounded border border-transparent px-2 py-1 text-xs cursor-pointer transition-all",
              "hover:border-[rgba(255,255,255,0.2)]",
              inputValue ? "text-[#e2e8f0]" : "text-[#6b7280]"
            )}
          >
            {inputValue || placeholder}
          </div>
        )}
        {isSaving && (
          <div className="absolute right-1 top-1">
            <div className="w-3 h-3 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeeklyPlanGrid({ initialPlans, onWeekChange }: WeeklyPlanGridProps) {
  const t = useTranslations('Destiny');
  const locale = useLocale() as SupportedLocale;
  const [plans, setPlans] = useState(initialPlans);

  // 현재 표시 주의 시작일 (기본값: 오늘)
  const [weekStartDate, setWeekStartDate] = useState(() => getTodayStr());

  // useMemo로 weekDates 계산 최적화
  const weekDates = useMemo(
    () => getAdaptiveWeekDates(weekStartDate, locale),
    [weekStartDate, locale]
  );

  // 주간 범위 라벨
  const weekRangeLabel = useMemo(
    () => getWeekRangeLabel(weekStartDate, locale),
    [weekStartDate, locale]
  );

  // 오늘이 현재 주에 포함되어 있는지 확인
  const isTodayInCurrentWeek = useMemo(() => {
    return weekDates.some(d => d.isToday);
  }, [weekDates]);

  // 네비게이션 핸들러
  const handlePreviousWeek = useCallback(() => {
    const newStart = getWeekOffsetDate(weekStartDate, -1);
    setWeekStartDate(newStart);
    onWeekChange?.(newStart);
  }, [weekStartDate, onWeekChange]);

  const handleNextWeek = useCallback(() => {
    const newStart = getWeekOffsetDate(weekStartDate, 1);
    setWeekStartDate(newStart);
    onWeekChange?.(newStart);
  }, [weekStartDate, onWeekChange]);

  const handleGoToToday = useCallback(() => {
    const todayStr = getTodayStr();
    setWeekStartDate(todayStr);
    onWeekChange?.(todayStr);
  }, [onWeekChange]);

  // initialPlans가 변경되면 plans 상태 업데이트
  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  const handleSave = async (date: string, value: string) => {
    // Optimistic update
    setPlans(prev => ({ ...prev, [date]: value }));
    await updateWeeklyPlan(date, value);
  };

  return (
    <div className="space-y-3">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
          {t('weeklyPlan.title')}
        </h3>

        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Week Button */}
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(6,182,212,0.2)] text-[#9ca3af] hover:text-[#06b6d4] transition-all"
            aria-label={t('weeklyPlan.previous')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Week Range Label */}
          <span className="text-xs text-[#e2e8f0] font-medium min-w-[140px] text-center">
            {weekRangeLabel}
          </span>

          {/* Next Week Button */}
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(6,182,212,0.2)] text-[#9ca3af] hover:text-[#06b6d4] transition-all"
            aria-label={t('weeklyPlan.next')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Today Button (only show if today is not in current week) */}
          {!isTodayInCurrentWeek && (
            <button
              onClick={handleGoToToday}
              className="p-1.5 rounded-md bg-[rgba(6,182,212,0.1)] hover:bg-[rgba(6,182,212,0.2)] text-[#06b6d4] transition-all ml-1"
              aria-label={t('weeklyPlan.today')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Day Columns Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDates.map((day) => (
          <DayColumnInput
            key={day.date}
            date={day.date}
            dayLabel={day.dayLabel}
            dateLabel={day.dateLabel}
            value={plans[day.date] ?? null}
            isToday={day.isToday}
            onSave={handleSave}
            placeholder={t('weeklyPlan.placeholder')}
          />
        ))}
      </div>
    </div>
  );
}
