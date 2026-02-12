import { validateCourseForm, CourseFormData } from '@/data/utils/validation';
import { Course } from '@/data/courses';

describe('Teacher Validation', () => {
  const validFormData: CourseFormData = {
    title: 'Test Course',
    teacher: 'Dr. Sarah Johnson',
    category: 'Web Development',
    level: 'Intermedio',
    lessons: 20,
    duration: '10 horas',
    rating: 4.5,
    description: 'A comprehensive test course description',
    tags: ['test'],
  };

  const existingCourses: Course[] = [];

  describe('Required Field Validation', () => {
    it('should fail validation when teacher is empty string', () => {
      const formData = { ...validFormData, teacher: '' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name is required');
    });

    it('should fail validation when teacher is only whitespace', () => {
      const formData = { ...validFormData, teacher: '   ' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name is required');
    });

    it('should fail validation when teacher is undefined', () => {
      const formData = { ...validFormData, teacher: undefined as any };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name is required');
    });
  });

  describe('Minimum Length Validation', () => {
    it('should fail validation when teacher is 1 character', () => {
      const formData = { ...validFormData, teacher: 'A' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name must be at least 2 characters');
    });

    it('should pass validation when teacher is exactly 2 characters', () => {
      const formData = { ...validFormData, teacher: 'Dr' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should fail when teacher has leading/trailing spaces and is too short', () => {
      const formData = { ...validFormData, teacher: ' A ' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name must be at least 2 characters');
    });
  });

  describe('Maximum Length Validation', () => {
    it('should fail validation when teacher exceeds 100 characters', () => {
      const longName = 'Dr. ' + 'A'.repeat(98); // 102 characters total
      const formData = { ...validFormData, teacher: longName };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name must not exceed 100 characters');
    });

    it('should pass validation when teacher is exactly 100 characters', () => {
      const exactLength = 'Dr. ' + 'A'.repeat(96); // 100 characters total
      const formData = { ...validFormData, teacher: exactLength };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation when teacher is 99 characters', () => {
      const justUnder = 'Dr. ' + 'A'.repeat(95); // 99 characters total
      const formData = { ...validFormData, teacher: justUnder };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });
  });

  describe('Valid Teacher Names', () => {
    it('should pass validation with typical teacher name', () => {
      const formData = { ...validFormData, teacher: 'Dr. Sarah Johnson' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation with professor title', () => {
      const formData = { ...validFormData, teacher: 'Prof. Michael Chen' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation with full name without title', () => {
      const formData = { ...validFormData, teacher: 'Emily Williams' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation with name containing hyphens', () => {
      const formData = { ...validFormData, teacher: 'Dr. Mary-Anne Smith-Jones' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation with name containing apostrophes', () => {
      const formData = { ...validFormData, teacher: "Dr. O'Connor" };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should pass validation with international characters', () => {
      const formData = { ...validFormData, teacher: 'Dr. José García' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });

    it('should trim whitespace and validate correctly', () => {
      const formData = { ...validFormData, teacher: '  Dr. Sarah Johnson  ' };
      const result = validateCourseForm(formData, existingCourses);

      expect(result.errors.teacher).toBeUndefined();
    });
  });

  describe('Integration with Other Field Validations', () => {
    it('should validate teacher alongside other required fields', () => {
      const incompleteData: CourseFormData = {
        title: '',
        teacher: '',
        category: '',
        level: '',
        lessons: '',
        duration: '',
        rating: '',
        description: '',
        tags: [],
      };

      const result = validateCourseForm(incompleteData, existingCourses);

      expect(result.isValid).toBe(false);
      expect(result.errors.teacher).toBe('Teacher name is required');
      expect(result.errors.title).toBeDefined();
      expect(result.errors.category).toBeDefined();
    });

    it('should pass when all fields including teacher are valid', () => {
      const result = validateCourseForm(validFormData, existingCourses);

      expect(result.isValid).toBe(true);
      expect(result.errors.teacher).toBeUndefined();
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
