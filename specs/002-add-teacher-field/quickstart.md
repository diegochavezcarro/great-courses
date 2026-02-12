# Quickstart Guide: Add Teacher Field to Course Entity

**Feature**: 002-add-teacher-field  
**Phase**: 1 (Design & Contracts)  
**Date**: 2026-02-11  
**Estimated Time**: 2-3 hours for full implementation + tests

## Overview

This guide provides step-by-step instructions for implementing the teacher field addition to the Course entity. Follow the steps in order to ensure all components are updated consistently.

---

## Prerequisites

- Feature 001 (Course CRUD) fully implemented and tested
- Development environment set up (Node.js, Next.js, TypeScript)
- Git branch `002-add-teacher-field` created and checked out
- Testing frameworks configured (Jest, Testing Library, Playwright)

---

## Phase 1: Data Model Updates (30 minutes)

### Step 1.1: Update Course Interface

**File**: `data/courses.ts`

1. Open `data/courses.ts`
2. Locate the `Course` interface definition
3. Add teacher field after title:

```typescript
export interface Course {
  id: string;
  title: string;
  teacher: string;  // ADD THIS LINE
  category: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
}
```

4. Save file - TypeScript compiler will flag all usages missing teacher

### Step 1.2: Add Teacher to Sample Data

**File**: `data/courses.ts`

1. Locate `featuredCourses` array
2. Add teacher field to each course object:

```typescript
export const featuredCourses: Course[] = [
  {
    id: 'nextjs-fundamentals-1699564800000',
    title: 'Next.js Fundamentals',
    teacher: 'Dr. Sarah Johnson',  // ADD FOR EACH COURSE
    category: 'Web Development',
    // ... rest of fields
  },
  // Repeat for all courses in array
];
```

3. Choose realistic teacher names (e.g., "Dr. Sarah Johnson", "Prof. Michael Chen")
4. Save file and verify no TypeScript errors

### Step 1.3: Update Validation Logic

**File**: `data/utils/validation.ts`

1. Open `data/utils/validation.ts`
2. Add teacher to `ValidationErrors` interface:

```typescript
interface ValidationErrors {
  title?: string;
  teacher?: string;  // ADD THIS LINE
  category?: string;
  // ... other fields
}
```

3. Locate `validateCourseForm` function
4. Add teacher validation after title validation:

```typescript
export function validateCourseForm(data: CourseFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Existing title validation...

  // ADD TEACHER VALIDATION
  const teacherTrimmed = data.teacher.trim();
  if (!teacherTrimmed) {
    errors.teacher = 'Teacher name is required';
  } else if (teacherTrimmed.length < 2) {
    errors.teacher = 'Teacher name must be at least 2 characters';
  } else if (teacherTrimmed.length > 100) {
    errors.teacher = 'Teacher name must not exceed 100 characters';
  }

  // Existing category, level, etc. validations...

  return errors;
}
```

5. Save file

---

## Phase 2: Service Layer Updates (20 minutes)

### Step 2.1: Update CourseService Search

**File**: `data/services/course-service.ts`

1. Open `data/services/course-service.ts`
2. Locate `searchCourses` method
3. Add teacher to search query:

```typescript
searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return this.courses.filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.teacher.toLowerCase().includes(lowerQuery) ||  // ADD THIS LINE
    course.category.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
```

4. No changes needed to `createCourse`, `updateCourse` - TypeScript handles teacher automatically
5. Save file

---

## Phase 3: Component Updates (60 minutes)

### Step 3.1: Update CourseForm Component

**File**: `components/course-management/course-form.tsx`

1. Open `components/course-management/course-form.tsx`
2. Add teacher to `CourseFormData` interface:

```typescript
interface CourseFormData {
  title: string;
  teacher: string;  // ADD THIS LINE
  category: string;
  // ... other fields
}
```

3. Update initial form state:

```typescript
// For new courses
const emptyFormData: CourseFormData = {
  title: '',
  teacher: '',  // ADD THIS LINE
  category: '',
  // ... other fields
};

// For editing existing courses
const [formData, setFormData] = useState<CourseFormData>({
  title: course?.title || '',
  teacher: course?.teacher || '',  // ADD THIS LINE
  category: course?.category || '',
  // ... other fields
});
```

4. Add warning badge for courses without teacher (after form heading):

```tsx
{course && !course.teacher && (
  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-sm text-yellow-800">
      ⚠️ This course requires a teacher assignment. Please add teacher information below.
    </p>
  </div>
)}
```

5. Add teacher input field (between title and category inputs):

