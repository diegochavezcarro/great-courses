# Component Contracts: Course Management System

**Date**: 2026-02-11
**Phase**: 1 - Design & Contracts
**Purpose**: Define component interfaces, props, and interaction contracts for course CRUD operations

## Modal Container Contract

### CourseManagementModal Component

**Responsibility**: Root modal component that orchestrates course management operations

**Props Interface**:
```typescript
interface CourseManagementModalProps {
  isOpen: boolean;                    // Controls modal visibility
  onClose: () => void;                // Callback when modal should close
  courses: Course[];                  // Current course collection
  onCoursesUpdate: (courses: Course[]) => void; // Callback when courses are modified
}
```

**State Management**:
```typescript
interface CourseManagementModalState {
  currentView: ModalView;             // Current operation: "list" | "create" | "edit" | "delete"
  selectedCourse: Course | null;      // Course being edited/viewed/deleted
  searchQuery: string;                // Current search filter
  categoryFilter: string;             // Category filter selection
  levelFilter: CourseLevel | "";      // Level filter selection
  isLoading: boolean;                 // Operation in progress indicator
  error: string | null;               // Error message for display
}
```

**Methods**:
```typescript
// View navigation
const showCourseList = (): void => { /* Reset to list view */ };
const showCreateForm = (): void => { /* Switch to create mode */ };
const showEditForm = (course: Course): void => { /* Switch to edit mode with course */ };
const showDeleteConfirmation = (course: Course): void => { /* Switch to delete mode */ };

// Modal lifecycle
const handleClose = (): void => { /* Close modal and reset state */ };
const handleEscapeKey = (event: KeyboardEvent): void => { /* Handle escape key */ };
```

**Events Emitted**:
- `onClose()`: When modal should be closed
- `onCoursesUpdate(Course[])`: When course collection changes

---

## Course List Contract

### CourseList Component

**Responsibility**: Display searchable, filterable list of courses with action buttons

**Props Interface**:
```typescript
interface CourseListProps {
  courses: Course[];                  // Complete course collection
  searchQuery: string;                // Current search filter
  categoryFilter: string;             // Current category filter
  levelFilter: CourseLevel | "";      // Current level filter
  onSearchChange: (query: string) => void; // Search input change handler
  onCategoryFilterChange: (category: string) => void; // Category filter handler
  onLevelFilterChange: (level: CourseLevel | "") => void; // Level filter handler
  onEditCourse: (course: Course) => void; // Edit button click handler
  onDeleteCourse: (course: Course) => void; // Delete button click handler
  isLoading?: boolean;                // Loading state indicator
}
```

**Computed Properties**:
```typescript
// Filtered courses based on current filters
const filteredCourses: Course[] = courses.filter(applySearchFilters);

// Available categories for filter dropdown
const availableCategories: string[] = Array.from(new Set(courses.map(c => c.category)));

// Available levels for filter dropdown
const availableLevels: CourseLevel[] = ["Principiante", "Intermedio", "Avanzado"];
```

**Search/Filter Logic**:
```typescript
const applySearchFilters = (course: Course): boolean => {
  const matchesSearch = !searchQuery || 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
  const matchesCategory = !categoryFilter || course.category === categoryFilter;
  const matchesLevel = !levelFilter || course.level === levelFilter;
  
  return matchesSearch && matchesCategory && matchesLevel;
};
```

**Events Emitted**:
- `onSearchChange(string)`: When search input changes
- `onCategoryFilterChange(string)`: When category filter changes  
- `onLevelFilterChange(CourseLevel | "")`: When level filter changes
- `onEditCourse(Course)`: When edit button clicked
- `onDeleteCourse(Course)`: When delete button clicked

---

## Course Form Contract

### CourseForm Component

**Responsibility**: Handle course creation and editing with validation

**Props Interface**:
```typescript
interface CourseFormProps {
  mode: "create" | "edit";            // Form operation mode
  initialData?: Course;               // Pre-populate for edit mode
  onSubmit: (courseData: CourseFormData) => Promise<void>; // Form submission handler
  onCancel: () => void;               // Cancel button handler
  isLoading?: boolean;                // Submission in progress
  error?: string;                     // Error message for display
}
```

