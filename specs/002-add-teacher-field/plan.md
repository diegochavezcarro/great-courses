# Implementation Plan: Add Teacher Field to Course Entity

**Branch**: `002-add-teacher-field` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-add-teacher-field/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a required teacher field (string, 2-100 characters) to the Course entity. Update all CRUD operations, form components, validation logic, and display components to handle teacher information. Display teacher with instructor icon below course title. Require immediate teacher assignment for existing courses before editing.

## Technical Context

**Language/Version**: TypeScript 5.5.3, Next.js 14.2.5  
**Primary Dependencies**: Next.js 14.2.5, React 18.3.1, Tailwind CSS 3.4.6  
**Storage**: TypeScript data files (data/courses.ts), in-memory state management  
**Testing**: Jest + Testing Library for unit/integration tests, Playwright for e2e testing  
**Target Platform**: Web browsers, mobile responsive design
**Project Type**: Next.js web application - App Router structure  
**Performance Goals**: Form validation <100ms, course list rendering <1s for 500 courses  
**Constraints**: Modal-based interface, synchronous updates, existing CRUD infrastructure must remain functional  
**Scale/Scope**: Single string field addition affecting 6 components, 2 utility files, 1 data file, comprehensive test coverage required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Clean Code ✅
- Single-responsibility components maintained (teacher field added to existing components)
- TypeScript interface updates preserve type safety
- Meaningful naming: teacher field, validation functions clearly named
- No new complexity introduced - simple string field addition

### Principle II: Simple UX Responsive Design ✅
- Teacher displayed below title with icon - follows existing metadata pattern
- Mobile-responsive design maintained through existing Tailwind patterns
- No additional UI complexity - teacher is one more metadata field
- Warning badge for incomplete courses is simple visual indicator

### Principle III: Minimal Dependencies ✅
- No new dependencies required
- Uses existing stack: Next.js 14.2.5, React 18.3.1, Tailwind CSS 3.4.6
- Testing dependencies already installed (Jest, Testing Library, Playwright)
- Built-in string validation sufficient for teacher field

### Principle IV: Comprehensive Testing Strategy ✅
- Unit tests required for validation, form components, display components
- Integration tests required for CRUD operations with teacher field
- E2E tests required for complete teacher assignment workflows
- Test coverage for migration workflow (existing courses)

**GATE STATUS**: ✅ **PASS** - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-add-teacher-field/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── component-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── globals.css
├── layout.tsx
└── page.tsx                           # [MODIFIED] Display teacher in course cards

components/
├── course-card.tsx                    # [MODIFIED] Add teacher display with icon below title
└── course-management/
    ├── course-form.tsx                # [MODIFIED] Add teacher input field
    ├── course-list-item.tsx           # [MODIFIED] Display teacher with icon
    ├── delete-confirmation.tsx        # [NO CHANGE]
    └── course-management-modal.tsx    # [MODIFIED] Handle teacher validation errors

data/
├── courses.ts                         # [MODIFIED] Add teacher field to Course interface
├── utils/
│   └── validation.ts                  # [MODIFIED] Add teacher validation (2-100 chars)
└── services/
    └── course-service.ts              # [MODIFIED] Handle teacher in CRUD operations

__tests__/
├── unit/
│   ├── validation.test.ts             # [NEW] Test teacher validation
│   ├── course-form.test.tsx           # [NEW] Test teacher input
│   └── course-card.test.tsx           # [NEW] Test teacher display
├── integration/
│   └── course-crud.test.tsx           # [NEW] Test CRUD with teacher field
└── e2e/
    └── teacher-workflow.spec.ts       # [NEW] Test complete teacher assignment flow
```

**Structure Decision**: Single project (Option 1) - Next.js App Router with TypeScript. Teacher field addition affects 6 components, 2 utility files, 1 data file. No new architectural patterns required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitutional principles satisfied.