```tsx
<Input
  id="teacher"
  label="Teacher"
  value={formData.teacher}
  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
  error={errors.teacher}
  placeholder="Enter instructor name"
  required
/>
```

6. Save file

### Step 3.2: Update CourseCard Component

**File**: `components/course-card.tsx`

1. Open `components/course-card.tsx`
2. Locate the JSX where title is rendered
3. Add teacher display immediately after title:

```tsx
<h3 className="text-xl font-semibold mb-2">{course.title}</h3>

{/* ADD TEACHER DISPLAY */}
<div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
  <svg 
    className="w-4 h-4" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
  <span>{course.teacher}</span>
</div>

{/* Existing metadata: category, level, etc. */}
```

4. Save file

### Step 3.3: Update CourseListItem Component

**File**: `components/course-management/course-list-item.tsx`

1. Open `components/course-management/course-list-item.tsx`
2. Locate title rendering in the list item
3. Add teacher display after title (same as CourseCard):

```tsx
<h4 className="font-semibold text-lg">{course.title}</h4>

{/* ADD TEACHER DISPLAY */}
<div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
  <svg 
    className="w-4 h-4" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
  <span>{course.teacher}</span>
</div>

{/* Existing metadata */}
```

4. Save file

### Step 3.4: Update CourseManagementModal Component

**File**: `components/course-management/course-management-modal.tsx`

1. Open `components/course-management/course-management-modal.tsx`
2. Locate `handleCreateCourse` function
3. Add teacher to course creation:

```typescript
const handleCreateCourse = (formData: CourseFormData) => {
  const validationErrors = validateCourseForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    // Handle errors
    return;
  }

  const newCourse = courseService.createCourse({
    title: formData.title,
    teacher: formData.teacher,  // ADD THIS LINE
    category: formData.category,
    level: formData.level,
    lessons: parseInt(formData.lessons),
    duration: formData.duration,
    rating: 0,
    description: formData.description,
    tags: formData.tags.split(',').map(t => t.trim()),
  });

  setCourses([...courses, newCourse]);
  setView('list');
};
```

4. Locate `handleUpdateCourse` function
5. Add teacher to course update:

```typescript
const handleUpdateCourse = (formData: CourseFormData) => {
  if (!selectedCourse) return;

  const validationErrors = validateCourseForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    // Handle errors
    return;
  }

  const updatedCourse = courseService.updateCourse(selectedCourse.id, {
    title: formData.title,
    teacher: formData.teacher,  // ADD THIS LINE
    category: formData.category,
    level: formData.level,
    lessons: parseInt(formData.lessons),
    duration: formData.duration,
    description: formData.description,
    tags: formData.tags.split(',').map(t => t.trim()),
  });

  setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  setView('list');
};
```

6. Save file

---

## Phase 4: Build and Manual Testing (20 minutes)

### Step 4.1: Build Verification

```bash
# Run Next.js build
npm run build

# Verify no TypeScript errors
# Look for teacher-related type errors
```

### Step 4.2: Dev Server Testing

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3000 (or 3001 if 3000 in use)
```

### Step 4.3: Manual Test Scenarios

**Test 1: Display Teacher on Homepage**
1. Homepage should show all courses with teacher below title
2. Verify instructor icon displays correctly
3. Check mobile responsive layout (resize browser)

**Test 2: Create New Course with Teacher**
1. Click "Manage Courses" button
2. Click "Create Course"
3. Fill all fields including teacher (e.g., "Dr. Jane Smith")
4. Submit form
5. Verify new course appears in list with teacher
6. Close modal, verify course displays on homepage with teacher

**Test 3: Create Course Without Teacher (Validation)**
1. Click "Manage Courses" → "Create Course"
2. Fill all fields EXCEPT teacher
3. Submit form
4. Verify error message: "Teacher name is required"
5. Enter single character "A" in teacher field
6. Verify error: "Teacher name must be at least 2 characters"
7. Enter valid teacher name (2+ chars)
8. Submit successfully

**Test 4: Edit Existing Course with Teacher**
1. Click "Manage Courses"
2. Click "Edit" on any course
3. Verify teacher field is pre-filled
4. Change teacher name
5. Submit
6. Verify updated teacher displays in list and homepage

**Test 5: Edit Course Without Teacher (Migration)**
- **Note**: If your sample data already has teacher (from Step 1.2), manually test by:
  1. Temporarily removing teacher from one course in data/courses.ts
  2. Refresh browser
  3. Click "Edit" on that course
  4. Verify yellow warning badge appears
  5. Try submitting without adding teacher - should show validation error
  6. Add teacher name and submit successfully
  7. Restore teacher to sample data

**Test 6: Search by Teacher Name**
1. Click "Manage Courses"
2. In search box, type part of a teacher name (e.g., "Sarah")
3. Verify courses taught by that teacher appear
4. Clear search, try another teacher name

---

## Phase 5: Automated Testing (40 minutes)

### Step 5.1: Unit Tests for Validation

**File**: `__tests__/unit/validation.test.ts` (CREATE NEW)

```typescript
import { validateCourseForm } from '@/data/utils/validation';
import { CourseFormData } from '@/components/course-management/course-form';

