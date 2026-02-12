# Feature Specification: Add Teacher Field to Course Entity

**Feature Branch**: `002-add-teacher-field`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "Extend the Course entity to include a required teacher field (string). The field must be stored, validated, and returned in all Course CRUD operations."

## Clarifications

### Session 2026-02-11

- Q: Where exactly should the teacher name be displayed in the course card layout? → A: Below course title with icon (like category/level info)
- Q: How should existing courses without teacher data be handled when the feature is deployed? → A: Require immediate manual update before viewing/editing

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Teacher Information Display (Priority: P1)

Course catalog users need to see who teaches each course so they can make informed decisions based on instructor expertise and teaching style. This helps users identify courses taught by instructors they know or prefer.

**Why this priority**: Essential information for course selection - users often choose courses based on the instructor, making this a high-value addition to the course entity.

**Automated Testing**: Unit tests for CourseCard component rendering teacher information, integration tests verifying teacher data persists through CRUD operations, e2e tests confirming teacher information displays correctly in both catalog and management interfaces.

**Manual Verification**: Can be fully verified by creating or editing a course with teacher information and confirming it displays in the course catalog cards and management interface.

**Acceptance Scenarios**:

1. **Given** I view a course in the catalog, **When** the course card is displayed, **Then** I see the teacher's name with an instructor icon below the course title, in the same style as category/level metadata
2. **Given** I view the course management interface, **When** listing courses, **Then** each course shows the assigned teacher below the title with consistent icon styling
3. **Given** a course has a teacher assigned, **When** I view course details, **Then** the teacher information is displayed in the metadata section alongside category, level, and lessons information

---

### User Story 2 - Teacher Assignment During Course Creation (Priority: P1)

Content administrators need to assign a teacher when creating a new course so that every course has clear ownership and instructor information from the start.

**Why this priority**: Critical for data completeness - requiring teacher assignment at creation ensures no courses are published without instructor information.

**Automated Testing**: Unit tests for CourseForm validation requiring teacher field, integration tests for course creation with teacher data, e2e tests for complete course creation workflow including teacher assignment.

**Manual Verification**: Can be verified by attempting to create a course without a teacher (should show validation error) and then successfully creating a course with teacher information.

**Acceptance Scenarios**:

1. **Given** I am creating a new course, **When** I open the course creation form, **Then** I see a required teacher input field
2. **Given** I attempt to create a course without entering a teacher name, **When** I submit the form, **Then** I see a validation error requiring the teacher field
3. **Given** I enter a valid teacher name, **When** I submit the course creation form, **Then** the course is created with the teacher information saved
4. **Given** I create a course with teacher information, **When** the course is saved, **Then** the teacher field is stored in the course entity

---

### User Story 3 - Teacher Information Updates (Priority: P2)

Content administrators need to update teacher assignments when instructors change or corrections are needed, maintaining accurate course ownership information over time.

**Why this priority**: Important for data accuracy - while less critical than initial assignment, the ability to update teacher information ensures the catalog remains current as instructor assignments change.

**Automated Testing**: Unit tests for CourseForm edit mode with teacher field, integration tests for course update operations including teacher changes, e2e tests for complete edit workflow with teacher modifications.

**Manual Verification**: Can be verified by editing an existing course, changing the teacher name, saving, and confirming the updated teacher information displays correctly throughout the application.

**Acceptance Scenarios**:

1. **Given** I am editing an existing course, **When** I open the course edit form, **Then** I see the current teacher name pre-populated in the teacher field
2. **Given** I change the teacher name, **When** I save the course, **Then** the updated teacher information is saved and displayed
3. **Given** I attempt to clear the teacher field, **When** I submit the form, **Then** I see a validation error preventing empty teacher values

---

### User Story 4 - Existing Course Migration (Priority: P1)

Content administrators need to add teacher information to existing courses before they can view or edit them, ensuring complete data across the entire catalog.

**Why this priority**: Critical for data consistency - requiring immediate updates prevents incomplete course records and ensures all courses meet the new data quality standards.

**Automated Testing**: Unit tests for validation blocking course edit without teacher, integration tests for migration workflow prompting teacher entry, e2e tests for complete existing course update journey.

**Manual Verification**: Can be verified by attempting to edit an existing course without teacher data (should prompt for teacher entry), adding teacher information, and confirming the course can then be edited normally.

**Acceptance Scenarios**:

1. **Given** I attempt to edit an existing course without teacher data, **When** I open the edit form, **Then** I am prompted to enter teacher information before proceeding
2. **Given** I enter teacher information for a previously incomplete course, **When** I save, **Then** the course is updated with teacher data and can be edited normally
3. **Given** an existing course lacks teacher data, **When** I view it in the management list, **Then** I see a visual indicator (e.g., warning badge) showing it requires teacher assignment
4. **Given** I attempt to view course details for a course without teacher data, **When** accessing from management interface, **Then** I am redirected to an update form requiring teacher entry

