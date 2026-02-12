# Tasks: Course Management System

**Input**: Design documents from `/specs/001-course-crud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per Constitution Principle IV - Comprehensive Testing Strategy, every feature must include unit tests, integration tests, and e2e tests as appropriate. Tests are MANDATORY and must pass before feature completion.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js project**: `app/`, `components/`, `data/`, `__tests__/` at repository root
- **Testing structure**: `__tests__/components/`, `__tests__/integration/`, `__tests__/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and testing framework setup

- [ ] T001 Install and configure testing dependencies (@testing-library/react, @testing-library/jest-dom, jest, jest-environment-jsdom)
- [ ] T002 Install and configure Playwright for e2e testing (@playwright/test)
- [ ] T003 [P] Setup Jest configuration file (jest.config.js) with TypeScript and React support
- [ ] T004 [P] Initialize Playwright configuration (playwright.config.ts) for Next.js app testing
- [ ] T005 [P] Create testing utility functions in __tests__/utils/test-utils.tsx for component testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Enhance Course interface in data/courses.ts with all required properties per data model
- [ ] T007 Create base UI components: Modal in components/ui/modal.tsx
- [ ] T008 [P] Create base UI components: Button in components/ui/button.tsx
- [ ] T009 [P] Create base UI components: Input in components/ui/input.tsx
- [ ] T010 [P] Create base UI components: Search in components/ui/search.tsx
- [ ] T011 Create CourseService class in components/course-management/services/course-service.ts for CRUD operations
- [ ] T012 Create validation utilities in components/course-management/utils/validation.ts
- [ ] T013 Add "Manage Courses" button to homepage app/page.tsx next to "Ver Demo" button

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Course Creation (Priority: P1) 🎯 MVP

**Goal**: Administrators can create new courses through a modal interface with validation and auto-save

**Manual Verification**: Click "Manage Courses" button, click "Add New Course", fill form with valid data, verify course appears in management list and main catalog

### Tests for User Story 1 (MANDATORY) ✓

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Unit tests for CourseForm component in __tests__/components/course-form.test.tsx
- [ ] T015 [P] [US1] Unit tests for course creation validation in __tests__/utils/validation.test.tsx
- [ ] T016 [P] [US1] Integration test for course creation workflow in __tests__/integration/course-creation.test.tsx
- [ ] T017 [P] [US1] E2E test for complete course creation journey in __tests__/e2e/course-creation.spec.ts

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create CourseForm component in components/course-management/course-form.tsx
- [ ] T019 [P] [US1] Create form validation hooks in components/course-management/hooks/use-course-validation.ts
- [ ] T020 [US1] Implement CourseManagementModal with create mode in components/course-management/course-management-modal.tsx
- [ ] T021 [US1] Add course creation logic to CourseService.createCourse method
- [ ] T022 [US1] Integrate modal with homepage state management for course updates
- [ ] T023 [US1] Add optimistic UI updates and error handling for course creation

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Course Viewing & Listing (Priority: P2)

**Goal**: Administrators can view all courses in a searchable, filterable interface

**Manual Verification**: Access course management interface, verify all courses display with key details, test search and filter functionality

### Tests for User Story 2 (MANDATORY) ✓

- [ ] T024 [P] [US2] Unit tests for CourseList component in __tests__/components/course-list.test.tsx
- [ ] T025 [P] [US2] Unit tests for search and filter logic in __tests__/components/course-filters.test.tsx
- [ ] T026 [P] [US2] Integration test for course listing and filtering in __tests__/integration/course-listing.test.tsx
- [ ] T027 [P] [US2] E2E test for course browsing and search functionality in __tests__/e2e/course-browsing.spec.ts

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create CourseList component in components/course-management/course-list.tsx
- [ ] T029 [P] [US2] Create CourseCard component for list display in components/course-management/course-card.tsx
- [ ] T030 [P] [US2] Create CourseFilters component in components/course-management/course-filters.tsx
- [ ] T031 [P] [US2] Implement search functionality in components/course-management/hooks/use-course-search.ts
- [ ] T032 [US2] Add list view to CourseManagementModal component
- [ ] T033 [US2] Implement filtering logic (category, level) in CourseService
- [ ] T034 [US2] Add loading states and empty state handling for course list

**Checkpoint**: Course listing and search functionality complete and independently testable

---

## Phase 5: User Story 3 - Course Editing (Priority: P3)

**Goal**: Administrators can update existing course information with validation and auto-save

**Manual Verification**: Select course from management interface, click edit, modify fields, save changes, verify updates appear correctly

### Tests for User Story 3 (MANDATORY) ✓

- [ ] T035 [P] [US3] Unit tests for course edit form pre-population in __tests__/components/course-form-edit.test.tsx
- [ ] T036 [P] [US3] Unit tests for course update validation in __tests__/utils/validation-update.test.tsx
- [ ] T037 [P] [US3] Integration test for course editing workflow in __tests__/integration/course-editing.test.tsx
- [ ] T038 [P] [US3] E2E test for complete course edit journey in __tests__/e2e/course-editing.spec.ts

### Implementation for User Story 3

