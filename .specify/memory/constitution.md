<!--
Sync Impact Report:
- Version change: Template → 1.0.0
- Added principles: Clean Code, Simple UX Responsive Design, Minimal Dependencies, No Testing Policy
- Removed sections: Generic template placeholders
- Templates requiring updates: ✅ Updated constitution.md
- Follow-up TODOs: None - all placeholders resolved
-->

# Great Courses Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)
Code must be readable, maintainable, and self-documenting. Every component and function should have a single, clear responsibility. Use meaningful names for variables, functions, and components. Follow consistent formatting and TypeScript best practices. Code should tell a story that any developer can understand without extensive comments.

**Rationale**: Clean code reduces cognitive load, accelerates onboarding, and prevents technical debt accumulation in a fast-moving project.

### II. Simple UX Responsive Design
User interface must prioritize simplicity and responsiveness across all devices. Mobile-first approach is mandatory. Use Tailwind CSS utilities for consistent, responsive layouts. Every UI element must serve a clear purpose and contribute to user goals. Avoid unnecessary animations, complex interactions, or visual clutter.

**Rationale**: Simple, responsive design ensures broad accessibility and optimal user experience across device types, reducing support overhead and increasing adoption.

### III. Minimal Dependencies
Limit external dependencies to the essential stack: Next.js 14.2.5, React 18.3.1, and Tailwind CSS 3.4.6. No additional libraries without explicit justification and approval. Prefer built-in browser APIs and React/Next.js capabilities over third-party solutions. Each dependency must solve a critical problem that cannot be reasonably implemented in-house.

**Rationale**: Minimal dependencies reduce security vulnerabilities, bundle size, maintenance overhead, and potential breaking changes during updates.

### IV. No Testing Policy (SUPERSEDES ALL OTHER GUIDANCE)
This project operates without any testing infrastructure. No unit tests, integration tests, or end-to-end tests will be written or maintained. Testing frameworks, test files, and testing-related dependencies are explicitly prohibited. Development relies on manual verification and production monitoring.

**Rationale**: For this rapid-development educational project, testing overhead is deemed unnecessary. Manual verification during development provides sufficient quality assurance for the intended scope and timeline.

## Technology Stack Requirements

**Core Framework**: Next.js 14.2.5 with App Router (mandatory)
**UI Library**: React 18.3.1 (mandatory)  
**Styling**: Tailwind CSS 3.4.6 (mandatory)
**Language**: TypeScript 5.5.3 (mandatory)
**Node.js**: 18.18+ (development requirement)

All dependency versions must match those specified in package.json. Upgrades require constitutional amendment unless they are patch-level security fixes.

## Development Standards

**File Organization**: Follow Next.js App Router conventions with components, app, and data directories
**Component Structure**: Functional components with TypeScript interfaces for all props
**Styling**: Tailwind utility classes only - no custom CSS files except globals.css for resets
**Code Quality**: ESLint configuration must pass without warnings
**Performance**: Prioritize Core Web Vitals optimization and mobile performance

## Governance

This constitution supersedes all other development practices, templates, and guidance documents. The No Testing Policy (Principle IV) takes precedence over any conflicting guidance in templates or external documentation.

**Amendment Process**: Constitution changes require explicit documentation of rationale and version increment following semantic versioning.
**Compliance Review**: All feature implementations must verify adherence to these four core principles.
**Version Control**: Use clear, descriptive commit messages that reference constitutional principles when applicable.

**Version**: 1.0.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11
