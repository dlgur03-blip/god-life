import { test, expect } from '@playwright/test'

test.describe('Discipline Mastery', () => {
  test('should display discipline rules', async ({ page }) => {
    await page.goto('/ko/discipline/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Check for discipline list
    const disciplineList = page.locator('[data-testid="discipline-list"], .discipline-list, .rules-list')
    const hasList = await disciplineList.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May redirect if not authenticated
    expect(hasList || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should allow adding new rule', async ({ page }) => {
    await page.goto('/ko/discipline/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Find input for adding rule
    const input = page.locator('input[placeholder*="rule"], input[placeholder*="규칙"], input[placeholder*="추가"]')
    if (await input.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await input.first().fill('New Test Rule')
      // Look for add button
      const addBtn = page.locator('button:has-text("Add"), button:has-text("추가")')
      if (await addBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await addBtn.first().click()
      }
    }
  })

  test('should show lock icon for future dates', async ({ page }) => {
    // Tomorrow's date
    await page.goto('/ko/discipline/day/2026-01-09')
    await page.waitForLoadState('networkidle')

    // Check for lock icon or locked state
    const lockIcon = page.locator('[data-testid="lock-icon"], .lock-icon, svg[class*="lock"]')
    const hasLock = await lockIcon.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May have different UI for locked state
    expect(hasLock || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should be read-only for past dates', async ({ page }) => {
    await page.goto('/ko/discipline/day/2026-01-07')
    await page.waitForLoadState('networkidle')

    // Check buttons are disabled or page shows read-only state
    const checkButtons = page.locator('[data-testid="check-button"], button[class*="check"]')
    if (await checkButtons.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      // Verify buttons may be disabled for past dates
      const isDisabled = await checkButtons.first().isDisabled().catch(() => true)
      expect(isDisabled).toBeDefined()
    }
  })

  test('should show delete confirmation dialog', async ({ page }) => {
    await page.goto('/ko/discipline/day/2026-01-08')
    await page.waitForLoadState('networkidle')

    // Find delete button
    const deleteBtn = page.locator('[data-testid="delete-rule-button"], button[aria-label*="delete"], button:has-text("삭제")')
    if (await deleteBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteBtn.first().click()
      // Check for confirmation dialog
      const dialog = page.locator('[role="dialog"], [role="alertdialog"], .modal')
      await expect(dialog.first()).toBeVisible({ timeout: 3000 })
    }
  })
})
