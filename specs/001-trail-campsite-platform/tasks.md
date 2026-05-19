# Tasks: Trail & Campsite Intelligence Platform (MVP Scope)

**Input**: Design documents from specs/001-trail-campsite-platform/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

## MVP Scope Lock

This task list is intentionally limited to a first release with:

- Public browse and detail pages for trails and campsites.
- Working backend discovery APIs.
- User authentication: sign up, log in, log out.
- Responsive UI that works on desktop and mobile.
- Basic error handling and validation throughout.
- No favorites, reviews, condition reports, or admin features yet.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline project setup for frontend and backend.

- [x] T001 Create backend project manifest and scripts in backend/package.json
- [x] T002 Create frontend project manifest and scripts in frontend/package.json
- [x] T003 [P] Configure backend linting in backend/.eslintrc.cjs
- [x] T004 [P] Configure frontend linting in frontend/.eslintrc.cjs
- [x] T005 [P] Add backend environment template in backend/.env.example
- [x] T006 [P] Add frontend environment template in frontend/.env.example
- [x] T007 Create backend app bootstrap files in backend/src/app.js and backend/src/server.js
- [x] T008 Create frontend app bootstrap files in frontend/index.html and frontend/src/main.jsx

**Checkpoint**: Setup complete.

---

## Phase 2: MVP Foundation (Blocking)

**Purpose**: Core backend and frontend plumbing required before discovery features.

**CRITICAL**: No feature work starts before this phase completes.

- [x] T009 Configure MongoDB connection module in backend/src/config/database.js
- [x] T010 [P] Implement shared API error utilities in backend/src/lib/errors.js
- [x] T011 [P] Implement API error handler middleware in backend/src/middleware/error-handler.js
- [x] T012 [P] Implement request validation middleware in backend/src/middleware/validate-request.js
- [x] T013 [P] Implement Trail model schema and indexes in backend/src/models/trail.model.js
- [x] T014 [P] Implement Campsite model schema and indexes in backend/src/models/campsite.model.js
- [x] T015 Create API router composition and health route in backend/src/routes/index.js and backend/src/routes/health.routes.js
- [x] T016 Configure frontend app shell layout and global styles in frontend/src/main.jsx and frontend/src/styles/app.css

**Checkpoint**: Foundation ready for MVP story implementation.

---

## Phase 3: User Story 1 - Discover Trails and Campsites (MVP)

**Goal**: Visitors can browse, search, and filter trails/campsites, and open detail pages.

**Independent Test**: Without signing in, user can search and filter lists, open detail pages, and see empty/loading/error states.

### Tests for User Story 1

- [x] T017 [P] [US1] Add contract tests for discovery endpoints in backend/tests/contract/discovery.contract.test.js
- [x] T018 [P] [US1] Add backend integration tests for list/detail discovery in backend/tests/integration/discovery.integration.test.js
- [x] T019 [P] [US1] Add frontend integration tests for browse/detail flows in frontend/tests/integration/discovery.integration.test.jsx

### Backend Implementation for User Story 1

- [x] T020 [US1] Implement trail discovery service (search/filter/pagination/detail) in backend/src/services/trail.service.js
- [x] T021 [US1] Implement campsite discovery service (search/filter/pagination/detail) in backend/src/services/campsite.service.js
- [x] T022 [US1] Implement discovery controller handlers in backend/src/controllers/discovery.controller.js
- [x] T023 [US1] Implement discovery routes in backend/src/routes/trails.routes.js and backend/src/routes/campsites.routes.js

### Frontend Implementation for User Story 1

- [x] T024 [US1] Implement discovery API clients in frontend/src/api/trails-api.js and frontend/src/api/campsites-api.js
- [x] T025 [US1] Implement trails and campsites browse pages in frontend/src/pages/trails-page.jsx and frontend/src/pages/campsites-page.jsx
- [x] T026 [US1] Implement trail and campsite detail pages in frontend/src/pages/trail-detail-page.jsx and frontend/src/pages/campsite-detail-page.jsx
- [x] T027 [US1] Implement reusable filter/search UI components in frontend/src/components/discovery-filter-bar.jsx and frontend/src/components/discovery-empty-state.jsx

**Checkpoint**: MVP discovery is fully functional and independently testable.

---

## Phase 4: User Story 2 - Authentication (MVP)

