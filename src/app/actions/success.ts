'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) throw new Error("User not found");
  return user;
}

export async function getSuccessProjects() {
  const user = await getUser();
  return await prisma.successProject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      entries: {
        where: { isCompleted: true },
        select: { id: true }
      }
    }
  });
}

export async function getSuccessProject(id: string) {
  const user = await getUser();
  return await prisma.successProject.findUnique({
    where: { id, userId: user.id },
    include: {
      entries: {
        orderBy: { dayIndex: 'asc' },
        select: {
          id: true,
          dayIndex: true,
          content: true,
          isCompleted: true,
          completedAt: true
        }
      }
    }
  });
}

export async function createSuccessProject(formData: FormData) {
  const user = await getUser();
  const title = formData.get('title') as string;
  const startDateStr = formData.get('startDate') as string;
  const reminderTime = formData.get('reminderTime') as string;

  if (!title || !startDateStr) throw new Error("Missing fields");

  // Create Project + 100 Entries Transaction
  await prisma.$transaction(async (tx) => {
    const project = await tx.successProject.create({
      data: {
        userId: user.id,
        title,
        startDate: new Date(startDateStr),
        reminderTime,
      }
    });

    // Generate 100 entries
    // Note: SQLite restriction on createMany again.
    const entriesData = Array.from({ length: 100 }, (_, i) => ({
      projectId: project.id,
      dayIndex: i + 1,
    }));

    await Promise.all(entriesData.map(entry => 
       tx.successEntry.create({ data: entry })
    ));
  });

  revalidatePath('/success');
  redirect('/success');
}

export async function updateSuccessEntry(
  projectId: string,
  dayIndex: number,
  content: string
) {
  const user = await getUser();

  // Get project to validate ownership and calculate current day
  const project = await prisma.successProject.findUnique({
    where: { id: projectId, userId: user.id },
    select: { startDate: true }
  });

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  // Calculate current day index based on user's timezone
  const { getUserTimezone } = await import('@/lib/timezone');
  const timezone = await getUserTimezone();

  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: timezone });
  const today = new Date(todayStr + 'T00:00:00');

  const startDateStr = project.startDate.toISOString().split('T')[0];
  const startDate = new Date(startDateStr + 'T00:00:00');

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentDayIndex = diffDays + 1;

  // Only allow updating today's entry
  if (dayIndex !== currentDayIndex) {
    throw new Error("Only today's entry can be updated");
  }

  await prisma.successEntry.update({
    where: {
      projectId_dayIndex: {
        projectId,
        dayIndex
      }
    },
    data: {
      content,
      isCompleted: true,
      completedAt: new Date(),
    }
  });

  revalidatePath(`/success/project/${projectId}`);
}

export async function deleteSuccessProject(projectId: string) {
  const user = await getUser();

  // Verify ownership before deletion
  const project = await prisma.successProject.findUnique({
    where: { id: projectId },
    select: { userId: true }
  });

  if (!project || project.userId !== user.id) {
    throw new Error("Project not found or unauthorized");
  }

  // Delete project (entries cascade automatically via Prisma schema)
  await prisma.successProject.delete({
    where: { id: projectId }
  });

  revalidatePath('/success');
  redirect('/success');
}
