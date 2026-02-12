# Data Model: Add Teacher Field to Course Entity

**Feature**: 002-add-teacher-field  
**Phase**: 1 (Design & Contracts)  
**Date**: 2026-02-11

## Overview

This document defines the data model changes required to add a teacher field to the Course entity. The teacher field is a required string (2-100 characters) representing the course instructor's name.

## Entity: Course

### Updated Schema

```typescript
export interface Course {
  id: string;              // Unique identifier (slug-timestamp format)
  title: string;           // Course title (2-100 chars, required)
  teacher: string;         // NEW: Instructor name (2-100 chars, required)
  category: string;        // Course category (2-100 chars, required)
  level: CourseLevel;      // Difficulty level (beginner/intermediate/advanced)
  lessons: number;         // Number of lessons (positive integer)
  duration: string;        // Duration format (e.g., "4 weeks", "10 hours")
  rating: number;          // Rating score (0-5)
  description: string;     // Course description (2-500 chars)
  tags: string[];          // Array of tag strings
}
```

### Field Specifications

#### teacher (NEW)

- **Type**: `string`
- **Required**: Yes
- **Constraints**: 
  - Minimum length: 2 characters
  - Maximum length: 100 characters
  - No whitespace-only values
  - Trimmed before validation
- **Default**: None (must be provided by user)
- **Purpose**: Store the name of the course instructor
- **Display**: Below course title with instructor icon
- **Examples**: 
  - Valid: "Dr. Sarah Johnson", "Prof. Michael Chen", "John Smith", "María García"
  - Invalid: "A" (too short), "" (empty), "   " (whitespace-only)

### Validation Rules

```typescript
// data/utils/validation.ts
interface ValidationErrors {
  title?: string;
  teacher?: string;     // NEW: Teacher validation error message
  category?: string;
  level?: string;
  lessons?: string;
  duration?: string;
  description?: string;
  tags?: string;
}

export function validateCourseForm(data: CourseFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Existing validations...
  
  // NEW: Teacher validation
  if (!data.teacher || data.teacher.trim().length < 2) {
    errors.teacher = 'Teacher name must be at least 2 characters';
  } else if (data.teacher.trim().length > 100) {
    errors.teacher = 'Teacher name must not exceed 100 characters';
  }

  return errors;
}
```

## Form Data Transfer Object

### CourseFormData

```typescript
// components/course-management/course-form.tsx
interface CourseFormData {
  title: string;
  teacher: string;        // NEW: Form input for teacher
  category: string;
  level: CourseLevel;
  lessons: string;        // String in form, converted to number for Course
  duration: string;
  description: string;
  tags: string;           // Comma-separated string in form, parsed to array
}
```

### Initial Form State

```typescript
// For new course creation
const emptyFormData: CourseFormData = {
  title: '',
  teacher: '',            // NEW: Empty string for new courses
  category: '',
  level: 'beginner',
  lessons: '',
  duration: '',
  description: '',
  tags: '',
};

// For editing existing course
const formDataFromCourse = (course: Course): CourseFormData => ({
  title: course.title,
  teacher: course.teacher,              // NEW: Populate from course
  category: course.category,
  level: course.level,
  lessons: course.lessons.toString(),
  duration: course.duration,
  description: course.description,
  tags: course.tags.join(', '),
});
```

## Data Migration

### Existing Courses Without Teacher

Courses created in Feature 001 do not have a teacher field. The migration strategy is:

1. **TypeScript Compiler**: Will flag missing teacher field in existing sample data
2. **Sample Data Update**: Add teacher to all courses in `data/courses.ts`
3. **Runtime Handling**: When editing an existing course without teacher:
   - Display warning badge in form
   - Block form submission until teacher is added
   - Validation error: "Teacher name must be at least 2 characters"

### Example Migration

