# Data Model: Course Management System

**Date**: 2026-02-11
**Phase**: 1 - Design & Data Modeling
**Purpose**: Define entities, relationships, and data structures for course CRUD operations

## Core Entities

### Course Entity

**Purpose**: Represents educational content with all metadata required for display and management.

**Attributes**:
```typescript
interface Course {
  id: string;                    // Auto-generated unique identifier (slug-timestamp format)
  title: string;                 // Course name (required, allows duplicates with warning)
  category: string;              // Subject area (e.g., "Desarrollo Web", "UI/UX", "Productividad")
  level: CourseLevel;            // Difficulty: "Principiante" | "Intermedio" | "Avanzado"
  lessons: number;               // Number of lessons/modules (positive integer)
  duration: string;              // Human-readable time estimate (e.g., "14 horas", "6 horas")
  rating: number;                // Administrator-set rating (0.0-5.0, one decimal precision)
  description: string;           // Course overview and learning outcomes (required)
  tags: string[];                // Searchable keywords and technologies (e.g., ["Next.js", "TypeScript"])
}

type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";
```

**Validation Rules**:
- `id`: Auto-generated, cannot be empty or modified after creation
- `title`: Required, 3-120 characters, warn on duplicates but allow
- `category`: Required, 2-50 characters, suggest from existing categories
- `level`: Required, must match CourseLevel enum exactly
- `lessons`: Required, positive integer 1-999
- `duration`: Required, format suggestion but free-form text
- `rating`: Required, number 0.0-5.0 with one decimal precision
- `description`: Required, 10-1000 characters
- `tags`: Optional array, 0-10 tags, each tag 2-20 characters

**Business Rules**:
- ID generation uses `title` + timestamp to ensure uniqueness
- Ratings are manually set by administrators, no auto-calculation
- Tags are used for search functionality - normalize to lowercase for matching
- Category suggestions based on existing course categories for consistency

### Course Management State

**Purpose**: Track modal state and form data during CRUD operations.

**Interface**:
```typescript
interface CourseManagementState {
  isModalOpen: boolean;          // Modal visibility state
  currentView: ModalView;        // Current operation being performed
  selectedCourse: Course | null; // Course being edited/viewed/deleted
  formData: Partial<Course>;     // In-progress form data
  searchQuery: string;           // Current search filter
  categoryFilter: string;        // Category filter selection
  levelFilter: CourseLevel | ""; // Level filter selection
  isLoading: boolean;            // Operation in progress
  error: string | null;          // Error message display
}

type ModalView = "list" | "create" | "edit" | "delete";
```

**State Transitions**:
- `list` → `create`: "Add New Course" button
- `list` → `edit`: Course item "Edit" action  
- `list` → `delete`: Course item "Delete" action
- `create|edit|delete` → `list`: Save, cancel, or completion
- Modal closes: Reset to initial state

### Form Data Entity

**Purpose**: Handle course creation and editing with validation feedback.

**Interface**:
```typescript
interface CourseFormData {
  title: string;
  category: string;
  level: CourseLevel | "";
  lessons: number | "";
  duration: string;
  rating: number | "";
  description: string;
  tags: string[];
}

interface FormValidation {
  isValid: boolean;
  errors: Record<keyof CourseFormData, string>;
  warnings: string[];  // For duplicate titles, suggestion messages
}
```

**Validation Logic**:
- Real-time validation on field blur and form submission
- Error messages specific to each field's requirements
- Warning messages for duplicate titles (non-blocking)
- Form submission blocked until `isValid: true`

## Data Relationships

### Course Collection Management

**Storage**: Array of Course objects in `data/courses.ts`

**Operations**:
```typescript
// Create: Add new course to array
const addCourse = (course: Course): Course[] => [...courses, course];

// Read: Filter and search operations
const getCourses = (filters: SearchFilters): Course[] => courses.filter(applyFilters);

// Update: Replace course by ID
const updateCourse = (id: string, updates: Partial<Course>): Course[] => 
  courses.map(course => course.id === id ? { ...course, ...updates } : course);

// Delete: Remove course by ID
const deleteCourse = (id: string): Course[] => courses.filter(course => course.id !== id);
```

