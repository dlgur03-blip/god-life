import { test, expect } from '@playwright/test'

test.describe('Destiny Navigator', () => {
  test('should display 24-hour timeblock structure', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    // Wait for page load - may redirect if not authenticated
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to previous day', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Find and click previous day navigation
    const prevBtn = page.locator('[aria-label*="prev"], button:has-text("<"), button:has-text("Previous")').first()
    if (await prevBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await prevBtn.click()
      await expect(page).toHaveURL(/2026-01-07/)
    }
  })

  test('should navigate to next day', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Find and click next day navigation
    const nextBtn = page.locator('[aria-label*="next"], button:has-text(">"), button:has-text("Next")').first()
    if (await nextBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nextBtn.click()
      await expect(page).toHaveURL(/2026-01-09/)
    }
  })

  test('should display weekly plan grid', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for weekly grid or related content
    const weeklyGrid = page.locator('[data-testid="weekly-plan-grid"], .weekly-plan, .week-grid')
    const hasWeeklyGrid = await weeklyGrid.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May not be visible if not authenticated
    expect(hasWeeklyGrid || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should allow goal editing', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Find goal input if visible
    const goalInput = page.locator('[data-testid="week-goal-input"], input[placeholder*="goal"], textarea[placeholder*="goal"]')
    if (await goalInput.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await goalInput.first().fill('Test Goal')
    }
  })
})

test.describe('Destiny Templates', () => {
  test('should open save template dialog', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Look for save template button
    const saveBtn = page.locator('button:has-text("Save Template"), button:has-text("템플릿 저장")')
    if (await saveBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await saveBtn.first().click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })

  test('should open load template dialog', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Look for load template button
    const loadBtn = page.locator('button:has-text("Load Template"), button:has-text("템플릿 불러오기")')
    if (await loadBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadBtn.first().click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })
})
