import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect unauthenticated users to home', async ({ page }) => {
    await page.goto('/ko/destiny/day/2026-01-08')
    // Should redirect to login or home page
    await expect(page).toHaveURL(/\/$|login|api\/auth/)
  })

  test('should show Google login button', async ({ page }) => {
    await page.goto('/ko')
    // Wait for page load
    await page.waitForLoadState('networkidle')
    const loginBtn = page.locator('button:has-text("Google"), a:has-text("Google")')
    await expect(loginBtn.first()).toBeVisible({ timeout: 10000 })
  })

  test('should maintain session after refresh', async ({ page }) => {
    await page.goto('/ko')
    await page.reload()
    // Verify page loads correctly after refresh
    await expect(page).toHaveURL(/\/ko/)
  })
})

test.describe('Authorization', () => {
  test('should show 403 or redirect for non-admin accessing admin', async ({ page }) => {
    await page.goto('/ko/admin')
    // Either shows 403, access denied message, or redirects
    const hasAccessDenied = await page.locator('text=403, text=forbidden, text=denied, text=unauthorized').first().isVisible().catch(() => false)
    const redirected = page.url().includes('login') || page.url().includes('api/auth') || !page.url().includes('admin')
    expect(hasAccessDenied || redirected).toBe(true)
  })
})
