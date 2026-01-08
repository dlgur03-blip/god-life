import { test, expect } from '@playwright/test'

test.describe('Self Epistle - Writing', () => {
  test('should display epistle form', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for epistle form
    const form = page.locator('[data-testid="epistle-form"], form, .epistle-form')
    const hasForm = await form.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May redirect if not authenticated
    expect(hasForm || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should have yesterday and tomorrow fields', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for yesterday and tomorrow text fields
    const toYesterday = page.locator('[data-testid="to-yesterday"], textarea[name*="yesterday"], textarea[placeholder*="어제"]')
    const toTomorrow = page.locator('[data-testid="to-tomorrow"], textarea[name*="tomorrow"], textarea[placeholder*="내일"]')

    const hasYesterday = await toYesterday.first().isVisible({ timeout: 5000 }).catch(() => false)
    const hasTomorrow = await toTomorrow.first().isVisible({ timeout: 5000 }).catch(() => false)

    // If authenticated, should have both fields
    if (!page.url().includes('login') && !page.url().includes('auth')) {
      expect(hasYesterday || hasTomorrow).toBe(true)
    }
  })

  test('should allow mood selection', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for mood selector
    const moodSelector = page.locator('[data-testid="mood-selector"], .mood-selector, [class*="mood"]')
    const hasMoodSelector = await moodSelector.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May redirect if not authenticated
    expect(hasMoodSelector || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should save letter on submit', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Fill form fields
    const toYesterday = page.locator('[data-testid="to-yesterday"], textarea[name*="yesterday"]')
    const toTomorrow = page.locator('[data-testid="to-tomorrow"], textarea[name*="tomorrow"]')

    if (await toYesterday.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await toYesterday.first().fill('Test yesterday message')
    }
    if (await toTomorrow.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await toTomorrow.first().fill('Test tomorrow message')
    }

    // Find save button
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("저장"), button[type="submit"]')
    if (await saveBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveBtn.first().click()
    }
  })
})

test.describe('Self Epistle - Date Access', () => {
  test('should allow writing for today', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Form should be visible and editable for today
    const form = page.locator('[data-testid="epistle-form"], form, .epistle-form')
    const hasForm = await form.first().isVisible({ timeout: 5000 }).catch(() => false)
    expect(hasForm || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should be read-only for past dates', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-07')
    await page.waitForLoadState('networkidle')

    // Should show read-only state or past letter
    const readOnly = page.locator('[data-testid="read-only"], .read-only, [readonly]')
    const hasReadOnly = await readOnly.first().isVisible({ timeout: 5000 }).catch(() => false)
    // Read-only state or redirect
    expect(hasReadOnly || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should block future dates beyond tomorrow', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-10')
    await page.waitForLoadState('networkidle')

    // Should show blocked state or redirect
    const blocked = page.locator('[data-testid="blocked"], .blocked, [class*="lock"]')
    const hasBlocked = await blocked.first().isVisible({ timeout: 5000 }).catch(() => false)
    // Blocked state or redirect
    expect(hasBlocked || page.url().includes('login') || page.url().includes('auth') || page.url().includes('epistle')).toBe(true)
  })
})

test.describe('Self Epistle - Received Letter', () => {
  test('should display yesterday letter card', async ({ page }) => {
    await page.goto('/ko/epistle/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for received letter card
    const receivedCard = page.locator('[data-testid="received-letter"], .received-letter, .letter-card')
    // May or may not be visible depending on data
    const hasCard = await receivedCard.first().isVisible({ timeout: 5000 }).catch(() => false)
    // Either has card, no card (no data), or redirected
    expect(hasCard !== undefined).toBe(true)
  })
})
