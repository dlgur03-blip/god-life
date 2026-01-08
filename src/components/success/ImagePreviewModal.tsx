'use client';

import { useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ImagePreviewModalProps = {
  isOpen: boolean;
  imageUrl: string;
  dayIndex: number;
  onClose: () => void;
};

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  dayIndex,
  onClose
}: ImagePreviewModalProps) {
  const t = useTranslations('Success.image');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        'relative z-10 w-full h-full max-w-4xl max-h-[90vh] mx-4 my-8',
        'flex flex-col',
        'animate-in fade-in zoom-in-95 duration-200'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#050b14]/90 rounded-t-2xl border border-[rgba(255,255,255,0.1)] border-b-0">
          <h3 className="text-lg font-bold text-[#e2e8f0]">
            {t('dayPhoto', { day: dayIndex })}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-[#9ca3af] hover:text-white transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container with Zoom */}
        <div className="flex-1 bg-[#050b14]/90 border-x border-[rgba(255,255,255,0.1)] overflow-hidden relative">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={() => zoomIn()}
                    className={cn(
                      'p-2 rounded-lg',
                      'bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.8)]',
                      'text-white transition-colors'
                    )}
                    aria-label={t('zoomIn')}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className={cn(
                      'p-2 rounded-lg',
                      'bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.8)]',
                      'text-white transition-colors'
                    )}
                    aria-label={t('zoomOut')}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className={cn(
                      'p-2 rounded-lg',
                      'bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.8)]',
                      'text-white transition-colors'
                    )}
                    aria-label={t('resetZoom')}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={imageUrl}
                    alt={t('notePhotoAlt', { day: dayIndex })}
                    className="max-w-full max-h-full object-contain"
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* Footer hint */}
        <div className="p-3 bg-[#050b14]/90 rounded-b-2xl border border-[rgba(255,255,255,0.1)] border-t-0 text-center">
          <p className="text-xs text-[#6b7280]">{t('pinchToZoom')}</p>
        </div>
      </div>
    </div>
  );
}