describe('validateCourseForm - Teacher Field', () => {
  const validFormData: CourseFormData = {
    title: 'Test Course',
    teacher: 'Dr. Test Instructor',
    category: 'Testing',
    level: 'beginner',
    lessons: '10',
    duration: '5 weeks',
    description: 'Test description',
    tags: 'test, demo',
  };

  it('should pass validation with valid teacher (2-100 chars)', () => {
    const errors = validateCourseForm(validFormData);
    expect(errors.teacher).toBeUndefined();
  });

  it('should fail validation with empty teacher', () => {
    const errors = validateCourseForm({ ...validFormData, teacher: '' });
    expect(errors.teacher).toBe('Teacher name is required');
  });

  it('should fail validation with teacher < 2 chars', () => {
    const errors = validateCourseForm({ ...validFormData, teacher: 'A' });
    expect(errors.teacher).toBe('Teacher name must be at least 2 characters');
  });

  it('should fail validation with teacher > 100 chars', () => {
    const longTeacher = 'A'.repeat(101);
    const errors = validateCourseForm({ ...validFormData, teacher: longTeacher });
    expect(errors.teacher).toBe('Teacher name must not exceed 100 characters');
  });

  it('should fail validation with whitespace-only teacher', () => {
    const errors = validateCourseForm({ ...validFormData, teacher: '   ' });
    expect(errors.teacher).toBe('Teacher name is required');
  });
});
```

Run tests:
```bash
npm run test -- validation.test.ts
```

### Step 5.2: Unit Tests for CourseForm Component

**File**: `__tests__/unit/course-form.test.tsx` (CREATE NEW)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import CourseForm from '@/components/course-management/course-form';

describe('CourseForm - Teacher Field', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  it('should render teacher input field', () => {
    render(<CourseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const teacherInput = screen.getByLabelText(/teacher/i);
    expect(teacherInput).toBeInTheDocument();
    expect(teacherInput).toHaveAttribute('required');
  });

  it('should show warning badge for course without teacher', () => {
    const courseWithoutTeacher = {
      id: 'test-1',
      title: 'Test Course',
      teacher: '',  // Empty teacher
      category: 'Test',
      level: 'beginner',
      lessons: 10,
      duration: '5 weeks',
      rating: 4.5,
      description: 'Test',
      tags: ['test'],
    };

    render(
      <CourseForm
        course={courseWithoutTeacher}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const warningBadge = screen.getByText(/requires a teacher assignment/i);
    expect(warningBadge).toBeInTheDocument();
  });

  it('should pre-fill teacher field when editing course', () => {
    const existingCourse = {
      id: 'test-1',
      title: 'Test Course',
      teacher: 'Dr. Sarah Johnson',
      category: 'Test',
      level: 'beginner',
      lessons: 10,
      duration: '5 weeks',
      rating: 4.5,
      description: 'Test',
      tags: ['test'],
    };

    render(
      <CourseForm
        course={existingCourse}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const teacherInput = screen.getByLabelText(/teacher/i) as HTMLInputElement;
    expect(teacherInput.value).toBe('Dr. Sarah Johnson');
  });

  it('should show validation error for invalid teacher', () => {
    render(<CourseForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const teacherInput = screen.getByLabelText(/teacher/i);
    const submitButton = screen.getByRole('button', { name: /save/i });

    // Submit with empty teacher
    fireEvent.click(submitButton);
    expect(screen.getByText(/teacher name is required/i)).toBeInTheDocument();

    // Enter single character
    fireEvent.change(teacherInput, { target: { value: 'A' } });
    fireEvent.blur(teacherInput);
    expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument();
  });
});
```

Run tests:
```bash
npm run test -- course-form.test.tsx
```

### Step 5.3: Unit Tests for Display Components

**File**: `__tests__/unit/course-card.test.tsx` (CREATE NEW)

