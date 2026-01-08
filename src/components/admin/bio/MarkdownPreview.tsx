'use client';

import ReactMarkdown from 'react-markdown';

type Props = {
  content: string;
};

export default function MarkdownPreview({ content }: Props) {
  if (!content) {
    return (
      <div className="min-h-[400px] p-4 text-[#6b7280] italic">
        No content to preview...
      </div>
    );
  }

  return (
    <div className="min-h-[400px] p-4 prose prose-invert prose-sm max-w-none prose-headings:text-[#e2e8f0] prose-p:text-[#9ca3af] prose-strong:text-[#e2e8f0] prose-code:text-[#10b981] prose-a:text-[#8b5cf6] prose-ul:text-[#9ca3af] prose-ol:text-[#9ca3af] prose-li:text-[#9ca3af]">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
