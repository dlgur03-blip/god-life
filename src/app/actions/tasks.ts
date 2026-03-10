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
    include: { project: true },
  });
  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    category: t.category,
    projectId: t.projectId,
    projectName: t.project?.name ?? null,
    projectEmoji: t.project?.emoji ?? null,
    projectColor: t.project?.color ?? null,
    scheduledTime: t.scheduledTime,
    dueDate: t.dueDate,
    completedAt: t.completedAt?.toISOString() ?? null,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function getTaskProjects() {
  const user = await getUser();
  const projects = await prisma.taskProject.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { tasks: true } } },
  });
  return projects.map(p => ({
    id: p.id,
    name: p.name,
    emoji: p.emoji,
    color: p.color,
    taskCount: p._count.tasks,
  }));
}

export async function createTaskProject(name: string, emoji: string = '📁', color: string = '#2563eb') {
  const user = await getUser();
  const project = await prisma.taskProject.create({
    data: { userId: user.id, name, emoji, color },
  });
  revalidatePath('/tasks');
  return project.id;
}

export async function deleteTaskProject(projectId: string) {
  const user = await getUser();
  // Unlink tasks from project before deleting
  await prisma.userTask.updateMany({
    where: { projectId, userId: user.id },
    data: { projectId: null },
  });
  await prisma.taskProject.delete({
    where: { id: projectId, userId: user.id },
  });
  revalidatePath('/tasks');
}

export async function moveTaskToProject(taskId: string, projectId: string | null) {
  const user = await getUser();
  await prisma.userTask.update({
    where: { id: taskId, userId: user.id },
    data: { projectId },
  });
  revalidatePath('/tasks');
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
