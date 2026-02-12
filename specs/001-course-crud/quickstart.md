# Quickstart Guide: Course Management System Implementation

**Date**: 2026-02-11
**Target**: Developers implementing course CRUD functionality
**Prerequisites**: Next.js 14.2.5, React 18.3.1, TypeScript 5.5.3, Tailwind CSS 3.4.6

## Overview

This guide walks you through implementing a complete course management system with modal-based CRUD operations. The feature adds a "Manage Courses" button next to the existing "Ver demo" button, opening a comprehensive course administration interface.

## Quick Start (15-minute setup)

### Step 1: Install Testing Dependencies (2 minutes)

```bash
# Install testing frameworks per constitutional requirement
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install -D @playwright/test

# Initialize Playwright
npx playwright install
```

### Step 2: Create Base UI Components (5 minutes)

Create reusable UI components that will be shared across the course management system:

```bash
# Create UI component files
mkdir -p components/ui
touch components/ui/modal.tsx
touch components/ui/button.tsx  
touch components/ui/input.tsx
touch components/ui/search.tsx
```

**components/ui/modal.tsx** (Base modal component):
```typescript
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### Step 3: Create Course Management Components (5 minutes)

Set up the course management component structure:

```bash
# Create course management components
mkdir -p components/course-management
touch components/course-management/course-modal.tsx
touch components/course-management/course-list.tsx
touch components/course-management/course-form.tsx
touch components/course-management/course-item.tsx
touch components/course-management/delete-confirmation.tsx
```

### Step 4: Update Course Types (2 minutes)

Extend the existing course data structure:

**data/types/course.ts**:
```typescript
export type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";

export interface Course {
  id: string;
  title: string;
  category: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
}

export interface CourseFormData {
  title: string;
  category: string;
  level: CourseLevel | "";
  lessons: number | "";
  duration: string;
  rating: number | "";
  description: string;
  tags: string[];
}
```

### Step 5: Add Manage Courses Button (1 minute)

Update the homepage to include the management button:

**app/page.tsx** (add to existing button group):
```typescript
<div className="flex flex-wrap gap-3">
  <button className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
    Explorar cursos
  </button>
  <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20">
    Ver demo
  </button>
  <button 
    onClick={() => setIsCourseManagementOpen(true)}
    className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20"
  >
    Manage Courses
  </button>
</div>
```

## Implementation Walkthrough

### Phase 1: Course List Display (User Story 2 - Priority P2)

**Goal**: Display all courses with search and filter capabilities.

**Key Components**:
1. **CourseList**: Main listing component with filters
2. **CourseItem**: Individual course display row

**CourseList Implementation** (components/course-management/course-list.tsx):
```typescript
import { Course, CourseLevel } from "@/data/types/course";