```typescript
import { render, screen } from '@testing-library/react';
import CourseCard from '@/components/course-card';

describe('CourseCard - Teacher Display', () => {
  const mockCourse = {
    id: 'test-1',
    title: 'Test Course',
    teacher: 'Dr. Sarah Johnson',
    category: 'Web Development',
    level: 'beginner' as const,
    lessons: 10,
    duration: '5 weeks',
    rating: 4.5,
    description: 'Test description',
    tags: ['test', 'demo'],
  };

  it('should display teacher name with icon', () => {
    render(<CourseCard course={mockCourse} />);
    
    const teacherText = screen.getByText('Dr. Sarah Johnson');
    expect(teacherText).toBeInTheDocument();
    
    // Verify icon is rendered (check for SVG with specific path)
    const svg = teacherText.closest('div')?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display teacher below title', () => {
    const { container } = render(<CourseCard course={mockCourse} />);
    
    const title = screen.getByText('Test Course');
    const teacher = screen.getByText('Dr. Sarah Johnson');
    
    // Teacher should come after title in DOM
    const titleIndex = Array.from(container.querySelectorAll('*')).indexOf(title);
    const teacherIndex = Array.from(container.querySelectorAll('*')).indexOf(teacher);
    expect(teacherIndex).toBeGreaterThan(titleIndex);
  });
});
```

Run tests:
```bash
npm run test -- course-card.test.tsx
```

### Step 5.4: Integration Tests for CRUD Operations

**File**: `__tests__/integration/course-crud.test.tsx` (CREATE NEW)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

