import { vi } from 'vitest'

export const useTranslations = vi.fn((namespace?: string) => {
  return (key: string, values?: Record<string, string>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    if (values) {
      return Object.entries(values).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, v),
        fullKey
      )
    }
    return fullKey
  }
})

export const useLocale = vi.fn(() => 'ko')
export const useMessages = vi.fn(() => ({}))
export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children

vi.mock('next-intl', () => ({
  useTranslations,
  useLocale,
  useMessages,
  NextIntlClientProvider
}))
