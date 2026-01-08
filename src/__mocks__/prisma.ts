import { vi } from 'vitest'

export const prisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn()
  },
  destinyDay: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  destinyTimeBlock: {
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  destinyTemplate: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  },
  disciplineRule: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn()
  },
  disciplineCheck: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  },
  successProject: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  },
  successEntry: {
    findMany: vi.fn(),
    update: vi.fn()
  },
  epistleDay: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn()
  },
  bioPost: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  bioPostTranslation: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  $transaction: vi.fn((cb) => cb(prisma))
}

vi.mock('@/lib/prisma', () => ({ prisma }))
