import { SystemInfo } from '@/app/actions/admin';
import { cn } from '@/lib/utils';

type SystemInfoGridProps = {
  info: SystemInfo;
  labels: {
    nodeVersion: string;
    nextVersion: string;
    reactVersion: string;
    prismaVersion: string;
    platform: string;
    timezone: string;
    locale: string;
    environment: string;
  };
};

const infoItems = [
  { key: 'nodeVersion', color: '#10b981' },
  { key: 'nextVersion', color: '#000000' },
  { key: 'reactVersion', color: '#61dafb' },
  { key: 'prismaVersion', color: '#2d3748' },
  { key: 'platform', color: '#8b5cf6' },
  { key: 'timezone', color: '#f59e0b' },
  { key: 'locale', color: '#3b82f6' },
  { key: 'environment', color: '#ef4444' }
] as const;

export default function SystemInfoGrid({ info, labels }: SystemInfoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {infoItems.map(({ key, color }) => (
        <div
          key={key}
          className={cn(
            'p-4 rounded-xl',
            'bg-[rgba(255,255,255,0.02)]',
            'border border-[rgba(255,255,255,0.05)]'
          )}
        >
          <div
            className="w-2 h-2 rounded-full mb-2"
            style={{ backgroundColor: color }}
          />
          <p className="text-xs text-[#6b7280] mb-1">
            {labels[key as keyof typeof labels]}
          </p>
          <p className="text-sm font-mono text-[#e2e8f0] truncate">
            {info[key as keyof SystemInfo]}
          </p>
        </div>
      ))}
    </div>
  );
}