**Form Data Contract**:
```typescript
interface CourseFormData {
  title: string;                      // Course title (required)
  category: string;                   // Course category (required)
  level: CourseLevel | "";            // Course level (required)
  lessons: number | "";               // Number of lessons (required, positive)
  duration: string;                   // Duration description (required)
  rating: number | "";                // Rating 0-5 (required)
  description: string;                // Course description (required)
  tags: string[];                     // Tags array (optional)
}
```

**Validation Contract**:
```typescript
interface FormValidationResult {
  isValid: boolean;                   // Overall form validity
  errors: Partial<Record<keyof CourseFormData, string>>; // Field-specific errors
  warnings: string[];                 // Non-blocking warnings (duplicate titles)
}

// Validation rules
const validateCourseForm = (data: CourseFormData): FormValidationResult => {
  const errors: Partial<Record<keyof CourseFormData, string>> = {};
  const warnings: string[] = [];
  
  // Title validation
  if (!data.title.trim()) errors.title = "Title is required";
  else if (data.title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (data.title.length > 120) errors.title = "Title must be 120 characters or less";
  
  // Category validation
  if (!data.category.trim()) errors.category = "Category is required";
  else if (data.category.length < 2) errors.category = "Category must be at least 2 characters";
  
  // Level validation
  if (!data.level) errors.level = "Level is required";
  
  // Lessons validation
  if (!data.lessons) errors.lessons = "Number of lessons is required";
  else if (typeof data.lessons === "number" && (data.lessons < 1 || data.lessons > 999)) {
    errors.lessons = "Number of lessons must be between 1 and 999";
  }
  
  // Duration validation
  if (!data.duration.trim()) errors.duration = "Duration is required";
  
  // Rating validation
  if (data.rating === "") errors.rating = "Rating is required";
  else if (typeof data.rating === "number" && (data.rating < 0 || data.rating > 5)) {
    errors.rating = "Rating must be between 0 and 5";
  }
  
  // Description validation
  if (!data.description.trim()) errors.description = "Description is required";
  else if (data.description.length < 10) errors.description = "Description must be at least 10 characters";
  else if (data.description.length > 1000) errors.description = "Description must be 1000 characters or less";
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};
```

**Methods**:
```typescript
// Form field handlers
const handleFieldChange = (field: keyof CourseFormData, value: any): void => { /* Update field */ };
const handleTagsChange = (tags: string[]): void => { /* Update tags array */ };

// Form lifecycle
const handleSubmit = (event: React.FormEvent): Promise<void> => { /* Validate and submit */ };
const handleCancel = (): void => { /* Reset form and call onCancel */ };
const resetForm = (): void => { /* Clear all form data */ };
```

**Events Emitted**:
- `onSubmit(CourseFormData)`: When form is submitted with valid data
- `onCancel()`: When cancel button is clicked

---

## Delete Confirmation Contract

### DeleteConfirmation Component

**Responsibility**: Confirm course deletion with course details display

**Props Interface**:
```typescript
interface DeleteConfirmationProps {
  course: Course;                     // Course to be deleted
  onConfirm: (course: Course) => Promise<void>; // Deletion confirmation handler
  onCancel: () => void;               // Cancel deletion handler
  isLoading?: boolean;                // Deletion in progress
  error?: string;                     // Error message for display
}
```

**Display Contract**:
```typescript
// Information shown to user for confirmation
interface DeleteConfirmationDisplay {
  courseTitle: string;                // Course.title
  courseCategory: string;             // Course.category
  courseLessons: number;              // Course.lessons
  confirmationMessage: string;        // "Are you sure you want to delete this course?"
  warningMessage: string;             // "This action cannot be undone."
}
```

**Methods**:
```typescript
const handleConfirm = (): Promise<void> => { /* Call onConfirm with course */ };
const handleCancel = (): void => { /* Call onCancel */ };
const handleEscapeKey = (event: KeyboardEvent): void => { /* Handle escape key */ };
```

**Events Emitted**:
- `onConfirm(Course)`: When user confirms deletion
- `onCancel()`: When user cancels deletion

---

## Course Item Contract

### CourseItem Component

**Responsibility**: Display individual course in list with action buttons

**Props Interface**:
```typescript
interface CourseItemProps {
  course: Course;                     // Course data to display
  onEdit: (course: Course) => void;   // Edit button handler
  onDelete: (course: Course) => void; // Delete button handler
}
```

