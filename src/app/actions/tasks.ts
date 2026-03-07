'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('User not found');
  return user;
}

export async function getUserTasks() {
  const user = await getUser();
  const tasks = await prisma.userTask.findMany({
    where: { userId: user.id },
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
  });
  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    category: t.category,
    scheduledTime: t.scheduledTime,
    dueDate: t.dueDate,
    completedAt: t.completedAt?.toISOString() ?? null,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function updateTaskStatus(taskId: string, status: string) {
  const user = await getUser();
  const updateData: { status: string; completedAt?: Date | null } = { status };
  if (status === 'completed') {
    updateData.completedAt = new Date();
  } else {
    updateData.completedAt = null;
  }
  await prisma.userTask.update({
    where: { id: taskId, userId: user.id },
    data: updateData,
  });
  revalidatePath('/tasks');
}

export async function deleteTask(taskId: string) {
  const user = await getUser();
  await prisma.userTask.delete({
    where: { id: taskId, userId: user.id },
  });
  revalidatePath('/tasks');
}
