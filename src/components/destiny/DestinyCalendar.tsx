'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface DestinyCalendarProps {
  currentDate: string;
}

export default function DestinyCalendar({ currentDate }: DestinyCalendarProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Destiny');
  const [isOpen, setIsOpen] = useState(false);

  const [viewDate, setViewDate] = useState(() => {
    const [year, month] = currentDate.split('-').map(Number);
    return { year, month };
  });

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleSelectDate = (day: number) => {
    const dateStr = `${viewDate.year}-${String(viewDate.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    router.push(`/${locale}/destiny/day/${dateStr}`);
    setIsOpen(false);
  };

  const handleGoToToday = () => {
    router.push(`/${locale}/destiny/day/${todayStr}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const weekDays = locale === 'ko'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : locale === 'ja'
    ? ['日', '月', '火', '水', '木', '金', '土']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNames = locale === 'ko'
    ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    : locale === 'ja'
    ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <>
      {/* Calendar Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors print:hidden"
        title={t('calendar')}
      >
        <Calendar className="w-5 h-5" />
      </button>

      {/* Calendar Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-xl w-full max-w-sm border border-[var(--color-border)]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[var(--color-card-hover)] rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {viewDate.year} {monthNames[viewDate.month - 1]}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-[var(--color-card-hover)] rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 p-2">
              {weekDays.map((day, idx) => (
                <div
                  key={day}
                  className={`text-center text-xs font-medium py-2 ${
                    idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 p-2 pt-0">
              {/* Empty cells for days before first day of month */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${viewDate.year}-${String(viewDate.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === currentDate;
                const dayOfWeek = (firstDay + i) % 7;
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;

                return (
                  <button
                    key={day}
                    onClick={() => handleSelectDate(day)}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white'
                        : isToday
                        ? 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] font-bold ring-2 ring-[var(--color-secondary)]'
                        : isSunday
                        ? 'text-red-500 hover:bg-red-500/10'
                        : isSaturday
                        ? 'text-blue-500 hover:bg-blue-500/10'
                        : 'text-[var(--foreground)] hover:bg-[var(--color-card-hover)]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)]">
              <button
                onClick={handleGoToToday}
                className="px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
              >
                {t('goToToday')}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--color-card-hover)] rounded-full transition-colors text-[var(--foreground-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
