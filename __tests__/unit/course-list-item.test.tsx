import { render, screen } from '@testing-library/react';
import { CourseListItem } from '@/components/course-management/course-list-item';
import { Course } from '@/data/courses';

describe('CourseListItem - Teacher Display', () => {
  const mockCourse: Course = {
    id: 'test-course-1',
    title: 'Test Course',
    teacher: 'Dr. Emily Williams',
    category: 'Data Science',
    level: 'Avanzado',
    lessons: 30,
    duration: '20 horas',
    rating: 4.8,
    description: 'Advanced data science course',
    tags: ['Python', 'ML'],
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render teacher name with icon', () => {
    render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    expect(screen.getByText('Dr. Emily Williams')).toBeInTheDocument();
  });

  it('should render teacher icon (user SVG)', () => {
    const { container } = render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    // Verify SVG icon is present with correct attributes
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('should display teacher below course title and above metadata', () => {
    const { container } = render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    const title = screen.getByText('Test Course');
    const teacher = screen.getByText('Dr. Emily Williams');
    const category = screen.getByText('Data Science');
    
    // Verify order: title -> teacher -> category/metadata
    const titleElement = title.parentElement;
    const teacherElement = teacher.closest('div');
    const categoryElement = category.closest('span');
    
    expect(titleElement?.compareDocumentPosition(teacherElement!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(teacherElement?.compareDocumentPosition(categoryElement!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('should apply correct styling to teacher display', () => {
    const { container } = render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    const teacherContainer = screen.getByText('Dr. Emily Williams').closest('div');
    
    // Verify flex layout and text styling
    expect(teacherContainer).toHaveClass('flex', 'items-center', 'gap-1');
    expect(teacherContainer).toHaveClass('text-sm', 'text-gray-600');
  });

  it('should render teacher with different names correctly', () => {
    const courseWithDifferentTeacher = {
      ...mockCourse,
      teacher: 'Prof. John Smith',
    };
    
    render(<CourseListItem course={courseWithDifferentTeacher} {...mockHandlers} />);
    
    expect(screen.getByText('Prof. John Smith')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Emily Williams')).not.toBeInTheDocument();
  });

  it('should render Edit and Delete buttons alongside teacher info', () => {
    render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    expect(screen.getByText('Dr. Emily Williams')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should render all course metadata including teacher', () => {
    render(<CourseListItem course={mockCourse} {...mockHandlers} />);
    
    // Verify all key information is displayed
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Williams')).toBeInTheDocument();
    expect(screen.getByText('Data Science')).toBeInTheDocument();
    expect(screen.getByText('Avanzado')).toBeInTheDocument();
    expect(screen.getByText(/30 lessons/i)).toBeInTheDocument();
    expect(screen.getByText('20 horas')).toBeInTheDocument();
  });
});
