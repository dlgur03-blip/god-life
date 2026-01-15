'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { updateWeeklyPlan, deleteWeeklyPlan } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';

interface WeeklyPlanGridProps {
  initialPlans: Array<{ id: string; content: string }>;
  readOnly?: boolean;
}

interface PlanBoxProps {
  index: number;
  id: string | null;
  content: string;
  onSave: (index: number, content: string) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  placeholder: string;
  readOnly?: boolean;
}

function PlanBox({ index, id, content, onSave, onDelete, placeholder, readOnly = false }: PlanBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(content);
    }
  }, [content, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const handleSave = async (newValue: string) => {
    if (newValue === content) return;

    // If empty and had content before, delete
    if (!newValue.trim() && id) {
      setIsSaving(true);
      try {
        await onDelete(index);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!newValue.trim()) return;

    setIsSaving(true);
    try {
      await onSave(index, newValue);
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
    }, 800);
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
        "flex-1 min-w-[120px] rounded-lg border p-3 transition-all",
        "border-[var(--color-border)] bg-[var(--background-secondary)]",
        "hover:border-[var(--color-border-hover)] hover:bg-[var(--color-card-hover)]",
        isEditing && "border-[var(--color-secondary)] bg-[var(--color-secondary)]/5"
      )}
    >
      <div className="text-center mb-2">
        <div className="text-xs font-bold text-[var(--foreground-muted)]">
          {index + 1}
        </div>
      </div>

      <div className="relative min-h-[80px]">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              "w-full h-full min-h-[80px] bg-transparent rounded border-none px-1 py-1 text-sm text-[var(--foreground)] outline-none resize-none",
              "placeholder:text-[var(--foreground-muted)]"
            )}
          />
        ) : (
          <div
            onClick={() => !readOnly && setIsEditing(true)}
            className={cn(
              "w-full h-full min-h-[80px] px-1 py-1 text-sm whitespace-pre-wrap break-words",
              readOnly ? "cursor-default opacity-70" : "cursor-pointer",
              inputValue ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"
            )}
          >
            {inputValue || placeholder}
          </div>
        )}
        {isSaving && (
          <div className="absolute right-1 top-1">
            <div className="w-3 h-3 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeeklyPlanGrid({ initialPlans, readOnly = false }: WeeklyPlanGridProps) {
  const t = useTranslations('Destiny');
  const [plans, setPlans] = useState<Array<{ id: string | null; content: string }>>(
    // Ensure we always have 7 slots
    Array.from({ length: 7 }, (_, i) => ({
      id: initialPlans[i]?.id ?? null,
      content: initialPlans[i]?.content ?? ''
    }))
  );

  useEffect(() => {
    setPlans(
      Array.from({ length: 7 }, (_, i) => ({
        id: initialPlans[i]?.id ?? null,
        content: initialPlans[i]?.content ?? ''
      }))
    );
  }, [initialPlans]);

  const handleSave = async (index: number, content: string) => {
    const result = await updateWeeklyPlan(index, content);
    if (result?.id) {
      setPlans(prev => {
        const newPlans = [...prev];
        newPlans[index] = { id: result.id, content };
        return newPlans;
      });
    }
  };

  const handleDelete = async (index: number) => {
    const plan = plans[index];
    if (plan.id) {
      await deleteWeeklyPlan(plan.id);
      setPlans(prev => {
        const newPlans = [...prev];
        newPlans[index] = { id: null, content: '' };
        return newPlans;
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
        {t('weeklyPlan.title')}
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {plans.map((plan, index) => (
          <PlanBox
            key={index}
            index={index}
            id={plan.id}
            content={plan.content}
            onSave={handleSave}
            onDelete={handleDelete}
            placeholder={t('weeklyPlan.freeformPlaceholder')}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
