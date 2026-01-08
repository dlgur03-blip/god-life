'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Edit3 } from 'lucide-react';
import type { TranslationInput } from '@/types/bio';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';

type Props = {
  value: TranslationInput;
  onChange: (value: TranslationInput) => void;
};

export default function TranslationEditor({ value, onChange }: Props) {
  const t = useTranslations('Admin.bio');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#e2e8f0] mb-1">
          {t('form.titlePlaceholder')}
        </label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder={t('form.titlePlaceholder')}
          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-[#e2e8f0] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-[#e2e8f0]">
            {t('form.contentPlaceholder')}
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                !showPreview
                  ? 'bg-[rgba(139,92,246,0.2)] text-[#8b5cf6]'
                  : 'text-[#9ca3af] hover:text-[#e2e8f0]'
              }`}
            >
              <Edit3 size={14} />
              {t('editor')}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                showPreview
                  ? 'bg-[rgba(139,92,246,0.2)] text-[#8b5cf6]'
                  : 'text-[#9ca3af] hover:text-[#e2e8f0]'
              }`}
            >
              <Eye size={14} />
              {t('preview')}
            </button>
          </div>
        </div>

        {showPreview ? (
          <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.02)]">
            <MarkdownPreview content={value.content} />
          </div>
        ) : (
          <MarkdownEditor
            value={value.content}
            onChange={(content) => onChange({ ...value, content })}
            placeholder={t('form.contentPlaceholder')}
          />
        )}
      </div>
    </div>
  );
}
