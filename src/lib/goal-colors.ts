import { GoalType } from '@prisma/client';

export const GOAL_COLORS: Record<GoalType, {
  primary: string;
  bg: string;
  border: string;
  label: string;
}> = {
  ULTIMATE: {
    primary: '#FFD700',
    bg: 'rgba(255, 215, 0, 0.15)',
    border: 'rgba(255, 215, 0, 0.3)',
    label: 'Ultimate',
  },
  TEN_YEAR: {
    primary: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.3)',
    label: '10 Years',
  },
  FIVE_YEAR: {
    primary: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
    label: '5 Years',
  },
  ONE_YEAR: {
    primary: '#10B981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
    label: '1 Year',
  },
  SIX_MONTH: {
    primary: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.3)',
    label: '6 Months',
  },
  THREE_MONTH: {
    primary: '#F97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.3)',
    label: '3 Months',
  },
  ONE_MONTH: {
    primary: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.3)',
    label: '1 Month',
  },
  ONE_WEEK: {
    primary: '#6B7280',
    bg: 'rgba(107, 114, 128, 0.15)',
    border: 'rgba(107, 114, 128, 0.3)',
    label: '1 Week',
  },
};

export function getGoalColor(type: GoalType) {
  return GOAL_COLORS[type];
}
