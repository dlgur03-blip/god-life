'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Compass, ClipboardList, Trophy, Activity, Mail, Wallet, Brain, MessageCircle, Sparkles, Radio,
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
  radio: Radio,
};

const statusColorMap: Record<string, string> = {
  muted: 'text-[var(--foreground-muted)]',
  primary: 'text-[var(--color-primary)]',
  secondary: 'text-[var(--color-secondary)]',
  accent: 'text-[var(--color-accent)]',
  success: 'text-[var(--color-success)]',
  info: 'text-[var(--color-info)]',
};

// Module gradient mapping for left stripe
const moduleGradientMap: Record<string, string> = {
  'var(--color-destiny)': 'var(--gradient-destiny)',
  'var(--color-primary)': 'var(--gradient-taskboard)',
  'var(--color-success-module)': 'var(--gradient-success)',
  'var(--color-discipline)': 'var(--gradient-discipline)',
  'var(--color-epistle)': 'var(--gradient-epistle)',
  'var(--color-money)': 'var(--gradient-money)',
  'var(--color-secondary)': 'var(--gradient-met)',
};

export interface ModuleCardData {
  name: string;
  href: string;
  iconKey: string;
  desc: string;
  status: { label: string; color: string };
  moduleColor: string;
  aiPrompt?: string;
}

export default function DashboardModules({ modules }: { modules: ModuleCardData[] }) {
  const router = useRouter();
  const t = useTranslations('Home');

  const handleAiChat = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="w-full max-w-5xl mt-4 md:mt-8 flex flex-col gap-4 md:gap-5">
      {/* Destiny Navigator — Full-width hero card */}
      {modules[0] && (
        <ModuleCard
          m={modules[0]}
          index={0}
          variant="hero"
          router={router}
          t={t}
          handleAiChat={handleAiChat}
        />
      )}

      {/* TaskBoard + Discipline — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {modules.slice(1, 3).map((m, i) => (
          <ModuleCard key={m.name} m={m} index={i + 1} router={router} t={t} handleAiChat={handleAiChat} />
        ))}
      </div>

      {/* Success + Epistle + Money — 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {modules.slice(3, 6).map((m, i) => (
          <ModuleCard key={m.name} m={m} index={i + 3} router={router} t={t} handleAiChat={handleAiChat} />
        ))}
      </div>

      {/* MET + AI Coach — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {modules.slice(6).map((m, i) => (
          <ModuleCard key={m.name} m={m} index={i + 6} router={router} t={t} handleAiChat={handleAiChat} />
        ))}
      </div>
    </div>
  );
}

function ModuleCard({
  m,
  index,
  variant,
  router,
  t,
  handleAiChat,
}: {
  m: ModuleCardData;
  index: number;
  variant?: 'hero';
  router: ReturnType<typeof useRouter>;
  t: ReturnType<typeof useTranslations>;
  handleAiChat: (prompt: string, e: React.MouseEvent) => void;
}) {
  const Icon = iconMap[m.iconKey] || Compass;
  const gradient = moduleGradientMap[m.moduleColor] || 'var(--gradient-destiny)';

  return (
    <div
      onClick={() => router.push(m.href)}
      className={`module-card cursor-pointer group animate-fade-in-up stagger-${index + 1} ${
        variant === 'hero' ? 'p-5 sm:p-7' : 'p-4 sm:p-5'
      }`}
      style={{ '--module-gradient': gradient } as React.CSSProperties}
    >
      <div className="flex items-start gap-4">
        {/* Icon with colored background */}
        <div
          className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${m.moduleColor} 10%, transparent)` }}
        >
          <Icon
            className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300"
            style={{ color: m.moduleColor }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className={`font-bold text-[var(--foreground)] group-hover:text-[var(--color-secondary)] transition-colors duration-300 ${
                variant === 'hero' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              }`} style={{ fontFamily: 'var(--font-display)' }}>
                {m.name}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">{m.desc}</p>
            </div>

            {/* Status Badge — top-right */}
            <div
              className={`flex-shrink-0 px-2.5 py-1 text-[10px] sm:text-xs font-medium border border-[var(--color-border)] ${statusColorMap[m.status.color] || statusColorMap.muted}`}
              style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-card-bg)' }}
            >
              {m.status.label}
            </div>
          </div>

          {/* AI Assist Button — bottom */}
          {m.aiPrompt && (
            <button
              onClick={(e) => handleAiChat(m.aiPrompt!, e)}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <Sparkles className="w-3 h-3" />
              {t('aiAssist')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
