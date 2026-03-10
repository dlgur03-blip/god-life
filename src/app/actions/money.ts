'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");
  return user;
}

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  memo: string | null;
  date: string;
  createdAt: Date;
};

// Get transactions for a specific month
export async function getMonthTransactions(yearMonth: string): Promise<Transaction[]> {
  const user = await getUser();

  const transactions = await prisma.moneyTransaction.findMany({
    where: {
      userId: user.id,
      date: { startsWith: yearMonth }, // e.g., "2024-01"
    },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });

  return transactions.map(t => ({
    ...t,
    type: t.type as TransactionType,
  }));
}

// Get summary for a specific month
export async function getMonthSummary(yearMonth: string) {
  const user = await getUser();

  const transactions = await prisma.moneyTransaction.findMany({
    where: {
      userId: user.id,
      date: { startsWith: yearMonth },
    },
    select: { type: true, amount: true },
  });

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

// Create a new transaction
export async function createTransaction(data: {
  type: TransactionType;
  category: string;
  amount: number;
  memo?: string;
  date: string;
}) {
  const user = await getUser();

  if (!data.type || !data.category || !data.amount || !data.date) {
    throw new Error("Missing required fields");
  }

  if (data.amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const transaction = await prisma.moneyTransaction.create({
    data: {
      userId: user.id,
      type: data.type,
      category: data.category,
      amount: Math.round(data.amount), // Ensure integer
      memo: data.memo || null,
      date: data.date,
    },
  });

  revalidatePath('/money');
  return transaction;
}

// Update a transaction
export async function updateTransaction(
  id: string,
  data: {
    type?: TransactionType;
    category?: string;
    amount?: number;
    memo?: string | null;
    date?: string;
  }
) {
  const user = await getUser();

  const existing = await prisma.moneyTransaction.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== user.id) {
    throw new Error("Transaction not found or unauthorized");
  }

  if (data.amount !== undefined && data.amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const transaction = await prisma.moneyTransaction.update({
    where: { id },
    data: {
      ...data,
      amount: data.amount ? Math.round(data.amount) : undefined,
    },
  });

  revalidatePath('/money');
  return transaction;
}

// Delete a transaction
export async function deleteTransaction(id: string) {
  const user = await getUser();

  const existing = await prisma.moneyTransaction.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== user.id) {
    throw new Error("Transaction not found or unauthorized");
  }

  await prisma.moneyTransaction.delete({
    where: { id },
  });

  revalidatePath('/money');
}

// Get today's transactions
export async function getTodayTransactions(): Promise<Transaction[]> {
  const user = await getUser();
  const today = new Date().toISOString().split('T')[0];

  const transactions = await prisma.moneyTransaction.findMany({
    where: {
      userId: user.id,
      date: today,
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions.map(t => ({
    ...t,
    type: t.type as TransactionType,
  }));
}
