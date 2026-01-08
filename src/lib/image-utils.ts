export const MAX_IMAGE_DIMENSION = 1920;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const JPEG_QUALITY = 0.85;

// Supported file types - HEIC included for validation but converted on upload
export const VALID_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export type ValidationResult = {
  valid: boolean;
  error?: 'invalidFileType' | 'fileTooLarge' | 'unknownError';
  isHEIC?: boolean;
};

export function validateImageFile(file: File): ValidationResult {
  const fileType = file.type.toLowerCase();
  const isHEIC = fileType === 'image/heic' || fileType === 'image/heif' ||
                 file.name.toLowerCase().endsWith('.heic') ||
                 file.name.toLowerCase().endsWith('.heif');

  // For HEIC files without proper MIME type, check extension
  if (!VALID_FILE_TYPES.includes(fileType) && !isHEIC) {
    return { valid: false, error: 'invalidFileType' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'fileTooLarge' };
  }

  return { valid: true, isHEIC };
}

export async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Clean up object URL
      URL.revokeObjectURL(img.src);

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_IMAGE_DIMENSION);
          width = MAX_IMAGE_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_IMAGE_DIMENSION);
          height = MAX_IMAGE_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Use better image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}
