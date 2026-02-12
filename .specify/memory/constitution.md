<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0 (MAJOR - principle redefinition)
- Modified principles: No Testing Policy → Comprehensive Testing Strategy
- Added sections: Testing requirements and standards
- Removed sections: No Testing Policy (Principle IV)
- Templates requiring updates: ✅ Updated constitution.md, ⚠ Templates need testing restoration
- Follow-up TODOs: Restore testing guidance in all templates
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
Limit external dependencies to the essential stack: Next.js 14.2.5, React 18.3.1, and Tailwind CSS 3.4.6. Additional testing dependencies are permitted and encouraged. Prefer built-in browser APIs and React/Next.js capabilities over third-party solutions for non-testing functionality. Each dependency must solve a critical problem that cannot be reasonably implemented in-house.

**Rationale**: Minimal dependencies reduce security vulnerabilities, bundle size, maintenance overhead, and potential breaking changes during updates, while allowing necessary testing infrastructure.

### IV. Comprehensive Testing Strategy (NON-NEGOTIABLE)
Every feature must be covered by appropriate tests: unit tests for individual components and functions, integration tests for user workflows, and end-to-end tests for critical user journeys. Use modern testing frameworks suitable for Next.js/React applications. Tests must be maintained alongside code changes and all tests must pass before deployment.

**Rationale**: Comprehensive testing ensures code reliability, prevents regressions, facilitates confident refactoring, and maintains quality as the application scales.

## Technology Stack Requirements

**Core Framework**: Next.js 14.2.5 with App Router (mandatory)
**UI Library**: React 18.3.1 (mandatory)  
**Styling**: Tailwind CSS 3.4.6 (mandatory)
**Language**: TypeScript 5.5.3 (mandatory)
**Testing**: Modern testing frameworks for React/Next.js (Jest, Testing Library, Playwright/Cypress)
**Node.js**: 18.18+ (development requirement)

All dependency versions must match those specified in package.json. Upgrades require constitutional amendment unless they are patch-level security fixes. Testing dependencies may be added as needed to support the Comprehensive Testing Strategy.

## Development Standards

**File Organization**: Follow Next.js App Router conventions with components, app, data, and tests directories
**Component Structure**: Functional components with TypeScript interfaces for all props
**Styling**: Tailwind utility classes only - no custom CSS files except globals.css for resets
**Code Quality**: ESLint configuration must pass without warnings
**Performance**: Prioritize Core Web Vitals optimization and mobile performance
**Testing Structure**: Tests organized by feature and type (unit, integration, e2e) with clear naming conventions

## Governance

This constitution supersedes all other development practices, templates, and guidance documents. The Comprehensive Testing Strategy (Principle IV) requires all features to have appropriate test coverage.

**Amendment Process**: Constitution changes require explicit documentation of rationale and version increment following semantic versioning.
**Compliance Review**: All feature implementations must verify adherence to these four core principles, including testing requirements.
**Version Control**: Use clear, descriptive commit messages that reference constitutional principles when applicable.

**Version**: 2.0.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11