describe('Course CRUD with Teacher Field', () => {
  it('should create course with teacher', async () => {
    render(<Home />);
    
    // Open modal
    fireEvent.click(screen.getByText(/manage courses/i));
    
    // Click Create Course
    fireEvent.click(screen.getByText(/create course/i));
    
    // Fill form including teacher
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Test Course' },
    });
    fireEvent.change(screen.getByLabelText(/teacher/i), {
      target: { value: 'Dr. New Instructor' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Testing' },
    });
    // Fill other required fields...

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Verify course appears in list with teacher
    await waitFor(() => {
      expect(screen.getByText('New Test Course')).toBeInTheDocument();
      expect(screen.getByText('Dr. New Instructor')).toBeInTheDocument();
    });
  });

  it('should update course teacher', async () => {
    render(<Home />);
    
    // Open modal
    fireEvent.click(screen.getByText(/manage courses/i));
    
    // Click Edit on first course
    const editButtons = screen.getAllByText(/edit/i);
    fireEvent.click(editButtons[0]);
    
    // Update teacher field
    const teacherInput = screen.getByLabelText(/teacher/i) as HTMLInputElement;
    const originalTeacher = teacherInput.value;
    
    fireEvent.change(teacherInput, {
      target: { value: 'Dr. Updated Teacher' },
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify updated teacher in list
    await waitFor(() => {
      expect(screen.queryByText(originalTeacher)).not.toBeInTheDocument();
      expect(screen.getByText('Dr. Updated Teacher')).toBeInTheDocument();
    });
  });
});
```

Run tests:
```bash
npm run test -- course-crud.test.tsx
```

### Step 5.5: E2E Tests for Teacher Workflow

**File**: `__tests__/e2e/teacher-workflow.spec.ts` (CREATE NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Teacher Field Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display teacher on course cards', async ({ page }) => {
    // Verify teacher displays below title on homepage
    const firstCourse = page.locator('.course-card').first();
    await expect(firstCourse.locator('text=/Dr\\.|Prof\\./').first()).toBeVisible();
  });

  test('should create course with teacher', async ({ page }) => {
    // Open management modal
    await page.click('text=Manage Courses');
    
    // Click Create Course
    await page.click('text=Create Course');
    
    // Fill form
    await page.fill('input[id="title"]', 'E2E Test Course');
    await page.fill('input[id="teacher"]', 'Dr. E2E Instructor');
    await page.fill('input[id="category"]', 'Testing');
    await page.selectOption('select[id="level"]', 'beginner');
    await page.fill('input[id="lessons"]', '5');
    await page.fill('input[id="duration"]', '3 weeks');
    await page.fill('textarea[id="description"]', 'E2E test description');
    await page.fill('input[id="tags"]', 'e2e, test');
    
    // Submit
    await page.click('button:has-text("Save Course")');
    
    // Verify course in list
    await expect(page.locator('text=E2E Test Course')).toBeVisible();
    await expect(page.locator('text=Dr. E2E Instructor')).toBeVisible();
  });

  test('should require teacher for form submission', async ({ page }) => {
    await page.click('text=Manage Courses');
    await page.click('text=Create Course');
    
    // Fill all fields except teacher
    await page.fill('input[id="title"]', 'No Teacher Course');
    await page.fill('input[id="category"]', 'Testing');
    // ... other fields
    
    // Submit without teacher
    await page.click('button:has-text("Save Course")');
    
    // Verify validation error
    await expect(page.locator('text=/teacher name is required/i')).toBeVisible();
  });

  test('should search courses by teacher name', async ({ page }) => {
    await page.click('text=Manage Courses');
    
    // Enter teacher name in search
    await page.fill('input[placeholder*="search"]', 'Sarah');
    
    // Verify only courses by Sarah appear
    await expect(page.locator('text=/Dr\\. Sarah/i')).toBeVisible();
  });
});
```

Run E2E tests:
```bash
npm run test:e2e
```

---

## Phase 6: Finalization (10 minutes)

### Step 6.1: Code Review Checklist

- [ ] Course interface has required teacher field
- [ ] All sample courses have teacher assigned
- [ ] Validation logic checks teacher 2-100 chars
- [ ] CourseForm has teacher input with error display
- [ ] Warning badge shows for courses without teacher
- [ ] CourseCard displays teacher with icon below title
- [ ] CourseListItem displays teacher with icon below title
- [ ] CourseManagementModal passes teacher in CRUD operations
- [ ] CourseService searches teacher field
- [ ] All TypeScript errors resolved
- [ ] Build succeeds (`npm run build`)
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing scenarios verified

### Step 6.2: Git Commit

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add required teacher field to Course entity

- Add teacher string field (2-100 chars) to Course interface
- Update validation logic for teacher field
- Add teacher input to CourseForm with warning badge
- Display teacher with icon below title in CourseCard and CourseListItem
- Update CourseService to search teacher names
- Add comprehensive unit, integration, and E2E tests
- Migrate sample data with teacher assignments

Closes #002"
```

### Step 6.3: Documentation Update

1. Update README.md if needed (document teacher field in Course schema)
2. Update any API documentation (if applicable)
3. Add teacher field to any existing data examples

---

## Troubleshooting

### Issue: TypeScript Error "Property 'teacher' is missing"

**Solution**: Ensure you updated:
1. Course interface in `data/courses.ts`
2. All sample courses in `featuredCourses` array
3. CourseFormData interface in `components/course-management/course-form.tsx`

### Issue: Warning Badge Not Showing

**Solution**: Check:
1. Condition: `{course && !course.teacher && (...)`
2. Course object actually has empty/undefined teacher field
3. Component is receiving `course` prop correctly

### Issue: Icon Not Displaying

**Solution**: Verify:
1. SVG code is complete (path and circle elements)
2. Tailwind classes applied: `w-4 h-4`
3. `stroke="currentColor"` attribute present

### Issue: Validation Not Working

**Solution**: Ensure:
1. `validateCourseForm` is called before form submission
2. Teacher validation logic uses `.trim()` to handle whitespace
3. Error state is updated: `setErrors({ ...errors, teacher: 'error message' })`

### Issue: Tests Failing

**Solution**: Check:
1. Test data includes teacher field
2. Mock data matches Course interface
3. Test assertions use correct text/labels (case-insensitive regex recommended)
4. Testing Library queries match actual rendered elements

---

## Time Estimates by Phase

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Data model updates | 30 minutes |
| 2 | Service layer updates | 20 minutes |
| 3 | Component updates | 60 minutes |
| 4 | Manual testing | 20 minutes |
| 5 | Automated testing | 40 minutes |
| 6 | Finalization | 10 minutes |
| **Total** | | **2-3 hours** |

---

## Success Criteria

✅ All TypeScript errors resolved  
✅ Build succeeds without warnings  
✅ Teacher displays on all course cards with icon  
✅ Teacher input in create/edit forms with validation  
✅ Warning badge shows for courses without teacher  
✅ Search includes teacher names  
✅ All tests pass (unit + integration + E2E)  
✅ Manual testing scenarios verified  
✅ Code committed to feature branch

---

## Next Steps

After completing this quickstart:

1. Run `/speckit.tasks` to generate detailed task breakdown (tasks.md)
2. Run `/speckit.implement` to execute implementation with tracking
3. Create pull request for code review
4. Merge to main after approval

---

## References

- [Feature Specification](spec.md)
- [Data Model](data-model.md)
- [Component Contracts](contracts/component-contracts.md)
- [Research Findings](research.md)
