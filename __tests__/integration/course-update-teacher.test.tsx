import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

/**
 * Integration Test: Course update workflow with teacher modification
 * Tests editing existing courses and updating teacher information
 */
describe('Integration: Course Update with Teacher', () => {
  it('should complete full course update workflow with teacher change', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    // Open management and edit first course
    await user.click(screen.getByRole('button', { name: /manage courses/i }));
    
    const editButtons = await screen.findAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Verify teacher field is pre-populated
    const teacherInput = await screen.findByLabelText(/teacher/i);
    expect(teacherInput).toHaveValue('Dr. Sarah Johnson');

    // Update teacher name
    await user.clear(teacherInput);
    await user.type(teacherInput, 'Dr. Updated Professor');

    // Submit update
    await user.click(screen.getByRole('button', { name: /update course/i }));

    // Verify updated teacher appears and old one is gone
    await waitFor(() => {
      expect(screen.getAllByText('Dr. Updated Professor').length).toBeGreaterThan(0);
      expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
    });
  });

  it('should preserve teacher when updating other fields', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /manage courses/i }));
    
    const editButtons = await screen.findAllByRole('button', { name: /edit/i });
    await user.click(editButtons[1]);

    // Get original teacher value from input
    const teacherInput = await screen.findByLabelText(/teacher/i) as HTMLInputElement;
    const originalTeacher = teacherInput.value;

    // Update only the title
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Course Title');

    // Submit without changing teacher
    await user.click(screen.getByRole('button', { name: /update course/i }));

    // Verify teacher remains unchanged in the list
    await waitFor(() => {
      expect(screen.getAllByText(originalTeacher).length).toBeGreaterThan(0);
    });
  });

  it('should validate teacher constraints when updating', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /manage courses/i }));
    
    const editButtons = await screen.findAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Try to clear teacher (should fail validation)
    const teacherInput = await screen.findByLabelText(/teacher/i);
    await user.clear(teacherInput);

    await waitFor(() => {
      expect(screen.getByText(/teacher name is required/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update course/i })).toBeDisabled();
    });
  });
});
