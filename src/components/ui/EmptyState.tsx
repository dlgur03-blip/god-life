'use client';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ emoji, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
      <div className="text-5xl mb-4 animate-spring">{emoji}</div>
      <h3
        className="text-lg font-bold text-[var(--foreground)] mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--foreground-muted)] text-center max-w-xs mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
