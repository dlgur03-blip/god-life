'use client';

import { useEffect, useState } from 'react';
import { getUserStreak } from '@/app/actions/streak';
import { useSession } from 'next-auth/react';

export default function StreakBadge() {
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!session?.user) return;
    getUserStreak().then(s => setStreak(s.current));
  }, [session]);

  if (!session?.user || streak === 0) return null;

  const level = streak >= 100 ? 3 : streak >= 30 ? 2 : streak >= 7 ? 1 : 0;
  const fireClass = level >= 2 ? 'animate-fire' : '';

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 text-xs font-bold ${fireClass}`}
      style={{
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'color-mix(in srgb, var(--color-secondary) 10%, transparent)',
        color: 'var(--color-secondary)',
      }}
      title={`${streak}일 연속 갓생!`}
    >
      <span>{level >= 3 ? '🔥' : level >= 2 ? '🔥' : level >= 1 ? '🔥' : '⚡'}</span>
      <span>{streak}</span>
    </div>
  );
}
