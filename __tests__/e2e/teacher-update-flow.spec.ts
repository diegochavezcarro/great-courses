import { test, expect } from '@playwright/test';

/**
 * E2E Test: Teacher Update Flow
 * Tests the complete journey of editing a course and updating teacher information
 */
test.describe('E2E: Teacher Update Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully update teacher through full UI flow', async ({ page }) => {
    // Open course management
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Click Edit on first course
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.first().click();

    // Verify teacher field is pre-populated
    const teacherInput = page.getByLabel(/teacher/i);
    await expect(teacherInput).toHaveValue('Dr. Sarah Johnson');

    // Change teacher name
    await teacherInput.fill('Dr. Updated Professor');

    // Submit update
    await page.getByRole('button', { name: /update course/i }).click();

    // Verify updated teacher appears in list
    await expect(page.getByText('Dr. Updated Professor')).toBeVisible();
    
    // Original teacher should not be visible
    await expect(page.getByText('Dr. Sarah Johnson')).not.toBeVisible();
  });

  test('should pre-populate teacher field when editing course', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Edit second course (Prof. Michael Chen)
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.nth(1).click();

    // Verify teacher is pre-populated
    const teacherInput = page.getByLabel(/teacher/i);
    await expect(teacherInput).toHaveValue('Prof. Michael Chen');
  });

  test('should prevent saving when teacher is cleared', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.first().click();

    // Clear teacher field
    const teacherInput = page.getByLabel(/teacher/i);
    await teacherInput.clear();

    // Update button should be disabled
    const updateButton = page.getByRole('button', { name: /update course/i });
    await expect(updateButton).toBeDisabled();

    // Validation error should appear
    await expect(page.getByText(/teacher name is required/i)).toBeVisible();
  });

  test('should validate teacher constraints during update', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.first().click();

    const teacherInput = page.getByLabel(/teacher/i);

    // Test too short
    await teacherInput.fill('A');
    await expect(page.getByText(/must be at least 2 characters/i)).toBeVisible();

    // Test too long
    const longName = 'Dr. ' + 'A'.repeat(98);
    await teacherInput.fill(longName);
    await expect(page.getByText(/must not exceed 100 characters/i)).toBeVisible();

    // Test valid
    await teacherInput.fill('Dr. Valid Update');
    await expect(page.getByRole('button', { name: /update course/i })).not.toBeDisabled();
  });

  test('should preserve teacher when updating other fields', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.first().click();

    // Get original teacher
    const teacherInput = page.getByLabel(/teacher/i);
    const originalTeacher = await teacherInput.inputValue();

    // Update only the title
    await page.getByLabel(/title/i).fill('Updated Title Only');

    // Submit update
    await page.getByRole('button', { name: /update course/i }).click();

    // Verify teacher remained unchanged
    await expect(page.getByText(originalTeacher)).toBeVisible();
  });

  test('should cancel edit and preserve original teacher', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.first().click();

    // Change teacher
    const teacherInput = page.getByLabel(/teacher/i);
    const originalTeacher = await teacherInput.inputValue();
    await teacherInput.fill('Dr. Should Not Save');

    // Cancel instead of saving
    await page.getByRole('button', { name: /cancel/i }).click();

    // Original teacher should still be visible
    await expect(page.getByText(originalTeacher)).toBeVisible();
    await expect(page.getByText('Dr. Should Not Save')).not.toBeVisible();
  });
});
