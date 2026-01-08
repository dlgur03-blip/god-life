'use client';

import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import type { ErrorLogSummary } from '@/app/actions/admin';

type ErrorLogSummaryStatsProps = {
  summary: ErrorLogSummary;
  labels: {
    totalErrors: string;
    totalWarnings: string;
    totalInfo: string;
    recent24h: string;
  };
};

export default function ErrorLogSummaryStats({ summary, labels }: ErrorLogSummaryStatsProps) {
  const stats = [
    {
      label: labels.totalErrors,
      value: summary.totalErrors,
      icon: AlertCircle,
      color: 'text-[#ef4444]',
      bgColor: 'bg-[rgba(239,68,68,0.1)]'
    },
    {
      label: labels.totalWarnings,
      value: summary.totalWarnings,
      icon: AlertTriangle,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[rgba(245,158,11,0.1)]'
    },
    {
      label: labels.totalInfo,
      value: summary.totalInfo,
      icon: Info,
      color: 'text-[#06b6d4]',
      bgColor: 'bg-[rgba(6,182,212,0.1)]'
    },
    {
      label: labels.recent24h,
      value: summary.recentCount24h,
      icon: Clock,
      color: 'text-[#8b5cf6]',
      bgColor: 'bg-[rgba(139,92,246,0.1)]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e2e8f0]">{stat.value}</p>
              <p className="text-sm text-[#9ca3af]">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
