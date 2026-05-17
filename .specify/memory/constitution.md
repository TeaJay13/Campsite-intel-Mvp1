<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0
Modified principles (refined with project-specific rules):
  - I. Code Quality (updated: naming conventions, modular architecture, error handling added)
  - II. Testing Standards (updated: CRUD API coverage, input validation, edge-case requirements added)
  - III. User Experience Consistency (updated: mobile-first, layout consistency, loading states added)
  - IV. Performance Requirements (updated: 500ms target, pagination, over-fetching rules added)
Added principles:
  - V. Data Integrity & Relationships (new)
  - VI. Security Standards (new)
  - VII. Scalability & Extensibility (new)
  - VIII. Dependency Management (new)
Added sections: none
Removed sections: none
Templates updated:
  ✅ .specify/templates/plan-template.md — Constitution Check table expanded to 8 gates
  ✅ .specify/templates/tasks-template.md — Polish phase aligned with all 8 principles
Follow-up TODOs: none
-->

# Trail & Campsite Intelligence Platform Constitution

## Core Principles

### I. Code Quality

All production code MUST be clean, maintainable, and structured for long-term
comprehension. Concretely:

- Naming conventions MUST be consistent: camelCase for JavaScript/TypeScript
  identifiers, PascalCase for model and class names, kebab-case for file and
  route paths. Deviations require a documented rationale in the PR.
- The codebase MUST follow a modular architecture with clear layer separation:
  routes, controllers, services, and models MUST reside in distinct directories
  and MUST NOT import across non-adjacent layers (e.g., a route MUST NOT import
  a model directly).
- Logic MUST NOT be duplicated. Any business rule appearing in more than one
  place MUST be extracted to a shared service or utility before merge.
- Every API route MUST have explicit error handling: unexpected inputs, missing
  resources, and downstream failures MUST return structured error responses with
  an appropriate HTTP status code and a human-readable message.
- Functions and methods MUST have a single, well-defined responsibility (SRP);
  cyclomatic complexity MUST not exceed 10 per function.
- Linting and static analysis MUST pass with zero errors on every commit.

**Rationale**: A trail and campsite platform will grow in entity count, API
surface, and contributor count over time. Enforcing layering and naming
discipline from the start prevents the codebase from collapsing into an
unnavigable monolith.

### II. Testing Standards

Automated testing is NON-NEGOTIABLE for all API functionality:

- All core CRUD endpoints for the platform's primary resources (trails,
  campsites, reviews, users) MUST have integration tests covering create, read,
  update, and delete operations.
- Every API endpoint MUST validate its inputs. Tests MUST include negative cases
  confirming that invalid data (wrong type, missing required field, out-of-range
  value) is rejected with a 400-level response before any database call is made.
- Edge cases MUST be explicitly tested: empty result sets, non-existent resource
  IDs, and requests from unauthorized users MUST each have dedicated test cases.
- Unit test coverage MUST remain at or above 80% for all service-layer modules.
- Contract tests MUST be created for every public API boundary.
- Test files MUST reside in a `tests/` tree mirroring the source structure
  (`unit/`, `integration/`, `contract/`).

**Rationale**: Outdoor data (trail conditions, campsite availability) changes
frequently and is safety-relevant. A comprehensive test suite is the primary
defence against regressions that could surface incorrect or dangerous
information to users.

### III. User Experience Consistency

All user-facing surfaces MUST adhere to a unified design language and
interaction model:

- The UI MUST be mobile-first: every page and component MUST be usable and
  readable on viewports as narrow as 375px before desktop enhancements are
  added.
- Navigation structure, card layouts, and form patterns MUST be consistent
  across all pages. New pages MUST reuse established layout components; one-off
  layouts require design review.
- Every asynchronous operation MUST display a loading state. Every failure MUST
  display a human-readable error message in context — no silent failures, no
  unhandled promise rejections reaching the user.
- Accessible design is REQUIRED: interactive elements MUST meet WCAG 2.1 AA
  standards (minimum 4.5:1 contrast ratio for body text, keyboard navigability,
  descriptive ARIA labels on icon-only controls).
- Domain terminology (trail, campsite, review, difficulty rating) MUST be used
  consistently across UI labels, API field names, and documentation; a glossary
  entry is required for every new domain term.

