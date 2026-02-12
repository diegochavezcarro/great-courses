import { Course } from '../courses';
import { CourseFormData, generateCourseId } from '../utils/validation';

export interface SearchFilters {
  query: string;
  category: string;
  level: string;
}

export class CourseService {
  private courses: Course[];
  private onUpdate: (courses: Course[]) => void;

  constructor(courses: Course[], onUpdate: (courses: Course[]) => void) {
    this.courses = courses;
    this.onUpdate = onUpdate;
  }

  getCourses(filters?: SearchFilters): Course[] {
    if (!filters) {
      return this.courses;
    }

    return this.courses.filter((course) => {
      const queryMatch =
        !filters.query ||
        course.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(filters.query.toLowerCase())
        );

      const categoryMatch = !filters.category || course.category === filters.category;
      const levelMatch = !filters.level || course.level === filters.level;

      return queryMatch && categoryMatch && levelMatch;
    });
  }

  createCourse(formData: CourseFormData): Course {
    const newCourse: Course = {
      id: generateCourseId(formData.title),
      title: formData.title,
      category: formData.category,
      level: formData.level as Course['level'],
      lessons: Number(formData.lessons),
      duration: formData.duration,
      rating: Number(formData.rating),
      description: formData.description,
      tags: formData.tags,
    };

    this.courses = [...this.courses, newCourse];
    this.onUpdate(this.courses);
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<CourseFormData>): Course | null {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index === -1) {
      return null;
    }

    const updatedCourse: Course = {
      ...this.courses[index],
      ...(updates.title && { title: updates.title }),
      ...(updates.category && { category: updates.category }),
      ...(updates.level && { level: updates.level as Course['level'] }),
      ...(updates.lessons && { lessons: Number(updates.lessons) }),
      ...(updates.duration && { duration: updates.duration }),
      ...(updates.rating !== undefined && { rating: Number(updates.rating) }),
      ...(updates.description && { description: updates.description }),
      ...(updates.tags && { tags: updates.tags }),
    };

    this.courses = [
      ...this.courses.slice(0, index),
      updatedCourse,
      ...this.courses.slice(index + 1),
    ];
    this.onUpdate(this.courses);
    return updatedCourse;
  }

  deleteCourse(id: string): boolean {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index === -1) {
      return false;
    }

    this.courses = [
      ...this.courses.slice(0, index),
      ...this.courses.slice(index + 1),
    ];
    this.onUpdate(this.courses);
    return true;
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find((course) => course.id === id);
  }

  getCategories(): string[] {
    return Array.from(new Set(this.courses.map((course) => course.category)));
  }
}
