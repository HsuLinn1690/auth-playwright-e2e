# auth-playwright-e2e

[![Tests](https://github.com/HsuLinn1690/auth-playwright-e2e/actions/workflows/tests.yml/badge.svg?branch=dev-master)](https://github.com/HsuLinn1690/auth-playwright-e2e/actions/workflows/tests.yml)

Front-end Sign Up / Sign In app (React + Vite + TypeScript) with a json-server mock API, built as a target for Playwright UI E2E and API tests, gated by GitHub Actions.

> **Security note:** this is demo auth only. Passwords are stored **in plaintext** in `mock-api/db.json`. Never use a real password here.

## Stack

| Part | Tool | URL |
| --- | --- | --- |
| App | React 19 + Vite + TypeScript + React Router | http://localhost:5173 |
| Mock API | json-server 0.17.4 | http://localhost:3001 |
| Tests | Playwright (UI E2E + API) | - |

## Getting started

```bash
npm install
npx playwright install        # downloads browsers (first time only)

# Terminal 1: mock API (resets db.json from db.seed.json on every start)
npm run mock-api

# Terminal 2: app
npm run dev
```

Open http://localhost:5173 and sign in with the seed user `testuser@example.com` / `Test@1234`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the app on port 5173 |
| `npm run mock-api` | Reset and start the mock API on port 3001 |
| `npm run reset-db` | Copy `mock-api/db.seed.json` over `mock-api/db.json` |
| `npm run typecheck` | TypeScript check for app, configs and tests |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm test` | All Playwright projects (api, chromium, firefox, webkit) |
| `npm run test:e2e` | UI tests in Chromium only |
| `npm run test:api` | API tests only |
| `npm run test:critical` | Merge-blocking tests only (`@critical`) |
| `npm run test:edge` | Edge-case tests only (`@edge`) |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the last HTML report |

Playwright starts the app and the mock API automatically (`webServer` in `playwright.config.ts`), so `npm test` works without starting anything first.

## Project structure

```
├── mock-api/
│   └── db.seed.json          # Seed data (db.json is generated and git-ignored)
├── scripts/reset-db.mjs      # Cross-platform DB reset
├── src/
│   ├── api/usersApi.ts       # fetch wrapper for the mock API
│   ├── auth/session.ts       # localStorage session (auth_user)
│   ├── components/           # TextField, PasswordInput
│   ├── pages/                # SignUpPage, SignInPage, WelcomePage
│   ├── routes/guards.tsx     # RequireAuth, RedirectIfAuth, RootRedirect
│   ├── validation/validators.ts
│   ├── messages.ts           # All UI strings (single source for tests)
│   └── App.tsx               # Routes
├── tests/
│   ├── pages/                # Page Objects (SignUpPage, SignInPage, WelcomePage)
│   ├── support/              # fixtures.ts (custom fixtures), test-data.ts
│   ├── e2e/                  # UI tests: signup, signin, session, resilience
│   └── api/                  # API contract tests
└── playwright.config.ts
```

## Routes

| Route | Signed out | Signed in |
| --- | --- | --- |
| `/` | → `/signin` | → `/welcome` |
| `/signup` | Show | → `/welcome` |
| `/signin` | Show | → `/welcome` |
| `/welcome` | → `/signin` | Show |
| Anything else | → `/` | → `/` |

## Mock API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/users?email={email}` | Duplicate check and sign in (exact match, emails stored lowercase) |
| POST | `/users` | Create user |
| GET | `/users/{id}` | Read one user (API tests) |
| DELETE | `/users/{id}` | Test cleanup |

Known limitations (by design): json-server does not validate input, does not enforce unique emails, and returns passwords in responses. All rules are enforced by the front end.

## Branching and CI

```
feature/* ──PR──► dev-master ──PR──► master
```

| Event | Typecheck | API tests | E2E browsers |
| --- | --- | --- | --- |
| PR `feature/*` → `dev-master` | ✅ | ✅ | Chromium |
| Push to `dev-master` | ✅ | ✅ | Chromium |
| PR `dev-master` → `master` | ✅ | ✅ | Chromium, Firefox, WebKit |

Workflow: `.github/workflows/tests.yml`. Reports and failure traces are attached to each run under **Artifacts** (kept 14 days). Branch protection on `master` blocks merging until all checks pass.
<!-- Ruleset pass-flow test: 2026-11-26 -->
