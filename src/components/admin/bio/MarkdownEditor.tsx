'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Bold, Italic, Heading1, Heading2, Heading3, Link2, List, Code, LucideIcon } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarButtonConfig = {
  icon: LucideIcon;
  prefix: string;
  suffix: string;
  titleKey: string;
  shortcut?: string;
};

const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
  { icon: Bold, prefix: '**', suffix: '**', titleKey: 'bold', shortcut: 'Ctrl+B' },
  { icon: Italic, prefix: '*', suffix: '*', titleKey: 'italic', shortcut: 'Ctrl+I' },
  { icon: Heading1, prefix: '# ', suffix: '', titleKey: 'heading1' },
  { icon: Heading2, prefix: '## ', suffix: '', titleKey: 'heading2' },
  { icon: Heading3, prefix: '### ', suffix: '', titleKey: 'heading3' },
  { icon: Link2, prefix: '[', suffix: '](url)', titleKey: 'link' },
  { icon: List, prefix: '- ', suffix: '', titleKey: 'list' },
  { icon: Code, prefix: '```\n', suffix: '\n```', titleKey: 'code' }
];

function ToolbarButton({
  icon: Icon,
  title,
  shortcut,
  onClick
}: {
  icon: LucideIcon;
  title: string;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${title} (${shortcut})` : title}
      className="p-2 rounded hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
    >
      <Icon size={18} />
    </button>
  );
}

export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  const t = useTranslations('Admin.bio.markdown');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newValue =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newValue);

    // Move cursor to appropriate position
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**');
      } else if (e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*');
      }
    }
  }, [insertMarkdown]);

  const getTitle = (titleKey: string) => {
    if (titleKey === 'heading1') return `${t('heading')} 1`;
    if (titleKey === 'heading2') return `${t('heading')} 2`;
    if (titleKey === 'heading3') return `${t('heading')} 3`;
    return t(titleKey);
  };

  return (
    <div className="border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden">
      <div className="bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.1)] p-2 flex gap-1 flex-wrap">
        {TOOLBAR_BUTTONS.map((btn, idx) => (
          <ToolbarButton
            key={idx}
            icon={btn.icon}
            title={getTitle(btn.titleKey)}
            shortcut={btn.shortcut}
            onClick={() => insertMarkdown(btn.prefix, btn.suffix)}
          />
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent resize-none min-h-[400px] p-4 text-[#e2e8f0] placeholder:text-[#6b7280] focus:outline-none"
      />
    </div>
  );
}
