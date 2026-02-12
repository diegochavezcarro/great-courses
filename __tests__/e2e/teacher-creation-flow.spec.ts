import { test, expect } from '@playwright/test';

/**
 * E2E Test: Teacher Creation Flow
 * Tests the complete journey of creating a new course with teacher assignment
 */
test.describe('E2E: Teacher Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully create course with teacher through full UI flow', async ({ page }) => {
    // Step 1: Click Manage Courses button
    await page.getByRole('button', { name: /manage courses/i }).click();
    await expect(page.getByText('Manage Courses')).toBeVisible();

    // Step 2: Click Add New Course
    await page.getByRole('button', { name: /add new course/i }).click();
    await expect(page.getByText(/create.*course/i)).toBeVisible();

    // Step 3: Fill in all form fields including teacher
    await page.getByLabel(/title/i).fill('E2E Test Course');
    await page.getByLabel(/teacher/i).fill('Dr. E2E Instructor');
    await page.getByLabel(/category/i).fill('Testing');
    await page.getByLabel(/level/i).selectOption('Avanzado');
    await page.getByLabel(/number of lessons/i).fill('30');
    await page.getByLabel(/duration/i).fill('15 horas');
    await page.getByLabel(/rating/i).fill('4.9');
    await page.getByLabel(/description/i).fill('End-to-end test course with comprehensive teacher assignment validation and UI workflow testing');

    // Step 4: Submit form
    await page.getByRole('button', { name: /create course/i }).click();

    // Step 5: Verify course appears in management list with teacher
    await expect(page.getByText('E2E Test Course')).toBeVisible();
    await expect(page.getByText('Dr. E2E Instructor')).toBeVisible();

    // Step 6: Close modal and verify in main catalog
    await page.getByRole('button', { name: /close|back to list/i }).click();

    // Step 7: Verify course appears in homepage catalog
    await expect(page.getByText('E2E Test Course')).toBeVisible();
    await expect(page.getByText('Dr. E2E Instructor')).toBeVisible();
  });

  test('should prevent submission when teacher field is empty', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Fill all fields EXCEPT teacher
    await page.getByLabel(/title/i).fill('Course Without Teacher');
    await page.getByLabel(/category/i).fill('Test');
    await page.getByLabel(/level/i).selectOption('Principiante');
    await page.getByLabel(/number of lessons/i).fill('10');
    await page.getByLabel(/duration/i).fill('5 horas');
    await page.getByLabel(/rating/i).fill('4.0');
    await page.getByLabel(/description/i).fill('Test description');

    // Create button should be disabled
    const createButton = page.getByRole('button', { name: /create course/i });
    await expect(createButton).toBeDisabled();

    // Validation error should be visible
    await expect(page.getByText(/teacher name is required/i)).toBeVisible();
  });

  test('should show validation errors for invalid teacher names', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    const teacherInput = page.getByLabel(/teacher/i);

    // Test too short (1 character)
    await teacherInput.fill('A');
    await teacherInput.blur();
    await expect(page.getByText(/must be at least 2 characters/i)).toBeVisible();

    // Test too long (>100 characters)
    const longName = 'Dr. ' + 'A'.repeat(98);
    await teacherInput.fill(longName);
    await teacherInput.blur();
    await expect(page.getByText(/must not exceed 100 characters/i)).toBeVisible();

    // Test valid name
    await teacherInput.fill('Dr. Valid Name');
    await teacherInput.blur();
    await expect(page.getByText(/teacher name/i)).not.toHaveClass(/error/);
  });

  test('should handle teacher input with special characters', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Fill form with teacher name containing special characters
    await page.getByLabel(/title/i).fill('Special Char Test');
    await page.getByLabel(/teacher/i).fill("Dr. O'Connor-Smith");
    await page.getByLabel(/category/i).fill('Test');
    await page.getByLabel(/level/i).selectOption('Intermedio');
    await page.getByLabel(/number of lessons/i).fill('15');
    await page.getByLabel(/duration/i).fill('8 horas');
    await page.getByLabel(/rating/i).fill('4.5');
    await page.getByLabel(/description/i).fill('Test course with special characters in teacher name');

    // Should allow submission
    const createButton = page.getByRole('button', { name: /create course/i });
    await expect(createButton).not.toBeDisabled();
    
    await createButton.click();

    // Verify course created with special characters intact
    await expect(page.getByText("Dr. O'Connor-Smith")).toBeVisible();
  });

  test('should maintain teacher value while filling other fields', async ({ page }) => {
    await page.getByRole('button', { name: /manage courses/i }).click();
    await page.getByRole('button', { name: /add new course/i }).click();

    // Fill teacher first
    await page.getByLabel(/teacher/i).fill('Dr. Persistent Teacher');

    // Fill other fields
    await page.getByLabel(/title/i).fill('Test Course');
    await page.getByLabel(/category/i).fill('Testing');

    // Verify teacher value is still present
    await expect(page.getByLabel(/teacher/i)).toHaveValue('Dr. Persistent Teacher');
  });
});
