'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { resizeImage, validateImageFile, MAX_FILE_SIZE_MB } from '@/lib/image-utils';

type ImageUploadProps = {
  projectId: string;
  dayIndex: number;
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export default function ImageUpload({
  projectId,
  dayIndex,
  currentImageUrl,
  onUploadComplete,
  onRemove,
  disabled = false
}: ImageUploadProps) {
  const t = useTranslations('Success.image');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'unknown');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Resize image client-side
      const resizedBlob = await resizeImage(file);
      setUploadProgress(50);

      // Create form data
      const formData = new FormData();
      formData.append('file', resizedBlob, `day-${dayIndex}.jpg`);
      formData.append('projectId', projectId);
      formData.append('dayIndex', String(dayIndex));

      // Upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { url } = await response.json();
      setPreviewUrl(url);
      onUploadComplete(url);
      setUploadProgress(100);
    } catch (err) {
      setError('uploadFailed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [projectId, dayIndex, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [disabled, isUploading, handleFileSelect]);

  const handleRemove = async () => {
    if (previewUrl && previewUrl !== currentImageUrl) {
      // Delete from storage if it's a new upload
      await fetch('/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({ url: previewUrl }),
      });
    }
    setPreviewUrl(null);
    onRemove();
  };

  // Show thumbnail if image exists
  if (previewUrl) {
    return (
      <div className="relative group">
        <div className="w-full h-32 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)] bg-white/5">
          <img
            src={previewUrl}
            alt={t('notePhoto')}
            className="w-full h-full object-cover"
          />
        </div>
        {!disabled && (
          <button
            onClick={handleRemove}
            className={cn(
              'absolute -top-2 -right-2 w-6 h-6 rounded-full',
              'bg-[#ef4444] hover:bg-[#dc2626] text-white',
              'flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'shadow-lg'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          'relative w-full h-32 rounded-lg border-2 border-dashed',
          'flex flex-col items-center justify-center gap-2',
          'transition-all duration-200',
          disabled || isUploading
            ? 'border-[rgba(255,255,255,0.05)] bg-white/[0.02] cursor-not-allowed'
            : 'border-[rgba(255,255,255,0.1)] bg-white/5 hover:border-[#06b6d4] hover:bg-[rgba(6,182,212,0.05)] cursor-pointer'
        )}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-[#06b6d4] animate-spin" />
            <span className="text-xs text-[#9ca3af]">{t('uploading')}</span>
            {/* Progress bar */}
            <div className="absolute bottom-2 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#06b6d4] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="w-8 h-8 text-[#6b7280]" />
            <span className="text-xs text-[#9ca3af]">{t('dropOrClick')}</span>
            <span className="text-xs text-[#4b5563]">{t('maxSize', { size: MAX_FILE_SIZE_MB })}</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!disabled && !isUploading && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg',
              'bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-[#e2e8f0]',
              'border border-[rgba(255,255,255,0.1)] transition-colors text-sm'
            )}
          >
            <Upload className="w-4 h-4" />
            {t('selectFile')}
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg',
              'bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-[#e2e8f0]',
              'border border-[rgba(255,255,255,0.1)] transition-colors text-sm'
            )}
          >
            <Camera className="w-4 h-4" />
            {t('takePhoto')}
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-[#ef4444]">{t(`errors.${error}`)}</p>
      )}
    </div>
  );
}
