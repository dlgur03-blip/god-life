'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ActionResult, success, error } from '@/lib/errors';
import { GoalType, GoalStatus } from '@prisma/client';
import {
  Goal,
  GoalWithChildren,
  CreateGoalInput,
  UpdateGoalInput,
  getValidParentTypes,
} from '@/types/goals';

// Helper to get current user
async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error('User not found');
  return user;
}

// Validate parent-child relationship
function validateHierarchy(childType: GoalType, parentType: GoalType): boolean {
  const validParents = getValidParentTypes(childType);
  return validParents.includes(parentType);
}

// CREATE GOAL
export async function createGoal(
  input: CreateGoalInput
): Promise<ActionResult<Goal>> {
  try {
    const user = await getUser();

    // Validate parent relationship if parentId is provided
    if (input.parentId) {
      const parentGoal = await prisma.goal.findUnique({
        where: { id: input.parentId },
      });

      if (!parentGoal || parentGoal.userId !== user.id) {
        return error('INVALID_GOAL_PARENT');
      }

      if (!validateHierarchy(input.type, parentGoal.type)) {
        return error('INVALID_GOAL_TYPE_HIERARCHY');
      }
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        type: input.type,
        title: input.title,
        description: input.description,
        parentId: input.parentId,
        startDate: input.startDate,
        targetDate: input.targetDate,
      },
    });

    revalidatePath('/destiny/goals');
    return success(goal as Goal);
  } catch (e) {
    console.error('[createGoal] Error:', e);
    if (e instanceof Error && e.message === 'Unauthorized') {
      return error('UNAUTHORIZED');
    }
    return error('GOAL_CREATE_FAILED');
  }
}

// UPDATE GOAL
export async function updateGoal(
  goalId: string,
  input: UpdateGoalInput
): Promise<ActionResult<Goal>> {
  try {
    const user = await getUser();

    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal || existingGoal.userId !== user.id) {
      return error('GOAL_NOT_FOUND');
    }

    // Validate new parent if changing
    if (input.parentId !== undefined && input.parentId !== null) {
      const parentGoal = await prisma.goal.findUnique({
        where: { id: input.parentId },
      });

      if (!parentGoal || parentGoal.userId !== user.id) {
        return error('INVALID_GOAL_PARENT');
      }

      if (!validateHierarchy(existingGoal.type, parentGoal.type)) {
        return error('INVALID_GOAL_TYPE_HIERARCHY');
      }
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title: input.title,
        description: input.description,
        parentId: input.parentId,
        startDate: input.startDate,
        targetDate: input.targetDate,
        progress: input.progress,
        status: input.status,
      },
    });

    // Auto-update parent progress when child completes
    if (input.status === 'COMPLETED' && existingGoal.parentId) {
      await updateParentProgress(existingGoal.parentId);
    }

    revalidatePath('/destiny/goals');
    return success(goal as Goal);
  } catch (e) {
    console.error('[updateGoal] Error:', e);
    return error('GOAL_UPDATE_FAILED');
  }
}

// DELETE GOAL
export async function deleteGoal(goalId: string): Promise<ActionResult<void>> {
  try {
    const user = await getUser();

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal || goal.userId !== user.id) {
      return error('GOAL_NOT_FOUND');
    }

    await prisma.goal.delete({ where: { id: goalId } });

    revalidatePath('/destiny/goals');
    return success(undefined);
  } catch (e) {
    console.error('[deleteGoal] Error:', e);
    return error('GOAL_DELETE_FAILED');
  }
}

// GET GOALS BY TYPE
export async function getGoalsByType(
  type: GoalType
): Promise<ActionResult<Goal[]>> {
  try {
    const user = await getUser();

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        type: type,
      },
      orderBy: { createdAt: 'desc' },
    });

    return success(goals as Goal[]);
  } catch (e) {
    console.error('[getGoalsByType] Error:', e);
    if (e instanceof Error && e.message === 'Unauthorized') {
      return error('UNAUTHORIZED');
    }
    return error('UNKNOWN');
  }
}

// GET FULL GOAL HIERARCHY
export async function getGoalHierarchy(): Promise<ActionResult<GoalWithChildren[]>> {
  try {
    const user = await getUser();

    // Fetch all goals with recursive children
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        parentId: null, // Start from root goals
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: {
                      include: {
                        children: {
                          include: {
                            children: {
                              include: {
                                children: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return success(goals as GoalWithChildren[]);
  } catch (e) {
    console.error('[getGoalHierarchy] Error:', e);
    if (e instanceof Error && e.message === 'Unauthorized') {
      return error('UNAUTHORIZED');
    }
    return error('UNKNOWN');
  }
}

// GET GOAL WITH CHILDREN
export async function getGoalWithChildren(
  goalId: string
): Promise<ActionResult<GoalWithChildren>> {
  try {
    const user = await getUser();

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        parent: true,
        children: {
          include: {
            children: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!goal || goal.userId !== user.id) {
      return error('GOAL_NOT_FOUND');
    }

    return success(goal as GoalWithChildren);
  } catch (e) {
    console.error('[getGoalWithChildren] Error:', e);
    return error('UNKNOWN');
  }
}

// UPDATE GOAL PROGRESS
export async function updateGoalProgress(
  goalId: string,
  progress: number
): Promise<ActionResult<Goal>> {
  try {
    const user = await getUser();

    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal || existingGoal.userId !== user.id) {
      return error('GOAL_NOT_FOUND');
    }

    // Clamp progress between 0 and 100
    const clampedProgress = Math.max(0, Math.min(100, progress));

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        progress: clampedProgress,
        status: clampedProgress >= 100 ? 'COMPLETED' : 'ACTIVE',
      },
    });

    // Update parent progress
    if (existingGoal.parentId) {
      await updateParentProgress(existingGoal.parentId);
    }

    revalidatePath('/destiny/goals');
    return success(goal as Goal);
  } catch (e) {
    console.error('[updateGoalProgress] Error:', e);
    return error('GOAL_UPDATE_FAILED');
  }
}

// Helper: Update parent progress based on children
async function updateParentProgress(parentId: string): Promise<void> {
  const children = await prisma.goal.findMany({
    where: { parentId },
    select: { progress: true },
  });

  if (children.length === 0) return;

  const avgProgress = Math.round(
    children.reduce((sum, c) => sum + c.progress, 0) / children.length
  );

  await prisma.goal.update({
    where: { id: parentId },
    data: { progress: avgProgress },
  });
}

// GET ALL GOALS (flat list)
export async function getAllGoals(): Promise<ActionResult<Goal[]>> {
  try {
    const user = await getUser();

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: [
        { type: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return success(goals as Goal[]);
  } catch (e) {
    console.error('[getAllGoals] Error:', e);
    if (e instanceof Error && e.message === 'Unauthorized') {
      return error('UNAUTHORIZED');
    }
    return error('UNKNOWN');
  }
}