**Rationale**: Hikers and campers use this platform in varied conditions —
including low-bandwidth mobile connections in the field. A consistent,
accessible, and clearly communicative UI is a safety and trust requirement, not
a polish concern.

### IV. Performance Requirements

Performance is a first-class feature and MUST be planned, measured, and
validated — not retrofitted:

- The target response time for all standard read endpoints (trail list, campsite
  detail, review list) is under 500ms at p95 under typical load. Any endpoint
  exceeding this target MUST be profiled and optimised before merge.
- All list endpoints returning potentially large datasets (trails, reviews,
  campsites) MUST implement server-side pagination. Returning unbounded result
  sets is prohibited.
- API responses MUST NOT over-fetch: each endpoint returns only the fields
  required by its documented contract. Unused fields bloating the response
  payload require justification in the PR.
- Database queries MUST be reviewed for N+1 patterns before merge; explain-plan
  output MUST be included in the PR for any query joining more than two tables
  or touching a collection expected to exceed 10,000 documents/rows.
- CI MUST include a performance regression check; a build MUST fail if a
  measured baseline endpoint degrades by more than 20%.

**Rationale**: Trail discovery and campsite lookup are time-sensitive actions.
Users in areas with poor connectivity cannot afford slow, bloated responses.
Performance discipline at the database and API layer directly translates to
reliability for end users.

### V. Data Integrity & Relationships

The data model MUST enforce correct relationships and prevent corruption at
every layer:

- All relationships between core entities (User → Review, Trail → Campsite,
  Review → Trail/Campsite) MUST be enforced at the database level (foreign keys
  or document references with referential validation) AND at the application
  service layer.
- Orphaned data MUST be prevented: deleting a trail or campsite MUST cascade or
  block appropriately so that reviews never reference a non-existent target.
  The chosen strategy (cascade vs. restrict) MUST be documented per entity in
  the data model.
- All models MUST declare explicit validation rules for every field: required
  vs. optional, type constraints, length limits, and enumerated allowed values
  where applicable.
- Writes that violate a validation rule MUST be rejected before reaching the
  database; validation errors MUST be returned as structured 422 responses
  listing the offending fields.

**Rationale**: Outdoor safety depends on data accuracy. A review attached to
a deleted trail, or a campsite with an unconstrained difficulty value, erodes
user trust and can surface misleading information.

### VI. Security Standards

Security controls are NON-NEGOTIABLE and MUST be implemented by default, not
added as an afterthought:

- All user passwords MUST be stored as hashes using a strong adaptive algorithm
  (e.g., bcrypt with a work factor of ≥ 12 or Argon2id). Plaintext passwords
  MUST never be logged, stored, or transmitted.
- Protected API routes MUST verify a valid session or token before executing any
  business logic. Authentication checks MUST be applied at the middleware layer,
  not duplicated per route.
- The platform MUST enforce role-based access control (RBAC) with at minimum
  two roles: `user` and `admin`. Destructive or administrative operations
  (bulk deletes, user management, content moderation) MUST require the `admin`
  role.
- Users MUST NOT be able to edit or delete resources they do not own.
  Ownership checks MUST be performed in the service layer and tested with
  dedicated negative-case tests.
- All inputs received from external sources MUST be validated and sanitised
  before processing to prevent injection attacks (OWASP Top 10 compliance
  required).

**Rationale**: A platform handling user accounts, location data, and
community-generated content is a high-value target. Security failures expose
users to data loss and privacy violations; enforcing these controls by
architecture — not convention — makes them reliable.

### VII. Scalability & Extensibility

The platform MUST be designed for growth from day one:

- The REST API MUST follow RESTful conventions consistently: resource-oriented
  URL paths (`/trails`, `/trails/:id/campsites`), correct HTTP verb semantics,
  and standard status codes. Ad-hoc endpoints that break this convention require
  documented justification.
- Business logic MUST reside exclusively in the service layer. Controllers MUST
  be thin (request parsing + response formatting only); models MUST be data
  definitions only. UI components MUST NOT contain business logic.
- New features (trip planner, map integration, analytics dashboard) MUST be
  implementable by adding new routes, services, and models without modifying
  existing stable contracts. Breaking changes to existing API contracts require
  versioning (e.g., `/v2/trails`).
- Configuration values (database URIs, API keys, feature flags) MUST be
  injected via environment variables; no credentials or environment-specific
  values MUST appear in source code.

