import { vi } from 'vitest'

export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    image: null
  },
  expires: '2026-12-31T23:59:59.999Z'
}

export const getServerSession = vi.fn(() => Promise.resolve(mockSession))

vi.mock('next-auth', () => ({
  getServerSession
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession, status: 'authenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn()
}))
