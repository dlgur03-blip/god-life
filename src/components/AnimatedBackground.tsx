'use client';

import { useSession } from 'next-auth/react';

export default function AnimatedBackground() {
  const { data: session } = useSession();

  // Only show for authenticated users (dashboard + module pages)
  if (!session?.user) return null;

  return (
    <div className="animated-bg print:hidden" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}
