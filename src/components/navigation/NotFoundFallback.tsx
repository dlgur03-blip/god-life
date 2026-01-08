'use client';

import { Link } from '@/navigation';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundFallbackProps {
  title: string;
  message: string;
  backHref?: string;
  backLabel?: string;
  homeLabel: string;
  showHomeButton?: boolean;
}

export default function NotFoundFallback({
  title,
  message,
  backHref,
  backLabel,
  homeLabel,
  showHomeButton = true
}: NotFoundFallbackProps) {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] rounded-2xl p-10 text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-[#ffffff] mb-4">{title}</h1>
        <p className="text-[#9ca3af] mb-8">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] rounded-lg text-[#ffffff] hover:border-[#06b6d4]/50 hover:bg-[rgba(255,255,255,0.10)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          )}
          {showHomeButton && (
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#06b6d4]/20 border border-[#06b6d4] rounded-lg text-[#06b6d4] hover:bg-[#06b6d4] hover:text-black transition-all"
            >
              <Home className="w-4 h-4" />
              {homeLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
