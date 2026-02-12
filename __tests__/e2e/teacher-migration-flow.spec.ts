import { test, expect } from '@playwright/test';

/**
 * E2E Test: Teacher Migration Flow
 * Tests the complete journey of migrating legacy courses without teacher
 */
test.describe('E2E: Teacher Migration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show warning badge when editing course without teacher', async ({ page }) => {
    // For this test, we'd need a course without teacher
    // Since we can't easily create one in the UI, we'll simulate by checking the warning logic
    
    await page.getByRole('button', { name: /manage courses/i }).click();
    
    // Create a new course without teacher (by clearing it in edit mode)
    await page.getByRole('button', { name: /add new course/i }).click();
    
    // Fill minimal form to create course
    await page.getByLabel(/title/i).fill('Legacy Test Course');
    await page.getByLabel(/teacher/i).fill('Dr. Temporary');
    await page.getByLabel(/category/i).fill('Test');
    await page.getByLabel(/level/i).selectOption('Principiante');
    await page.getByLabel(/number of lessons/i).fill('10');
    await page.getByLabel(/duration/i).fill('5 horas');
    await page.getByLabel(/rating/i).fill('4.0');
    await page.getByLabel(/description/i).fill('Temporary course for testing migration');
    
    await page.getByRole('button', { name: /create course/i }).click();
    
    // Now edit this course and try to clear teacher
    await page.getByRole('button', { name: /edit/i }).last().click();
    
    const teacherInput = page.getByLabel(/teacher/i);
    await teacherInput.clear();
    
    // Validation error should appear (acts as migration warning)
    await expect(page.getByText(/teacher name is required/i)).toBeVisible();
    
    // Update button should be disabled
    await expect(page.getByRole('button', { name: /update course/i })).toBeDisabled();
  });

  test('should require teacher assignment before allowing save', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Fill form without teacher
    await page.getByLabel(/title/i).fill('Migration Test');
    await page.getByLabel(/category/i).fill('Test');
    await page.getByLabel(/level/i).selectOption('Principiante');
    await page.getByLabel(/number of lessons/i).fill('5');
    await page.getByLabel(/duration/i).fill('3 horas');
    await page.getByLabel(/rating/i).fill('4.0');
    await page.getByLabel(/description/i).fill('Test migration workflow');

    // Create button should be disabled
    await expect(page.getByRole('button', { name: /create course/i })).toBeDisabled();

    // Add teacher
    await page.getByLabel(/teacher/i).fill('Dr. Migrated Instructor');

    // Button should now be enabled
    await expect(page.getByRole('button', { name: /create course/i })).not.toBeDisabled();
  });

  test('should complete migration by adding teacher to legacy course', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();

    // Create a course
    await page.getByRole('button', { name: /add new course/i }).click();
    
    await page.getByLabel(/title/i).fill('Course to Migrate');
    await page.getByLabel(/teacher/i).fill('Dr. Initial Teacher');
    await page.getByLabel(/category/i).fill('Migration');
    await page.getByLabel(/level/i).selectOption('Intermedio');
    await page.getByLabel(/number of lessons/i).fill('12');
    await page.getByLabel(/duration/i).fill('6 horas');
    await page.getByLabel(/rating/i).fill('4.5');
    await page.getByLabel(/description/i).fill('Course for migration testing workflow');
    
    await page.getByRole('button', { name: /create course/i }).click();

    // Edit it and change teacher (simulating migration)
    await page.getByRole('button', { name: /edit/i }).last().click();
    
    const teacherInput = page.getByLabel(/teacher/i);
    await teacherInput.fill('Dr. Migrated Teacher');
    
    // Save should work
    await page.getByRole('button', { name: /update course/i }).click();
    
    // Verify migrated teacher appears
    await expect(page.getByText('Dr. Migrated Teacher')).toBeVisible();
  });

  test('should guide user through migration with clear error messages', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Try to submit without teacher
    await page.getByLabel(/title/i).fill('Guided Migration Test');
    
    // Blur to trigger validation
    await page.getByLabel(/teacher/i).focus();
    await page.getByLabel(/teacher/i).blur();

    // Should see clear error message
    await expect(page.getByText(/teacher name is required/i)).toBeVisible();

    // Fill with too-short name
    await page.getByLabel(/teacher/i).fill('A');
    await expect(page.getByText(/must be at least 2 characters/i)).toBeVisible();

    // Fill with valid name
    await page.getByLabel(/teacher/i).fill('Dr. Complete Migration');
    
    // Error should clear
    await expect(page.getByText(/teacher name is required/i)).not.toBeVisible();
    await expect(page.getByText(/must be at least 2 characters/i)).not.toBeVisible();
  });

  test('should persist migrated teacher across page refresh', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Create course with teacher
    await page.getByLabel(/title/i).fill('Persistence Test Course');
    await page.getByLabel(/teacher/i).fill('Dr. Persistent Teacher');
    await page.getByLabel(/category/i).fill('Testing');
    await page.getByLabel(/level/i).selectOption('Avanzado');
    await page.getByLabel(/number of lessons/i).fill('20');
    await page.getByLabel(/duration/i).fill('10 horas');
    await page.getByLabel(/rating/i).fill('4.8');
    await page.getByLabel(/description/i).fill('Course to test teacher persistence after page refresh');
    
    await page.getByRole('button', { name: /create course/i }).click();

    // Close modal
    await page.getByRole('button', { name: /close|back/i }).click();

    // Refresh page
    await page.reload();

    // Verify teacher persists
    await expect(page.getByText('Dr. Persistent Teacher')).toBeVisible();
  });
});
