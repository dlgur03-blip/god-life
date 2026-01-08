import { EnvironmentVariable } from '@/app/actions/admin';
import { cn } from '@/lib/utils';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';

const REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

type EnvironmentVariableListEnhancedProps = {
  variables: EnvironmentVariable[];
  labels: {
    name: string;
    value: string;
    masked: string;
    notSet: string;
    requiredMissing: string;
  };
};

export default function EnvironmentVariableListEnhanced({
  variables,
  labels
}: EnvironmentVariableListEnhancedProps) {
  const missingRequired = variables.filter(
    v => REQUIRED_ENV_KEYS.includes(v.name) && v.value === null
  );

  return (
    <div className="space-y-4">
      {/* 누락된 필수 변수 경고 */}
      {missingRequired.length > 0 && (
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-xl',
          'bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)]'
        )}>
          <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#f59e0b]">
              {labels.requiredMissing}
            </p>
            <p className="text-xs text-[#9ca3af] mt-1">
              {missingRequired.map(v => v.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* 변수 목록 */}
      <div className="space-y-2">
        {/* 헤더 */}
        <div className="grid grid-cols-[1fr,2fr] gap-4 px-3 py-2 text-xs text-[#6b7280] uppercase tracking-wider">
          <span>{labels.name}</span>
          <span>{labels.value}</span>
        </div>
        {/* 변수 목록 */}
        {variables.map((variable) => {
          const isRequired = REQUIRED_ENV_KEYS.includes(variable.name);
          const isMissing = isRequired && variable.value === null;

          return (
            <div
              key={variable.name}
              className={cn(
                'grid grid-cols-[1fr,2fr] gap-4 px-3 py-3',
                'rounded-lg transition-colors',
                isMissing
                  ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]'
                  : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)]'
              )}
            >
              <div className="flex items-center gap-2">
                {variable.isMasked ? (
                  <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-[#10b981]" />
                )}
                <span className={cn(
                  'text-sm font-mono',
                  isMissing ? 'text-[#f59e0b]' : 'text-[#e2e8f0]'
                )}>
                  {variable.name}
                </span>
                {isRequired && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(139,92,246,0.2)] text-[#8b5cf6]">
                    Required
                  </span>
                )}
              </div>
              <span className={cn(
                'text-sm font-mono truncate',
                variable.value === null
                  ? 'text-[#ef4444] italic'
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
          );
        })}
      </div>
    </div>
  );
}
