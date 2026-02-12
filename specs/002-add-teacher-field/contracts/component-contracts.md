# Component Contracts: Add Teacher Field

**Feature**: 002-add-teacher-field  
**Phase**: 1 (Design & Contracts)  
**Date**: 2026-02-11

## Overview

This document defines the component interfaces and contracts affected by the teacher field addition. All components that display or manage Course entities must be updated to handle the new required teacher field.

---

## 1. CourseCard Component

**File**: `components/course-card.tsx`  
**Purpose**: Display course information on homepage and catalog views  
**Change Type**: MODIFIED (add teacher display)

### Props Interface

```typescript
interface CourseCardProps {
  course: Course;  // Course now includes teacher field
}
```

### Contract

**Input**:
- `course`: Course object with teacher field populated

**Output**:
- Renders course card with teacher displayed below title
- Teacher shown with instructor icon and text
- Mobile-responsive layout maintained

**Behavior**:
- Display teacher immediately below course title
- Use instructor icon (user SVG) before teacher name
- Apply consistent styling: `text-sm text-gray-600`
- Maintain existing card layout (image, title, metadata, description)

### Updated JSX Structure

```tsx
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <img src={course.image} alt={course.title} />
  <div className="p-6">
    <h3 className="text-xl font-semibold">{course.title}</h3>
    
    {/* NEW: Teacher display */}
    <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span>{course.teacher}</span>
    </div>

    {/* Existing metadata */}
    <div className="flex items-center gap-4 mt-3">
      {/* category, level, lessons, duration */}
    </div>
    
    {/* Description, tags, rating */}
  </div>
</div>
```

### Testing Contract

- **Unit Test**: Verify teacher renders with icon
- **Snapshot Test**: Capture updated card layout
- **Accessibility Test**: Ensure icon has proper ARIA labels

---

## 2. CourseListItem Component

**File**: `components/course-management/course-list-item.tsx`  
**Purpose**: Display course in management modal list view  
**Change Type**: MODIFIED (add teacher display)

### Props Interface

```typescript
interface CourseListItemProps {
  course: Course;     // Course now includes teacher field
  onEdit: () => void;
  onDelete: () => void;
}
```

### Contract

**Input**:
- `course`: Course object with teacher field
- `onEdit`: Callback for edit button
- `onDelete`: Callback for delete button

**Output**:
- Renders list item with teacher below title
- Edit and delete buttons functional
- Compact layout for modal display

**Behavior**:
- Display teacher with icon below title, above category/level metadata
- Use same icon and styling as CourseCard
- Maintain existing button functionality
- Apply hover states and focus management

### Updated JSX Structure

```tsx
<div className="border rounded-lg p-4 hover:bg-gray-50">
  <div className="flex justify-between items-start">
    <div className="flex-1">
      <h4 className="font-semibold text-lg">{course.title}</h4>
      
      {/* NEW: Teacher display */}
      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>{course.teacher}</span>
      </div>

      {/* Existing metadata */}
      <div className="flex items-center gap-3 mt-2">
        {/* category, level, lessons */}
      </div>
    </div>

    {/* Edit and Delete buttons */}
    <div className="flex gap-2">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  </div>
</div>
```

### Testing Contract

- **Unit Test**: Verify teacher renders between title and metadata
- **Integration Test**: Test edit/delete callbacks still work
- **Accessibility Test**: Ensure screen readers announce teacher

---

## 3. CourseForm Component

**File**: `components/course-management/course-form.tsx`  
**Purpose**: Create and edit course information  
**Change Type**: MODIFIED (add teacher input field)

### Props Interface

```typescript
interface CourseFormProps {
  course?: Course;              // Optional for create mode, includes teacher if editing
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}
```

### State Interface

```typescript
interface CourseFormData {
  title: string;
  teacher: string;      // NEW: Form field for teacher
  category: string;
  level: CourseLevel;
  lessons: string;
  duration: string;
  description: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  teacher?: string;     // NEW: Validation error for teacher
  category?: string;
  level?: string;
  lessons?: string;
  duration?: string;
  description?: string;
  tags?: string;
}
```

### Contract

**Input**:
- `course`: Existing course for edit mode (teacher populated) or undefined for create mode
- `onSubmit`: Callback with validated form data including teacher
- `onCancel`: Callback for cancel action

**Output**:
- Form with teacher input field between title and category
- Validation errors displayed inline
- Warning badge if editing course without teacher

**Behavior**:
- **Create Mode**: Teacher input empty, user must enter 2-100 chars
- **Edit Mode (with teacher)**: Teacher input pre-filled with course.teacher
- **Edit Mode (without teacher)**: Show warning badge, require teacher before submit
- Validate teacher on blur and on submit
- Display validation errors below teacher input field
- Block form submission if teacher invalid

### Updated JSX Structure