interface CourseListProps {
  courses: Course[];
  searchQuery: string;
  categoryFilter: string;
  levelFilter: CourseLevel | "";
  onSearchChange: (query: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onLevelFilterChange: (level: CourseLevel | "") => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

export function CourseList({ 
  courses, 
  searchQuery,
  categoryFilter,
  levelFilter,
  onSearchChange,
  onCategoryFilterChange,
  onLevelFilterChange,
  onEditCourse,
  onDeleteCourse 
}: CourseListProps) {
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get unique categories for filter
  const availableCategories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value as CourseLevel | "")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Levels</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredCourses.map(course => (
          <CourseItem
            key={course.id}
            course={course}
            onEdit={onEditCourse}
            onDelete={onDeleteCourse}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {filteredCourses.length} of {courses.length} courses
        </span>
        <button
          onClick={() => /* Handle add new course */}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
        >
          Add New Course
        </button>
      </div>
    </div>
  );
}
```

### Phase 2: Course Creation (User Story 1 - Priority P1)

**Goal**: Allow administrators to create new courses with validation.

**CourseForm Implementation** (components/course-management/course-form.tsx):
```typescript
import { useState } from "react";
import { Course, CourseFormData, CourseLevel } from "@/data/types/course";

interface CourseFormProps {
  mode: "create" | "edit";
  initialData?: Course;
  onSubmit: (courseData: CourseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CourseForm({ mode, initialData, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || "",
    category: initialData?.category || "",
    level: initialData?.level || "",
    lessons: initialData?.lessons || "",
    duration: initialData?.duration || "",
    rating: initialData?.rating || "",
    description: initialData?.description || "",
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  const validateField = (field: keyof CourseFormData, value: any): string => {
    switch (field) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.length < 3) return "Title must be at least 3 characters";
        if (value.length > 120) return "Title must be 120 characters or less";
        return "";
      
      case "category":
        if (!value.trim()) return "Category is required";
        return "";
      
      case "level":
        if (!value) return "Level is required";
        return "";
      
      case "lessons":
        if (!value) return "Number of lessons is required";
        if (typeof value === "number" && (value < 1 || value > 999)) {
          return "Number of lessons must be between 1 and 999";
        }
        return "";
      
      case "duration":
        if (!value.trim()) return "Duration is required";
        return "";
      
      case "rating":
        if (value === "") return "Rating is required";
        if (typeof value === "number" && (value < 0 || value > 5)) {
          return "Rating must be between 0 and 5";
        }
        return "";
      
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.length < 10) return "Description must be at least 10 characters";
        if (value.length > 1000) return "Description must be 1000 characters or less";
        return "";
      
      default:
        return "";
    }
  };

  const handleFieldChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};
    Object.keys(formData).forEach(key => {
      const field = key as keyof CourseFormData;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {mode === "create" ? "Create New Course" : "Edit Course"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Course title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Add similar fields for category, level, lessons, duration, rating, description, tags */}
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 transition"
          >
            {isLoading ? "Saving..." : mode === "create" ? "Create Course" : "Update Course"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Phase 3: Data Service Layer

**Course Data Service** (data/utils/course-service.ts):
```typescript
import { Course } from "@/data/types/course";
import { featuredCourses } from "@/data/courses";

class CourseDataService {
  private courses: Course[] = [...featuredCourses];

  generateCourseId(title: string): string {
    const timestamp = Date.now();
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${slug}-${timestamp}`;
  }

  createCourse(courseData: Omit<Course, "id">): Course {
    const course: Course = {
      ...courseData,
      id: this.generateCourseId(courseData.title)
    };
    
    this.courses.push(course);
    return course;
  }

  getCourses(): Course[] {
    return [...this.courses];
  }

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return null;
    
    this.courses[index] = { ...this.courses[index], ...updates };
    return this.courses[index];
  }

  deleteCourse(id: string): boolean {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => course.id !== id);
    return this.courses.length < initialLength;
  }
}

export const courseDataService = new CourseDataService();
```

## Testing Strategy

### Unit Tests Setup

**components/course-management/__tests__/course-form.test.tsx**:
```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CourseForm } from "../course-form";

describe("CourseForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it("should render create form correctly", () => {
    render(
      <CourseForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText("Create New Course")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Course title")).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    render(
      <CourseForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    fireEvent.click(screen.getByText("Create Course"));
    
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
```

### E2E Tests Setup

**__tests__/e2e/course-management.spec.ts**:
```typescript
import { test, expect } from "@playwright/test";

test.describe("Course Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should open course management modal", async ({ page }) => {
    await page.click('text="Manage Courses"');
    
    await expect(page.locator('[data-testid="course-management-modal"]')).toBeVisible();
    await expect(page.locator('text="Course Management"')).toBeVisible();
  });

  test("should create a new course", async ({ page }) => {
    await page.click('text="Manage Courses"');
    await page.click('text="Add New Course"');
    
    await page.fill('input[name="title"]', "Test Course");
    await page.fill('input[name="category"]', "Test Category");
    await page.selectOption('select[name="level"]', "Principiante");
    await page.fill('input[name="lessons"]', "10");
    await page.fill('input[name="duration"]', "5 hours");
    await page.fill('input[name="rating"]', "4.5");
    await page.fill('textarea[name="description"]', "This is a test course description with more than 10 characters");
    
    await page.click('text="Create Course"');
    
    await expect(page.locator('text="Test Course"')).toBeVisible();
  });
});
```

## Performance Optimizations

### Search Debouncing
```typescript
import { useMemo, useState } from "react";
import { debounce } from "lodash"; // or implement custom debounce

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // Perform search
  }, 300),
  []
);
```

### Virtual Scrolling (for large lists)
```typescript
// Consider react-window for lists > 100 items
import { VariableSizeList } from "react-window";
```

## Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Modal accessibility verified (focus trap, escape key, ARIA labels)
- [ ] Mobile responsive design tested
- [ ] Course data persistence working
- [ ] Search performance < 1 second for 1000 courses
- [ ] Form validation comprehensive and user-friendly

## Next Steps

1. **Implement User Story 2** (Course Listing) first - provides immediate value
2. **Add User Story 1** (Course Creation) - enables content expansion
3. **Implement User Story 3** (Course Editing) - maintenance capability
4. **Add User Story 4** (Course Deletion) - complete CRUD functionality

## Support Resources

- **Specification**: [spec.md](../spec.md)
- **Data Model**: [data-model.md](../data-model.md)  
- **Component Contracts**: [contracts/component-contracts.md](../contracts/component-contracts.md)
- **Research Decisions**: [research.md](../research.md)

Follow constitutional principles throughout implementation: clean code, simple UX, minimal dependencies, and comprehensive testing.