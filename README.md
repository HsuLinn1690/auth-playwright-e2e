# auth-playwright-e2e

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
│   ├── e2e/                  # Playwright UI tests
│   └── api/                  # Playwright API tests
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

## Branching

- Work lands on `dev-master`.
- Open a PR from `dev-master` to `master`. GitHub Actions runs the tests, and branch protection blocks the merge until they pass.