```tsx
<form onSubmit={handleSubmit}>
  <h2>{course ? 'Edit Course' : 'Create Course'}</h2>

  {/* Warning badge for courses without teacher */}
  {course && !course.teacher && (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-yellow-800">
        ⚠️ This course requires a teacher assignment. Please add teacher information below.
      </p>
    </div>
  )}

  {/* Title input */}
  <Input
    id="title"
    label="Title"
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    error={errors.title}
    required
  />

  {/* NEW: Teacher input */}
  <Input
    id="teacher"
    label="Teacher"
    value={formData.teacher}
    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
    onBlur={validateTeacher}
    error={errors.teacher}
    placeholder="Enter instructor name"
    required
  />

  {/* Existing inputs: category, level, lessons, duration, description, tags */}

  <div className="flex gap-2">
    <button type="submit" disabled={hasErrors}>Save Course</button>
    <button type="button" onClick={onCancel}>Cancel</button>
  </div>
</form>
```

### Validation Logic

```typescript
const validateTeacher = () => {
  const trimmed = formData.teacher.trim();
  if (!trimmed || trimmed.length < 2) {
    setErrors({ ...errors, teacher: 'Teacher name must be at least 2 characters' });
  } else if (trimmed.length > 100) {
    setErrors({ ...errors, teacher: 'Teacher name must not exceed 100 characters' });
  } else {
    const { teacher, ...rest } = errors;
    setErrors(rest);
  }
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const validationErrors = validateCourseForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  onSubmit(formData);
};
```

### Testing Contract

- **Unit Test**: Verify teacher input renders and accepts input
- **Unit Test**: Verify teacher validation (too short, too long, valid)
- **Unit Test**: Verify warning badge shows for courses without teacher
- **Integration Test**: Verify form submission includes teacher in data
- **E2E Test**: Complete flow of creating course with teacher

---

## 4. CourseManagementModal Component

**File**: `components/course-management/course-management-modal.tsx`  
**Purpose**: Orchestrate CRUD operations in modal interface  
**Change Type**: MODIFIED (pass teacher data through CRUD operations)

### State Interface

```typescript
type ModalView = 'list' | 'create' | 'edit' | 'delete';

interface CourseManagementModalState {
  isOpen: boolean;
  view: ModalView;
  selectedCourse: Course | null;  // Course includes teacher field
  courses: Course[];               // All courses have teacher field
}
```

### Contract

**Input**:
- `isOpen`: Boolean to show/hide modal
- `onClose`: Callback when modal closes
- `courses`: Array of courses (all with teacher field)
- `setCourses`: State setter for courses array

**Output**:
- Modal with list/create/edit/delete views
- Teacher field handled in all CRUD operations
- Updated courses array with teacher data

**Behavior**:
- **List View**: Display courses with teacher (via CourseListItem)
- **Create View**: Pass empty teacher to CourseForm
- **Edit View**: Pass course with teacher to CourseForm
- **Delete View**: Show course with teacher in confirmation
- Handle teacher validation errors from CourseForm
- Update courses state with teacher data after create/edit

### CRUD Operation Handlers

```typescript
const handleCreateCourse = (formData: CourseFormData) => {
  const validationErrors = validateCourseForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    // Show validation errors including teacher errors
    return;
  }

  const newCourse = courseService.createCourse({
    title: formData.title,
    teacher: formData.teacher,  // NEW: Pass teacher to service
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

const handleUpdateCourse = (formData: CourseFormData) => {
  if (!selectedCourse) return;

  const validationErrors = validateCourseForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    // Show validation errors including teacher errors
    return;
  }

  const updatedCourse = courseService.updateCourse(selectedCourse.id, {
    title: formData.title,
    teacher: formData.teacher,  // NEW: Update teacher field
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

### Testing Contract

- **Integration Test**: Create course with teacher, verify in courses array
- **Integration Test**: Edit course teacher, verify update persists
- **Integration Test**: Edit course without teacher, verify warning shows
- **Integration Test**: Delete course with teacher, verify removal

---

## 5. CourseService Class

**File**: `data/services/course-service.ts`  
**Purpose**: Encapsulate CRUD business logic  
**Change Type**: MODIFIED (handle teacher in CRUD methods)

### Class Interface

```typescript
class CourseService {
  private courses: Course[];

  constructor(initialCourses: Course[]) {
    this.courses = initialCourses;  // All courses must have teacher
  }

