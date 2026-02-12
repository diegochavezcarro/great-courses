import { render, screen } from '@testing-library/react';
import { CourseCard } from '@/components/course-card';
import { Course } from '@/data/courses';

describe('CourseCard - Teacher Display', () => {
  const mockCourse: Course = {
    id: 'test-course-1',
    title: 'Test Course',
    teacher: 'Dr. Sarah Johnson',
    category: 'Web Development',
    level: 'Intermedio',
    lessons: 24,
    duration: '14 horas',
    rating: 4.9,
    description: 'A comprehensive test course',
    tags: ['Next.js', 'TypeScript'],
  };

  it('should render teacher name with icon', () => {
    render(<CourseCard course={mockCourse} />);
    
    // Verify teacher name is displayed
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
  });

  it('should render teacher icon (user SVG)', () => {
    const { container } = render(<CourseCard course={mockCourse} />);
    
    // Verify SVG icon is present
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should display teacher below course title', () => {
    const { container } = render(<CourseCard course={mockCourse} />);
    
    const title = screen.getByText('Test Course');
    const teacher = screen.getByText('Dr. Sarah Johnson');
    
    // Verify teacher appears after title in DOM order
    const titleElement = title.parentElement;
    const teacherElement = teacher.closest('div');
    
    // Use DOM position check - teacher div should follow title element
    const result = titleElement?.compareDocumentPosition(teacherElement!);
    // DOCUMENT_POSITION_FOLLOWING (4) means teacherElement follows titleElement
    expect(result & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('should apply correct styling to teacher display', () => {
    const { container } = render(<CourseCard course={mockCourse} />);
    
    const teacherContainer = screen.getByText('Dr. Sarah Johnson').closest('div');
    
    // Verify flex layout classes
    expect(teacherContainer).toHaveClass('flex', 'items-center', 'gap-1');
    expect(teacherContainer).toHaveClass('text-sm', 'text-slate-600');
  });

  it('should render teacher with different names correctly', () => {
    const courseWithDifferentTeacher = {
      ...mockCourse,
      teacher: 'Prof. Michael Chen',
    };
    
    render(<CourseCard course={courseWithDifferentTeacher} />);
    
    expect(screen.getByText('Prof. Michael Chen')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
  });

  it('should render all course information including teacher', () => {
    render(<CourseCard course={mockCourse} />);
    
    // Verify all key course information is present
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText(/4\.9/)).toBeInTheDocument(); // Use regex to handle formatting
    expect(screen.getByText('24 lecciones')).toBeInTheDocument();
    expect(screen.getByText('14 horas')).toBeInTheDocument();
  });
});
