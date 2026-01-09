'use client';

import { useTranslations } from 'next-intl';
import { User, Calendar } from 'lucide-react';
import Image from 'next/image';

interface UserProfileProps {
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export default function UserProfile({ name, email, image, createdAt }: UserProfileProps) {
  const t = useTranslations('MyPage.profile');

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)]">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--color-secondary)]/20 flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={name || 'User'}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-[var(--color-secondary)]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            {name || t('anonymous')}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">{email}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-[var(--foreground-muted)]">
            <Calendar className="w-3 h-3" />
            <span>{t('memberSince', { date: formattedDate })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
