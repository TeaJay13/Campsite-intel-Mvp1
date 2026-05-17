# Phase 0 Research: Trail & Campsite Intelligence Platform

## Decision 1: Frontend architecture

- Decision: Use React 18 + TanStack Query in a Vite-based SPA frontend.
- Rationale: The specification is interaction-heavy (search/filter, favorites, reviews, condition reports) and does not require SSR for core workflows. TanStack Query directly addresses loading, error, pagination, cache, and mutation synchronization requirements while keeping dependencies light.
- Alternatives considered:
  - Next.js App Router: strong full-stack option but adds framework complexity not required for this scope.
  - React with ad hoc fetch state: lower initial setup but higher long-term complexity and duplicated request-state handling.

## Decision 2: Backend architecture

- Decision: Use Express with layered modules (`routes/controllers/services/models`) and middleware for auth, RBAC, validation, and error handling.
- Rationale: Express is minimal and aligns with constitution requirements for explicit layered architecture and structured API error handling. It keeps route ownership clear for REST contracts.
- Alternatives considered:
  - NestJS: richer built-in patterns but heavier abstraction for a small learning-scale project.
  - Fastify: better throughput potential but lower familiarity and ecosystem alignment for this scope.

## Decision 3: Database and persistence model

- Decision: Use MongoDB with Mongoose schemas, indexes, and validation support.
- Rationale: The specification explicitly allows MongoDB/NoSQL and includes entity relationships that fit a document model with references. Mongoose schema constraints and compound indexes support one-review-per-user-per-entity and search/filter performance goals.
- Alternatives considered:
  - PostgreSQL: strong relational integrity but outside requested NoSQL preference.
  - Firebase Firestore: fast setup but less explicit control over query/index behavior for this API design.

## Decision 4: Authentication and authorization

- Decision: JWT-based stateless authentication with `user` and `admin` RBAC, enforced at middleware and service layers.
- Rationale: JWT fits REST APIs and project scale, supports protected routes, and maps cleanly to constitution security requirements for middleware auth + ownership checks.
- Alternatives considered:
  - Firebase Auth: valid but introduces external service dependency and coupling for a learning-focused local architecture.
  - Session cookies only: feasible but less API-portable for this frontend/backend split.

## Decision 5: Validation and error contract

- Decision: Validate request input with Zod schemas at route boundaries and enforce model constraints at persistence boundaries.
- Rationale: Dual-layer validation satisfies constitution requirements to reject invalid writes before database mutation and enables clear 400/422 structured responses.
- Alternatives considered:
  - Joi/Yup: capable options, but Zod provides a concise schema authoring model and less schema duplication.
  - Validation in controllers only: increases duplication and weakens consistency.

## Decision 6: Orphan prevention and deletion strategy

- Decision: Use soft-delete/archive semantics for trails and campsites, block new reviews/reports/favorites on archived entities, and keep historical records for moderation/audit.
- Rationale: Matches specification acceptance criteria and avoids integrity issues from hard deletes while preserving moderation history.
- Alternatives considered:
  - Hard delete with cascades: simpler storage but risks data loss and audit gaps.
  - Restrict delete forever: maintains integrity but conflicts with archive/restore requirements.

## Decision 7: Performance strategy

- Decision: Implement server-side pagination for all list-style endpoints, query-level projection to avoid over-fetching, and indexes on frequent filter/search fields.
- Rationale: Needed to satisfy <=500ms p95 target and constitution performance constraints.
- Alternatives considered:
  - Return full result sets: violates pagination requirement and does not scale.
  - Client-side filtering only: increases payload size and harms mobile/bandwidth conditions.

## Decision 8: Testing strategy

- Decision: Use integration tests for CRUD and auth/ownership edge cases, contract tests against OpenAPI endpoints, and unit tests for service-layer business rules with >=80% service coverage.
- Rationale: Directly satisfies constitution testing gates and reduces regression risk in safety-relevant outdoor condition data.
- Alternatives considered:
  - Unit-only approach: insufficient for API boundary and auth correctness.
  - Manual-only QA: does not satisfy non-negotiable automated testing requirements.

## Resolved clarifications summary

All planning clarifications are resolved with no remaining NEEDS CLARIFICATION items:

- Stack: React + TanStack Query frontend, Express backend, MongoDB database.
- Auth method: JWT with middleware enforcement.
- Validation: Zod at request layer and schema validation at model layer.
- Deletion policy: archive/restore with integrity protections.
- Performance approach: pagination, projection, indexing.
- Test approach: unit + integration + contract coverage aligned to constitution.
