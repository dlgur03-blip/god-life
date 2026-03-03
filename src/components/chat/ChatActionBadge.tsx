'use client';

import { Check } from 'lucide-react';

interface ChatActionBadgeProps {
  text: string;
}

export default function ChatActionBadge({ text }: ChatActionBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)] border border-[var(--color-success)] border-opacity-30"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <Check className="w-3 h-3" />
      {text}
    </span>
  );
}
