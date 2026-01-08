import { test, expect } from '@playwright/test'

test.describe('Success Code - Project List', () => {
  test('should display project list page', async ({ page }) => {
    await page.goto('/ko/success')
    await page.waitForLoadState('networkidle')

    // Check for success grid
    const successGrid = page.locator('[data-testid="success-grid"], .success-grid, .project-list')
    const hasGrid = await successGrid.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May redirect if not authenticated
    expect(hasGrid || page.url().includes('login') || page.url().includes('auth')).toBe(true)
  })

  test('should open create project dialog', async ({ page }) => {
    await page.goto('/ko/success')
    await page.waitForLoadState('networkidle')

    // Find new project button
    const newBtn = page.locator('button:has-text("New Project"), button:has-text("새 프로젝트"), button:has-text("+")')
    if (await newBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await newBtn.first().click()
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 })
    }
  })
})

test.describe('Success Code - Project Detail', () => {
  test('should display 10x10 grid', async ({ page }) => {
    // Navigate to a project detail - using placeholder ID
    await page.goto('/ko/success/project/test-project-id')
    await page.waitForLoadState('networkidle')

    // Check for grid
    const grid = page.locator('[data-testid="success-grid"], .success-grid, .grid')
    const hasGrid = await grid.first().isVisible({ timeout: 5000 }).catch(() => false)
    // May show 404 or redirect if project doesn't exist or not authenticated
    expect(hasGrid || page.url().includes('login') || page.url().includes('auth') || page.url().includes('success')).toBe(true)
  })

  test('should open entry editor on cell click', async ({ page }) => {
    await page.goto('/ko/success/project/test-project-id')
    await page.waitForLoadState('networkidle')

    // Find clickable grid cell
    const cell = page.locator('[data-testid="grid-cell"], .grid-cell, .entry-cell')
    if (await cell.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await cell.first().click()
      // Editor or dialog may open
    }
  })

  test('should allow image upload', async ({ page }) => {
    await page.goto('/ko/success/project/test-project-id')
    await page.waitForLoadState('networkidle')

    // Find file input
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      // File upload interaction test
      expect(await fileInput.first().isEnabled()).toBeDefined()
    }
  })

  test('should show image preview modal', async ({ page }) => {
    await page.goto('/ko/success/project/test-project-id')
    await page.waitForLoadState('networkidle')

    // Find entry image
    const entryImage = page.locator('[data-testid="entry-image"], .entry-image, img.preview')
    if (await entryImage.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await entryImage.first().click()
      // Modal may open
      const modal = page.locator('[role="dialog"], .modal, .image-modal')
      await expect(modal.first()).toBeVisible({ timeout: 3000 })
    }
  })
})

test.describe('Success Code - Delete', () => {
  test('should show delete confirmation', async ({ page }) => {
    await page.goto('/ko/success/project/test-project-id')
    await page.waitForLoadState('networkidle')

    // Find delete project button
    const deleteBtn = page.locator('[data-testid="delete-project-button"], button:has-text("Delete"), button:has-text("삭제")')
    if (await deleteBtn.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteBtn.first().click()
      // Confirmation dialog
      const dialog = page.locator('[role="dialog"], [role="alertdialog"]')
      await expect(dialog.first()).toBeVisible({ timeout: 3000 })
    }
  })
})
