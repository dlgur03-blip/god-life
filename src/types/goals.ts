import { GoalType, GoalStatus } from '@prisma/client';

export type { GoalType, GoalStatus };

export type Goal = {
  id: string;
  userId: string;
  type: GoalType;
  title: string;
  description: string | null;
  parentId: string | null;
  startDate: Date | null;
  targetDate: Date | null;
  progress: number;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type GoalWithChildren = Goal & {
  children: GoalWithChildren[];
  parent?: Goal | null;
};

export type GoalHierarchy = {
  [key in GoalType]?: GoalWithChildren[];
};

export type CreateGoalInput = {
  type: GoalType;
  title: string;
  description?: string;
  parentId?: string;
  startDate?: Date;
  targetDate?: Date;
};

export type UpdateGoalInput = {
  title?: string;
  description?: string | null;
  parentId?: string | null;
  startDate?: Date | null;
  targetDate?: Date | null;
  progress?: number;
  status?: GoalStatus;
};

// Goal type hierarchy order (parent -> child)
export const GOAL_TYPE_ORDER: GoalType[] = [
  'ULTIMATE',
  'TEN_YEAR',
  'FIVE_YEAR',
  'ONE_YEAR',
  'SIX_MONTH',
  'THREE_MONTH',
  'ONE_MONTH',
  'ONE_WEEK',
];

// Get valid parent types for a goal type
export function getValidParentTypes(type: GoalType): GoalType[] {
  const index = GOAL_TYPE_ORDER.indexOf(type);
  if (index <= 0) return [];
  return GOAL_TYPE_ORDER.slice(0, index);
}

// Get valid child types for a goal type
export function getValidChildTypes(type: GoalType): GoalType[] {
  const index = GOAL_TYPE_ORDER.indexOf(type);
  if (index === -1 || index >= GOAL_TYPE_ORDER.length - 1) return [];
  return GOAL_TYPE_ORDER.slice(index + 1);
}