**Search & Filter Logic**:
```typescript
interface SearchFilters {
  query: string;           // Search in title, description, tags
  category: string;        // Exact match on category
  level: CourseLevel | ""; // Exact match on level
}

const applyFilters = (course: Course, filters: SearchFilters): boolean => {
  const queryMatch = !filters.query || 
    course.title.toLowerCase().includes(filters.query.toLowerCase()) ||
    course.description.toLowerCase().includes(filters.query.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));
  
  const categoryMatch = !filters.category || course.category === filters.category;
  const levelMatch = !filters.level || course.level === filters.level;
  
  return queryMatch && categoryMatch && levelMatch;
};
```

## Data Flow Architecture

### Course CRUD Operations Flow

**Create Course Flow**:
1. User clicks "Add New Course" → `currentView: "create"`
2. Form displays empty `CourseFormData`
3. User fills form → Real-time validation
4. User submits → Generate ID, validate, add to collection
5. Success → Return to list view, show new course

**Read/List Courses Flow**:
1. Modal opens → `currentView: "list"`
2. Load all courses from `data/courses.ts`
3. Apply current search/filter state
4. Display paginated/scrollable results

**Update Course Flow**:
1. User clicks "Edit" on course → `currentView: "edit"`, `selectedCourse: Course`
2. Form pre-populates with existing course data
3. User modifies → Real-time validation
4. User submits → Validate, update in collection by ID
5. Success → Return to list view, show updated course

**Delete Course Flow**:
1. User clicks "Delete" on course → `currentView: "delete"`, `selectedCourse: Course`
2. Display confirmation with course details
3. User confirms → Remove from collection by ID
4. Success → Return to list view, course no longer visible

### State Persistence Strategy

**In-Memory State**: React useState for modal interactions and temporary form data
**Persistent State**: File system updates to `data/courses.ts` for permanent changes
**Synchronization**: Immediate state updates with optimistic UI, file updates handled synchronously

## Data Validation Strategy

### Client-Side Validation

**Field-Level Validation**:
- Title: Required, length, duplicate warning
- Category: Required, length, suggestion from existing
- Level: Required, enum validation
- Lessons: Required, positive integer range
- Duration: Required, suggested format patterns
- Rating: Required, decimal range 0.0-5.0
- Description: Required, length range
- Tags: Optional, array length, individual tag validation

**Form-Level Validation**:
- All required fields completed
- No blocking errors present
- Confirmation before destructive operations (delete)

### Data Integrity Rules

**ID Management**:
- Auto-generation prevents duplicate IDs
- Timestamp component ensures uniqueness across concurrent operations
- Slug component maintains human-readable, URL-friendly format

**Referential Integrity**:
- No foreign key relationships in current scope
- Course deletion is safe (no dependencies)
- Category consistency maintained through suggestion system

## Performance Considerations

### Search Performance

**Strategy**: Client-side filtering for up to 1000 courses (per success criteria)
**Implementation**: JavaScript array filtering with optimized string operations
**Optimization**: Debounced search input to avoid excessive filtering

### Memory Management

**Course List**: Load all courses into memory for management operations
**Form State**: Clear form data after operations to prevent memory accumulation
**Modal State**: Reset state when modal closes to prevent stale data

### Scalability Planning

**Current Scope**: 500 courses displayed simultaneously (per success criteria)
**Future Enhancement Points**:
- Virtual scrolling for large lists
- Server-side search for thousands of courses
- Pagination for better UX at scale

## Phase 1 Data Model Complete

✅ **Course entity fully defined** with validation rules and business logic
✅ **State management interfaces** established for modal operations
✅ **Data flow patterns** documented for all CRUD operations
✅ **Search and filter logic** specified for course discovery
✅ **Validation strategy** comprehensive for data integrity
✅ **Performance considerations** addressed for current scope

**Ready for**: API contracts definition and quickstart guide creation.