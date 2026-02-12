# Tasks: Add Teacher Field to Course Entity

**Input**: Design documents from `/specs/002-add-teacher-field/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md

**Tests**: Per Constitution Principle IV - Comprehensive Testing Strategy, this feature includes unit tests, integration tests, and e2e tests. Tests are MANDATORY and must pass before feature completion.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Basic configuration for Feature 002 implementation

- [X] T001 Verify Feature 001 CRUD infrastructure is complete and functional
- [X] T002 Review quickstart.md and component contracts for implementation guidance

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data model and validation infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update Course interface to include teacher field in data/courses.ts
- [X] T004 Update featuredCourses sample data with teacher assignments in data/courses.ts
- [X] T005 [P] Add teacher validation logic (2-100 chars) to validateCourseForm in data/utils/validation.ts
- [X] T006 [P] Update CourseFormData interface to include teacher field in components/course-management/course-form.tsx
- [X] T007 Update CourseService.searchCourses to include teacher field in search query in data/services/course-service.ts

**Checkpoint**: Foundation ready - TypeScript compiler will guide all remaining changes

---

## Phase 3: User Story 1 - Teacher Information Display (Priority: P1) 🎯 MVP

**Goal**: Display teacher name with instructor icon below course title in catalog and management views, enabling users to identify instructors at a glance

**Manual Verification**: Create/edit a course with teacher "Dr. Sarah Johnson", verify teacher displays below title with icon in both course card (homepage) and list item (management modal)

### Tests for User Story 1 (MANDATORY) ✓

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Unit test for CourseCard teacher display in __tests__/unit/course-card.test.tsx
- [ ] T009 [P] [US1] Unit test for CourseListItem teacher display in __tests__/unit/course-list-item.test.tsx
- [ ] T010 [P] [US1] Integration test verifying teacher persists through CRUD in __tests__/integration/course-crud-teacher.test.tsx
- [ ] T011 [US1] E2E test confirming teacher displays in catalog and management in __tests__/e2e/teacher-display.spec.ts

### Implementation for User Story 1

- [X] T012 [P] [US1] Add teacher display with icon below title in components/course-card.tsx
- [X] T013 [P] [US1] Add teacher display with icon below title in components/course-management/course-list-item.tsx

**Checkpoint**: At this point, teacher information should display correctly in all course views

---

## Phase 4: User Story 2 - Teacher Assignment During Course Creation (Priority: P1) 🎯 MVP

**Goal**: Require teacher assignment when creating new courses, ensuring 100% data completeness from the start

**Manual Verification**: Attempt to create course without teacher (should show validation error), then create course with teacher "Prof. Michael Chen" (should succeed)

### Tests for User Story 2 (MANDATORY) ✓

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US2] Unit test for teacher input field rendering in __tests__/unit/course-form-teacher-input.test.tsx
- [ ] T015 [P] [US2] Unit test for teacher validation errors (empty, too short, too long) in __tests__/unit/teacher-validation.test.ts
- [ ] T016 [US2] Integration test for course creation with teacher in __tests__/integration/course-create-teacher.test.tsx
- [ ] T017 [US2] E2E test for complete course creation workflow with teacher in __tests__/e2e/teacher-creation-flow.spec.ts

### Implementation for User Story 2

- [X] T018 [US2] Add teacher input field between title and category in components/course-management/course-form.tsx
- [X] T019 [US2] Add teacher to form state initialization (empty for create, populated for edit) in components/course-management/course-form.tsx
- [X] T020 [US2] Update handleCreateCourse to include teacher in CourseManagementModal in components/course-management/course-management-modal.tsx

**Checkpoint**: At this point, new courses can be created with required teacher field

---

## Phase 5: User Story 3 - Teacher Information Updates (Priority: P2)

**Goal**: Allow administrators to update teacher assignments when instructors change, maintaining accurate course ownership

**Manual Verification**: Edit existing course, change teacher from "Dr. Sarah Johnson" to "Dr. Emily Williams", verify updated teacher displays everywhere

### Tests for User Story 3 (MANDATORY) ✓

- [ ] T021 [P] [US3] Unit test for teacher field pre-population in edit mode in __tests__/unit/course-form-edit-teacher.test.tsx
- [ ] T022 [P] [US3] Integration test for course update with teacher change in __tests__/integration/course-update-teacher.test.tsx
- [ ] T023 [US3] E2E test for complete edit workflow with teacher modification in __tests__/e2e/teacher-update-flow.spec.ts

### Implementation for User Story 3

- [X] T024 [US3] Update handleUpdateCourse to include teacher in CourseManagementModal in components/course-management/course-management-modal.tsx
- [X] T025 [US3] Verify teacher field pre-populates correctly in edit mode (already implemented via T019 form state)

**Checkpoint**: At this point, all CRUD operations handle teacher field correctly

---

## Phase 6: User Story 4 - Existing Course Migration (Priority: P1) 🎯 MVP

**Goal**: Require immediate teacher assignment for existing courses before editing, ensuring complete data across entire catalog

**Manual Verification**: Temporarily remove teacher from one sample course, attempt to edit it, verify warning badge appears, add teacher "Dr. New Instructor", verify edit succeeds

### Tests for User Story 4 (MANDATORY) ✓

- [ ] T026 [P] [US4] Unit test for warning badge display when course lacks teacher in __tests__/unit/course-form-warning-badge.test.tsx
- [ ] T027 [P] [US4] Integration test for migration workflow (edit course without teacher) in __tests__/integration/course-migration-teacher.test.tsx
- [ ] T028 [US4] E2E test for complete migration journey (edit → see warning → add teacher → save) in __tests__/e2e/teacher-migration-flow.spec.ts

### Implementation for User Story 4

- [X] T029 [US4] Add warning badge for courses without teacher in components/course-management/course-form.tsx
- [X] T030 [US4] Ensure validation blocks saving courses without teacher (already implemented via T005 validation logic)

**Checkpoint**: All user stories are now independently functional and tested

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T031 [P] Run all unit tests and verify 100% pass rate
- [ ] T032 [P] Run all integration tests and verify 100% pass rate
- [ ] T033 [P] Run all e2e tests and verify 100% pass rate
- [X] T034 Build project and verify no TypeScript errors
- [X] T035 Manual testing of all quickstart.md scenarios
- [X] T036 [P] Code review and refactoring (if needed)
- [X] T037 [P] Update README.md to document teacher field in Course schema
- [X] T038 Verify mobile responsive design for teacher display
- [X] T039 Test search functionality includes teacher names
- [X] T040 Final commit with comprehensive message

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) + User Story 1 (needs display components)
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) + User Story 2 (needs form inputs)
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) + User Story 2 (needs validation)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

**User Story 1 (P1 - Display)**: 
- MUST complete Foundational (Phase 2) first
- No dependencies on other stories
- Foundational tasks: T003, T004, T005, T006, T007

**User Story 2 (P1 - Creation)**:
- MUST complete Foundational (Phase 2) first
- SHOULD complete User Story 1 first (so created courses display properly)
- Can technically run in parallel with US1 if different developers

**User Story 3 (P2 - Updates)**:
- MUST complete Foundational (Phase 2) first
- MUST complete User Story 2 (needs form infrastructure)
- Extends US2 functionality for updates

**User Story 4 (P1 - Migration)**:
- MUST complete Foundational (Phase 2) first
- MUST complete User Story 2 (needs validation and form logic)
- Adds warning badge to existing form

### Within Each User Story

1. **Tests FIRST**: Write all tests for the story, ensure they FAIL
2. **Implementation**: Implement code to make tests PASS
3. **Manual Verification**: Follow quickstart.md scenarios
4. **Story Complete**: Move to next priority

### Parallel Opportunities

**Within Foundational Phase**:
- T005 (validation) can run parallel with T006 (form interface)
- T007 (search) can run parallel with T005 and T006

**Within User Story 1**:
- T008, T009, T010 (tests) can all run in parallel
- T012, T013 (display components) can run in parallel

**Within User Story 2**:
- T014, T015, T016 (tests) can all run in parallel
- T018, T019 (form updates) must run sequentially

**Within User Story 3**:
- T021, T022 (tests) can run in parallel
- T024, T025 (update logic) can run sequentially

**Within User Story 4**:
- T026, T027 (tests) can run in parallel
- T029, T030 (warning implementation) can run sequentially

**Within Polish Phase**:
- T031, T032, T033 (all test runs) can be launched in parallel
- T036, T037, T038 (documentation/review) can run in parallel

---

## Parallel Example: User Story 1 (Display)

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for CourseCard teacher display in __tests__/unit/course-card.test.tsx"
Task: "Unit test for CourseListItem teacher display in __tests__/unit/course-list-item.test.tsx"
Task: "Integration test verifying teacher persists in __tests__/integration/course-crud-teacher.test.tsx"

# Launch display component work together:
Task: "Add teacher display with icon in components/course-card.tsx"
Task: "Add teacher display with icon in components/course-management/course-list-item.tsx"
```

