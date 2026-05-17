# Quickstart: Trail & Campsite Intelligence Platform

## Prerequisites

- Node.js 20 LTS
- npm 10+
- MongoDB 7+ (local or hosted)

## 1) Install dependencies

Install backend and frontend dependencies separately:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## 2) Configure environment variables

Create backend environment file from template:

```bash
cp backend/.env.example backend/.env
```

If using Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Backend values:

- `PORT=3001`
- `NODE_ENV=development`
- `MONGODB_URI=<mongo-connection-string>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d`
- `PASSWORD_RESET_EXPIRES_MIN=60`

Create frontend environment file from template:

```bash
cp frontend/.env.example frontend/.env
```

Frontend values:

- `VITE_API_BASE_URL=http://localhost:3001/api`

## 3) Run development servers

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Expected:

- Backend API at `http://localhost:3001`
- Frontend app at `http://localhost:5173`

## 4) Endpoint usage examples

Health check:

```bash
curl http://localhost:3001/api/health
```

Discovery:

```bash
curl "http://localhost:3001/api/trails?search=cedar&region=North&difficulty=easy"
curl "http://localhost:3001/api/campsites?search=pine&region=West&amenity=water"
```

Auth:

```bash
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","displayName":"User","password":"password123"}'
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
```

Favorites (replace `<TOKEN>` and ids):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3001/api/favorites
curl -X POST -H "Authorization: Bearer <TOKEN>" http://localhost:3001/api/favorites/trails/<TRAIL_ID>
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:3001/api/favorites/campsites/<CAMPSITE_ID>
```

Reviews and reports:

```bash
curl http://localhost:3001/api/reviews/trails/<TRAIL_ID>
curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"rating":5,"comment":"Great trail"}' http://localhost:3001/api/reviews/trails/<TRAIL_ID>
curl http://localhost:3001/api/reports/trails/<TRAIL_ID>
curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"status":"muddy","notes":"Wet sections"}' http://localhost:3001/api/reports/trails/<TRAIL_ID>
```

Admin (requires admin JWT):

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:3001/api/admin/trails
curl -X POST -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Content-Type: application/json" -d '{"action":"remove-review","reason":"policy"}' http://localhost:3001/api/admin/reviews/<REVIEW_ID>/moderate
```

## 5) Test matrix and current results

Backend full suite:

```bash
npm test --prefix backend
```

Result snapshot (2026-05-12):

- 11 test files passed
- 20 tests passed
- Includes contract, integration, data-integrity, and performance smoke checks

Frontend full suite:

```bash
npm test --prefix frontend
```

Result snapshot (2026-05-12):

- 5 test files passed
- 5 tests passed
- Includes discovery, auth/favorites, reviews/reports, admin guard, accessibility smoke

## 6) Dependency and security gate status

Run audit scripts:

```bash
npm run audit:check --prefix backend
npm run audit:check --prefix frontend
```

Current status (2026-05-12):

- Backend audit reports vulnerabilities (moderate/high/critical), including upstream packages in `mongoose`, `express`, and transitive tooling.
- Frontend audit reports vulnerabilities (moderate/critical), including `vite`/`esbuild` and `vitest` advisories.
- Remediation path suggested by npm is `npm audit fix --force`, which may introduce breaking changes. Upgrades should be reviewed and tested in a dedicated hardening pass.

## 7) Final acceptance notes

- Discovery flows implemented: browse/search/filter/detail for trails and campsites.
- Auth and favorites implemented: register/login/profile/logout and favorites add/remove/list.
- Review/report contributions implemented with ownership and recency helper behavior.
- Admin endpoints implemented with RBAC gate and moderation record writes.
- Frontend includes user and admin pathways plus loading/error/empty states for core pages.
- Automated suites pass for all implemented phases in current codebase.
