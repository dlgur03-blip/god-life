'use client';

import { CheckCircle } from 'lucide-react';

type ErrorLogEmptyStateProps = {
  labels: {
    noLogs: string;
    systemHealthy: string;
  };
};

export default function ErrorLogEmptyState({ labels }: ErrorLogEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
      <div className="p-4 rounded-full bg-[rgba(16,185,129,0.2)] mb-4">
        <CheckCircle className="w-8 h-8 text-[#10b981]" />
      </div>
      <p className="text-[#e2e8f0] font-medium mb-1">{labels.noLogs}</p>
      <p className="text-[#9ca3af] text-sm">{labels.systemHealthy}</p>
    </div>
  );
}
