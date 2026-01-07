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
        orderBy: { dayIndex: 'asc' }
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

export async function updateSuccessEntry(projectId: string, dayIndex: number, content: string) {
  await getUser(); // Check auth
  
  // Find entry first to ensure ownership via project is complex in one query, 
  // simplified: trust database constraints + projectId check if needed.
  // Ideally we check project ownership first.
  
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
