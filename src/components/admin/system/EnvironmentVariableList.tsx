import { EnvironmentVariable } from '@/app/actions/admin';
import { cn } from '@/lib/utils';
import { Lock, Unlock } from 'lucide-react';

type EnvironmentVariableListProps = {
  variables: EnvironmentVariable[];
  labels: {
    name: string;
    value: string;
    masked: string;
    notSet: string;
  };
};

export default function EnvironmentVariableList({
  variables,
  labels
}: EnvironmentVariableListProps) {
  return (
    <div className="space-y-2">
      {/* 헤더 */}
      <div className="grid grid-cols-[1fr,2fr] gap-4 px-3 py-2 text-xs text-[#6b7280] uppercase tracking-wider">
        <span>{labels.name}</span>
        <span>{labels.value}</span>
      </div>
      {/* 변수 목록 */}
      {variables.map((variable) => (
        <div
          key={variable.name}
          className={cn(
            'grid grid-cols-[1fr,2fr] gap-4 px-3 py-3',
            'rounded-lg bg-[rgba(255,255,255,0.02)]',
            'hover:bg-[rgba(255,255,255,0.05)] transition-colors'
          )}
        >
          <div className="flex items-center gap-2">
            {variable.isMasked ? (
              <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-[#10b981]" />
            )}
            <span className="text-sm font-mono text-[#e2e8f0]">
              {variable.name}
            </span>
          </div>
          <span className={cn(
            'text-sm font-mono truncate',
            variable.value === null
              ? 'text-[#6b7280] italic'
              : variable.isMasked
                ? 'text-[#6b7280]'
                : 'text-[#9ca3af]'
          )}>
            {variable.value === null
              ? labels.notSet
              : variable.isMasked
                ? labels.masked
                : variable.value}
          </span>
        </div>
      ))}
    </div>
  );
}
