import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

/**
 * Integration Test: Course creation workflow with teacher assignment
 * Tests the complete user journey of creating a new course with required teacher field
 */
describe('Integration: Course Creation with Teacher', () => {
  it('should complete full course creation workflow with teacher', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    // Step 1: Open course management
    await user.click(screen.getByRole('button', { name: /manage courses/i }));

    // Step 2: Click Add New Course
    const addButton = await screen.findByRole('button', { name: /add new course/i });
    await user.click(addButton);

    // Step 3: Fill all required fields including teacher
    await user.type(screen.getByLabelText(/title/i), 'Integration Test Course');
    await user.type(screen.getByLabelText(/teacher/i), 'Dr. Integration Test');
    await user.type(screen.getByLabelText(/category/i), 'Testing');
    await user.selectOptions(screen.getByLabelText(/level/i), 'Avanzado');
    await user.type(screen.getByLabelText(/number of lessons/i), '25');
    await user.type(screen.getByLabelText(/duration/i), '12 horas');
    await user.type(screen.getByLabelText(/rating/i), '4.8');
    await user.type(screen.getByLabelText(/description/i), 'Comprehensive integration test course with full teacher assignment workflow validation');

    // Step 4: Submit form
    const createButton = screen.getByRole('button', { name: /create course/i });
    await waitFor(() => expect(createButton).not.toBeDisabled());
    await user.click(createButton);

    // Step 5: Verify course appears with teacher in management list
    await waitFor(() => {
      expect(screen.getAllByText('Integration Test Course').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dr. Integration Test').length).toBeGreaterThan(0);
    });

    // Step 6: Close modal and verify course appears in main catalog
    await user.click(screen.getByRole('button', { name: /close|cancel/i }));

    await waitFor(() => {
      expect(screen.getByText('Dr. Integration Test')).toBeInTheDocument();
    });
  });

  it('should show validation errors when teacher is missing during creation', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /manage courses/i }));
    await user.click(await screen.findByRole('button', { name: /add new course/i }));

    // Fill all fields EXCEPT teacher
    await user.type(screen.getByLabelText(/title/i), 'Course Without Teacher');
    await user.type(screen.getByLabelText(/category/i), 'Test');
    
    // Blur teacher field without entering value
    const teacherInput = screen.getByLabelText(/teacher/i);
    teacherInput.focus();
    teacherInput.blur();

    // Validation error should appear
    await waitFor(() => {
      expect(screen.getByText(/teacher name is required/i)).toBeInTheDocument();
    });

    // Submit button should be disabled
    expect(screen.getByRole('button', { name: /create course/i })).toBeDisabled();
  });

  it('should validate teacher length constraints during creation', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /manage courses/i }));
    await user.click(await screen.findByRole('button', { name: /add new course/i }));

    // Test minimum length (1 character - should fail)
    const teacherInput = screen.getByLabelText(/teacher/i);
    await user.type(teacherInput, 'A');
    teacherInput.blur();

    await waitFor(() => {
      expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument();
    });

    // Fix by adding more characters
    await user.clear(teacherInput);
    await user.type(teacherInput, 'Dr. Smith');

    await waitFor(() => {
      expect(screen.queryByText(/must be at least 2 characters/i)).not.toBeInTheDocument();
    });
  });
});