- [ ] T039 [P] [US3] Extend CourseForm component to support edit mode with pre-population
- [ ] T040 [P] [US3] Add edit action buttons to CourseCard component
- [ ] T041 [US3] Implement edit mode in CourseManagementModal component
- [ ] T042 [US3] Add CourseService.updateCourse method with validation
- [ ] T043 [US3] Handle optimistic updates and rollback for course editing
- [ ] T044 [US3] Add change detection and form state management for edits

**Checkpoint**: Course editing functionality complete with proper validation and state management

---

## Phase 6: User Story 4 - Course Deletion (Priority: P4)

**Goal**: Administrators can remove courses with confirmation dialog to maintain content quality

**Manual Verification**: Select course, click delete, confirm deletion in dialog, verify course removed from both management interface and main catalog

### Tests for User Story 4 (MANDATORY) ✓

- [ ] T045 [P] [US4] Unit tests for delete confirmation dialog in __tests__/components/delete-confirmation.test.tsx
- [ ] T046 [P] [US4] Unit tests for course deletion logic in __tests__/services/course-service-delete.test.tsx
- [ ] T047 [P] [US4] Integration test for course deletion workflow in __tests__/integration/course-deletion.test.tsx
- [ ] T048 [P] [US4] E2E test for complete course deletion journey in __tests__/e2e/course-deletion.spec.ts

### Implementation for User Story 4

- [ ] T049 [P] [US4] Create DeleteConfirmationDialog component in components/course-management/delete-confirmation.tsx
- [ ] T050 [P] [US4] Add delete action buttons to CourseCard component
- [ ] T051 [US4] Implement delete mode in CourseManagementModal component
- [ ] T052 [US4] Add CourseService.deleteCourse method with confirmation
- [ ] T053 [US4] Handle optimistic deletion and error rollback
- [ ] T054 [US4] Add safety measures and undo functionality for accidental deletions

**Checkpoint**: Course deletion functionality complete with proper confirmation and safety measures

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, performance optimization, and comprehensive testing

- [ ] T055 [P] Add responsive design improvements for mobile course management
- [ ] T056 [P] Implement keyboard navigation and accessibility features for modal
- [ ] T057 [P] Add loading indicators and skeleton states for better UX
- [ ] T058 [P] Optimize course list rendering performance for large datasets
- [ ] T059 Add comprehensive error boundary for course management modal
- [ ] T060 Implement data persistence validation and recovery mechanisms
- [ ] T061 Add analytics tracking for course management operations
- [ ] T062 Final integration testing across all user stories
- [ ] T063 Performance testing for modal operations and large course lists
- [ ] T064 [P] Add performance validation for modal open/close timing (<200ms requirement)
- [ ] T065 [P] Add performance validation for search results timing (<1s for 1000 courses)
- [ ] T066 Add data synchronization validation between modal and main catalog (FR-010)

---

## Dependencies

### Story Completion Order
1. **Setup & Foundation** (T001-T013) → Must complete before any user story
2. **User Story 1 (P1)** (T014-T023) → Can start after foundation, independent
3. **User Story 2 (P2)** (T024-T034) → Can start after foundation, independent  
4. **User Story 3 (P3)** (T035-T044) → Requires US1 (create) and US2 (list) components
5. **User Story 4 (P4)** (T045-T054) → Requires US2 (list) for selection, independent of create/edit
6. **Polish** (T055-T066) → After all user stories are complete

### Parallel Execution Opportunities

**During Foundation Phase**:
- T003, T004, T005 (configuration files)
- T008, T009, T010 (UI components)

**During User Story Implementation**:
- All test tasks (T014-T017, T024-T027, T035-T038, T045-T048) can run in parallel
- Component creation tasks within each story can run in parallel
- US1 and US2 can be developed simultaneously after foundation
- Polish tasks (T055-T058, T064-T065) can run in parallel

## Implementation Strategy

### MVP Approach
**Minimum Viable Product**: Complete User Story 1 (Course Creation) only
- Provides immediate value: administrators can add new courses
- Establishes foundation for remaining features
- Enables early user feedback and validation
- Estimated effort: 35% of total project (23/66 tasks)

### Incremental Delivery
1. **Sprint 1**: Setup + Foundation + US1 (Course Creation)
2. **Sprint 2**: US2 (Listing & Search)  
3. **Sprint 3**: US3 (Editing)
4. **Sprint 4**: US4 (Deletion) + Polish

### Quality Gates
- All tests must pass before marking tasks complete
- Each user story must be independently verifiable
- Modal operations must complete within performance thresholds (<200ms open, <1s search)
- Responsive design verified on mobile devices
- Accessibility standards met for keyboard navigation

## Risk Mitigation

**Technical Risks**:
- Modal state management complexity → Mitigated by dedicated state hooks
- Performance with large course lists → Mitigated by virtualization and pagination
- Data synchronization between modal and main app → Mitigated by centralized state updates

**Delivery Risks**:
- Story dependencies blocking progress → Mitigated by parallel development opportunities
- Testing bottlenecks → Mitigated by test-first development approach
- Integration complexity → Mitigated by incremental story delivery