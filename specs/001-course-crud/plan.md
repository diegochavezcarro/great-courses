# Implementation Plan: Course Management System

**Branch**: `001-course-crud` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-course-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive CRUD interface for course management accessible via modal dialog from the homepage. Administrators can create, view, edit, and delete courses with auto-generated IDs, validation, and real-time updates to both management interface and public catalog. Modal design maintains user context while providing full functionality.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.5.3, Next.js 14.2.5
**Primary Dependencies**: Next.js 14.2.5, React 18.3.1, Tailwind CSS 3.4.6
**Storage**: Local TypeScript files (data/courses.ts), in-memory state management
**Testing**: Jest + Testing Library for unit/integration tests, Playwright for e2e testing
**Target Platform**: Web browsers, mobile responsive design
**Project Type**: Next.js web application - App Router structure  
**Performance Goals**: Modal opens <200ms, search results <1s for up to 1000 courses, form validation <100ms
**Constraints**: Modal overlay design, no backend database, synchronous updates, mobile-first responsive
**Scale/Scope**: Up to 500 courses displayed simultaneously, 4 CRUD operations, 1 modal interface

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Clean Code ✅
- Component-based architecture with single responsibilities
- TypeScript interfaces for all props and data structures
- Meaningful names for course management components and functions
- Self-documenting validation and state management logic

### Principle II: Simple UX Responsive Design ✅
- Modal interface maintains simplicity and focus
- Mobile-first Tailwind CSS implementation required
- Clear, purposeful UI elements for CRUD operations
- No complex animations or visual clutter in management interface

### Principle III: Minimal Dependencies ✅
- Uses only required stack: Next.js 14.2.5, React 18.3.1, Tailwind CSS 3.4.6
- Testing frameworks permitted per constitutional amendment: Jest, Testing Library, Playwright
- No additional third-party libraries needed for core functionality
- Built-in React state management sufficient for local data operations

### Principle IV: Comprehensive Testing Strategy ✅
- Unit tests planned for all form components and validation logic
- Integration tests for complete CRUD workflows specified  
- E2E tests with Playwright for critical user journeys through modal interface
- Test coverage requirement met for all four user stories

**GATE STATUS**: ✅ **PASS** - All constitutional principles satisfied. Design phase complete.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
specs/001-course-crud/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── globals.css
├── layout.tsx
└── page.tsx             # Updated with "Manage Courses" button

components/
├── course-card.tsx      # Existing component
├── course-management/
│   ├── course-management-modal.tsx # Main modal container
│   ├── course-list.tsx       # Course listing with search/filter
│   ├── course-form.tsx       # Create/Edit form component
│   ├── course-card.tsx       # Individual course display component
│   └── delete-confirmation.tsx # Delete confirmation dialog
└── ui/
    ├── modal.tsx        # Reusable modal base component
    ├── button.tsx       # Consistent button styles
    ├── input.tsx        # Form input components
    └── search.tsx       # Search input component

data/
├── courses.ts           # Existing course data (extended)
├── types/
│   └── course.ts       # Course type definitions
└── utils/
    ├── course-validation.ts  # Validation logic
    └── id-generation.ts     # Unique ID generation

__tests__/
├── components/
│   └── course-management/
│       ├── course-management-modal.test.tsx
│       ├── course-list.test.tsx
│       ├── course-form.test.tsx
│       └── delete-confirmation.test.tsx
├── integration/
│   ├── course-crud-workflow.test.tsx
│   └── course-search-filter.test.tsx
└── e2e/
    └── course-management.spec.ts
```
│   └── [route]/
│       └── route.ts
├── [page]/
│   └── page.tsx
├── globals.css
└── layout.tsx

components/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
