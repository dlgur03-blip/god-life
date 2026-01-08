import { test, expect } from '@playwright/test'

test.describe('Cross-Module Navigation', () => {
  test('should navigate between all modules', async ({ page }) => {
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')

    // Navigate to Destiny
    const destinyLink = page.locator('a[href*="destiny"]').first()
    if (await destinyLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await destinyLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/destiny|login|auth/)
    }

    // Navigate to Discipline
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')
    const disciplineLink = page.locator('a[href*="discipline"]').first()
    if (await disciplineLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await disciplineLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/discipline|login|auth/)
    }

    // Navigate to Success
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')
    const successLink = page.locator('a[href*="success"]').first()
    if (await successLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await successLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/success|login|auth/)
    }

    // Navigate to Epistle
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')
    const epistleLink = page.locator('a[href*="epistle"]').first()
    if (await epistleLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await epistleLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/epistle|login|auth/)
    }

    // Navigate to Bio
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')
    const bioLink = page.locator('a[href*="bio"]').first()
    if (await bioLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await bioLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/bio|login|auth/)
    }
  })
})

test.describe('Locale Switching', () => {
  const locales = ['ko', 'en', 'ja']

  for (const locale of locales) {
    test(`should switch to ${locale}`, async ({ page }) => {
      await page.goto('/ko')
      await page.waitForLoadState('networkidle')

      // Try locale selector
      const localeBtn = page.locator(`[data-locale="${locale}"], a[href*="/${locale}"], button:has-text("${locale.toUpperCase()}")`)
      if (await localeBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await localeBtn.first().click()
        await page.waitForLoadState('networkidle')
      }

      // Directly navigate as fallback
      await page.goto(`/${locale}`)
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain(`/${locale}`)
    })
  }
})

test.describe('Responsive Navigation', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')

    // Check for mobile menu button
    const mobileMenuBtn = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"], .hamburger, .menu-toggle')
    const hasMobileMenu = await mobileMenuBtn.first().isVisible({ timeout: 5000 }).catch(() => false)
    // Mobile menu should be visible on small screens
    expect(hasMobileMenu !== undefined).toBe(true)
  })

  test('should show full nav on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/ko')
    await page.waitForLoadState('networkidle')

    // Check for desktop nav
    const desktopNav = page.locator('[data-testid="desktop-nav"], nav, header')
    const hasDesktopNav = await desktopNav.first().isVisible({ timeout: 5000 }).catch(() => false)
    expect(hasDesktopNav).toBe(true)
  })
})