---

## Parallel Example: User Story 2 (Creation)

```bash
# Launch all tests for User Story 2 together:
Task: "Unit test for teacher input field in __tests__/unit/course-form-teacher-input.test.tsx"
Task: "Unit test for teacher validation in __tests__/unit/teacher-validation.test.ts"
Task: "Integration test for creation in __tests__/integration/course-create-teacher.test.tsx"

# Form updates (sequential - same file):
Task: "Add teacher input field in components/course-management/course-form.tsx"
Task: "Update form state initialization in components/course-management/course-form.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 4 Only)

**Reasoning**: US1 (display), US2 (creation), and US4 (migration) are all P1 priority and deliver core teacher functionality. US3 (updates) is P2 and can come later.

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T007) - CRITICAL BLOCKER
3. Complete Phase 3: User Story 1 - Display (T008-T013)
4. Complete Phase 4: User Story 2 - Creation (T014-T020)
5. Complete Phase 6: User Story 4 - Migration (T026-T030)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo MVP (display + creation + migration working)

### Incremental Delivery

1. **Foundation** (Phase 1-2) → Data model and validation ready
2. **+User Story 1** (Phase 3) → Teacher displays everywhere → Test independently → Deploy
3. **+User Story 2** (Phase 4) → New courses require teacher → Test independently → Deploy
4. **+User Story 4** (Phase 6) → Migration workflow complete → Test independently → Deploy
5. **+User Story 3** (Phase 5) → Teacher updates enabled → Test independently → Deploy
6. **+Polish** (Phase 7) → Final quality checks → Deploy

Each increment adds value without breaking previous stories.

### Parallel Team Strategy

With 2-3 developers:

1. **Team completes Foundational together** (Phase 2: T003-T007)
2. **Once Foundational is done, parallelize**:
   - Developer A: User Story 1 (Display) - T008-T013
   - Developer B: User Story 2 (Creation) - T014-T020
3. **After US1 & US2 complete**:
   - Developer A: User Story 4 (Migration) - T026-T030
   - Developer B: User Story 3 (Updates) - T021-T025
4. Stories complete and integrate independently

---

## Recommended Execution Order

**For single developer (MVP focus)**:
```
Phase 1 (Setup) → Phase 2 (Foundational) → 
Phase 3 (US1 Display) → Phase 4 (US2 Creation) → 
Phase 6 (US4 Migration) → Phase 5 (US3 Updates) → 
Phase 7 (Polish)
```

**For team of 2 (parallel after foundation)**:
```
Phase 1 (Setup) → Phase 2 (Foundational) →
  Dev A: Phase 3 (US1)  |  Dev B: Phase 4 (US2)
  Dev A: Phase 6 (US4)  |  Dev B: Phase 5 (US3)