**Rationale**: The platform's roadmap includes maps, trip planning, and
analytics. Architecture decisions made today either enable or foreclose those
futures. RESTful conventions and strict layer separation ensure that new
capabilities can be grafted on without destabilising existing functionality.

### VIII. Dependency Management

Every third-party package added to the project MUST be justified and governed:

- Adding a new npm dependency MUST be justified in the PR with an explanation
  of why an existing dependency or a built-in Node.js/browser API cannot
  fulfil the requirement. Preference MUST be given to smaller, focused
  packages over large all-in-one libraries where functionality overlap exists.
- All dependencies MUST be pinned to an exact version in `package.json`.
  Unpinned ranges (`^`, `~`, `*`) are prohibited in production dependencies.
  A `package-lock.json` MUST be committed and kept in sync at all times.
- `npm audit` MUST be run in CI on every build. Any high or critical severity
  vulnerability MUST block the build until resolved or explicitly suppressed
  with a documented justification.
- Unused dependencies MUST be removed before merge. Packages no longer
  referenced in source code require a documented reason to remain in
  `package.json`.
- Dependencies that are only required at build time or in tests MUST be
  declared as `devDependencies`; shipping dev tooling in production
  `dependencies` is prohibited.

**Rationale**: Uncontrolled dependency growth increases attack surface, bloats
bundles, and creates long-term maintenance burden. Explicit justification and
audit gates ensure every package earns its place and does not silently
introduce vulnerabilities.

## Quality Gates

The following gates MUST all pass before a feature may be merged to the main
branch:

- **I. Code Quality Gate**: Linter reports zero errors; PR review confirms
  naming conventions, layer separation, no duplicated logic, and explicit error
  handling on all new routes.
- **II. Testing Gate**: All tests pass; unit coverage ≥ 80% for service
  modules; CRUD and negative-case integration tests present; edge cases
  (empty results, invalid IDs, unauthorized access) covered.
- **III. UX Consistency Gate**: Mobile-first layout verified; loading and error
  states implemented; accessibility audit passes (WCAG 2.1 AA); no new
  terminology introduced without glossary entry.
- **IV. Performance Gate**: All new endpoints meet the 500ms p95 target; list
  endpoints implement pagination; no N+1 queries; CI perf regression check
  passes.
- **V. Data Integrity Gate**: All models have explicit validation rules; orphan
  prevention strategy documented; invalid writes return structured 422
  responses.
- **VI. Security Gate**: Authentication middleware applied to all protected
  routes; ownership checks present and tested; RBAC enforced for admin
  operations; no plaintext passwords or credentials in source.
- **VII. Scalability Gate**: New endpoints follow RESTful conventions; business
  logic is in the service layer only; no hardcoded config values in source.
- **VIII. Dependency Gate**: Every new npm package has a documented justification
  in the PR; all production dependencies are pinned to exact versions;
  `package-lock.json` is committed; `npm audit` reports no high/critical
  vulnerabilities; unused packages removed; dev-only packages are in
  `devDependencies`.

Any gate failure blocks the merge. Exceptions require written approval from the
project lead and MUST be tracked as technical-debt issues.

## Development Workflow

- **Branching**: All work happens on a feature branch named
  `###-short-description`; no direct commits to `main`.
- **Spec-first**: A feature spec MUST exist and be approved before
  implementation begins (run `/speckit.specify` → `/speckit.plan` →
  `/speckit.tasks`).
- **PR size**: Pull requests SHOULD target ≤ 400 lines of net-new production
  code; larger PRs require justification and MUST be reviewed by two
  contributors.
- **Review turnaround**: Code reviews MUST be completed within one business day
  of submission.
- **CI required**: All eight Quality Gates MUST be green before a PR may be
  approved.

## Governance

This Constitution supersedes all other documented practices. Amendments MUST
follow this process:

1. Open an issue describing the proposed change and its rationale.
2. Increment the version number per semantic versioning rules (see header).
3. Update this file and run `/speckit.constitution` to propagate changes to
   dependent templates.
4. Obtain approval from at least one other project contributor before merging.

All pull requests and code reviews MUST verify compliance with all eight Core
Principles. Non-compliance MUST be called out in review and resolved before
merge.

**Version**: 1.2.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-05-05
