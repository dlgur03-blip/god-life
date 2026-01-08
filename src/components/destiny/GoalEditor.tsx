'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type GoalVariant = 'ultimate' | 'longTerm' | 'month' | 'week' | 'today';

const variantColors: Record<GoalVariant, { border: string; text: string; bg: string }> = {
  ultimate: { border: 'border-[#FFD700]', text: 'text-[#FFD700]', bg: 'bg-[rgba(255,215,0,0.1)]' },
  longTerm: { border: 'border-[#8B5CF6]', text: 'text-[#8B5CF6]', bg: 'bg-[rgba(139,92,246,0.1)]' },
  month: { border: 'border-[#10B981]', text: 'text-[#10B981]', bg: 'bg-[rgba(16,185,129,0.1)]' },
  week: { border: 'border-[#06b6d4]', text: 'text-[#06b6d4]', bg: 'bg-[rgba(6,182,212,0.1)]' },
  today: { border: 'border-[#f59e0b]', text: 'text-[#f59e0b]', bg: 'bg-[rgba(245,158,11,0.1)]' },
};

interface GoalEditorProps {
  label: string;
  value: string | null;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  variant?: GoalVariant;
}

export default function GoalEditor({ label, value, onSave, placeholder, variant = 'week' }: GoalEditorProps) {
  const colors = variantColors[variant];
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value || '');
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async (newValue: string) => {
    if (newValue === (value || '')) return;

    setIsSaving(true);
    try {
      await onSave(newValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (newValue: string) => {
    setInputValue(newValue);

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer (500ms)
    debounceRef.current = setTimeout(() => {
      handleSave(newValue);
    }, 500);
  };

  const handleBlur = () => {
    // Clear debounce and save immediately on blur
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    handleSave(inputValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value || '');
      setIsEditing(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span className={cn("w-24 text-xs font-bold uppercase text-right shrink-0", colors.text)}>
        {label}
      </span>
      <div className="flex-1 relative">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full h-8 bg-black/20 rounded border px-3 text-sm text-gray-200 outline-none transition-all",
              colors.border,
              isSaving && colors.bg
            )}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={cn(
              "flex-1 h-8 bg-black/20 rounded border border-[rgba(255,255,255,0.05)] flex items-center px-3 text-sm cursor-pointer transition-all",
              "hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]",
              inputValue ? "text-gray-300" : "text-gray-500"
            )}
          >
            {inputValue || placeholder || '-'}
          </div>
        )}
        {isSaving && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className={cn("w-4 h-4 border-2 border-t-transparent rounded-full animate-spin", colors.border)} />
          </div>
        )}
      </div>
    </div>
  );
}
