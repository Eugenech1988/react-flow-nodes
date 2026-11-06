# Pipeline Automation Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/Bun-1.3%2B-f5f5f5?logo=javascript)](https://bun.sh/)
[![TurboRepo](https://img.shields.io/badge/TurboRepo-%E2%9C%93-8fd5ff?logo=turbo)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js)](https://nodejs.org/)

## Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Quick Start](#quick-start)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Building for Production](#building-for-production)
- [Packages](#packages)
    - [UI Components](#ui-components)
    - [Contracts](#contracts)
    - [ESLint & TypeScript Configs](#eslint--typescript-configs)
- [Applications](#applications)
    - [React (pipelines-app)](#react-pipelines-app)
    - [Next.js Marketing Portal (pipelines-next)](#nextjs-marketing-portal-pipelines-next)
    - [NestJS API (pipeline-api)](#nestjs-api-pipeline-api)
- [Deep Dive: API Architecture](#deep-dive-api-architecture)
- [Deep Dive: React Architecture & Data Flow](#deep-dive-react-architecture--data-flow)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository implements a full‑stack pipeline/workflow automation platform managed as a **Bun** monorepo with **TurboRepo**. It provides:

- A visual flow‑editor UI built with React, Vite, and **React Flow**.
- A comprehensive **Next.js Marketing Portal & Portfolio** built with App Router, showcasing advanced UI/UX, complex animations, and internationalization.
- A NestJS backend exposing a type‑safe **tRPC** API powered by Prisma.
- Shared UI primitives and contract schemas for consistency across the stack.

The project follows **Feature‑Sliced Design (FSD)** in both the React app and the Next.js portal, adhering to strict TypeScript and ESLint rules for a high‑quality codebase.

---

## Monorepo Structure
```text
.
├─ apps/                     # Individual applications
│   ├─ react/                # Vite + React UI (pipelines-app)
│   ├─ next/                 # Next.js Marketing Portal (pipelines-next)
│   └─ api/                  # NestJS backend (pipeline-api)
├─ packages/                 # Shared libraries and configs
│   ├─ ui/                   # UI component library (Tailwind, Radix, Sonner)
│   ├─ contracts/            # Zod schemas & shared types
│   ├─ eslint-config/        # Central ESLint configuration
│   └─ typescript-config/    # Base tsconfig.json
├─ .github/                  # CI/CD workflows
├─ turbo.json                # TurboRepo pipeline definition
├─ bun.lockb                 # Bun lockfile
└─ README.md                 # This file
```
All workspaces share the @/* alias for internal imports (e.g., import { Foo } from '@/features/foo').

### Quick start

```text
# 1. Ensure you have Bun ≥ 1.3 and Node ≥ 22.12
brew install bun   # macOS (or follow https://bun.sh)

# 2. Install workspace dependencies
bun install

# 3. Run all apps in parallel
bun run dev
```

Open your browser:

Next.js Marketing Portal: http://localhost:3000

React UI (App): http://localhost:5173

API (Swagger UI): http://localhost:3001

### Running with Docker

Running with Docker
Docker with Docker Compose is required. Run this command from the repository root:

```bash
docker compose up --build
```
The applications are available at:

Next.js Portal: http://localhost:3000

React UI: http://localhost:5173

API and Swagger: http://localhost:3001 and http://localhost:3001/api/docs

PostgreSQL: localhost:5432 (base pipeline, user and pass pipeline)

Stop the containers with docker compose down. PostgreSQL data is stored in a Docker volume. To remove it along with the containers, run docker compose down -v.

The API loads defaults from apps/api/.env.example and overrides them with apps/api/.env when that file exists. Compose overrides the database URL and local frontend URLs so containers can reach each other. Set real OAuth, payment, and SMTP credentials in apps/api/.env when using those integrations.

### Development Commands

| Command | Description |
| :--- | :--- |
| `bun install` | Install dependencies for the entire workspace |
| `bun run dev` | Start all Turbo dev tasks in parallel |
| `bun --filter pipelines-app run dev` | Run only the React UI |
| `bun --filter pipelines-next run dev` | Run only the Next.js Marketing Portal |
| `bun --filter @pipeline/api run dev` | Run only the NestJS API |
| `bun run lint` | Run ESLint across all packages/apps |
| `bun run check-types` | Type-checking via `tsc` for the whole repo |
| `bun run format:check` | Verify Prettier formatting |
| `bun run format` | Auto-format all files |
| `bun run build` | Build all apps/packages for production |
| `bun --filter pipelines-app run test` | Run Vitest suite for the React app |
| `bun --filter @pipeline/api run test` | Run Jest unit tests for the API |
| `bun --filter @pipeline/api run test:e2e` | Run Jest E2E tests for the API |

### Testing

React: Vitest + React Testing Library (*.test.{ts,tsx}) located next to the component.

API: Jest (*.spec.ts) for services/controllers and test/*.e2e-spec.ts for end‑to‑end tests.

All tests can be executed via the commands above or through the Turbo pipeline bun run test.

### Linting & Formatting
The repository uses a shared ESLint config (packages/eslint-config) and Prettier. The recommended workflow is:
```bash
# Lint
bun run lint

# Type‑check
bun run check-types

# Format check (CI will fail on mismatches)
bun run format:check
```
If you need to automatically fix formatting, run bun run format.

### Building for Production
```bash
# Build every app and package
bun run build
```
The output directories are:

- apps/react/dist/

- apps/next/.next/

- apps/api/dist/

- packages/ui/dist/

Deploy the compiled assets according to your hosting strategy (e.g., Vercel for Next.js, Docker for the API, static hosting for the React build).

### Packages

#### UI Components (@pipeline/ui)

- A Tailwind‑CSS v4‑based component library that includes:

- Base UI primitives (Radix, Base UI)

- Icon set (Lucide)

- Toast notifications (Sonner)

- Utility cn() helper for class merging

Import via import { Button } from '@pipeline/ui'.

#### Contracts (@pipeline/contracts)
Contains shared Zod schemas, DTOs, and TypeScript types used by both the API and the React/Next.js clients to guarantee end‑to‑end type safety. Core contracts live in packages/contracts/src/ (e.g., database-nodes.ts).

#### ESLint & TypeScript Configs
Centralized configurations live in packages/eslint-config and packages/typescript-config. They are referenced through the workspace tsconfig.json files.

### Applications
#### React App (pipelines-app)
- Stack: React 19, Vite 8, React Compiler, Tailwind v4, Zustand, Framer Motion, Radix UI, React Hook Form + Zod, TanStack Query v5, tRPC v11.

- Structure: Feature‑Sliced Design under src/ (app, pages, widgets, features, entities, shared).

- Entry point: src/main.tsx.

#### Next.js Marketing Portal (pipelines-next)
- Stack: Next.js 16 (App Router), React 19, Tailwind v4, Framer Motion, custom i18n (useT/getT).

- Structure: FSD-like organization under src/ (app/, widgets/, features/, shared/).

- Purpose: Serves as the public-facing marketing portal, portfolio, and landing pages.

#### NestJS API (pipeline-api)
- Stack: NestJS 11, Prisma 7, PostgreSQL, tRPC v11, Inngest 4, Passport (OAuth + JWT), Argon2, Nodemailer, Google AI SDK.

#### Key directories:

- src/ – core application code.

- src/modules/ – feature modules (e.g., database-nodes/).

- src/trpc/ – tRPC router (app-router.ts) exposing procedures that map directly to contracts in @pipeline/contracts.

- prisma/ – Prisma schema (schema.prisma) and migrations.

### Deep Dive: API Architecture
- Entry Point – src/main.ts bootstraps NestJS, registers the tRPC module, and connects Prisma.

- tRPC Integration – The TrpcModule registers the router built from sub‑routers (pipeline, node, user, etc.). The router is exported via src/trpc/app-router.ts and re‑exported in the package root for the client to consume.

- Prisma ORM – All data models are defined in prisma/schema.prisma. After changes run bun prisma generate to sync types.

- uthentication – Passport strategies (GoogleStrategy, GithubStrategy, JwtStrategy) are configured in src/auth/. tRPC procedures use publicProcedure or protectedProcedure wrappers that inject the authenticated user.

- Background Processing – Inngest workflows (src/ingest/workflows/) handle long‑running pipeline executions. Jobs are enqueued via ingestClient.send() from services.

- Error Handling – API errors are normalized into TRPCError with appropriate codes (INTERNAL_SERVER_ERROR, BAD_REQUEST).

- Testing – Unit tests mock Prisma via @prisma/client/runtime and use TestingModule to instantiate services. E2E tests spin up the Nest application and make real HTTP/tRPC calls.

#### Deep Dive: React Architecture & Data Flow
- Feature‑Sliced Design – Each feature lives under src/features/<feature>/ and contains: components/, hooks/, store/, types/.

- tRPC Client – Initialized once in src/app/trpc.tsx.

- State Management – Global UI state lives in src/shared/state/. Feature‑local state is often kept in React Query caches via trpc.

- Component Example – DatabaseNode.tsx demonstrates react-hook-form with Zod schema, calling tRPC mutations, and optimistic UI updates.

- Styling – All components use Tailwind‑CSS utilities via the cn() helper from @pipeline/ui.

- Routing – src/app/router.tsx defines routes with react-router-dom. Lazy‑load feature bundles via React.lazy and Suspense.

### Deep Dive: Next.js Marketing Portal
The apps/next workspace is not just a landing page; it is a comprehensive marketing portal and portfolio. It is built using Next.js 15 (App Router) and React 19, serving as a showcase of advanced UI/UX engineering and scalable frontend architecture.

#### Tech Stack
- Framework: Next.js 16 (App Router, Server Components)

- Styling: Tailwind CSS v4, Framer Motion (complex layout and scroll animations)

- Icons: Lucide React

- i18n: next-intl / custom useT & getT server/client hooks

- Fonts: Roboto, Roboto Mono (via next/font/google)

### Contributing
Fork the repository.

Create a feature branch (git checkout -b feat/awesome-feature).

Follow the commit convention: lower‑case imperative description (e.g., add pipeline sharing).

Ensure lint, type‑check and format pass.

Write tests for any new behavior.

Open a Pull Request describing the change, linking any related issue, and include screenshots for UI changes.

### License
MIT © 2026 Eugene.

