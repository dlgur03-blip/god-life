'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const t = useTranslations('Common');

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-[#ef4444]',
      button: 'bg-[#ef4444] hover:bg-[#dc2626] text-white'
    },
    warning: {
      icon: 'text-[#f59e0b]',
      button: 'bg-[#f59e0b] hover:bg-[#d97706] text-black'
    },
    default: {
      icon: 'text-[#06b6d4]',
      button: 'bg-[#06b6d4] hover:bg-[#0891b2] text-black'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className={cn(
        'relative z-10 w-full max-w-md mx-4',
        'bg-[#050b14] border border-[rgba(255,255,255,0.1)]',
        'rounded-2xl p-6 shadow-2xl',
        'animate-in fade-in zoom-in-95 duration-200'
      )}>
        <div className="flex items-start gap-4">
          <div className={cn('p-2 rounded-full bg-white/5', styles.icon)}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#e2e8f0] mb-2">
              {title || t('dialog.confirmTitle')}
            </h3>
            <p className="text-sm text-[#9ca3af]">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium',
              'bg-white/5 hover:bg-white/10 text-[#e2e8f0]',
              'border border-[rgba(255,255,255,0.1)]',
              'transition-colors'
            )}
          >
            {cancelLabel || t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-bold',
              'transition-colors',
              styles.button
            )}
          >
            {confirmLabel || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
