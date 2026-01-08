import { test, expect } from '@playwright/test'

test.describe('Admin - Access Control', () => {
  test('should show access denied for non-admin', async ({ page }) => {
    await page.goto('/ko/admin')
    await page.waitForLoadState('networkidle')

    // Check for access denied or redirect
    const accessDenied = page.locator('[data-testid="access-denied"], text=403, text=forbidden, text=denied, text=unauthorized')
    const hasAccessDenied = await accessDenied.first().isVisible({ timeout: 5000 }).catch(() => false)
    const redirected = page.url().includes('login') || page.url().includes('api/auth') || !page.url().includes('admin')

    expect(hasAccessDenied || redirected).toBe(true)
  })
})

test.describe('Admin - Dashboard', () => {
  test.skip('should display stats cards (requires admin auth)', async ({ page }) => {
    await page.goto('/ko/admin')
    await page.waitForLoadState('networkidle')

    const statsCard = page.locator('[data-testid="stats-card"], .stats-card')
    await expect(statsCard.first()).toBeVisible({ timeout: 5000 })
  })

  test.skip('should display module cards', async ({ page }) => {
    await page.goto('/ko/admin')
    await page.waitForLoadState('networkidle')

    const moduleCard = page.locator('[data-testid="module-card"], .module-card')
    await expect(moduleCard.first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Admin - User Management', () => {
  test.skip('should display user list (requires admin auth)', async ({ page }) => {
    await page.goto('/ko/admin/users')
    await page.waitForLoadState('networkidle')

    const userTable = page.locator('[data-testid="user-table"], table, .user-list')
    await expect(userTable.first()).toBeVisible({ timeout: 5000 })
  })

  test.skip('should allow user search', async ({ page }) => {
    await page.goto('/ko/admin/users')
    await page.waitForLoadState('networkidle')

    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="검색"]')
    await searchInput.first().fill('test@example.com')
  })
})

test.describe('Admin - Bio Management', () => {
  test.skip('should display bio post list (requires admin auth)', async ({ page }) => {
    await page.goto('/ko/admin/bio')
    await page.waitForLoadState('networkidle')

    const bioList = page.locator('[data-testid="bio-admin-list"], .bio-list')
    await expect(bioList.first()).toBeVisible({ timeout: 5000 })
  })

  test.skip('should open create post form', async ({ page }) => {
    await page.goto('/ko/admin/bio/new')
    await page.waitForLoadState('networkidle')

    const bioForm = page.locator('[data-testid="bio-post-form"], form')
    await expect(bioForm.first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Admin - System Status', () => {
  test.skip('should display system info (requires admin auth)', async ({ page }) => {
    await page.goto('/ko/admin/system')
    await page.waitForLoadState('networkidle')

    const systemStatus = page.locator('[data-testid="system-status"], .system-info')
    await expect(systemStatus.first()).toBeVisible({ timeout: 5000 })
  })
})
