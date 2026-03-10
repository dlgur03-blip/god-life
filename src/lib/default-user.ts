import { prisma } from '@/lib/prisma';

const DEFAULT_EMAIL = 'user@godlife.app';
const DEFAULT_NAME = 'GOD LIFE User';

/**
 * Get or create the default user (no auth required).
 * Single-user mode: everyone uses the same account.
 */
export async function getDefaultUser() {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      email: DEFAULT_EMAIL,
      name: DEFAULT_NAME,
    },
  });
  return user;
}
