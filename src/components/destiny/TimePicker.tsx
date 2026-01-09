'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { TIME_CONFIG } from '@/lib/time-utils';

type TimePickerProps = {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  disabled?: boolean;
};

export default function TimePicker({ value, onChange, label, disabled }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate time options (5-minute increments per TIME_CONFIG.INTERVAL)
  const timeOptions: string[] = [];
  for (let h = TIME_CONFIG.MIN_HOUR; h < 24; h++) {
    for (let m = 0; m < 60; m += TIME_CONFIG.INTERVAL) {
      timeOptions.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  timeOptions.push('24:00'); // Allow 24:00 as end time

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  // Scroll to selected time when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const dropdown = containerRef.current?.querySelector('[data-dropdown]');
      const selected = dropdown?.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {label && <span className="text-xs text-[#6b7280] mr-2">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-mono",
          "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]",
          "hover:border-[#06b6d4] hover:bg-[rgba(255,255,255,0.1)] transition-all",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Clock size={14} className="text-[#06b6d4]" />
        <span className="text-[#e2e8f0]">{value}</span>
      </button>

      {isOpen && (
        <div
          data-dropdown
          className="absolute z-50 mt-1 w-24 max-h-48 overflow-y-auto rounded-lg bg-[#050b14] border border-[rgba(255,255,255,0.1)] shadow-lg"
        >
          {timeOptions.map((time) => (
            <button
              key={time}
              data-selected={time === value}
              onClick={() => handleSelect(time)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(time);
                }
              }}
              role="option"
              aria-selected={time === value}
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm font-mono",
                "hover:bg-[rgba(6,182,212,0.2)] transition-colors",
                time === value ? "bg-[rgba(6,182,212,0.3)] text-[#06b6d4]" : "text-[#e2e8f0]"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