**Goal**: Users can register, log in, and log out. Protected pages require authentication.

**Independent Test**: User can sign up with a new account, log in, see their session reflected in the nav, and log out.

### Tests for User Story 2

- [x] T037 [P] [US2] Add contract tests for auth endpoints in backend/tests/contract/auth.contract.test.js
- [x] T038 [P] [US2] Add backend integration tests for register/login/logout in backend/tests/integration/auth.integration.test.js
- [x] T039 [P] [US2] Add frontend integration tests for auth flows in frontend/tests/integration/auth.integration.test.jsx

### Backend Implementation for User Story 2

- [x] T040 [US2] Implement User model schema and indexes in backend/src/models/user.model.js
- [x] T041 [US2] Implement auth service (register, login, token generation) in backend/src/services/auth.service.js
- [x] T042 [US2] Implement JWT auth middleware in backend/src/middleware/auth.middleware.js
- [x] T043 [US2] Implement auth controller handlers in backend/src/controllers/auth.controller.js
- [x] T044 [US2] Implement auth routes (POST /auth/register, POST /auth/login, POST /auth/logout) in backend/src/routes/auth.routes.js

### Frontend Implementation for User Story 2

- [x] T045 [US2] Implement auth API client in frontend/src/api/auth-api.js
- [x] T046 [US2] Implement auth context and session state in frontend/src/contexts/auth-context.jsx
- [x] T047 [US2] Implement login and register pages in frontend/src/pages/login-page.jsx and frontend/src/pages/register-page.jsx
- [x] T048 [US2] Update nav to show login/register links and logout button based on session state in frontend/src/main.jsx

**Checkpoint**: Users can register, log in, and log out. Session state is reflected in the UI.

---

## Phase 5: MVP UI Polish (Nice Frontend)

**Purpose**: Ensure the first release feels polished, intentional, and usable on mobile and desktop.

- [ ] T028 [P] Improve visual design system tokens (color, type, spacing) in frontend/src/styles/tokens.css
- [ ] T029 [P] Apply responsive page and card layouts in frontend/src/styles/layout.css
- [ ] T030 Add loading, skeleton, and error presentation consistency in frontend/src/components/loading-state.jsx and frontend/src/components/error-state.jsx
- [ ] T031 Improve interaction polish (hover/focus/transition states) in frontend/src/styles/interactions.css
- [ ] T032 Run accessibility pass for contrast, keyboard flow, and labels in frontend/tests/integration/accessibility.integration.test.jsx

**Checkpoint**: MVP has a polished public UI and clear UX states.

---

## Phase 6: MVP Verification and Release Readiness

**Purpose**: Validate quality gates relevant to MVP and prepare for first demo/release.

- [ ] T033 Validate API performance for paginated read endpoints in backend/tests/integration/performance.integration.test.js
- [ ] T034 Verify no over-fetching in discovery responses and update contracts in specs/001-trail-campsite-platform/contracts/openapi.yaml
- [ ] T035 Update quickstart for MVP run/test flow in specs/001-trail-campsite-platform/quickstart.md
- [ ] T036 Run full MVP test matrix and record results in specs/001-trail-campsite-platform/quickstart.md

**Checkpoint**: MVP ready to demo and ship.

---

## Deferred Post-MVP Backlog (Out of Scope for Now)

These features are intentionally deferred until after MVP is accepted:

- Password reset flow
- Favorites create/remove/list
- Reviews create/edit/delete
- Condition reports create/list/recency handling
- Admin CRUD/moderation and RBAC

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5 -> Phase 6

### Story Dependencies

- US1 starts after Phase 2 only.
- US2 starts after Phase 2 only (runs in parallel with US1 if desired).

### Parallel Opportunities

- Phase 2 tasks marked [P] can run in parallel.
- Phase 3 tests (T017, T018, T019) can run in parallel.
- Phase 4 tests (T037, T038, T039) can run in parallel.
- Phase 5 styling tasks (T028, T029) can run in parallel.

---

## Implementation Strategy (MVP First)

1. Finish Phase 2 foundation.
2. Implement and validate US1 discovery end-to-end.
3. Implement and validate US2 auth end-to-end.
4. Polish UI quality and accessibility.
5. Run MVP verification and release checks.
6. Re-open deferred backlog only after MVP acceptance.
