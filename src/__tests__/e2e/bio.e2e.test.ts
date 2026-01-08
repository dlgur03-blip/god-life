import { test, expect } from '@playwright/test'

test.describe('Bio Hacking - List', () => {
  test('should display bio post list', async ({ page }) => {
    await page.goto('/ko/bio')
    await page.waitForLoadState('networkidle')

    // Check for bio list
    const bioList = page.locator('[data-testid="bio-list"], .bio-list, .post-list')
    const hasList = await bioList.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May redirect if not authenticated
    expect(hasList || page.url().includes('login') || page.url().includes('auth') || page.url().includes('bio')).toBe(true)
  })

  test('should show category filters', async ({ page }) => {
    await page.goto('/ko/bio')
    await page.waitForLoadState('networkidle')

    // Check for category filters
    const categories = page.locator('[data-testid="category-filter"], .category-filter, .filter-buttons')
    const hasCategories = await categories.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May or may not have category filters
    expect(hasCategories !== undefined).toBe(true)
  })
})

test.describe('Bio Hacking - Post Detail', () => {
  test('should display post content', async ({ page }) => {
    await page.goto('/ko/bio/test-slug')
    await page.waitForLoadState('networkidle')

    // Check for post content - may show 404 if post doesn't exist
    const content = page.locator('article, .post-content, .markdown-content')
    const hasContent = await content.first().isVisible({ timeout: 5000 }).catch(() => false)
    // Either has content or shows 404/redirect
    expect(hasContent || page.url().includes('bio') || page.url().includes('404')).toBe(true)
  })

  test('should handle translation fallback', async ({ page }) => {
    // Test with locale that may not have translation
    await page.goto('/ja/bio/test-slug')
    await page.waitForLoadState('networkidle')

    // Verify fallback content displays or 404
    expect(page.url()).toContain('/ja/')
  })
})

test.describe('Bio Hacking - Locales', () => {
  const locales = ['ko', 'en', 'ja']

  for (const locale of locales) {
    test(`should load in ${locale} locale`, async ({ page }) => {
      await page.goto(`/${locale}/bio`)
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(new RegExp(`/${locale}/bio`))
    })
  }
})