---

### Edge Cases

- Teacher names exceeding 100 characters will be rejected with validation error (maximum enforced)
- Special characters (accents, hyphens, apostrophes) in teacher names are accepted and preserved
- Multiple courses can share the same teacher name without conflicts (no uniqueness requirement)
- Teacher names on mobile devices will wrap to multiple lines if needed, maintaining readability with icon alignment
- Existing courses without teacher data will require immediate teacher assignment when administrators attempt to view or edit them (blocking workflow until completed)
- Teacher field cannot be cleared once set - administrators must provide a replacement teacher name if changing

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Course entity MUST include a teacher field of type string
- **FR-002**: Teacher field MUST be required for all course creation operations
- **FR-003**: Teacher field MUST be required for all course update operations
- **FR-004**: System MUST validate teacher field is not empty before saving courses
- **FR-005**: Teacher field MUST be persisted with all other course data
- **FR-006**: Teacher field MUST be returned in all course read operations
- **FR-007**: Course creation form MUST include a teacher input field with validation
- **FR-008**: Course edit form MUST display and allow updates to the teacher field
- **FR-009**: Course list/catalog displays MUST show teacher information for each course
- **FR-010**: Teacher field validation MUST accept strings between 2 and 100 characters
- **FR-011**: Teacher field MUST accept names with common special characters (accents, hyphens, apostrophes, spaces)
- **FR-012**: System MUST preserve teacher field data through all CRUD operations without loss or corruption
- **FR-013**: Teacher information MUST be displayed below the course title with an instructor icon, matching the visual style of category/level metadata
- **FR-014**: System MUST prevent editing of existing courses that lack teacher data until teacher information is provided
- **FR-015**: Management interface MUST show a visual indicator (warning badge) for courses missing teacher information
- **FR-016**: System MUST prompt administrators to add teacher information when attempting to view or edit courses without teacher data

### Key Entities

- **Course**: Extended to include teacher field (string, required, 2-100 characters)
  - Existing attributes: id, title, category, level, lessons, duration, rating, description, tags
  - New attribute: teacher - the instructor/teacher assigned to this course

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All new courses created include teacher information (100% data completeness)
- **SC-002**: Users can identify course instructors without additional navigation (information visible in course cards)
- **SC-003**: Administrator can successfully create courses with teacher assignment in under 3 minutes (including time to enter teacher name)
- **SC-004**: Teacher field validation prevents empty or invalid data from being saved (0 courses without teacher information)
- **SC-005**: Existing courses can be updated to include teacher information through the edit interface
- **SC-006**: Teacher information displays correctly across all screen sizes and devices

## Scope *(mandatory)*

### In Scope

- Add teacher field to Course TypeScript interface
- Update CourseFormData interface to include teacher field
- Add teacher validation rules to validation utility
- Update CourseForm component to include teacher input field with instructor icon
- Modify CourseListItem component to display teacher information below title with icon
- Update CourseCard component (main catalog) to show teacher information below title with icon
- Update all CRUD operations to handle teacher field
- Add teacher field to existing sample course data
- Validate teacher field in form submissions
- Add visual indicator (warning badge) for courses missing teacher data in management interface
- Implement blocking workflow requiring teacher entry before editing existing incomplete courses
- Create teacher assignment prompt/modal for existing courses without teacher data

### Out of Scope

- Teacher profile pages or detailed teacher information management
- Teacher authentication or login capabilities
- Linking courses to a separate Teacher entity or database table
- Teacher rating or review functionality
- Multiple teachers per course (single teacher only)
- Teacher selection from a dropdown list (free-form text input)
- Historical tracking of teacher changes over time
- Migration script for production data (manual update of existing courses acceptable)

## Assumptions *(include if relevant)*

- Teacher field is a simple string, not a reference to a separate Teacher entity
- Multiple courses can have the same teacher name (no uniqueness constraint)
- Teacher names are entered manually by administrators (no autocomplete from existing teachers)
- Existing courses in the system must be updated with teacher information before they can be edited
- Teacher information is displayed with an instructor icon below the course title
- Blocking workflow for incomplete courses is acceptable and won't disrupt critical operations
- Teacher field does not affect course filtering or search functionality in this iteration
- Teacher information is displayed but not searchable or filterable initially

## Dependencies *(include if any)*

- Requires existing Course Management System (Feature 001-course-crud)
- Depends on CourseForm, CourseListItem, CourseCard components
- Depends on CourseService CRUD operations
- Depends on validation utility functions

## Open Questions *(optional)*

None - all requirements are clear and specified.
