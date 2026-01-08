import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'

const mockSession = {
  user: { id: 'test', email: 'test@example.com', name: 'Test' },
  expires: '2026-12-31'
}

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession as never}>
      <NextIntlClientProvider locale="ko" messages={{}}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