**Display Contract**:
```typescript
// Information displayed for each course
interface CourseItemDisplay {
  title: string;                      // Course.title
  category: string;                   // Course.category
  level: CourseLevel;                 // Course.level with visual indicator
  lessonsCount: string;               // Course.lessons + " lessons"
  duration: string;                   // Course.duration
  rating: string;                     // Course.rating + "/5" with stars
  tagsPreview: string[];              // First 3 Course.tags
  hasMoreTags: boolean;               // Course.tags.length > 3
}
```

**Interaction Contract**:
```typescript
const handleEdit = (): void => { /* Call onEdit with course */ };
const handleDelete = (): void => { /* Call onDelete with course */ };
```

**Events Emitted**:
- `onEdit(Course)`: When edit button is clicked
- `onDelete(Course)`: When delete button is clicked

---

## Data Service Contract

### CourseDataService

**Responsibility**: Handle course data persistence and ID generation

**Interface**:
```typescript
interface CourseDataService {
  // CRUD operations
  createCourse: (courseData: Omit<Course, "id">) => Course;
  getCourses: () => Course[];
  updateCourse: (id: string, updates: Partial<Course>) => Course | null;
  deleteCourse: (id: string) => boolean;
  
  // Utility operations
  generateCourseId: (title: string) => string;
  validateUniqueId: (id: string, excludeId?: string) => boolean;
  checkDuplicateTitle: (title: string, excludeId?: string) => boolean;
}
```

**Implementation Contract**:
```typescript
// ID Generation
const generateCourseId = (title: string): string => {
  const timestamp = Date.now();
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-${timestamp}`;
};

// CRUD Operations
const createCourse = (courseData: Omit<Course, "id">): Course => {
  const course: Course = {
    ...courseData,
    id: generateCourseId(courseData.title)
  };
  
  // Add to collection and persist
  courses.push(course);
  persistCourses(courses);
  
  return course;
};

const updateCourse = (id: string, updates: Partial<Course>): Course | null => {
  const index = courses.findIndex(course => course.id === id);
  if (index === -1) return null;
  
  courses[index] = { ...courses[index], ...updates };
  persistCourses(courses);
  
  return courses[index];
};

const deleteCourse = (id: string): boolean => {
  const initialLength = courses.length;
  courses = courses.filter(course => course.id !== id);
  
  if (courses.length < initialLength) {
    persistCourses(courses);
    return true;
  }
  
  return false;
};
```

---

## Integration Contract

### Homepage Integration

**Button Addition Contract**:
```typescript
// Addition to app/page.tsx
interface HomepageIntegration {
  manageCourseButton: {
    text: "Manage Courses";           // Button label
    position: "next to Ver demo";     // Placement specification
    styling: "Tailwind classes matching Ver demo"; // Consistent appearance
    onClick: () => void;              // Opens course management modal
  };
}
```

**Modal Integration Contract**:
```typescript
// Homepage state additions
interface HomepageState {
  isCourseManagementOpen: boolean;    // Modal visibility state
  courses: Course[];                  // Course collection from data/courses.ts
}

// Homepage methods
const openCourseManagement = (): void => { /* Set modal open */ };
const closeCourseManagement = (): void => { /* Set modal closed */ };
const updateCourses = (newCourses: Course[]): void => { /* Update course data */ };
```

## Contract Validation Rules

### Type Safety Requirements
- All components must use TypeScript interfaces for props
- No `any` types allowed in component contracts
- Strict type checking for Course entity and related interfaces

### Error Handling Requirements
- All async operations must handle errors gracefully
- Error states must be displayed to users with actionable messages
- No silent failures in CRUD operations

### Performance Requirements
- Course filtering operations must complete in <100ms
- Modal opening/closing must be <200ms
- Form validation must be real-time with debouncing

### Accessibility Requirements
- All interactive elements must have appropriate ARIA labels
- Modal must trap focus and handle escape key
- Form validation errors must be announced to screen readers

## Phase 1 Contracts Complete

✅ **Modal container contract** defined with comprehensive state management
✅ **Course list contract** established with search/filter capabilities
✅ **Course form contract** specified with validation rules
✅ **Delete confirmation contract** created with safety measures
✅ **Data service contract** defined for persistence operations
✅ **Integration contracts** planned for homepage and modal lifecycle

**Ready for**: Quickstart guide creation and agent context updates.