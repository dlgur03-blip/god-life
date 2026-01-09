'use client';

import { useTheme, ThemeName } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

const themes: { id: ThemeName; preview: { bg: string; accent: string; text: string } }[] = [
  {
    id: 'dior',
    preview: { bg: '#f8f6f3', accent: '#c9a96e', text: '#1a1a1a' },
  },
  {
    id: 'cyber',
    preview: { bg: '#050b14', accent: '#06b6d4', text: '#e2e8f0' },
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('MyPage.theme');

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((themeOption) => (
        <button
          key={themeOption.id}
          onClick={() => setTheme(themeOption.id)}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            theme === themeOption.id
              ? 'border-[var(--color-secondary)] shadow-lg'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
          }`}
        >
          {/* Theme Preview */}
          <div
            className="w-full h-24 rounded-md mb-3 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: themeOption.preview.bg }}
          >
            <div className="text-center">
              <div
                className="text-xs font-bold tracking-widest mb-1"
                style={{ color: themeOption.preview.text }}
              >
                GOD LIFE
              </div>
              <div
                className="w-12 h-1 mx-auto rounded-full"
                style={{ backgroundColor: themeOption.preview.accent }}
              />
            </div>
          </div>

          {/* Theme Name */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--foreground)]">
                {t(`options.${themeOption.id}.name`)}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                {t(`options.${themeOption.id}.description`)}
              </p>
            </div>

            {theme === themeOption.id && (
              <div className="w-6 h-6 rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
