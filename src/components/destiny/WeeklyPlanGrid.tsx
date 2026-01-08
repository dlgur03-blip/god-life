'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { updateWeeklyPlan } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';

interface WeeklyPlanGridProps {
  startDate: string; // YYYY-MM-DD
  initialPlans: Record<string, string | null>;
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
          isToday ? "text-[#06b6d4]" : "text-gray-500"
        )}>
          {dayLabel}
        </div>
        <div className="text-xs text-gray-600">{dateLabel}</div>
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
              "w-full h-full min-h-[60px] bg-black/30 rounded border px-2 py-1 text-xs text-gray-200 outline-none resize-none transition-all",
              "border-[#06b6d4] focus:border-[#06b6d4]",
              isSaving && "bg-[rgba(6,182,212,0.3)]"
            )}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={cn(
              "w-full h-full min-h-[60px] bg-black/30 rounded border border-transparent px-2 py-1 text-xs cursor-pointer transition-all",
              "hover:border-[rgba(255,255,255,0.2)]",
              inputValue ? "text-gray-300" : "text-gray-600"
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

export default function WeeklyPlanGrid({ startDate, initialPlans }: WeeklyPlanGridProps) {
  const t = useTranslations('Destiny');
  const locale = useLocale();
  const [plans, setPlans] = useState(initialPlans);

  const handleSave = async (date: string, value: string) => {
    // Optimistic update
    setPlans(prev => ({ ...prev, [date]: value }));
    await updateWeeklyPlan(date, value);
  };

  // Generate 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    // Day label based on locale
    const dayNames = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ko: ['일', '월', '화', '수', '목', '금', '토'],
      ja: ['日', '月', '火', '水', '木', '金', '土'],
    };
    const dayLabel = (dayNames[locale as keyof typeof dayNames] || dayNames.en)[d.getDay()];
    const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;

    return {
      date: dateStr,
      dayLabel,
      dateLabel,
      isToday: dateStr === today,
    };
  });

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {t('weeklyPlan.title')}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <DayColumnInput
            key={day.date}
            date={day.date}
            dayLabel={day.dayLabel}
            dateLabel={day.dateLabel}
            value={plans[day.date]}
            isToday={day.isToday}
            onSave={handleSave}
            placeholder={t('weeklyPlan.placeholder')}
          />
        ))}
      </div>
    </div>
  );
}
