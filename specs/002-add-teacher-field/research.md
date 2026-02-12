# Research: Add Teacher Field to Course Entity

**Feature**: 002-add-teacher-field  
**Phase**: 0 (Outline & Research)  
**Date**: 2026-02-11

## Overview

This document consolidates research findings and technical decisions for adding a required teacher field to the Course entity. All technical unknowns from the plan's Technical Context section have been resolved.

## Research Findings

### 1. Field Validation Strategy

**Decision**: Use existing validation pattern from Feature 001  
**Rationale**:
- Current `validateCourseForm` function validates all fields with 2-100 character constraints
- Teacher field follows same validation pattern: required string, 2-100 characters
- No special characters or format validation needed (teacher names are free-form text)
- Consistent with existing validation for title, category, description fields

**Implementation**:
```typescript
// Extend existing validation in data/utils/validation.ts
if (!data.teacher || data.teacher.trim().length < 2 || data.teacher.trim().length > 100) {
  errors.teacher = 'Teacher name must be between 2 and 100 characters';
}
```

**Alternatives Considered**:
- Complex validation with title prefixes (Dr., Prof.) - rejected for overengineering
- Email or ID-based teacher references - rejected for simplicity (string suffices)
- External teacher entity/service - rejected per Minimal Dependencies principle

### 2. Display Pattern for Teacher Field

**Decision**: Display teacher below title with instructor icon, matching existing metadata layout  
**Rationale**:
- Existing course cards display category/level/lessons/duration in metadata section
- Teacher is instructor-level metadata, logically grouped with other course attributes
- Icon-based visual hierarchy already established in Feature 001
- Mobile-responsive grid layout in Tailwind already handles metadata rows

**Implementation**:
```tsx
// In course-card.tsx and course-list-item.tsx
<div className="flex items-center gap-1 text-sm text-gray-600">
  <svg className="w-4 h-4">...</svg> {/* Instructor/user icon */}
  <span>{course.teacher}</span>
</div>
```

**Alternatives Considered**:
- Separate teacher section above title - rejected for inconsistent hierarchy
- Teacher as subtitle under title - rejected per spec clarification (below title)
- Teacher in card footer - rejected for visibility concerns

### 3. Migration Workflow for Existing Courses

**Decision**: Blocking workflow requiring immediate teacher assignment before editing  
**Rationale**:
- Spec clarification: "When user attempts to edit course without teacher, show warning badge"
- Prevents data inconsistency (all courses must have teacher after migration)
- Form validation already blocks submission for missing required fields
- Warning badge provides clear user guidance without complex migration scripts

**Implementation**:
```tsx
// In course-management-modal.tsx
{!selectedCourse.teacher && (
  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-sm text-yellow-800">
      ⚠️ This course requires a teacher assignment. Please add teacher information below.
    </p>
  </div>
)}
```

**Alternatives Considered**:
- Automatic teacher assignment ("Unknown Instructor") - rejected for data quality concerns
- Batch migration script - rejected for simplicity (manual assignment on first edit)
- Optional teacher field with phased migration - rejected per spec requirement (required field)

### 4. Form Input Component Selection

**Decision**: Reuse existing `<Input>` component from components/ui/input.tsx  
**Rationale**:
- Teacher field is simple text input, no specialized UI needed
- Existing Input component handles labels, validation errors, accessibility
- Consistent with other text inputs (title, duration, lessons)
- No new dependencies or custom components required

**Implementation**:
```tsx
<Input
  id="teacher"
  label="Teacher"
  value={formData.teacher}
  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
  error={errors.teacher}
  required
/>
```

**Alternatives Considered**:
- Autocomplete/dropdown for teacher selection - rejected for overengineering (no teacher database)
- Rich text editor for teacher bio - rejected (simple name suffices per spec)
- Specialized teacher picker component - rejected per Minimal Dependencies principle

### 5. Icon Selection for Teacher Display

**Decision**: Use SVG user/instructor icon inline, matching existing icon pattern  
**Rationale**:
- Feature 001 uses inline SVG icons for category badges and metadata
- No icon library dependencies (lucide-react, heroicons) installed
- Simple user icon (person silhouette) is universally recognized for instructor
- Tailwind classes handle sizing and colors consistently

**SVG Path**:
```svg
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  <circle cx="12" cy="7" r="4" />
</svg>
```

**Alternatives Considered**:
- Icon library dependency (lucide-react) - rejected per Minimal Dependencies principle
- Text label only ("Instructor:") - rejected for visual hierarchy consistency
- Emoji instructor icon (👨‍🏫) - rejected for accessibility and professional appearance

### 6. TypeScript Interface Updates

**Decision**: Add teacher as required field to Course interface, update CourseFormData accordingly  
**Rationale**:
- TypeScript's type safety ensures all CRUD operations handle teacher field
- Compiler errors guide implementation across all affected components
- Required field enforces data integrity at type level
- No breaking changes to existing code (teacher added, not replaced)

**Implementation**:
```typescript
// data/courses.ts
export interface Course {
  id: string;
  title: string;
  teacher: string;  // NEW: Required instructor name
  category: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
}

// components/course-management/course-form.tsx
interface CourseFormData {
  title: string;
  teacher: string;  // NEW: Required field
  category: string;
  level: CourseLevel;
  lessons: string;
  duration: string;
  description: string;
  tags: string;
}
```

**Alternatives Considered**:
- Optional teacher field (teacher?: string) - rejected per spec requirement (required field)
- Separate Teacher interface/type - rejected for overengineering (simple string suffices)
- teacher as array (multiple instructors) - rejected for spec scope (single teacher)

## Technical Decisions Summary

| Decision Area | Chosen Approach | Key Constraint |
|---------------|-----------------|----------------|
| Validation | Extend existing validateCourseForm | 2-100 character constraint |
| Display | Icon + text below title | Match existing metadata layout |
| Migration | Blocking warning on edit | Require immediate assignment |
| Form Input | Reuse Input component | No new dependencies |
| Icon | Inline SVG user icon | No icon library |
| TypeScript | Required field in Course interface | Type safety enforcement |

## Best Practices Applied

1. **Clean Code**: Leverage existing validation, input, and display patterns
2. **Simple UX**: Teacher field follows established course metadata conventions
3. **Minimal Dependencies**: No new packages, libraries, or external services
4. **Comprehensive Testing**: Unit tests for validation, integration tests for CRUD, e2e for migration workflow

## Open Questions

None - all technical unknowns resolved.

## Next Steps

Proceed to Phase 1:
1. Create data-model.md with Course entity schema updates
2. Create contracts/component-contracts.md with affected component interfaces
3. Create quickstart.md with step-by-step implementation guide
4. Update agent context with new implementation details
