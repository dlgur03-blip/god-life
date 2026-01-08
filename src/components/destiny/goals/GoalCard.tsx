'use client';

import { useState } from 'react';
import { GoalWithChildren } from '@/types/goals';
import { GOAL_COLORS } from '@/lib/goal-colors';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import GoalProgressBar from './GoalProgressBar';
import GoalStatusBadge from './GoalStatusBadge';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';

interface GoalCardProps {
  goal: GoalWithChildren;
  depth?: number;
  onEdit: (goal: GoalWithChildren) => void;
  onDelete: (goalId: string) => void;
  onAddChild: (parentId: string) => void;
}

export default function GoalCard({
  goal,
  depth = 0,
  onEdit,
  onDelete,
  onAddChild,
}: GoalCardProps) {
  const t = useTranslations('Goals');
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const colors = GOAL_COLORS[goal.type];
  const hasChildren = goal.children && goal.children.length > 0;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'group rounded-xl border p-4 transition-all',
          'hover:shadow-lg'
        )}
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          marginLeft: depth > 0 ? `${depth * 16}px` : 0,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded transition-colors mt-0.5"
            >
              {isExpanded ? (
                <ChevronDown size={16} style={{ color: colors.primary }} />
              ) : (
                <ChevronRight size={16} style={{ color: colors.primary }} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-7" />}

          {/* Goal Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: colors.primary }}
              >
                {t(`types.${goal.type.toLowerCase()}`)}
              </span>
              <GoalStatusBadge status={goal.status} />
            </div>
            <h3 className="text-base font-medium text-gray-200 truncate">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {goal.description}
              </p>
            )}
            <div className="mt-3">
              <GoalProgressBar progress={goal.progress} color={colors.primary} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onAddChild(goal.id)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={t('addChild')}
            >
              <Plus size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => onEdit(goal)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={t('edit')}
            >
              <Edit2 size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title={t('delete')}
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {goal.children.map((child) => (
            <GoalCard
              key={child.id}
              goal={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
