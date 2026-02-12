import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseForm } from '@/components/course-management/course-form';
import { Course } from '@/data/courses';

describe('CourseForm - Teacher Input Field', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const existingCourses: Course[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Field Rendering', () => {
    it('should render teacher input field in create mode', () => {
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      expect(teacherInput).toBeInTheDocument();
      expect(teacherInput).toHaveAttribute('required');
    });

    it('should render teacher input between title and category', () => {
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const inputs = screen.getAllByRole('textbox');
      const labels = inputs.map(input => 
        input.closest('div')?.querySelector('label')?.textContent
      );

      const titleIndex = labels.findIndex(label => label?.includes('Title'));
      const teacherIndex = labels.findIndex(label => label?.includes('Teacher'));
      const categoryIndex = labels.findIndex(label => label?.includes('Category'));

      expect(titleIndex).toBeLessThan(teacherIndex);
      expect(teacherIndex).toBeLessThan(categoryIndex);
    });

    it('should have correct placeholder text', () => {
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      expect(teacherInput).toHaveAttribute('placeholder', 'e.g., Dr. Sarah Johnson');
    });

    it('should be marked as required field', () => {
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      expect(teacherInput).toHaveAttribute('required');
    });
  });

  describe('User Interaction', () => {
    it('should accept teacher input', async () => {
      const user = userEvent.setup();
      
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      await user.type(teacherInput, 'Dr. Sarah Johnson');

      expect(teacherInput).toHaveValue('Dr. Sarah Johnson');
    });

    it('should update teacher value on change', async () => {
      const user = userEvent.setup();
      
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      
      await user.type(teacherInput, 'Dr. Smith');
      expect(teacherInput).toHaveValue('Dr. Smith');
      
      await user.clear(teacherInput);
      await user.type(teacherInput, 'Prof. Johnson');
      expect(teacherInput).toHaveValue('Prof. Johnson');
    });

    it('should handle special characters in teacher name', async () => {
      const user = userEvent.setup();
      
      render(
        <CourseForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      await user.type(teacherInput, "Dr. O'Connor-Smith");

      expect(teacherInput).toHaveValue("Dr. O'Connor-Smith");
    });
  });

  describe('Edit Mode', () => {
    it('should pre-populate teacher field in edit mode', () => {
      const existingCourse: Course = {
        id: 'test-1',
        title: 'Test Course',
        teacher: 'Dr. Emily Williams',
        category: 'Programming',
        level: 'Intermedio',
        lessons: 20,
        duration: '10 horas',
        rating: 4.5,
        description: 'Test description',
        tags: ['test'],
      };

      render(
        <CourseForm
          mode="edit"
          initialData={existingCourse}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      expect(teacherInput).toHaveValue('Dr. Emily Williams');
    });

    it('should allow editing pre-populated teacher name', async () => {
      const user = userEvent.setup();
      
      const existingCourse: Course = {
        id: 'test-1',
        title: 'Test Course',
        teacher: 'Dr. Smith',
        category: 'Programming',
        level: 'Intermedio',
        lessons: 20,
        duration: '10 horas',
        rating: 4.5,
        description: 'Test description',
        tags: [],
      };

      render(
        <CourseForm
          mode="edit"
          initialData={existingCourse}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          existingCourses={existingCourses}
        />
      );

      const teacherInput = screen.getByPlaceholderText(/dr\. sarah johnson/i);
      
      await user.clear(teacherInput);
      await user.type(teacherInput, 'Prof. Johnson');
      
      expect(teacherInput).toHaveValue('Prof. Johnson');
    });
  });
});