  getCourses(): Course[] {
    return this.courses;  // Returns courses with teacher field
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  createCourse(courseData: Omit<Course, 'id'>): Course {
    // courseData must include teacher field (TypeScript enforced)
    const newCourse: Course = {
      id: generateCourseId(courseData.title),
      ...courseData,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course {
    // updates can include teacher field for editing
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    this.courses[index] = { ...this.courses[index], ...updates };
    return this.courses[index];
  }

  deleteCourse(id: string): boolean {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.courses.splice(index, 1);
    return true;
  }

  searchCourses(query: string): Course[] {
    // Search includes teacher field in query matching
    const lowerQuery = query.toLowerCase();
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.teacher.toLowerCase().includes(lowerQuery) ||  // NEW: Search teacher names
      course.category.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
```

### Contract

**Input**:
- `createCourse`: courseData with teacher field (required)
- `updateCourse`: updates with optional teacher field
- `searchCourses`: query string (searches teacher names too)

**Output**:
- All methods return Course objects with teacher field populated
- searchCourses includes courses matching teacher name

**Behavior**:
- TypeScript enforces teacher field in createCourse parameter
- updateCourse allows teacher to be changed via Partial<Course>
- searchCourses queries teacher field along with title, category, description, tags
- All CRUD operations maintain teacher data integrity

### Testing Contract

- **Unit Test**: createCourse with teacher returns course with teacher
- **Unit Test**: updateCourse updates teacher field
- **Unit Test**: searchCourses finds courses by teacher name
- **Unit Test**: getCourseById returns course with teacher

---

## 6. Validation Utility

**File**: `data/utils/validation.ts`  
**Purpose**: Validate form data before CRUD operations  
**Change Type**: MODIFIED (add teacher validation)

### Function Interface

```typescript
interface ValidationErrors {
  title?: string;
  teacher?: string;     // NEW: Teacher error message
  category?: string;
  level?: string;
  lessons?: string;
  duration?: string;
  description?: string;
  tags?: string;
}

export function validateCourseForm(data: CourseFormData): ValidationErrors;
```

### Contract

**Input**:
- `data`: CourseFormData with teacher field

**Output**:
- ValidationErrors object with teacher error if validation fails
- Empty object if all fields valid (including teacher)

**Behavior**:
- Validate teacher is not empty or whitespace-only
- Validate teacher length >= 2 characters (after trim)
- Validate teacher length <= 100 characters (after trim)
- Return specific error messages for teacher validation failures

### Validation Logic

```typescript
export function validateCourseForm(data: CourseFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Existing validations for title, category, etc...

  // NEW: Teacher validation
  const teacherTrimmed = data.teacher.trim();
  if (!teacherTrimmed) {
    errors.teacher = 'Teacher name is required';
  } else if (teacherTrimmed.length < 2) {
    errors.teacher = 'Teacher name must be at least 2 characters';
  } else if (teacherTrimmed.length > 100) {
    errors.teacher = 'Teacher name must not exceed 100 characters';
  }

  return errors;
}
```

### Testing Contract

- **Unit Test**: Empty teacher returns "Teacher name is required"
- **Unit Test**: Teacher with 1 char returns "must be at least 2 characters"
- **Unit Test**: Teacher with 101 chars returns "must not exceed 100 characters"
- **Unit Test**: Teacher with 2-100 chars returns no error
- **Unit Test**: Whitespace-only teacher returns "Teacher name is required"

---

## Summary Table

| Component | File | Change Type | Key Contract Update |
|-----------|------|-------------|---------------------|
| CourseCard | components/course-card.tsx | MODIFIED | Display teacher with icon below title |
| CourseListItem | components/course-management/course-list-item.tsx | MODIFIED | Display teacher with icon below title |
| CourseForm | components/course-management/course-form.tsx | MODIFIED | Add teacher input, validation, warning badge |
| CourseManagementModal | components/course-management/course-management-modal.tsx | MODIFIED | Pass teacher through CRUD operations |
| CourseService | data/services/course-service.ts | MODIFIED | Handle teacher in CRUD, search teacher names |
| validateCourseForm | data/utils/validation.ts | MODIFIED | Validate teacher 2-100 chars |

---

## Component Dependency Graph

```text
app/page.tsx
    ↓ uses
CourseCard (displays teacher)
    ↓ receives
Course entity (with teacher field)

app/page.tsx
    ↓ opens
CourseManagementModal
    ↓ renders
CourseListItem (displays teacher)
    ↓ or
CourseForm (edits teacher)
    ↓ validates via
validateCourseForm (checks teacher)
    ↓ submits to
CourseService (CRUD with teacher)
    ↓ returns
Course entity (with teacher field)
```

---

## Integration Points

1. **Type Safety**: Course interface with required teacher field enforces TypeScript checks across all components
2. **Validation**: validateCourseForm centralizes teacher validation logic used by CourseForm
3. **State Management**: courses state in page.tsx flows teacher data to all child components
4. **Service Layer**: CourseService handles teacher in all CRUD operations, including search
5. **Display Consistency**: CourseCard and CourseListItem use identical teacher display pattern

---

## Non-Functional Contracts

### Performance
- Teacher field rendering adds minimal overhead (<5ms per course card)
- Teacher search queries maintain <100ms response time for 500 courses

### Accessibility
- Teacher display includes semantic HTML (span for text)
- Icon has aria-hidden="true" (decorative)
- Screen readers announce teacher name after title

### Responsive Design
- Teacher display uses flex layout (icon + text)
- Mobile: Teacher wraps to new line below title if needed
- Desktop: Teacher inline with icon, consistent spacing

---

## Testing Summary

Each component contract requires:
- **Unit Tests**: Component renders with teacher, validation logic works
- **Integration Tests**: CRUD operations with teacher field persist correctly
- **E2E Tests**: Complete workflows (create, edit, delete) including teacher field
- **Accessibility Tests**: Screen readers and keyboard navigation work with teacher field

All tests follow existing patterns from Feature 001.