→ Phase 7 (Polish together)
```

---

## Test Coverage Summary

**Total Test Files**: 11 new test files

| Test Type | Count | User Stories |
|-----------|-------|--------------|
| Unit Tests | 7 | US1 (2), US2 (2), US3 (1), US4 (2) |
| Integration Tests | 4 | US1 (1), US2 (1), US3 (1), US4 (1) |
| E2E Tests | 4 | US1 (1), US2 (1), US3 (1), US4 (1) |

**Test-Driven Development**: All tests must be written FIRST and FAIL before implementation begins for each user story.

---

## Files Affected Summary

**Total Files Modified**: 7 files
**Total New Test Files**: 11 files

### Data Layer (3 files modified):
1. `data/courses.ts` - Add teacher to Course interface and sample data
2. `data/utils/validation.ts` - Add teacher validation
3. `data/services/course-service.ts` - Update search to include teacher

### Component Layer (4 files modified):
4. `components/course-card.tsx` - Display teacher with icon
5. `components/course-management/course-form.tsx` - Add teacher input and warning badge
6. `components/course-management/course-list-item.tsx` - Display teacher with icon
7. `components/course-management/course-management-modal.tsx` - Pass teacher in CRUD

### Test Layer (11 new files):
8. `__tests__/unit/course-card.test.tsx`
9. `__tests__/unit/course-list-item.test.tsx`
10. `__tests__/unit/course-form-teacher-input.test.tsx`
11. `__tests__/unit/teacher-validation.test.ts`
12. `__tests__/unit/course-form-edit-teacher.test.tsx`
13. `__tests__/unit/course-form-warning-badge.test.tsx`
14. `__tests__/integration/course-crud-teacher.test.tsx`
15. `__tests__/integration/course-create-teacher.test.tsx`
16. `__tests__/integration/course-update-teacher.test.tsx`
17. `__tests__/integration/course-migration-teacher.test.tsx`
18. `__tests__/e2e/teacher-display.spec.ts`
19. `__tests__/e2e/teacher-creation-flow.spec.ts`
20. `__tests__/e2e/teacher-update-flow.spec.ts`
21. `__tests__/e2e/teacher-migration-flow.spec.ts`

---

## Time Estimates

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Setup | T001-T002 | 10 minutes |
| Phase 2: Foundational | T003-T007 | 45 minutes |
| Phase 3: US1 Display | T008-T013 | 50 minutes (20 tests + 30 impl) |
| Phase 4: US2 Creation | T014-T020 | 60 minutes (25 tests + 35 impl) |
| Phase 5: US3 Updates | T021-T025 | 40 minutes (15 tests + 25 impl) |
| Phase 6: US4 Migration | T026-T030 | 45 minutes (20 tests + 25 impl) |
| Phase 7: Polish | T031-T040 | 40 minutes |
| **Total** | **40 tasks** | **4.5 hours** |

**MVP Only (US1+US2+US4)**: ~3 hours
**With US3 (Updates)**: ~3.5 hours
**With Full Polish**: ~4.5 hours

---

## Success Criteria Checklist

- [ ] All 40 tasks completed and checked off
- [ ] All TypeScript errors resolved (Course interface changes)
- [ ] All unit tests pass (7 test files)
- [ ] All integration tests pass (4 test files)
- [ ] All e2e tests pass (4 test files)
- [ ] Build succeeds without warnings
- [ ] Teacher displays on all course cards with icon below title
- [ ] Teacher input in create/edit forms with validation
- [ ] Warning badge shows for courses without teacher
- [ ] Search includes teacher names
- [ ] Manual quickstart.md scenarios verified
- [ ] Mobile responsive design confirmed
- [ ] README.md updated with teacher field documentation
- [ ] Code committed to `002-add-teacher-field` branch

---

## Notes

- All tasks with [P] marker can run in parallel (different files, no dependencies)
- Tasks without [P] must run sequentially within their phase
- Tests marked MANDATORY must be written before implementation
- TypeScript compiler will guide implementation after Foundational phase
- Quickstart.md provides detailed code examples for each task
- Component contracts define exact interfaces and JSX structures
