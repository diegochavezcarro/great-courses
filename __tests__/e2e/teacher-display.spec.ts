import { test, expect } from '@playwright/test';

/**
 * E2E Test: Teacher Display Journey
 * Tests the complete user experience of viewing teacher information across all course views
 */
test.describe('E2E: Teacher Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display teacher information on course cards in main catalog', async ({ page }) => {
    // Verify teachers are visible on homepage
    await expect(page.getByText('Dr. Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Prof. Michael Chen')).toBeVisible();
    await expect(page.getByText('Dr. Emily Williams')).toBeVisible();

    // Verify teacher icons are present (SVG elements)
    const teacherIcons = page.locator('svg[aria-hidden="true"]');
    await expect(teacherIcons).toHaveCount(3); // One per featured course
  });

  test('should display teacher information in course management list', async ({ page }) => {
    // Open course management modal
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Wait for modal to open
    await expect(page.getByText('Manage Courses')).toBeVisible();

    // Verify teachers are displayed in list view
    await expect(page.getByText('Dr. Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Prof. Michael Chen')).toBeVisible();
    await expect(page.getByText('Dr. Emily Williams')).toBeVisible();
  });

  test('should maintain teacher display consistency across views', async ({ page }) => {
    // Get teacher from homepage (first occurrence)
    const teacherOnHome = await page.getByText('Dr. Sarah Johnson').first().textContent();

    // Open management modal
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Verify same teacher appears in management view
    const teacherInManagement = await page.getByText('Dr. Sarah Johnson').first().textContent();
    expect(teacherInManagement).toBe(teacherOnHome);
  });

  test('should display teacher icon with correct styling on all devices', async ({ page }) => {
    // Check desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const teacherContainer = page.locator('text=Dr. Sarah Johnson').locator('..');
    await expect(teacherContainer).toBeVisible();
    
    // Verify flex layout classes
    await expect(teacherContainer).toHaveClass(/flex/);
    await expect(teacherContainer).toHaveClass(/items-center/);

    // Check mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Teacher should still be visible and properly styled
    await expect(page.getByText('Dr. Sarah Johnson')).toBeVisible();
    await expect(teacherContainer).toBeVisible();
  });

  test('should search for courses by teacher name', async ({ page }) => {
    // Open management modal
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Type teacher name in search
    await page.getByPlaceholder(/search courses/i).fill('Dr. Sarah');

    // Only Dr. Sarah Johnson's course should be visible
    await expect(page.getByText('Dr. Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Prof. Michael Chen')).not.toBeVisible();
    await expect(page.getByText('Dr. Emily Williams')).not.toBeVisible();
  });

  test('should search teacher names case-insensitively', async ({ page }) => {
    // Open management modal
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Search with lowercase
    await page.getByPlaceholder(/search courses/i).fill('michael chen');

    // Should find Prof. Michael Chen
    await expect(page.getByText('Prof. Michael Chen')).toBeVisible();
  });
});
