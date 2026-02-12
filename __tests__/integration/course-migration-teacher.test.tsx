import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseForm } from '@/components/course-management/course-form';
import { Course } from '@/data/courses';

/**
 * Integration Test: Migration workflow for courses without teacher
 * Tests warning badge display and forced teacher assignment for legacy courses
 */
describe('Integration: Course Migration - Teacher Assignment', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show warning badge when editing course without teacher', () => {
    const legacyCourse: Course = {
      id: 'legacy-1',
      title: 'Legacy Course',
      teacher: '', // Missing teacher
      category: 'Programming',
      level: 'Intermedio',
      lessons: 20,
      duration: '10 horas',
      rating: 4.5,
      image: '/images/course.jpg',
      description: 'Course from before teacher field was required',
      tags: ['legacy'],
    };

    render(
      <CourseForm
        mode="edit"
        initialData={legacyCourse}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Verify warning badge is displayed
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    expect(screen.getByText(/requires a teacher assignment/i)).toBeInTheDocument();
    expect(screen.getByText(/add teacher information below/i)).toBeInTheDocument();
  });

  it('should enforce teacher assignment before allowing save', async () => {
    const legacyCourse: Course = {
      id: 'legacy-1',
      title: 'Legacy Course',
      teacher: '',
      category: 'Programming',
      level: 'Intermedio',
      lessons: 20,
      duration: '10 horas',
      rating: 4.5,
      image: '/images/course.jpg',
      description: 'Course from before teacher field was required',
      tags: [],
    };

    render(
      <CourseForm
        mode="edit"
        initialData={legacyCourse}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Submit button should be disabled initially
    const updateButton = screen.getByRole('button', { name: /update course/i });
    await waitFor(() => {
      expect(updateButton).toBeDisabled();
    });

    // Validation error should be present
    expect(screen.getByText(/teacher name is required/i)).toBeInTheDocument();
  });

  it('should remove warning and enable save after teacher is added', async () => {
    const user = userEvent.setup();
    
    const legacyCourse: Course = {
      id: 'legacy-1',
      title: 'Legacy Course',
      teacher: '',
      category: 'Programming',
      level: 'Intermedio',
      lessons: 20,
      duration: '10 horas',
      rating: 4.5,
      image: '/images/course.jpg',
      description: 'Course from before teacher field was required',
      tags: [],
    };

    render(
      <CourseForm
        mode="edit"
        initialData={legacyCourse}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Verify warning is shown
    expect(screen.getByText(/requires a teacher assignment/i)).toBeInTheDocument();

    // Add teacher to the field
    const teacherInput = screen.getByLabelText(/teacher/i) as HTMLInputElement;
    await user.type(teacherInput, 'Dr. Newly Assigned');

    // Warning should still be shown (only removed after save)
    // But validation error should be gone and button should be enabled
    await waitFor(() => {
      const updateButton = screen.getByRole('button', { name: /update course/i });
      expect(updateButton).not.toBeDisabled();
      expect(screen.queryByText(/teacher name is required/i)).not.toBeInTheDocument();
    });

    // Teacher value should be in the input
    expect(teacherInput).toHaveValue('Dr. Newly Assigned');
  });

  it('should not show warning for courses that already have teacher', () => {
    const normalCourse: Course = {
      id: 'normal-1',
      title: 'Normal Course',
      teacher: 'Dr. Existing Teacher',
      category: 'Programming',
      level: 'Intermedio',
      lessons: 20,
      duration: '10 horas',
      rating: 4.5,
      image: '/images/course.jpg',
      description: 'Course with teacher already assigned',
      tags: [],
    };

    render(
      <CourseForm
        mode="edit"
        initialData={normalCourse}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // No warning badge should be shown
    expect(screen.queryByText(/requires a teacher assignment/i)).not.toBeInTheDocument();
  });
});
