import { Course, CourseLevel } from '../courses';

export interface CourseFormData {
  title: string;
  teacher: string;
  category: string;
  level: CourseLevel | '';
  lessons: number | '';
  duration: string;
  rating: number | '';
  description: string;
  tags: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CourseFormData, string>>;
  warnings: string[];
}

export function validateCourseForm(
  data: CourseFormData,
  existingCourses?: Course[]
): FormValidationResult {
  const errors: Partial<Record<keyof CourseFormData, string>> = {};
  const warnings: string[] = [];

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 120) {
    errors.title = 'Title must be 120 characters or less';
  } else if (existingCourses) {
    const duplicateTitle = existingCourses.some(
      (course) => course.title.toLowerCase() === data.title.toLowerCase()
    );
    if (duplicateTitle) {
      warnings.push('A course with this title already exists');
    }
  }

  // Teacher validation
  if (!data.teacher || !data.teacher.trim()) {
    errors.teacher = 'Teacher name is required';
  } else if (data.teacher.trim().length < 2) {
    errors.teacher = 'Teacher name must be at least 2 characters';
  } else if (data.teacher.trim().length > 100) {
    errors.teacher = 'Teacher name must not exceed 100 characters';
  }

  // Category validation
  if (!data.category.trim()) {
    errors.category = 'Category is required';
  } else if (data.category.length < 2) {
    errors.category = 'Category must be at least 2 characters';
  } else if (data.category.length > 50) {
    errors.category = 'Category must be 50 characters or less';
  }

  // Level validation
  if (!data.level) {
    errors.level = 'Level is required';
  }

  // Lessons validation
  if (data.lessons === '') {
    errors.lessons = 'Number of lessons is required';
  } else if (typeof data.lessons === 'number') {
    if (data.lessons < 1) {
      errors.lessons = 'Number of lessons must be at least 1';
    } else if (data.lessons > 999) {
      errors.lessons = 'Number of lessons must be 999 or less';
    }
  }

  // Duration validation
  if (!data.duration.trim()) {
    errors.duration = 'Duration is required';
  }

  // Rating validation
  if (data.rating === '') {
    errors.rating = 'Rating is required';
  } else if (typeof data.rating === 'number') {
    if (data.rating < 0) {
      errors.rating = 'Rating must be at least 0';
    } else if (data.rating > 5) {
      errors.rating = 'Rating must be 5 or less';
    }
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }

  // Tags validation (optional field)
  if (data.tags.length > 10) {
    errors.tags = 'Maximum of 10 tags allowed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

export function generateCourseId(title: string): string {
  const timestamp = Date.now();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-${timestamp}`;
}
