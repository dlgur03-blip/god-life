'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Compass, ClipboardList, Trophy, Activity, Mail, Wallet, Brain, MessageCircle, Sparkles,
} from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  compass: Compass,
  clipboardList: ClipboardList,
  trophy: Trophy,
  activity: Activity,
  mail: Mail,
  wallet: Wallet,
  brain: Brain,
  messageCircle: MessageCircle,
};

const statusColorMap: Record<string, string> = {
  muted: 'text-[var(--foreground-muted)]',
  primary: 'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)]',
  success: 'text-[var(--color-success)]',
  info: 'text-[var(--color-info)]',
};

export interface ModuleCardData {
  name: string;
  href: string;
  iconKey: string;
  desc: string;
  status: { label: string; color: string };
  moduleColor: string;
  aiPrompt?: string; // if set, shows "AI로 채우기" button
}

export default function DashboardModules({ modules }: { modules: ModuleCardData[] }) {
  const router = useRouter();
  const t = useTranslations('Home');

  const handleAiChat = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt } }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mt-4 md:mt-8">
      {modules.map((m) => {
        const Icon = iconMap[m.iconKey] || Compass;
        return (
          <div
            key={m.name}
            onClick={() => router.push(m.href)}
            className="card-hover border border-[var(--color-border)] p-5 sm:p-8 flex flex-col items-center gap-3 sm:gap-4 text-center cursor-pointer group relative overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <Icon
              className="w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300"
              style={{ color: m.moduleColor }}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">
              {m.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">{m.desc}</p>

            {/* Status Badge */}
            <div
              className={`mt-1 px-3 py-1 text-xs font-medium border border-[var(--color-border)] ${statusColorMap[m.status.color] || statusColorMap.muted}`}
              style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-card-bg)' }}
            >
              {m.status.label}
            </div>

            {/* AI Assist Button */}
            {m.aiPrompt && (
              <button
                onClick={(e) => handleAiChat(m.aiPrompt!, e)}
                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-secondary)] border border-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-200"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <Sparkles className="w-3 h-3" />
                {t('aiAssist')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