```typescript
// Before (Feature 001)
export const featuredCourses: Course[] = [
  {
    id: 'nextjs-fundamentals-1699564800000',
    title: 'Next.js Fundamentals',
    category: 'Web Development',
    level: 'beginner',
    // ... other fields
  },
];

// After (Feature 002)
export const featuredCourses: Course[] = [
  {
    id: 'nextjs-fundamentals-1699564800000',
    title: 'Next.js Fundamentals',
    teacher: 'Dr. Sarah Johnson',        // NEW: Required field added
    category: 'Web Development',
    level: 'beginner',
    // ... other fields
  },
];
```

## State Management

### Component State

```typescript
// app/page.tsx - Homepage component
const [courses, setCourses] = useState<Course[]>(featuredCourses);

// Teacher field automatically included in Course[] type
```

### CRUD Operations

```typescript
// data/services/course-service.ts
class CourseService {
  createCourse(courseData: Omit<Course, 'id'>): Course {
    // Teacher field required in courseData parameter
    const newCourse: Course = {
      id: generateCourseId(courseData.title),
      ...courseData,
      teacher: courseData.teacher,    // NEW: Teacher included in creation
    };
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course {
    // Teacher field can be updated via updates parameter
    const course = this.courses.find(c => c.id === id);
    return { ...course, ...updates };
  }
}
```

## Relationships

### Current Scope (Feature 002)

- **Teacher → Course**: One-to-many (conceptually, not enforced)
  - One teacher can teach multiple courses
  - Each course has exactly one teacher
  - Teacher is stored as denormalized string in Course entity

### Future Considerations (Out of Scope)

- Teacher as separate entity with ID references
- Teacher profile pages with bio, photo, credentials
- Teacher-based filtering/search
- Multiple teachers per course

## Data Flow Diagram

```text
User Input (Form)
       ↓
CourseFormData { teacher: string }
       ↓
validateCourseForm()
       ↓ (if valid)
CourseService.createCourse() / updateCourse()
       ↓
Course { teacher: string }
       ↓
courses state (useState)
       ↓
CourseCard / CourseListItem
       ↓
Display: [Icon] {course.teacher}
```

## Type Safety

### Compiler Guarantees

- TypeScript enforces teacher field presence in Course interface
- All CRUD operations must handle teacher (compiler error if missing)
- Form components must include teacher input (type mismatch otherwise)
- Display components receive teacher automatically via Course type

### Runtime Validation

- Form submission blocked if teacher is invalid (< 2 chars or > 100 chars)
- Validation errors displayed inline below teacher input field
- Warning badge shown for existing courses without teacher

## Testing Considerations

### Data Scenarios to Test

1. **Create course with valid teacher**: 2-100 character name
2. **Create course with invalid teacher**: Empty, < 2 chars, > 100 chars, whitespace-only
3. **Edit course with existing teacher**: Update teacher name
4. **Edit course without teacher**: Display warning, require teacher before save
5. **Display course with teacher**: Show teacher with icon below title
6. **Search/filter courses**: Teacher field does not affect existing search logic

### Test Data

```typescript
// Valid test courses
const validCourse: Course = {
  id: 'test-course-123',
  title: 'Test Course',
  teacher: 'Dr. Test Instructor',    // Valid: 2-100 chars
  category: 'Testing',
  level: 'beginner',
  lessons: 10,
  duration: '5 weeks',
  rating: 4.5,
  description: 'Test description',
  tags: ['test'],
};

// Invalid test data
const invalidTeacher1 = '';           // Empty
const invalidTeacher2 = 'A';          // Too short
const invalidTeacher3 = 'x'.repeat(101); // Too long
const invalidTeacher4 = '   ';        // Whitespace-only
```

## Summary

The teacher field addition is a straightforward schema extension:

- **Entity Change**: Add required string field to Course interface
- **Validation**: Apply 2-100 character constraint matching other fields
- **Migration**: Manual teacher assignment on first edit for existing courses
- **Display**: Icon + text below title in all course views
- **Type Safety**: TypeScript enforces teacher presence across all operations

No complex relationships, external dependencies, or architectural changes required.
